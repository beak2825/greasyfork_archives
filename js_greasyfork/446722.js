// ==UserScript==
// @name         Cleaner Post-Gazette
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Remove paywalls, ads, overlays, and scroll locks from the Pittsburgh Post-Gazette.
// @author       crowfly
// @match        https://www.post-gazette.com/*
// @match        https://newsinteractive.post-gazette.com/*
// @icon         https://www.post-gazette.com/favicon-32x32.png
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446722/Cleaner%20Post-Gazette.user.js
// @updateURL https://update.greasyfork.org/scripts/446722/Cleaner%20Post-Gazette.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const selectorsToRemove = [
    '.pgevoke-topads',
    '.pgevoke-grid-row[data-nativo]',
    '.pgevoke-story-topads',
    '.pgevoke-story-comments-disabled',
    '.pgevoke-story-comments',
    '.pgevoke-story-extracontent-nativo',
    '.pgevoke-civicscience',
    '.pg-bigdrawer',
    '.pg-bigdrawergradient',
    '#template-container',
  ];

  // Remove unwanted junk
  selectorsToRemove.forEach(sel => waitForKeyElements(sel, el => el.remove()));

  // Fix layout when paywall body class appears
  waitForKeyElements('body.pg-bigdraweropen .pgevoke-pagewrapper', el => {
    Object.assign(el.style, {
      height: 'auto',
      position: 'relative',
      overflowY: 'scroll',
    });
  });

  // Hide and remove transparent overlays
  waitForKeyElements('.tp-backdrop.tp-active, .tp-modal', el => {
    Object.assign(el.style, {
      display: 'none',
      opacity: '0',
    });
    el.remove();
  });

  // Auto-scroll un-locker — ensures the page stays scrollable
  const unlockScroll = () => {
    const body = document.body;
    const html = document.documentElement;

    // Restore normal scrolling
    [body, html].forEach(el => {
      if (el.style.overflow === 'hidden' || getComputedStyle(el).overflow === 'hidden') {
        el.style.overflow = 'auto';
        el.style.position = 'static';
        el.style.height = 'auto';
      }
      if (el.classList.contains('pg-bigdraweropen')) {
        el.classList.remove('pg-bigdraweropen');
      }
    });

    // Restore scroll on main wrapper if needed
    const wrapper = document.querySelector('.pgevoke-pagewrapper');
    if (wrapper) {
      wrapper.style.overflowY = 'auto';
      wrapper.style.height = 'auto';
      wrapper.style.position = 'relative';
    }

    window.scrollTo(0, window.scrollY); // re-sync scroll position
  };

  // Run immediately and periodically
  setInterval(unlockScroll, 1000);

  // Watch for new DOM mutations (for re-nuking and scroll locks)
  const observer = new MutationObserver(() => {
    selectorsToRemove.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
    unlockScroll(); // also re-check scroll state after any DOM change
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();