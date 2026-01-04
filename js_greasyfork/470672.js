// ==UserScript==
// @name         Change eBay Favicon
// @namespace    https://example.com/
// @version      1.0
// @description  Changes the favicon for eBay website
// @match        *://www.ebay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470672/Change%20eBay%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/470672/Change%20eBay%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeFavicon() {
        var link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = 'https://googlewebhp.neocities.org/favicon-16x16.png';
    }

    changeFavicon();
})();