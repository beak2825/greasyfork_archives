// ==UserScript==
// @name         Seg-Social Universal Expander
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically expands all collapsible sections on seg-social.es website (both types)
// @author       You
// @match        https://www.seg-social.es/wps/portal/wss/internet/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529128/Seg-Social%20Universal%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/529128/Seg-Social%20Universal%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to expand all collapsible elements
    function expandAllCollapsibleElements() {
        let expandedCount = 0;

        // Type 1: Find all collapsible elements with data-toggle="collapse"
        const collapsibleToggleElements = document.querySelectorAll('a[data-toggle="collapse"]');
        console.log(`Found ${collapsibleToggleElements.length} data-toggle collapsible elements`);

        // Expand each element if it's not already expanded
        collapsibleToggleElements.forEach((element, index) => {
            // Check if the element is not already expanded
            if (element.getAttribute('aria-expanded') !== 'true') {
                console.log(`Expanding toggle element ${index + 1}: ${element.textContent.trim()}`);
                element.click();
                expandedCount++;
            }
        });

        // Type 2: Find all <details> elements (HTML5 native collapsible elements)
        const detailsElements = document.querySelectorAll('details');
        console.log(`Found ${detailsElements.length} details elements`);

        // Expand each details element if it's not already open
        detailsElements.forEach((element, index) => {
            if (!element.hasAttribute('open')) {
                console.log(`Expanding details element ${index + 1}`);
                element.setAttribute('open', '');
                expandedCount++;
            }
        });

        // Type 3: Any elements with a pull-right span that aren't caught by the above
        const pullRightSpans = document.querySelectorAll('span.pull-right');
        console.log(`Found ${pullRightSpans.length} elements with pull-right spans`);

        pullRightSpans.forEach((span, index) => {
            const parent = span.parentElement;

            // Skip if the parent is already processed by previous methods
            if (parent.tagName === 'A' && parent.getAttribute('data-toggle') === 'collapse') {
                return;
            }

            if (parent.tagName === 'SUMMARY') {
                // This is part of a details/summary element that should be handled by the details processor
                const detailsElement = parent.parentElement;
                if (detailsElement && detailsElement.tagName === 'DETAILS' && !detailsElement.hasAttribute('open')) {
                    console.log(`Expanding details element with pull-right ${index + 1}`);
                    detailsElement.setAttribute('open', '');
                    expandedCount++;
                }
            } else {
                // Try to make the parent element clickable if it's not already processed
                console.log(`Attempting to expand element with pull-right ${index + 1}`);
                try {
                    parent.click();
                    expandedCount++;
                } catch (e) {
                    console.log(`Failed to expand element with pull-right ${index + 1}: ${e.message}`);
                }
            }
        });

        return expandedCount;
    }

    // Initial expansion after page loads
    setTimeout(() => {
        const expandedCount = expandAllCollapsibleElements();
        console.log(`Expanded ${expandedCount} elements in total`);
    }, 1500);

    // Create a small floating button to manually trigger expansion
    const expandButton = document.createElement('button');
    expandButton.textContent = 'Expand All';
    expandButton.style.position = 'fixed';
    expandButton.style.bottom = '20px';
    expandButton.style.right = '20px';
    expandButton.style.zIndex = '9999';
    expandButton.style.padding = '8px 12px';
    expandButton.style.backgroundColor = '#0066cc';
    expandButton.style.color = 'white';
    expandButton.style.border = 'none';
    expandButton.style.borderRadius = '4px';
    expandButton.style.cursor = 'pointer';

    // Add click event listener to the button
    expandButton.addEventListener('click', () => {
        const expandedCount = expandAllCollapsibleElements();

        // Visual feedback on button click
        const originalText = expandButton.textContent;
        expandButton.textContent = `Expanded ${expandedCount}`;
        setTimeout(() => {
            expandButton.textContent = originalText;
        }, 1500);
    });

    // Add the button to the page
    document.body.appendChild(expandButton);

    // Watch for dynamic content changes and expand new collapsible elements
    const observer = new MutationObserver((mutations) => {
        let needsExpansion = false;

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                needsExpansion = true;
            }
        });

        if (needsExpansion) {
            console.log('New content detected, expanding elements...');
            setTimeout(expandAllCollapsibleElements, 500);
        }
    });

    // Start observing the document for content changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();