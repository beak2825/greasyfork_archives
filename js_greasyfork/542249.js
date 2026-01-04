// ==UserScript==
// @name         Protopage Remove Advertisements
// @namespace    http://tampermonkey.net/protopageadremoval
// @include      https://www.protopage.com/*
// @grant        none
// @version      1.0.2
// @description  Removes ads from Protopage with futureproofing and safe execution
// @author       xechostormx
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/542249/Protopage%20Remove%20Advertisements.user.js
// @updateURL https://update.greasyfork.org/scripts/542249/Protopage%20Remove%20Advertisements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration for ad selectors (refined to avoid overreach)
    const AD_SELECTORS = [
        '#ad-0',              // Primary ad element (confirmed via inspection)
        '[id^="ad-"]',        // Dynamic ad IDs starting with "ad-" (e.g., ad-1, ad-2)
        '.ad-banner',         // Hypothetical class for ads (adjust based on inspection)
        '.advertisement'      // Another potential ad class (adjust based on inspection)
    ];

    // Safely remove ad elements
    function removeAds() {
        let adsRemoved = 0;
        const body = document.body;
        if (!body) {
            console.error('Body not found, aborting ad removal.');
            return;
        }

        AD_SELECTORS.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => {
                if (ad && ad.parentNode && ad !== body && !ad.contains(body)) {
                    ad.parentNode.removeChild(ad);
                    adsRemoved++;
                } else {
                    console.warn(`Skipped potential invalid ad removal for selector: ${selector}`);
                }
            });
        });

        if (adsRemoved > 0) {
            console.log(`Removed ${adsRemoved} ad(s) from Protopage at ${new Date().toLocaleTimeString()}`);
        } else {
            console.log('No ads found to remove at ' + new Date().toLocaleTimeString());
        }
    }

    // Observe DOM changes for dynamically loaded ads
    function observeAds() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    removeAds();
                }
            });
        });

        const targetNode = document.body;
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
            console.log('Ad Zapper observer started at ' + new Date().toLocaleTimeString());
        } else {
            console.error('Body not found for observation.');
        }

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            observer.disconnect();
        });
    }

    // Initialize when DOM is ready and a key element exists
    function init() {
        // Wait for a key Protopage element (e.g., content area) to ensure page is loaded
        const contentArea = document.querySelector('#page-content') || document.querySelector('.page-container');
        if (document.body && contentArea) {
            removeAds();
            observeAds();
        } else {
            console.warn('Document not fully loaded, retrying...');
            setTimeout(init, 500); // Retry after 500ms
        }
    }

    // Start the script
    init();
})();