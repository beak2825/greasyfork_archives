// ==UserScript==
// @name         Remove Ads and Block Popups on mkvcinemas
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes ads, prevents popups, and blocks unwanted redirects on mkvcinemas
// @author       Hasan-Abbas
// @match        https://mkvcinemas.*/** 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525834/Remove%20Ads%20and%20Block%20Popups%20on%20mkvcinemas.user.js
// @updateURL https://update.greasyfork.org/scripts/525834/Remove%20Ads%20and%20Block%20Popups%20on%20mkvcinemas.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // A function to remove an element if it exists
    function removeElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    }

    // Common ad-related selectors (you can expand this list based on observation)
    const adSelectors = [
        '#ad',  // Common ID for ads
        '.ads',  // Common class for ads
        '.ad-banner',  // Specific ad banners
        '.advertisement',  // Another common class
        '.popup',  // Popups
        '.video-ad',  // Video ads
        '.banner',  // Banner ads
        'iframe[src*="ads"]',  // Iframes often contain ads
        '[id*="ad"]',  // IDs that contain 'ad'
        '[class*="ad"]',  // Classes that contain 'ad'
        '[style*="display: none"]',  // Some hidden ad elements
        '.cookie-popup', // Cookie consent popups (can be ad related)
    ];

    // Run remove for each selector
    adSelectors.forEach(selector => removeElement(selector));

    // Block unwanted popups (opening new tabs or windows)
    const originalWindowOpen = window.open;
    window.open = function (url, name, specs) {
        // Prevent window.open from opening new tabs/windows (can be refined further if necessary)
        console.log("Blocked popup attempt:", url);
        return null;
    };

    // Disable links that lead to external downloads or app redirects
    const links = document.querySelectorAll('a[href*="telegram"], a[href*="download"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Blocked redirect to', link.href);
        });
    });

    // Handle redirects by listening for location change or hijacked URLs
    const originalLocation = window.location.href;
    setInterval(() => {
        if (window.location.href !== originalLocation) {
            window.location.href = originalLocation;  // Redirect back to original page
        }
    }, 1000);

    // You might want to listen for dynamic content loading (like more ads appearing via JS)
    // If necessary, use MutationObserver to catch these dynamically loaded elements
    const observer = new MutationObserver(() => {
        adSelectors.forEach(selector => removeElement(selector));
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
