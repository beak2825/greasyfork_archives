// ==UserScript==
// @name         Youtube close ads and promo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Skip youtube ads and promo by scan once a second
// @author       Konsto
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426237/Youtube%20close%20ads%20and%20promo.user.js
// @updateURL https://update.greasyfork.org/scripts/426237/Youtube%20close%20ads%20and%20promo.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var selectors = ["div.ytp-ad-overlay-close-container > button", ".ytp-ad-skip-button", "div.ytd-banner-promo-renderer > #dismiss-button", ".ytd-mealbar-promo-renderer > #dismiss-button"];

    setInterval(
        function () {
            try{ document.querySelectorAll(selectors.join(",")).forEach( function(el){ el.click() } ) } catch(e){}
        }, 1000)
})();