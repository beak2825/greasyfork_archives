// ==UserScript==
// @name         Hide YouTube Skip Buttons (mobile)
// @namespace    https://example.com/
// @version      1.0
// @description  Hide skip to next/previous video overlay buttons on mobile YouTube (m.youtube.com)
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543152/Hide%20YouTube%20Skip%20Buttons%20%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543152/Hide%20YouTube%20Skip%20Buttons%20%28mobile%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeOverlays() {
    document.querySelectorAll('[aria-label="Next video"], [aria-label="Previous video"], .ytp-next-overlay, .ytp-prev-overlay')
      .forEach(el => {
        el.style.display = 'none';
      });
  }

  const observer = new MutationObserver(removeOverlays);
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(removeOverlays, 1000);
})();