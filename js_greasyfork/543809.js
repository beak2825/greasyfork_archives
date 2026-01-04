// ==UserScript==
// @name         Holotower Catalog Auto-Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically search holotower catalog based on URL parameters
// @author       Claude
// @license      MIT
// @match        https://holotower.org/hlgg/catalog.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543809/Holotower%20Catalog%20Auto-Search.user.js
// @updateURL https://update.greasyfork.org/scripts/543809/Holotower%20Catalog%20Auto-Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameters
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Function to get URL hash parameters
    function getHashParameter(name) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return params.get(name);
    }

    // Function to wait for an element to exist
    function waitForElement(selector, callback, timeout = 5000) {
        const startTime = Date.now();

        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                requestAnimationFrame(check);
            } else {
                console.log(`Timeout waiting for element: ${selector}`);
            }
        }

        check();
    }

    // Function to click the search button to show the search field
    function openSearchField() {
        // Look for the search button with "Search" text (not "Close")
        const searchButtons = document.querySelectorAll('#catalog_search_button, .catalog_search a');
        let searchButton = null;

        for (let button of searchButtons) {
            if (button.textContent.trim() === 'Search') {
                searchButton = button;
                break;
            }
        }

        if (searchButton) {
            searchButton.click();
            console.log('Search button clicked, waiting for search field...');
            return true;
        } else {
            console.log('Search button not found');
            // Log what we can find for debugging
            const catalogSpan = document.querySelector('.catalog_search');
            if (catalogSpan) {
                console.log('Catalog search HTML:', catalogSpan.innerHTML);
            }
            return false;
        }
    }

    // Function to perform the search
    function performSearch(searchTerm) {
        // First, wait for the catalog search span to exist
        waitForElement('.catalog_search', () => {
            console.log('Catalog search area found');

            // Check if search field already exists (search is already open)
            const existingField = document.getElementById('search_field');
            if (existingField && existingField.offsetParent !== null) {
                // Search field is already visible, use it directly
                fillAndTriggerSearch(existingField, searchTerm);
            } else {
                // Need to click the search button first
                if (openSearchField()) {
                    // Wait for the search field to appear after clicking
                    waitForElement('#search_field', (searchField) => {
                        // Extra check to make sure it's visible
                        if (searchField.offsetParent !== null) {
                            fillAndTriggerSearch(searchField, searchTerm);
                        } else {
                            // Try again in case of timing issue
                            setTimeout(() => {
                                const field = document.getElementById('search_field');
                                if (field) fillAndTriggerSearch(field, searchTerm);
                            }, 50);
                        }
                    });
                }
            }
        });
    }

    // Function to fill the search field and trigger events
    function fillAndTriggerSearch(searchField, searchTerm) {
        searchField.value = searchTerm;
        searchField.focus();

        // Trigger the input event (based on what we found earlier)
        const inputEvent = new Event('input', { bubbles: true });
        searchField.dispatchEvent(inputEvent);

        // Also try keyup event in case that's what triggers it
        const keyupEvent = new Event('keyup', { bubbles: true });
        searchField.dispatchEvent(keyupEvent);

        // Try change event too
        const changeEvent = new Event('change', { bubbles: true });
        searchField.dispatchEvent(changeEvent);

        console.log('Auto-search performed for:', searchTerm);
    }

    // Wait for page to load then check for search parameters
    function initAutoSearch() {
        // Check URL parameters first: ?search=term
        let searchTerm = getUrlParameter('search') || getUrlParameter('q') || getUrlParameter('filter');

        // If not found, check hash parameters: #search=term
        if (!searchTerm) {
            searchTerm = getHashParameter('search') || getHashParameter('q') || getHashParameter('filter');
        }

        if (searchTerm) {
            console.log('Found search term:', searchTerm);
            // Start immediately - no arbitrary delay
            performSearch(searchTerm);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoSearch);
    } else {
        initAutoSearch();
    }

    // Also listen for hash changes (if user manually changes URL)
    window.addEventListener('hashchange', initAutoSearch);

})();