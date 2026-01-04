// ==UserScript==
// @name         BoxOfficeTurkey Ad Blocker Bypass
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Overrides ad blocker detection on boxofficeturkiye.com
// @author       You
// @match        https://boxofficeturkiye.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496678/BoxOfficeTurkey%20Ad%20Blocker%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/496678/BoxOfficeTurkey%20Ad%20Blocker%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to override styles and remove elements
    function overrideAdBlockerDetection() {
        // Override the filter property
        document.querySelectorAll('.user-has-ad-blocker .content-wrapper').forEach(element => {
            element.style.filter = 'none';
        });

        // Remove the ad blocker detected element
        document.querySelectorAll('.ad-blocker-detected').forEach(element => {
            element.remove();
        });
    }

    // Run on initial page load
    overrideAdBlockerDetection();

    // Run on every DOM change
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            overrideAdBlockerDetection();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
