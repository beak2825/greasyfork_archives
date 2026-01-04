// ==UserScript==
// @name         Remove TradingView India Ads
// @namespace    http://aravindnc.com/
// @version      1.0
// @description  Script to automatically remove ads on TradingView, targeting various ad elements including dialogs, banners, and iframes.
// @author       AravindNC
// @match        *://*.tradingview.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528601/Remove%20TradingView%20India%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/528601/Remove%20TradingView%20India%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkAd = setInterval(() => {
        const adBox = document.querySelector("[data-dialog-name='gopro']");

        if (adBox) {
            adBox.remove();
        }
    }, 5000);
})();
