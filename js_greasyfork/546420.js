// ==UserScript==
// @name         Wattpad Auto Scroll + Load More
// @namespace    https://khaid-anthony.local/userscripts
// @version      1.0.0
// @description  Automatically scrolls and clicks "Load more" on Wattpad search results until there is nothing left to load.
// @license      MIT
// @match        https://www.wattpad.com/search*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546420/Wattpad%20Auto%20Scroll%20%2B%20Load%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/546420/Wattpad%20Auto%20Scroll%20%2B%20Load%20More.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Find any "Load more" style button (by text or aria-label)
  function findLoadMore() {
    const buttons = document.querySelectorAll('button, [role="button"]');
    for (const b of buttons) {
      const text = (b.textContent || '').trim();
      const aria = (b.getAttribute('aria-label') || '').trim();
      if (/load/i.test(text) || /load/i.test(aria)) return b;
    }
    return null;
  }

  let lastHeight = 0;
  let stagnant = 0;
  const MAX_STAGNANT_TICKS = 6; // stop after 6 cycles with no growth
  const INTERVAL_MS = 1200;

  const timer = setInterval(() => {
    // 1) Scroll to bottom to trigger lazy loading
    window.scrollTo(0, document.body.scrollHeight);

    // 2) Click "Load more" if present
    const btn = findLoadMore();
    if (btn) btn.click();

    // 3) Stop when page height stops increasing for several cycles AND no button is found
    const h = document.body.scrollHeight;
    if (h <= lastHeight && !btn) {
      stagnant++;
      if (stagnant >= MAX_STAGNANT_TICKS) {
        clearInterval(timer);
      }
    } else {
      stagnant = 0;
      lastHeight = h;
    }
  }, INTERVAL_MS);
})();