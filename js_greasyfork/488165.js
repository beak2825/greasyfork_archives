// ==UserScript==
// @name         Linkvertise Bypasser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass Linkvertise ads
// @author       You
// @match        https://linkvertise.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488165/Linkvertise%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/488165/Linkvertise%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the ad link
        var adLink = document.querySelector('a[href*="/go/"]');

        // If the ad link exists, click it
        if (adLink) {
            adLink.click();
        }
    }, false);
})();