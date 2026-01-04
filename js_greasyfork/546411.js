// ==UserScript==
// @name         Wattpad Search: Auto Load More
// @namespace    https://greasyfork.org/en/users/you
// @version      1.0
// @description  Auto-clicks "Load more" on Wattpad search results until it disappears.
// @match        https://www.wattpad.com/search*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546411/Wattpad%20Search%3A%20Auto%20Load%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/546411/Wattpad%20Search%3A%20Auto%20Load%20More.meta.js
// ==/UserScript==
// @license MIT

(function () {
  'use strict';

  // Your provided XPath (very specific to one container)
  const LOAD_BTN_XPATH = '//*[@id="component-storycardcontainer-story-card-container-%2fsearch%2fcomic"]/div/div[1]/button';

  // Tiny XPath helper
  const $x = (xp) =>
    document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  // Fallback finder: any button whose text includes "Load" (simple & robust)
  function findLoadMore() {
    return $x(LOAD_BTN_XPATH) || Array.from(document.querySelectorAll('button'))
      .find(b => /load/i.test(b.textContent || ''));
  }

  let misses = 0, maxMisses = 5;     // stop after a few misses (safety)
  let maxClicks = 300;               // overall safety cap

  const tick = setInterval(() => {
    // Scroll down to encourage lazy content to render
    window.scrollTo(0, document.body.scrollHeight);

    const btn = findLoadMore();
    if (btn && maxClicks-- > 0) {
      btn.click();
      misses = 0; // reset when we successfully click
      return;
    }

    // No button this round—count a miss and stop after several
    if (++misses >= maxMisses || maxClicks <= 0) {
      clearInterval(tick);
      console.log('[Wattpad Auto Load More] Finished.');
    }
  }, 1200);
})();