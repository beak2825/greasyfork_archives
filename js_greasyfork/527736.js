// ==UserScript==
// @name         SelectiveTrial Free Paper Access
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Attempt to unlock papers on selectivetrial.com for free (educational use only)
// @author       You
// @match        *://*.selectivetrial.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527736/SelectiveTrial%20Free%20Paper%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/527736/SelectiveTrial%20Free%20Paper%20Access.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and remove paywall elements
    function unlockPapers() {
        // Hypothetical paywall class or ID - adjust these based on actual site inspection
        const paywallElements = document.querySelectorAll('.paywall, .locked-content, .premium-overlay');
        paywallElements.forEach(element => {
            element.style.display = 'none'; // Hide paywall overlay
        });

        // Hypothetical content class - reveal hidden content
        const lockedContent = document.querySelectorAll('.content-locked, .premium-content');
        lockedContent.forEach(content => {
            content.style.display = 'block'; // Show hidden content
            content.classList.remove('locked'); // Remove any locking class
        });

        // Remove blur or other restrictions if applied via CSS
        const blurredContent = document.querySelectorAll('[style*="blur"]');
        blurredContent.forEach(el => {
            el.style.filter = 'none'; // Remove blur effect
        });

        // Log success or failure
        if (paywallElements.length > 0 || lockedContent.length > 0) {
            console.log('Paywall elements targeted successfully.');
        } else {
            console.log('No paywall elements found. Inspect the page to adjust selectors.');
        }
    }

    // Run the function after the page fully loads
    window.addEventListener('load', () => {
        unlockPapers();
        
        // Optional: Periodically check for dynamically loaded paywalls
        setInterval(unlockPapers, 2000); // Runs every 2 seconds
    });

    // Initial run in case DOM is already loaded
    unlockPapers();
})();