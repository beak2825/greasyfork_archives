// ==UserScript==
// @name            Reddit NSFW Filter
// @namespace       Reddit-NSFW-Filter
// @version         1.0
// @description     A userscript to show only NSFW entries on the Reddit search page
// @author          Mortality577
// @license         MIT
// @match           *://*.reddit.com/search/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/495507/Reddit%20NSFW%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/495507/Reddit%20NSFW%20Filter.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Array of selectors to identify NSFW content
    const nsfwSelectors = [
        '.text-category-nsfw',          // Text tag for NSFW
        'svg[icon-name="nsfw-fill"]',   // SVG icon for NSFW
        '[data-faceplate-tracking-context*="\"nsfw\":true"]' // JSON data indicating NSFW
    ];

    // Function to check if an element or its children contains an NSFW tag
    const containsNSFWTag = (element) => 
        nsfwSelectors.some(selector => {
            try {
                return element.querySelector(selector);
            } catch (e) {
                console.error(`Error querying selector ${selector}:`, e);
                return false; // If an error occurs, assume the selector isn't valid
            }
        });

    // Function to filter NSFW entries
    const filterNSFW = () => {
        document
            .querySelectorAll('faceplate-tracker[data-testid="search-community"]')
            .forEach(entry => {
                entry.style.display = containsNSFWTag(entry) ? '' : 'none'; // Show only NSFW
            });
    };

    // Utility function for debouncing the filter function
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Initial filtering on page load
    filterNSFW();

    // Mutation observer to run the filter function when new content is added
    const observer = new MutationObserver(debounce(filterNSFW, 300)); // Debounce to avoid excessive calls
    observer.observe(document.body, { childList: true, subtree: true }); // Watch for changes in the entire document
})();
