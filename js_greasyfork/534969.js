// ==UserScript==
// @name         Begone YouTube Shorts
// @namespace    http://tampermonkey.net/
// @description  Remove all references to YouTube Shorts from the home page, sidebar, and newly loaded content. Any shorts are redirected to the /watch equivalent.
// @version      2027-06-12
// @author       Brendan Moore
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534969/Begone%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/534969/Begone%20YouTube%20Shorts.meta.js
// ==/UserScript==
(function() {
  'use strict';

  let executionCount = 0;
  // Cache mapping img.src -> boolean (true if portrait, false if landscape)
  const imgRatioCache = new Map();

  function removeShorts() {
    executionCount++;
    //console.log('executionCount', executionCount);

    // --- mobile (m.youtube.com) ---------------------------------------------

    // 1) Remove whole Shorts shelves
    document.querySelectorAll('ytm-reel-shelf-renderer').forEach(el => el.remove());

    // 2) Remove individual Short cards wherever they appear
    document
      .querySelectorAll('ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-rich-item-renderer')
      .forEach(card => {
        if (card.querySelector('[data-style="SHORTS"], [aria-label="Shorts"]')) {
          card.remove();
        }
      });

    // 3) Remove the Shorts button in the bottom nav
    document.querySelectorAll('.pivot-shorts')
      .forEach(btn => btn.closest('ytm-pivot-bar-item-renderer')?.remove());

    // --- desktop (www.youtube.com) ---------------------------------------------

    // 1) Remove entire "Shorts" shelves
    document.querySelectorAll(
      'ytd-rich-shelf-renderer[is-shorts], ytd-rich-shelf-renderer, ytd-reel-shelf-renderer'
    ).forEach(shelf => {
      const title = shelf.querySelector('#title')?.textContent.trim();
      if (shelf.hasAttribute('is-shorts') || title === 'Shorts') {
        shelf.remove();
      }
    });

    // 2) Remove individual Shorts lockups
    document.querySelectorAll('ytm-shorts-lockup-view-model-v2').forEach(lockup => {
      const item = lockup.closest('ytd-rich-item-renderer');
      (item || lockup).remove();
    });

    const MAX_CACHE_SIZE = 1000, CACHE_PRUNE_AMT = 200;
    // 3) Fallback: any video thumbnail taller than it is wide (cached by src)
    document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
      const img = item.querySelector('img');
      if (!img) return;

      const src = img.src;
      let isPortrait = imgRatioCache.get(src);

      if (isPortrait === undefined) {
        const rect = img.getBoundingClientRect();
        isPortrait = rect.height > rect.width;
        imgRatioCache.set(src, isPortrait);

        // Prune cache when it grows too large
        if (imgRatioCache.size > MAX_CACHE_SIZE) {
          const keys = imgRatioCache.keys();
          console.log('pruning cache');
          // Remove oldest entries until size is back under 800
          while (imgRatioCache.size > MAX_CACHE_SIZE - CACHE_PRUNE_AMT) {
            imgRatioCache.delete(keys.next().value);
          }
          console.log(imgRatioCache.size);
        }
      }

      if (isPortrait) {
        item.remove();
      }
    });
  }

  function removeSidebarShortsWithRetries() {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = 16; // ms

    const timer = setInterval(() => {
      attempts++;
      const entries = [
        ...document.querySelectorAll('ytd-guide-entry-renderer'),
        ...document.querySelectorAll('ytd-mini-guide-entry-renderer')
      ];

      entries.forEach(entry => {
        const text = entry.textContent.trim();
        const href = entry.querySelector('a')?.href || '';
        if (text.includes('Shorts') || href.includes('/shorts')) {
          entry.remove();
        }
      });

      if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, interval);
  }

  // —— throttle / queue system ——
  let pendingRemoval = false;
  let throttleTimer = null;
  const THROTTLE_MS = 500;

  function scheduleRemoveShorts() {
    pendingRemoval = true;
    if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        if (pendingRemoval) {
          removeShorts();
          pendingRemoval = false;
        }
        throttleTimer = null;
      }, THROTTLE_MS);
    }
  }

  // —— Guide-button listener with retry ——
  function attachGuideButtonListener() {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = 200; // ms

    const timer = setInterval(() => {
      attempts++;
      const btn = document.getElementById('guide-button');
      if (btn) {
        btn.addEventListener('click', () => {
          removeSidebarShortsWithRetries();
        });
        clearInterval(timer);
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, interval);
  }

  // —— SPA-aware / full-load redirect for /shorts/ URLs ——
  function redirectShorts() {
    const m = location.pathname.match(/^\/shorts\/([^/?]+)/);
    if (m && m[1]) {
      const vid = m[1];
      window.location.replace(`https://www.youtube.com/watch?v=${vid}`);
    }
  }

  function hookNavigationEvents() {
    ['pushState', 'replaceState'].forEach(fn => {
      const orig = history[fn];
      history[fn] = function(...args) {
        const rv = orig.apply(this, args);
        redirectShorts();
        return rv;
      };
    });
    window.addEventListener('popstate', redirectShorts);
    document.addEventListener('yt-navigate-finish', redirectShorts);
  }

  // —— initialization ——
  removeShorts();
  removeSidebarShortsWithRetries();
  scheduleRemoveShorts();
  attachGuideButtonListener();
  hookNavigationEvents();

  // Watch for dynamically added content, but throttle calls
  new MutationObserver(scheduleRemoveShorts).observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also check redirects on full load
  redirectShorts();
})();
