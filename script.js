// ===================================
// SCRIPT.JS - Portfolio Interactions
// ===================================

// Smooth Scroll for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // MENU HAMBURGER MOBILE
  // ===================================
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  
  console.log('Hamburger trouvé:', hamburger);
  console.log('Navigation trouvée:', mainNav);
  
  if (hamburger && mainNav) {
    console.log('Event listeners ajoutés au menu hamburger');
    
    // Toggle menu au clic sur hamburger
    hamburger.addEventListener('click', function(e) {
      console.log('Clic sur hamburger détecté');
      e.preventDefault();
      e.stopPropagation();
      
      this.classList.toggle('active');
      mainNav.classList.toggle('mobile-active');
      document.body.style.overflow = mainNav.classList.contains('mobile-active') ? 'hidden' : '';
      
      console.log('Menu actif:', mainNav.classList.contains('mobile-active'));
    });
    
    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mainNav.classList.remove('mobile-active');
        document.body.style.overflow = '';
      });
    });
    
    // Empêcher la fermeture si on clique dans le menu
    mainNav.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function(e) {
      if (mainNav.classList.contains('mobile-active') && !hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        hamburger.classList.remove('active');
        mainNav.classList.remove('mobile-active');
        document.body.style.overflow = '';
      }
    });
  } else {
    console.error('Hamburger ou navigation non trouvé!');
  }
  
  // Smooth scroll for all anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Header Scroll Effect with smooth momentum/easing like Framer
  const header = document.querySelector('.main-header');
  const heroContent = document.querySelector('.hero-content');
  const aboutSection = document.querySelector('#a-propos');
  const firstSection = document.querySelector('.section');
  
  if (header) {
    let currentScroll = 0;
    let targetScroll = 0;
    let isAnimating = false;
    
    // Fonction d'easing pour un mouvement fluide avec inertie
    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }
    
    // Animation loop pour smooth scroll effect
    function smoothScrollAnimation() {
      // Interpolation progressive vers la cible (effet d'élan) - augmenté pour plus de fluidité
      currentScroll = lerp(currentScroll, targetScroll, 0.15);
      
      const maxScroll = 500;
      const scrollPercent = Math.min(currentScroll / maxScroll, 1);
      
      // Fonction d'easing pour rendre la progression plus naturelle
      const easeOutCubic = 1 - Math.pow(1 - scrollPercent, 3);
      
      // Header background basé directement sur le scroll actuel pour réactivité
      let headerOpacity = 0;
      
      // Utiliser currentScroll pour une réponse immédiate
      if (currentScroll > 50) {
        // Commence à apparaître après 50px de scroll
        headerOpacity = Math.min((currentScroll - 50) / 150, 0.95);
      }
      
      header.style.background = `rgba(0, 0, 0, ${headerOpacity})`;
      header.style.backdropFilter = `blur(${headerOpacity * 10}px)`;
      header.style.borderBottom = `1px solid rgba(255,255,255,${headerOpacity * 0.1})`;
      
      // Padding et shadow avec transition douce
      const isMobile = window.innerWidth <= 768;
      const paddingHorizontal = isMobile ? '1rem' : '3rem';
      const paddingValue = lerp(1, 0.5, Math.min(currentScroll / 100, 1));
      header.style.padding = `${paddingValue}rem ${paddingHorizontal}`;
      header.style.boxShadow = `0 5px 20px rgba(0,0,0,${headerOpacity * 0.8})`;
      
      // Hero content descend légèrement en dessous pendant qu'il se rétrécit (si présent)
      if (heroContent) {
        const scale = 1 - (easeOutCubic * 0.15);
        const translateY = easeOutCubic * 50;
        const opacity = 1 - (easeOutCubic * 0.95);
        const blur = easeOutCubic * 15;
        
        heroContent.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        heroContent.style.opacity = opacity;
        heroContent.style.filter = `blur(${blur}px)`;
      }
      
      // Continue l'animation si pas encore à la cible (dans les deux sens)
      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        requestAnimationFrame(smoothScrollAnimation);
      } else {
        isAnimating = false;
      }
    }
    
    // Écouter le scroll et mettre à jour la cible
    window.addEventListener('scroll', () => {
      targetScroll = window.pageYOffset;
      
      // Démarrer l'animation si pas déjà en cours
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(smoothScrollAnimation);
      }
    }, { passive: true });
    
    // Initialiser avec le scroll actuel
    targetScroll = window.pageYOffset;
    currentScroll = targetScroll;
  }

  // Project Filters - Simple and direct implementation
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterButtons.length > 0 && projectItems.length > 0) {
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // First, hide all items with animation
        projectItems.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
        });
        
        // Then show the matching items after a brief delay
        setTimeout(() => {
          projectItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
              item.style.display = 'block';
              requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              });
            } else {
              item.style.display = 'none';
            }
          });
        }, 300);
      });
    });
    
    // Initialize all items as visible
    projectItems.forEach(item => {
      item.style.display = 'block';
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
  }

  // Scroll Reveal Animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements with fade-in animation
  const animatedElements = document.querySelectorAll('.timeline-item, .competence-card, .skill-tech-card, .gallery-card, .featured-card');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });

  // Active Navigation Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navigationLinks = document.querySelectorAll('.main-nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navigationLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

});

