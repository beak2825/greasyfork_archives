// ==UserScript==
// @name         nozcy ads block
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Try to block ads
// @author       @nozcy
// @match        *://*/*
// @grant        none
// @license      MTT
// @downloadURL https://update.greasyfork.org/scripts/493031/nozcy%20ads%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/493031/nozcy%20ads%20block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blockAds() {
        const elementsToRemove = document.querySelectorAll('iframe[src*="ad"], div[id*="ad"], div[class*="ad"], div[data-ad-slot]');
        for (const element of elementsToRemove) {
            element.remove();
        }
    }

    // Block ads on page load
    blockAds();

    // Also block ads every 100 milliseconds
    setInterval(blockAds, 100);
})();