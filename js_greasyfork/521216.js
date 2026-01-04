// ==UserScript==
// @name         Remove Popup Ads from Mobalytics
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove advertisement blocks and anti-adblock banners on Mobalytics.gg
// @author       Your Name
// @match        https://mobalytics.gg/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521216/Remove%20Popup%20Ads%20from%20Mobalytics.user.js
// @updateURL https://update.greasyfork.org/scripts/521216/Remove%20Popup%20Ads%20from%20Mobalytics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove advertisement elements
    function removeAds() {
        const adElements = document.querySelectorAll('div.m-1b70aff, div.m-mi6bts, div.m-1hsuptt');
        if (adElements.length > 0) {
            adElements.forEach(ad => {
                ad.remove(); // Remove the advertisement element from the DOM
            });
        } else {
            console.log("No ads found to remove."); // Log if no ads are found
        }
    }

    // Run the function to remove ads when the page is fully loaded
    window.addEventListener('load', () => {
        removeAds();

        // Observe for dynamically added ads
        const observer = new MutationObserver(removeAds);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
