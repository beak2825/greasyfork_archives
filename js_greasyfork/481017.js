// ==UserScript==
// @name         Remove Amazon Tracking Parameters (All Domains)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Aggressive approach to remove Amazon tracking parameters across all country domains
// @include       *://*.amazon.*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481017/Remove%20Amazon%20Tracking%20Parameters%20%28All%20Domains%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481017/Remove%20Amazon%20Tracking%20Parameters%20%28All%20Domains%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Removes tracking from the current URL if it matches an Amazon product page
     * and rewrites history to a clean version of the URL.
     */
    function cleanAmazonUrl() {
        var currentURL = window.location.href;
        // Matches /dp/ASIN or /gp/product/ASIN with a 10-character code
        // The 'i' flag lets it match uppercase or lowercase letters/numbers
        var asinPattern = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i;
        var match = asinPattern.exec(currentURL);
        if (match) {
            var asin = match[1];
            var newURL = window.location.protocol + '//' + window.location.host + '/dp/' + asin;
            if (newURL !== currentURL) {
                // Rewrite the URL in the address bar without triggering a page reload
                window.history.replaceState({}, document.title, newURL);
            }
        }
    }

    // --- Hook into history methods and popstate to catch all Amazon URL changes --- //

    var _pushState = history.pushState;
    var _replaceState = history.replaceState;

    // Override pushState
    history.pushState = function(state, title, url) {
        var ret = _pushState.apply(this, arguments);
        // After pushState is called, clean the URL
        setTimeout(cleanAmazonUrl, 10);
        return ret;
    };

    // Override replaceState
    history.replaceState = function(state, title, url) {
        var ret = _replaceState.apply(this, arguments);
        // After replaceState is called, clean the URL
        setTimeout(cleanAmazonUrl, 10);
        return ret;
    };

    // Also listen for popstate (back/forward browser buttons)
    window.addEventListener('popstate', function() {
        // Clean the URL after a brief delay
        setTimeout(cleanAmazonUrl, 10);
    });

    // Lastly, do an initial cleanup as early as possible (document-start)
    cleanAmazonUrl();
})();
