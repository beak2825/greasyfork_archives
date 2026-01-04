// ==UserScript==
// @name         Douban All Photos Grid Layout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts all horizontal swipers in Douban statuses to static 3x3 grid layouts
// @match        *://*.douban.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540955/Douban%20All%20Photos%20Grid%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/540955/Douban%20All%20Photos%20Grid%20Layout.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function transformAllSwipers() {
    const wrappers = document.querySelectorAll('.pics-wrapper');

    wrappers.forEach((picsWrapper) => {
      const swiper = picsWrapper.querySelector('.swiper');
      const swiperWrapper = swiper?.querySelector('.swiper-wrapper');

      if (!swiperWrapper || swiper.classList.contains('converted-to-grid')) return;

      // Remove swiper buttons
      swiper.querySelector('.swiper-button-prev')?.remove();
      swiper.querySelector('.swiper-button-next')?.remove();

      // Remove swiper classes and mark as processed
      swiper.className = 'custom-photo-grid converted-to-grid';
      swiperWrapper.className = 'custom-photo-wrapper';
      swiperWrapper.removeAttribute('style');

      // Remove slide-specific classes and adjust styles
      swiperWrapper.querySelectorAll('.swiper-slide').forEach((slide) => {
        slide.className = 'grid-slide';
        slide.removeAttribute('style');
      });
    });
  }

  function injectGridStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .custom-photo-grid {
        width: 100%;
        padding: 10px;
      }
      .custom-photo-wrapper {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
      .grid-slide {
        width: auto !important;
        margin: 0 !important;
      }
      .grid-slide .photo-item {
        width: 100% !important;
        height: auto !important;
      }
      .grid-slide .photo-img {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        border-radius: 4px;
      }
      .grid-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `;
    document.head.appendChild(style);
  }

  // Initial wait until .pics-wrapper appears
  const observer = new MutationObserver(() => {
    if (document.querySelector('.pics-wrapper')) {
      transformAllSwipers();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Apply styles once
  injectGridStyles();
})();
