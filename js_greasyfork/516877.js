// ==UserScript==
// @name         Remove Sponsored Content on Nextdoor
// @namespace    http://tampermonkey.net/
// @version      1.2 // Increased version number for the new logic
// @description  Remove divs with Sponsored span or a business_logo img URL on Nextdoor
// @match        https://nextdoor.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516877/Remove%20Sponsored%20Content%20on%20Nextdoor.user.js
// @updateURL https://update.greasyfork.org/scripts/516877/Remove%20Sponsored%20Content%20on%20Nextdoor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Finds and removes sponsored/business content divs.
     * It targets the common parent V3Wrapper of the feed items and checks for three patterns:
     * 1. A span containing the exact text "Sponsored".
     * 2. An img tag with "business_logo" in its src URL.
     */
    function removeSponsoredDivs() {
        // Select the feed-container div first
        const feedContainer = document.querySelector('div[data-testid="feed-container"]');
        if (!feedContainer) return;

        // Find the first-level V3Wrapper within the feed-container
        const outerV3Wrapper = feedContainer.querySelector('div[data-v3-view-type="V3Wrapper"]');
        if (!outerV3Wrapper) return;

        // Within the outer V3Wrapper, find all inner V3Wrapper divs (these are the individual feed items)
        const innerV3Wrappers = outerV3Wrapper.querySelectorAll('div[data-v3-view-type="V3Wrapper"]');
        // console.log(`Found ${innerV3Wrappers.length} potential feed item(s)`);

        innerV3Wrappers.forEach(div => {
            let shouldRemove = false;
            
            // --- Check for Pattern 1: Explicit "Sponsored" text ---
            const sponsoredSpan = Array.from(div.getElementsByTagName('span')).find(span => span.textContent.trim() === 'Sponsored');
            if (sponsoredSpan) {
                // console.log('Pattern 1 matched: "Sponsored" text found.');
                shouldRemove = true;
            }

           
            // --- Check (Pattern 2): "business_logo" in image URL ---
            const businessLogoImage = Array.from(div.getElementsByTagName('img')).find(img => img.src && img.src.includes('business_logo'));
            
            if (businessLogoImage) {
                 // console.log('Pattern 2 matched: "business_logo" URL found.');
                 shouldRemove = true;
            }

            // If any pattern is found, remove the entire V3Wrapper div (the feed item)
            if (shouldRemove) {
                console.log('Blocking sponsored/business content:', div);
                div.remove();
            }
        });
    }

    // Create a MutationObserver to monitor the document for added nodes (as you scroll)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Only run the function if new nodes were added
            if (mutation.addedNodes.length) {
                removeSponsoredDivs();
            }
        });
    });

    // Start observing the document body for changes, including deep changes (subtree)
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function initially on page load
    removeSponsoredDivs();
})();