// Function to open experience detail page
function openExperience(expId) {
  window.location.href = `experiences/${expId}.html`;
}

// Function to open project detail page
function openProject(projectId) {
  window.location.href = `projets/${projectId}.html`;
}

// Preload images on hover for better UX
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.gallery-card, .featured-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const img = this.querySelector('img');
      if (img && !img.complete) {
        img.src = img.src; // Force reload if not loaded
      }
    });
  });
});

// CV Download Tracking (optional analytics)
document.addEventListener('DOMContentLoaded', function() {
  const cvButtons = document.querySelectorAll('.btn-cv, .btn-cv-large, a[href*="CV.pdf"]');
  
  cvButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      console.log('CV downloaded at:', new Date().toLocaleString());
      // You can add analytics tracking here (e.g., Google Analytics)
    });
  });
});

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function(e) {
  // Press Escape to close modals (if implemented later)
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
  }
  
  // Press Home to scroll to top
  if (e.key === 'Home') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Performance: Lazy Loading for Images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Console Easter Egg
console.log('%c👋 Bienvenue sur mon portfolio!', 'font-size: 20px; font-weight: bold; color: #f59e0b;');
console.log('%cSi vous êtes ici, c\'est que vous êtes curieux! N\'hésitez pas à me contacter 😊', 'font-size: 14px; color: #fff;');
console.log('%c📧 ufukan.kocer@example.com', 'font-size: 12px; color: #ef4444;');
// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
  // Afficher/cacher le bouton en fonction du scroll
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  // Smooth scroll vers le haut au clic
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===================================
// COPIER EMAIL AU CLIC
// ===================================
function copyEmailToClipboard(event) {
  event.preventDefault();
  const email = 'ufukan.kocer@gmail.com';
  
  // Copier dans le presse-papier
  navigator.clipboard.writeText(email).then(function() {
    // Créer le message "Email copié"
    const message = document.createElement('div');
    message.textContent = 'Email copié';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.85);
      color: white;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      z-index: 10000;
      animation: fadeInOut 2s ease-in-out;
    `;
    
    document.body.appendChild(message);
    
    // Supprimer le message après 2 secondes
    setTimeout(function() {
      message.remove();
    }, 2000);
  }).catch(function(err) {
    console.error('Erreur lors de la copie:', err);
    alert('Email: ' + email);
  });
}

// Ajouter l'animation CSS si elle n'existe pas déjà
if (!document.getElementById('email-copy-animation')) {
  const style = document.createElement('style');
  style.id = 'email-copy-animation';
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
}

// ===================================
// LIGHTBOX GALERIE PHOTO
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const galleryImages = document.querySelectorAll('.gallery-card-image img');

  // Ouvrir le lightbox au clic sur une image
  galleryImages.forEach(function(img) {
    img.addEventListener('click', function() {
      lightbox.style.display = 'block';
      lightboxImg.src = this.src;
    });
  });

  // Fermer le lightbox au clic sur la croix
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      lightbox.style.display = 'none';
    });
  }

  // Fermer le lightbox au clic en dehors de l'image
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }

  // Fermer le lightbox avec la touche Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
      lightbox.style.display = 'none';
    }
  });
});
