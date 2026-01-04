// ==UserScript==
// @name         Marktplaats Ad Blaster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove ads that contain the "Bezoek website" link
// @author       You
// @match        https://www.marktplaats.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522027/Marktplaats%20Ad%20Blaster.user.js
// @updateURL https://update.greasyfork.org/scripts/522027/Marktplaats%20Ad%20Blaster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove ads containing "Bezoek website"
    function removeAds() {
        // Get all elements with the class "hz-Listing-seller-link"
        const sellerLinks = document.querySelectorAll('.hz-Listing-seller-link');

        sellerLinks.forEach((link) => {
            // Check if the link text is "Bezoek website"
            if (link.textContent.trim().toLowerCase() === "bezoek website") {
                // Find the closest ad element to the link
                const adElement = link.closest('.hz-Listing');  // Find the closest parent with the ad listing class
                if (adElement) {
                    adElement.style.display = 'none';  // Hide the entire ad
                }
            }
        });

        // Hide the banner if needed
        const banner = document.getElementById('banner-rubrieks-dt');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', removeAds);

    // Optionally, use MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });

})();
