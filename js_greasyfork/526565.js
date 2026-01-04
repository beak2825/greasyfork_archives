// ==UserScript==
// @name         Twitter/X UI Improvements
// @namespace    https://twitter.com/
// @version      1.1
// @description  Improves Twitter/X layout by adjusting widths and removing grok and stuff
// @author       Minoa
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526565/TwitterX%20UI%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/526565/TwitterX%20UI%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles
    const customStyles = `
        .r-1ye8kvj { max-width: 680px !important; }
        .r-o96wvk { width: 230px !important; }
        .r-ttdzmv { padding-top: 8px !important; }
        .r-1hycxz { width: 280px !important; }
        .r-1jte41z { min-width: 250px !important; }
    `;
    
    GM_addStyle(customStyles);

    // Function to remove unwanted elements
    function removeElements() {
        const selectors = [
            '[data-testid="GrokDrawer"]',
            'a[href="/i/grok"]',
            'a[href="/i/verified-orgs-signup"]',
            'a[href="/i/premium_sign_up"]',
            'aside[aria-label="Subscribe to Premium"]',
            '[data-testid="grokImgGen"]',
            '.r-18u37iz.r-1h0z5md button[aria-label="Grok actions"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });
    }

    // Create and run mutation observer to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        removeElements();
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial cleanup
    removeElements();
})();