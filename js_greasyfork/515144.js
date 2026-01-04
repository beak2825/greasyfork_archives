// ==UserScript==
// @name         Trendyol Sponsor Ad Remover
// @name:tr      Trendyol Sponsor Reklam Gizleyici
// @version      1.4
// @description  This script hides specific ads on Trendyol to enhance the shopping experience.
// @description:tr  Bu script, Trendyol'daki belirli reklamları gizleyerek alışveriş deneyimini iyileştirir.
// @author       Alyssa B. Morton
// @match        https://www.trendyol.com/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://cdn.dsmcdn.com/web/production/favicon.ico
// @namespace    https://violentmonkey.github.io/
// @downloadURL https://update.greasyfork.org/scripts/515144/Trendyol%20Sponsor%20Reklam%20Gizleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/515144/Trendyol%20Sponsor%20Reklam%20Gizleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideAds = () => {
        try {
            // Select all ad containers
            const adElements = document.querySelectorAll('div.p-card-wrppr.with-campaign-view');

            adElements.forEach(ad => {
                // Check if the ad contains the specific image
                const img = ad.querySelector('img[src="https://cdn.dsmcdn.com//seller-ads/editor/resources/seller-selection-stamp-v16.png"]');
                if (img) {
                    // Hide the specific ad container
                    ad.style.display = 'none'; // Hide the ad
                }
            });
        } catch (error) {
            console.error('Error hiding ads:', error);
        }
    };

    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Wait for the page to load completely
    window.addEventListener('load', () => {
        hideAds(); // Execute the hideAds function after the page has fully loaded

        // Set up a MutationObserver to watch for changes in the DOM
        const observer = new MutationObserver(debounce(() => {
            hideAds(); // Call hideAds whenever the DOM changes
        }, 300));

        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
