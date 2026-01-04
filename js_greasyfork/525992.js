// ==UserScript==
// @name         Reddit Search Preview Inline Interactive Gallery Carousel
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Interactive Inline Gallery Carousel with full-res Images for Reddit Search Gallery.
// @author       UniverseDev
// @license      GPL-3.0-or-later
// @icon         https://www.reddit.com/favicon.ico
// @match        *://*.reddit.com/search/*type=media*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/525992/Reddit%20Search%20Preview%20Inline%20Interactive%20Gallery%20Carousel.user.js
// @updateURL https://update.greasyfork.org/scripts/525992/Reddit%20Search%20Preview%20Inline%20Interactive%20Gallery%20Carousel.meta.js
// ==/UserScript==

(() => {
  'use strict';

  GM_addStyle(`
    .reddit-carousel {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
      cursor: default;
      z-index: 1;
    }
    .reddit-carousel-slide-container {
      display: flex;
      transition: transform 150ms ease;
      will-change: transform;
      z-index: 1;
    }
    .reddit-carousel-slide {
      flex: 0 0 100%;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .reddit-carousel-slide img {
      max-height: 100vw;
      height: 100%;
      width: 100%;
      object-fit: contain;
      object-position: center center;
      margin: 0 auto;
      z-index: 1;
    }
    .reddit-carousel-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 10;
    }
    .reddit-carousel-loading-global {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 11;
    }
    .reddit-carousel-error {
      color: red;
      font-size: 14px;
      padding: 20px;
      z-index: 1;
    }
    .reddit-carousel-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.7);
      border: none;
      width: 30px;
      height: 30px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4;
      transition: background 0.2s ease, transform 0.15s ease;
      color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      pointer-events: auto;
    }
    .reddit-carousel-arrow:hover {
      background: rgba(0,0,0,0.85);
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.5);
    }
    .reddit-carousel-arrow:active {
      transform: translateY(-50%) scale(0.95);
    }
    .reddit-carousel-arrow svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .reddit-carousel-arrow.left { left: 10px; display: none; }
    .reddit-carousel-arrow.right { right: 10px; display: flex; }
  `);

  const redditCarousel_animateTransition = (container, start, end, duration, callback) => {
    const startTime = performance.now();
    const step = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      container.style.transform = `translate3d(${start + (end - start) * ease}px, 0, 0)`;
      if (progress < 1) requestAnimationFrame(step);
      else if (callback) callback();
    };
    requestAnimationFrame(step);
  };

  function adjustSlideHeight(slide) {
    const img = slide.querySelector('img');
    if (!img) return;
    if (!img.complete || img.naturalWidth === 0) {
      img.addEventListener('load', () => adjustSlideHeight(slide));
      return;
    }
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const slideWidth = slide.clientWidth;
    slide.style.height = (slideWidth / aspectRatio) + 'px';
  }

  function adjustAllSlideHeights() {
    document.querySelectorAll('.reddit-carousel-slide').forEach(slide => adjustSlideHeight(slide));
    centerImages();
  }

  function centerImages() {
    document.querySelectorAll('.reddit-carousel-slide').forEach(slide => {
      slide.style.display = 'flex';
      slide.style.justifyContent = 'center';
      slide.style.alignItems = 'center';
    });
  }

  const redditCarousel_createCarousel = (primaryUrls, fallbackUrls, mediaMeta, altText) => {
    if (!primaryUrls?.length) return null;
    const carousel = document.createElement('div');
    carousel.classList.add('reddit-carousel');
    carousel.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); });
    const slideContainer = document.createElement('div');
    slideContainer.classList.add('reddit-carousel-slide-container');
    carousel.appendChild(slideContainer);
    let imagesLoaded = 0;
    const totalImages = primaryUrls.length;
    const globalOverlay = document.createElement('div');
    globalOverlay.classList.add('reddit-carousel-loading-global');
    carousel.appendChild(globalOverlay);
    primaryUrls.forEach((url, i) => {
      const slide = document.createElement('div');
      slide.classList.add('reddit-carousel-slide');
      const overlay = document.createElement('div');
      overlay.classList.add('reddit-carousel-loading-overlay');
      slide.appendChild(overlay);
      const img = document.createElement('img');
      img.src = url;
      img.alt = altText;
      if (fallbackUrls && fallbackUrls[i]) img.dataset.fallback = fallbackUrls[i];
      img.onerror = function() {
        if (this.dataset.fallback && this.src !== this.dataset.fallback) this.src = this.dataset.fallback;
        else slide.innerHTML = '<div class="reddit-carousel-error">Image failed to load</div>';
      };
      img.addEventListener('load', () => {
        redditCarousel_recalcDimensions();
        redditCarousel_updateArrowVisibility();
        updateArrowPositions();
        adjustSlideHeight(slide);
        const ov = slide.querySelector('.reddit-carousel-loading-overlay');
        if (ov) ov.remove();
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          globalOverlay.remove();
        }
      });
      slide.appendChild(img);
      slideContainer.appendChild(slide);
    });
    const carouselCounterWrapper = document.createElement('div');
    carouselCounterWrapper.innerHTML = `<div class="absolute inset-0 overflow-visible flex items-right justify-end">
      <button rpl="" class="pointer-events-none m-xs leading-4 pl-2xs pr-2xs py-0 text-sm h-fit button-small px-[var(--rem10)] button-media items-center justify-center button inline-flex ">
        <span class="flex items-center justify-center">
          <span class="carousel-counter flex items-center gap-xs">1/${primaryUrls.length}</span>
        </span>
      </button>
    </div>`;
    carousel.appendChild(carouselCounterWrapper);
    let redditCarousel_currentIndex = 0, redditCarousel_currentOffset = 0;
    const redditCarousel_recalcDimensions = () => {
      const containerWidth = slideContainer.clientWidth;
      redditCarousel_currentOffset = -redditCarousel_currentIndex * containerWidth;
      slideContainer.style.transform = `translate3d(${redditCarousel_currentOffset}px, 0, 0)`;
    };
    const redditCarousel_updateCounter = () => {
      const newCounterText = `${redditCarousel_currentIndex + 1}/${primaryUrls.length}`;
      const carouselCounter = carousel.querySelector('.carousel-counter');
      if (carouselCounter) carouselCounter.textContent = newCounterText;
    };
    const redditCarousel_goToSlide = index => {
      index = Math.max(0, Math.min(index, primaryUrls.length - 1));
      const containerWidth = slideContainer.clientWidth;
      const startOffset = redditCarousel_currentOffset;
      const endOffset = -index * containerWidth;
      redditCarousel_animateTransition(slideContainer, startOffset, endOffset, 150, () => {
        redditCarousel_currentOffset = endOffset;
        redditCarousel_currentIndex = index;
        redditCarousel_updateCounter();
        redditCarousel_updateArrowVisibility();
        updateArrowPositions();
      });
    };
    let redditCarousel_leftArrow, redditCarousel_rightArrow;
    if (primaryUrls.length > 1) {
      const redditCarousel_createArrow = dir => {
        const btn = document.createElement('button');
        btn.classList.add('reddit-carousel-arrow', dir);
        btn.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); });
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 20 20");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12.793 19.707l-9-9a1 1 0 0 1 0-1.414l9-9 1.414 1.414L5.914 10l8.293 8.293-1.414 1.414Z");
        svg.appendChild(path);
        if (dir === 'right') svg.style.transform = 'scaleX(-1)';
        btn.appendChild(svg);
        return btn;
      };
      redditCarousel_leftArrow = redditCarousel_createArrow('left');
      redditCarousel_leftArrow.addEventListener('click', () => { redditCarousel_goToSlide(redditCarousel_currentIndex - 1); });
      carousel.appendChild(redditCarousel_leftArrow);
      redditCarousel_rightArrow = redditCarousel_createArrow('right');
      redditCarousel_rightArrow.addEventListener('click', () => { redditCarousel_goToSlide(redditCarousel_currentIndex + 1); });
      carousel.appendChild(redditCarousel_rightArrow);
    }
    const redditCarousel_updateArrowVisibility = () => {
      if (primaryUrls.length <= 1) return;
      if (redditCarousel_currentIndex === 0) {
        redditCarousel_leftArrow.style.display = 'none';
        redditCarousel_rightArrow.style.display = 'flex';
      } else if (redditCarousel_currentIndex === primaryUrls.length - 1) {
        redditCarousel_leftArrow.style.display = 'flex';
        redditCarousel_rightArrow.style.display = 'none';
      } else {
        redditCarousel_leftArrow.style.display = 'flex';
        redditCarousel_rightArrow.style.display = 'flex';
      }
    };
    const updateArrowPositions = () => {
      requestAnimationFrame(() => {
        const rect = carousel.getBoundingClientRect();
        const arrowTop = (rect.height - 30) / 2;
        if (redditCarousel_leftArrow) redditCarousel_leftArrow.style.top = arrowTop + 'px';
        if (redditCarousel_rightArrow) redditCarousel_rightArrow.style.top = arrowTop + 'px';
      });
    };
    updateArrowPositions();
    let redditCarousel_resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(redditCarousel_resizeTimeout);
      redditCarousel_resizeTimeout = setTimeout(() => {
        redditCarousel_recalcDimensions();
        redditCarousel_updateArrowVisibility();
        updateArrowPositions();
        adjustAllSlideHeights();
      }, 100);
    });
    redditCarousel_updateArrowVisibility();
    return carousel;
  };

  const redditCarousel_fetchAndProcessGallery = (postURL, container) => {
    GM.xmlHttpRequest({
      url: `${postURL}.json`,
      method: 'GET',
      onload: response => {
        if (response.status >= 200 && response.status < 300) {
          try {
            const jsonData = JSON.parse(response.responseText);
            const postData = jsonData[0]?.data?.children[0]?.data;
            if (!postData) return;
            const altText = postData.title || "Reddit Gallery Image";
            let fullResUrls = [];
            let previewUrls = [];
            let mediaMeta = {};
            if (postData.gallery_data && postData.media_metadata) {
              mediaMeta = postData.media_metadata;
              const { items } = postData.gallery_data;
              fullResUrls = items.reduce((acc, item) => {
                const meta = mediaMeta[item.media_id];
                if (meta && meta.id && meta.m) {
                  let ext = "jpg";
                  if (meta.m.includes("png")) ext = "png";
                  else if (meta.m.includes("webp")) ext = "webp";
                  acc.push(`https://i.redd.it/${meta.id}.${ext}`);
                }
                return acc;
              }, []);
              previewUrls = items.reduce((acc, item) => {
                const meta = mediaMeta[item.media_id];
                let url;
                if (meta && meta.p) {
                  if (Array.isArray(meta.p) && meta.p.length > 0) {
                    url = meta.p[meta.p.length - 1].u;
                  } else if (meta.p.u) {
                    url = meta.p.u;
                  }
                  if (url) {
                    url = url.replace(/&amp;/g, '&');
                    acc.push(url);
                  }
                }
                return acc;
              }, []);
            }
            let primaryUrls = [];
            let fallbackUrls = [];
            if (fullResUrls.length > 0) {
              primaryUrls = fullResUrls;
              fallbackUrls = previewUrls;
            } else {
              primaryUrls = previewUrls;
            }
            const carousel = redditCarousel_createCarousel(primaryUrls, fallbackUrls, mediaMeta, altText);
            if (carousel) {
              const targetElement = container.querySelector('.relative.w-full.h-full');
              if (targetElement) {
                targetElement.innerHTML = '';
                targetElement.appendChild(carousel);
                const parentLink = targetElement.closest('a');
                if (parentLink) {
                  parentLink.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); });
                }
              }
            }
          } catch (error) {
            console.error("JSON parse error:", error);
          }
        }
      },
      onerror: err => console.error("Request failed:", err)
    });
  };

  const redditCarousel_galleryObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        if (!container.hasAttribute('data-gallery-intersected')) {
          container.setAttribute('data-gallery-intersected', 'true');
          const postUnit = container.closest('div[data-id="search-media-post-unit"]');
          const postLink = postUnit?.querySelector('a.no-underline');
          const target = container || postUnit;
          if (postLink?.href && target) redditCarousel_fetchAndProcessGallery(postLink.href, target);
        }
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.1 });

  const redditCarousel_processSearchResults = () => {
    document.querySelectorAll('div[data-id="search-media-post-unit"]').forEach(post => {
      if (post.hasAttribute('data-gallery-checked')) return;
      post.setAttribute('data-gallery-checked', 'true');
      const indicator = post.querySelector('div.absolute.inset-0.overflow-visible.flex.items-right.justify-end button span');
      if (indicator?.textContent.includes('/')) {
        const container = post.querySelector('shreddit-aspect-ratio') || post;
        if (container) redditCarousel_galleryObserver.observe(container);
      }
    });
  };

  let redditCarousel_ticking = false;
  window.addEventListener('scroll', () => {
    if (!redditCarousel_ticking) {
      requestAnimationFrame(() => {
        redditCarousel_processSearchResults();
        redditCarousel_ticking = false;
      });
      redditCarousel_ticking = true;
    }
  });
  window.addEventListener('load', redditCarousel_processSearchResults);
  window.addEventListener('load', adjustAllSlideHeights);
})();
