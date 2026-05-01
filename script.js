/**
 * CHETAN AGARWAL & CO. — CA FIRM WEBSITE
 * script.js — Premium Interactions & Functionality
 */

// ============================================================
// PRELOADER
// ============================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 1800);
  document.body.style.overflow = 'hidden';
});

// ============================================================
// STICKY NAVBAR & SCROLL EFFECTS
// ============================================================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Sticky navbar shadow
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top button
  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link highlighting
  highlightNavLink();

  // Animate stats when in view
  animateStats();

  // Fade-in on scroll
  handleScrollAnimations();
});

// Back to top click
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('active');
    if (hamburger.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

// Mobile dropdown toggle
document.querySelectorAll('.has-dropdown > a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 960) {
      e.preventDefault();
      const parent = link.parentElement;
      parent.classList.toggle('open-dd');
    }
  });
});

// Close nav on link click
document.querySelectorAll('.nav-links a:not(.has-dropdown > a)').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ============================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (navLink) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// COUNTER ANIMATION FOR STATS
// ============================================================
let statsAnimated = false;

function animateStats() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar || statsAnimated) return;

  const rect = statsBar.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    statsAnimated = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, 0, target, 1600);
    });
  }
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(from + (to - from) * ease(progress));
    el.textContent = value.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ============================================================
// SCROLL FADE-IN ANIMATIONS
// ============================================================
function initAnimations() {
  const elements = document.querySelectorAll(
    '.service-card, .ind-card, .article-card, .resource-card, .office-card, .team-card, .about-visual, .about-content'
  );

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`;
  });
}

function handleScrollAnimations() {
  const elements = document.querySelectorAll(
    '.service-card, .ind-card, .article-card, .resource-card, .office-card, .team-card, .about-visual, .about-content'
  );

  elements.forEach(el => {
    if (el.style.opacity === '0') {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }
  });
}

// ============================================================
// TESTIMONIALS SLIDER
// ============================================================
let currentSlide = 0;
const track = document.getElementById('testiTrack');
const dotsContainer = document.getElementById('testiDots');
let totalSlides = 0;
let slidesPerView = 2;
let autoSlideInterval;

function initTestimonials() {
  const cards = track ? track.querySelectorAll('.testi-card') : [];
  totalSlides = cards.length;
  if (!totalSlides) return;

  // Calculate slides per view
  slidesPerView = window.innerWidth <= 768 ? 1 : 2;
  const maxSlide = totalSlides - slidesPerView;

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('div');
      dot.classList.add('testi-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Prev/Next
  const prev = document.getElementById('testiPrev');
  const next = document.getElementById('testiNext');
  if (prev) prev.addEventListener('click', () => { goToSlide(Math.max(0, currentSlide - 1)); });
  if (next) next.addEventListener('click', () => { goToSlide(Math.min(maxSlide, currentSlide + 1)); });

  // Auto-slide
  autoSlideInterval = setInterval(() => {
    const max = totalSlides - slidesPerView;
    currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
    goToSlide(currentSlide);
  }, 4500);
}

function goToSlide(index) {
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  if (!cards.length) return;

  slidesPerView = window.innerWidth <= 768 ? 1 : 2;
  const maxSlide = totalSlides - slidesPerView;
  currentSlide = Math.max(0, Math.min(index, maxSlide));

  const cardWidth = cards[0].offsetWidth + 24; // card + margin
  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

  // Update dots
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.testi-dot') : [];
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

initTestimonials();
window.addEventListener('resize', () => {
  clearInterval(autoSlideInterval);
  initTestimonials();
});

// ============================================================
// ARTICLE CATEGORY FILTER
// ============================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    const cards = document.querySelectorAll('#articlesGrid .article-card');

    cards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

// ============================================================
// APPOINTMENT FORM
// ============================================================
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('apptName').value.trim();
    const phone = document.getElementById('apptPhone').value.trim();
    const service = document.getElementById('apptService').value;

    if (!name || !phone || !service) {
      showFormError(appointmentForm, 'Please fill in all required fields.');
      return;
    }

    if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s/g, ''))) {
      showFormError(appointmentForm, 'Please enter a valid phone number.');
      return;
    }

    // Simulate form submission
    const btn = appointmentForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Consultation';
      btn.disabled = false;
      appointmentForm.reset();
      openModal('successModal');
    }, 1500);
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      contactForm.reset();
      openModal('successModal');
    }, 1500);
  });
}

function showFormError(form, msg) {
  let errorEl = form.querySelector('.form-error-msg');
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.classList.add('form-error-msg');
    errorEl.style.cssText = 'color: #e74c3c; font-size: 0.82rem; text-align: center; padding: 8px; border-radius: 6px; background: rgba(231,76,60,0.08); margin-bottom: 10px;';
    form.prepend(errorEl);
  }
  errorEl.textContent = msg;
  setTimeout(() => { if (errorEl) errorEl.remove(); }, 4000);
}

// ============================================================
// MODAL
// ============================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ============================================================
// SCROLL-BASED SECTION REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  revealObserver.observe(el);
});

// Add CSS class for in-view
const style = document.createElement('style');
style.textContent = `.section-header.in-view { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ============================================================
// RESOURCE CARD DOWNLOAD FEEDBACK
// ============================================================
document.querySelectorAll('.resource-card .btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Coming Soon';
    btn.style.background = '#2ecc71';
    btn.style.borderColor = '#2ecc71';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2500);
  });
});

// ============================================================
// DYNAMIC YEAR IN FOOTER
// ============================================================
const footerYearEl = document.querySelector('.footer-bottom p');
if (footerYearEl) {
  const year = new Date().getFullYear();
  footerYearEl.innerHTML = footerYearEl.innerHTML.replace('2025', year);
}

// ============================================================
// INITIAL SCROLL CHECK (page might load mid-scroll)
// ============================================================
setTimeout(() => {
  handleScrollAnimations();
  animateStats();
}, 2000);
