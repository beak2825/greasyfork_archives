// ==UserScript==
// @name         Wattpad Auto Scroll + Load More (with marker)
// @namespace    https://khaid-anthony.local/userscripts
// @version      1.0.6
// @description  Auto scrolls and clicks "Load more" on Wattpad search pages; leaves a marker so you can verify it ran.
// @license      MIT
// @match        https://www.wattpad.com/search*
// @match        https://wattpad.com/search*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546428/Wattpad%20Auto%20Scroll%20%2B%20Load%20More%20%28with%20marker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546428/Wattpad%20Auto%20Scroll%20%2B%20Load%20More%20%28with%20marker%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const UW = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  // Marker so you can verify it ran
  UW.__WATT_AUTOLOAD__ = { injected: true, startedAt: new Date().toISOString(), ticks: 0, clicks: 0 };
  document.documentElement.setAttribute('data-watt-autoload', 'running');

  // Try to accept cookie banner so clicks aren’t blocked
  const consent = document.querySelector('#onetrust-accept-btn-handler');
  if (consent) consent.click();

  function findLoadMore() {
    const nodes = document.querySelectorAll('button, [role="button"]');
    for (const n of nodes) {
      const txt  = (n.textContent || '').trim();
      const aria = (n.getAttribute('aria-label') || '').trim();
      if (/load/i.test(txt) || /load/i.test(aria)) {
        return n.tagName === 'BUTTON' ? n : (n.closest('button') || n);
      }
    }
    return null;
  }

  let lastHeight = 0, stagnant = 0;
  const INTERVAL_MS = 1400, MAX_STAGNANT = 6;

  const timer = setInterval(() => {
    UW.__WATT_AUTOLOAD__.ticks++;

    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);

    // Click "Load more" if found
    const btn = findLoadMore();
    if (btn) { btn.click(); UW.__WATT_AUTOLOAD__.clicks++; stagnant = 0; }

    // Stop after things stop growing
    const h = document.body.scrollHeight;
    if (h <= lastHeight && !btn) {
      if (++stagnant >= MAX_STAGNANT) clearInterval(timer);
    } else {
      stagnant = 0; lastHeight = h;
    }
  }, INTERVAL_MS);
})();