// ==UserScript==
// @name        Remove Novelpia Viewer Ads
// @namespace   Novelpia.com
// @match       https://novelpia.com/viewer/*
// @grant       none
// @version     1.0.5
// @author      -
// @description Safari Content blocker is meh
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448311/Remove%20Novelpia%20Viewer%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/448311/Remove%20Novelpia%20Viewer%20Ads.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // wait a page load a bit
  setTimeout(() => {
    // block function
    let _____blockfunc = () => {
      // Coin payback
      ['#novel_drawing a[href="/coin_shop"]', '#novel_drawing_page a[href="/coin_shop"]'].forEach(s => {
        document.querySelectorAll(s).forEach(e => {
          e.parentNode.remove()
        });
      });
    };

    // run function.
    _____blockfunc();

    // tons of shit makes set interval. fuck
    setInterval(_____blockfunc, 1000);
  }, 500);
})();