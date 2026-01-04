// ==UserScript==
// @name         Swordz.io box hider
// @namespace    intuxs
// @version      1
// @description  Hides junk in the homescreen
// @author       YourName
// @match        *.swordz.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527590/Swordzio%20box%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/527590/Swordzio%20box%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide ads
    function hideAds() {
        // Target ads based on their structure or other attributes
        const ads = document.querySelectorAll('div[style*="background-color"], iframe, img[src*="ads"]');
        
        ads.forEach(ad => {
            // Check if the ad is visible and matches certain criteria
            if (ad.offsetWidth > 0 && ad.offsetHeight > 0) { // Ensure the ad is visible
                ad.style.display = 'none'; // Hide the ad
                console.log('Ad hidden:', ad);
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', hideAds);

    // Use MutationObserver to handle dynamically loaded ads
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                hideAds(); // Check for new ads and hide them
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();