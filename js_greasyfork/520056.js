// ==UserScript==
// @name         Google Spam Filter
// @version      0.1
// @description  Clean up Google Search spam links
// @author       CrazyWolf13
// @icon         https://www.google.com/favicon.ico
// @match        https://www.google.com/search*
// @license      MIT
// @namespace https://greasyfork.org/users/1407887
// @downloadURL https://update.greasyfork.org/scripts/520056/Google%20Spam%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/520056/Google%20Spam%20Filter.meta.js
// ==/UserScript==



(function () {
    'use strict';

    // Sponsored in different languages
    const SPONSORED_KEYWORDS = [
        'sponsored',    // English
        'gesponsert',   // German
        'patrocinado',  // Spanish
        'sponsorizzato',// Italian
        'parrainé',     // French
        'sponsoreret',  // Danish
        'реклама',      // Russian (means "advertisement")
        'sponsorerad',  // Swedish
        '広告',          // Japanese (means "advertisement")
        '赞助',          // Simplified Chinese (means "sponsored")
        'sponsorizat',  // Romanian
        'sponzoriran',  // Croatian
    ];

    // Number of levels to traverse up to find the parent element
    const TRAVERSE_LEVELS = 4;

    // Function to remove elements containing sponsored content
    function removeSponsoredElements() {
        const spans = document.querySelectorAll('span'); // Select all span elements

        spans.forEach(span => {
            const textContent = span.textContent?.toLowerCase().trim(); // Ensure content is lowercase and trimmed
            if (!textContent) return; // Skip empty or undefined content

            // Check if span contains any sponsored keyword
            const isSponsored = SPONSORED_KEYWORDS.some(keyword => textContent.includes(keyword));

            if (isSponsored) {
                let parent = span;

                // Traverse up the DOM tree
                for (let i = 0; i < TRAVERSE_LEVELS; i++) {
                    if (!parent.parentElement) break; // Stop if no parent exists
                    parent = parent.parentElement;
                }

                // Remove the parent element if it exists
                if (parent && parent.nodeType === Node.ELEMENT_NODE) {
                    console.log(`Removed sponsored element:`, parent);
                    parent.remove();
                }
            }
        });
    }

    // Function to handle DOM changes dynamically
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            removeSponsoredElements(); // Re-run spam removal on DOM changes
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Init
    function init() {
        console.log('Remove Sponsored Content initialized.');
        removeSponsoredElements(); 
        observeDOMChanges();       
    }
    window.addEventListener('DOMContentLoaded', init);

})();