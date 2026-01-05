// ==UserScript==
// @name         Wealth of Nations
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  block paywall on the economist
// @author       thebspatrol
// @match        http*://economist.com/*
// @match        http*://*.economist.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29235/Wealth%20of%20Nations.user.js
// @updateURL https://update.greasyfork.org/scripts/29235/Wealth%20of%20Nations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".blog-post__text, .blog-post__image, .blog-post__comments { display: block !important; }");

    for (var i = 0; i < 9; i++) {
        setTimeout(function(){
            var upsell = document.getElementById("piano__in-line-paywall");

            if (upsell === null) { return; }
            upsell.parentNode.removeChild(upsell);
        }, 1000*i);
    }
})();