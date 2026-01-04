// ==UserScript==
// @name         [Wallapop] CDN: request individual images of articles of the highest resolution possible
// @description  On cdn.wallapop.com, whenever pictureSize=W<number> and number < 1024, replace with W1024, to view individual pictures of items at higher resolution than provided by default.
// @icon         https://www.google.com/s2/favicons?sz=32&domain_url=wallapop.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain_url=wallapop.com
// @author       nooobye
// @namespace    https://greasyfork.org/en/scripts/545851-wallapop-cdn-upgrade-smaller-w-sizes-to-w1024
// @version      2025-08-18
// @match        https://cdn.wallapop.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545851/%5BWallapop%5D%20CDN%3A%20request%20individual%20images%20of%20articles%20of%20the%20highest%20resolution%20possible.user.js
// @updateURL https://update.greasyfork.org/scripts/545851/%5BWallapop%5D%20CDN%3A%20request%20individual%20images%20of%20articles%20of%20the%20highest%20resolution%20possible.meta.js
// ==/UserScript==

(function () {
  try {
    const url = new URL(location.href);
    const ps = url.searchParams.get('pictureSize');
    if (ps && ps.startsWith('W')) {
      const num = parseInt(ps.slice(1), 10);
      // Only sizes of W640 and W800 have been seen
      if (!isNaN(num) && num < 1024) {
        url.searchParams.set('pictureSize', 'W1024');
        if (url.href !== location.href) {
          location.replace(url.href);
        }
      }
    }
  } catch (e) {
    // no-op
  }
})();
