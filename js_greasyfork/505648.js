// ==UserScript==
// @name         Universal Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Blocks ads on all sites
// @match        *://*/*  // Apply to all URLs
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505648/Universal%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/505648/Universal%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle ad elements
    function blockAds() {
        // List of common ad container selectors
        const adSelectors = [
            'iframe[src*="ads"]', 
            'iframe[src*="advertising"]',
            'iframe[src*="ad"]',
            'div[id*="ad"]',
            'div[class*="ad"]',
            'div[class*="banner"]',
            'div[id*="banner"]',
            'div[class*="promo"]',
            'div[id*="promo"]',
            'div[class*="sponsor"]',
            'div[id*="sponsor"]',
            'div[id*="google_ads"]',
            'div[id*="ad-container"]',
            'div[class*="ad-container"]',
            'a[href*="ad"]',
            'a[href*="advert"]',
            'script[src*="ads"]',
            'script[src*="advertising"]'
        ];

        // Hide ad elements
        adSelectors.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.style.display = 'none');
        });

        // Remove ad elements
        adSelectors.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.remove());
        });

        // Close ad pop-ups
        const closeSelectors = ['.close-button', '.ad-close', '.dismiss-ad', '.close', '[aria-label="Close"]'];
        closeSelectors.forEach(selector => {
            const closeButtons = document.querySelectorAll(selector);
            closeButtons.forEach(button => button.click());
        });
    }

    // Check for ads every 2 seconds
    setInterval(blockAds, 2000);

    // Observe DOM changes to catch dynamically loaded ads
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => blockAds());
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial handling
    blockades();
})();
