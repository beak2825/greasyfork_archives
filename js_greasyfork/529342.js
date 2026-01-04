// ==UserScript==
// @name         Scrolller Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Attempts to bypass paywall on scrolller.com by removing overlays and restrictions
// @author       Grok
// @match        *://*.scrolller.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529342/Scrolller%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/529342/Scrolller%20Paywall%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove paywall elements
    function removePaywall() {
        // Common paywall overlay selectors (adjust after inspecting the site)
        const paywallSelectors = [
            '.paywall',              // Generic class
            '.modal',               // Common overlay class
            '.overlay',             // Common overlay class
            '#paywall',             // Generic ID
            '[class*="premium"]',   // Classes with "premium" in the name
            '[class*="locked"]',    // Classes with "locked" in the name
            '[id*="premium"]',      // IDs with "premium" in the name
            '.subscription-prompt'  // Possible subscription popup
        ];

        // Remove elements matching the selectors
        paywallSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.remove(); // Delete the element from the DOM
                console.log(`Removed element: ${selector}`);
            });
        });

        // Unlock scrolling (common paywall trick)
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // Remove blur or opacity effects
        const blurredElements = document.querySelectorAll('[style*="blur"], [style*="opacity"]');
        blurredElements.forEach(el => {
            el.style.filter = 'none';
            el.style.opacity = '1';
            console.log('Cleared blur/opacity on element');
        });

        // Disable inline styles that hide content
        const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
        hiddenElements.forEach(el => {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            console.log('Unhid element');
        });
    }

    // Run immediately
    removePaywall();

    // Run again after a delay (in case paywall loads dynamically)
    setTimeout(removePaywall, 1000);
    setTimeout(removePaywall, 3000);

    // Observe DOM changes (for dynamic paywalls)
    const observer = new MutationObserver(() => {
        removePaywall();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Optional: Spoof a logged-in state (if site checks localStorage/cookies)
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('loggedIn', 'true');
})();