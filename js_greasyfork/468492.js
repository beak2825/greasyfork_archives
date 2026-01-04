// ==UserScript==
// @name        O'Reilly Helper
// @namespace   https://github.com/mefengl
// @version     0.2.0
// @description 🎴 Enhance your O'Reilly learning experience: smoothly hide header and footer on scroll down, and show them (with cute transparency!) on scroll up.
// @author      mefengl
// @match       https://learning.oreilly.com/library/view/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=oreilly.com
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468492/O%27Reilly%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/468492/O%27Reilly%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
      header, #content-navigation {
          transition: opacity 0.5s linear;
      }
  `);

  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let isScrollingDown = false;

  let header = document.querySelector('header');
  let footer = document.querySelector('#content-navigation');

  if (header) {
    header.style.opacity = '0.6';
    header.style.transition = 'opacity 0.5s';
  }

  if (footer) {
    footer.style.opacity = '0';
    footer.style.transition = 'opacity 0.5s';
  }

  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && !isScrollingDown) {
      isScrollingDown = true;
      // On scroll down, hide header and footer
      if (header) header.style.opacity = '0';
      if (footer) footer.style.opacity = '0';
    } else if (scrollTop < lastScrollTop && isScrollingDown) {
      isScrollingDown = false;
      // On scroll up, show header and footer
      if (header) header.style.opacity = '0.6';
      if (footer) footer.style.opacity = '0.6';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile
  }, false);

})();
