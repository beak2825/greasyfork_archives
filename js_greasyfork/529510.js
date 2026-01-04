// ==UserScript==
// @name         Hide TradingView Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Says what is says
// @author       AravindNC
// @match        https://*.tradingview.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529510/Hide%20TradingView%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/529510/Hide%20TradingView%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideOverlapManager() {
        let element = document.getElementById("overlap-manager-root");
        if (element) {
            element.style.display = "none";
        }
    }

    // Run on page load
    hideOverlapManager();

    // Run periodically in case the element is dynamically added
    setInterval(hideOverlapManager, 5000);
})();
