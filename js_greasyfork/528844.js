// ==UserScript==
// @license MIT
// @name         Hide Temu Local Listings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide Temu listings from local warehouses
// @author       You
// @match        *://*.temu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528844/Hide%20Temu%20Local%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/528844/Hide%20Temu%20Local%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Text indicators that signify local listings
    const LOCAL_INDICATORS = [
        'Local',
        'local warehouse',
        'Ships from nearby'
    ];

    function hideLocalListings() {
        // Find the main container with the product listings
        const container = document.querySelector('.js-search-goodsList');
        if (!container) return;

        // Find the autoFitList container
        const autoFitList = container.querySelector('.autoFitList');
        if (!autoFitList) return;

        // Get all direct child divs of autoFitList (these are the product containers)
        const productContainers = autoFitList.children;

        for (const productContainer of productContainers) {
            // Skip non-div elements
            if (productContainer.tagName !== 'DIV') continue;

            // Get all text elements in this listing
            const textElements = productContainer.querySelectorAll('span, div');

            // Check if any text elements contain our local indicators
            let isLocalListing = false;
            for (const element of textElements) {
                const text = element.textContent.trim();

                // Check if text indicates a local listing
                if (LOCAL_INDICATORS.some(indicator => text.includes(indicator))) {
                    isLocalListing = true;
                    break;
                }

                // Also check for the green color styling
                if (element.getAttribute('style') &&
                    element.getAttribute('style').includes('color:#0A8800')) {
                    isLocalListing = true;
                    break;
                }
            }

            // Hide the product container if it's a local listing
            if (isLocalListing) {
                productContainer.style.display = 'none';
                console.log('Hidden local listing:', productContainer);
            }
        }
    }

    // Initial run
    function init() {
        hideLocalListings();

        // Run again after a short delay to catch any lazy-loaded content
        setTimeout(hideLocalListings, 1500);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Set up an observer for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        clearTimeout(window.localListingsTimer);
        window.localListingsTimer = setTimeout(hideLocalListings, 300);
    });

    // Start observing changes to the body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();