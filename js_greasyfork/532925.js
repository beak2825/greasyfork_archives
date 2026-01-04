// ==UserScript==
// @name         Wecima Anti-Adblock Detector
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Attempts to disable the adblock overlay triggered by a specific script checking adsbygoogle.js loading.
// @author       abadi718
// @match        *://wec.im/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532925/Wecima%20Anti-Adblock%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/532925/Wecima%20Anti-Adblock%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Flag to prevent console spam
    let overlayHiddenMessageShown = false;
    let scrollRestoredMessageShown = false;

    // Function to check for and hide the adblock overlay, and restore scrolling
    function checkAndFixAdblockNotice() {
        // Find the adblock overlay element (adjust selector if needed)
        const adBlockOverlay = document.getElementById('adBlock');

        // Check if the overlay exists and is visible (display: flex)
        if (adBlockOverlay && window.getComputedStyle(adBlockOverlay).display === 'flex') {
            // Hide the overlay
            adBlockOverlay.style.display = 'none';
            if (!overlayHiddenMessageShown) {
                 console.log('Tampermonkey: Adblock overlay hidden.');
                 overlayHiddenMessageShown = true; // Show message only once per detection
            }
        } else {
             // Reset flag if overlay is not currently detected as flex
             overlayHiddenMessageShown = false;
        }


        // Check if body scrolling is disabled
        if (document.body.style.overflow === 'hidden') {
            // Restore scrolling
            document.body.style.overflow = 'auto'; // Or 'visible' or '' depending on site's default
             if (!scrollRestoredMessageShown) {
                console.log('Tampermonkey: Body scroll restored.');
                scrollRestoredMessageShown = true; // Show message only once per detection
            }
        } else {
             // Reset flag if scroll is not currently detected as hidden
             scrollRestoredMessageShown = false;
        }
    }

    // Run the check periodically (e.g., every 500 milliseconds)
    // Adjust interval if needed - lower values are more responsive but use more resources
    const intervalId = setInterval(checkAndFixAdblockNotice, 500);

    // Optional: You might want to stop the interval after some time if the site is stable,
    // but it's generally safe to leave it running.
    // setTimeout(() => clearInterval(intervalId), 60000); // Example: Stop after 1 minute

    console.log('Tampermonkey: Anti-Adblock Detector script active.');

})();