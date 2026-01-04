// ==UserScript==
// @name         VIP League Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block pop-ups, ads, and interruptions on VIP League
// @author       Jayce Daiye
// @match        https://www.vipleague.pm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508311/VIP%20League%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/508311/VIP%20League%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block pop-up windows
    window.open = function() { return null; };

    // Remove known ad elements by common IDs or classes
    const removeAds = () => {
        // Common ad classes or IDs (update as necessary)
        const adSelectors = [
            '#ad-container',    // Example ad container
            '.ad-banner',       // Example ad banner
            '.pop-up',          // Example pop-ups
            '[id*="ad"]',       // Elements with IDs containing 'ad'
            '[class*="ad"]',    // Elements with classes containing 'ad'
            '.adsbox',          // Other specific ad boxes
        ];

        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => ad.remove());
        });
    };

    // Run the ad removal on page load and every 2 seconds (to catch dynamic ads)
    removeAds();
    setInterval(removeAds, 2000);

    // Block common JavaScript alerts and confirmations
    window.alert = () => {};
    window.confirm = () => true;
    window.prompt = () => null;

    // Disable specific event listeners that may cause interruptions
    const disableEventListeners = () => {
        document.querySelectorAll('*').forEach(el => {
            el.onclick = null;
            el.onmousedown = null;
            el.onmouseup = null;
        });
    };

    disableEventListeners();

    // Optional: Observe for new nodes being added dynamically
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            removeAds();
            disableEventListeners();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
