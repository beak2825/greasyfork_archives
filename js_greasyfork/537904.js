// ==UserScript==
// @name         Google Search AI Suffix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically adds "-ai" suffix to Google searches
// @author       Your Name
// @match        https://www.google.com/*
// @match        https://*.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537904/Google%20Search%20AI%20Suffix.user.js
// @updateURL https://update.greasyfork.org/scripts/537904/Google%20Search%20AI%20Suffix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add AI suffix if not already present
    function addAISuffix(searchQuery) {
        if (!searchQuery.trim().endsWith('-ai')) {
            return searchQuery.trim() + ' -ai';
        }
        return searchQuery;
    }

    // Function to update the search input
    function updateSearchInput() {
        const searchInput = document.querySelector('input[name="q"]');
        if (searchInput && !searchInput.value.includes('-ai')) {
            searchInput.value = addAISuffix(searchInput.value);
        }
    }

    // Handle the main Google search page
    if (window.location.pathname === '/') {
        // Monitor the search form submission
        document.addEventListener('submit', function(e) {
            if (e.target.matches('form')) {
                updateSearchInput();
            }
        });
    }

    // Handle the search results page
    if (window.location.pathname === '/search') {
        // Get the current search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        let currentQuery = urlParams.get('q');

        if (currentQuery && !currentQuery.includes('-ai')) {
            // Update the search input field
            const searchInput = document.querySelector('input[name="q"]');
            if (searchInput) {
                searchInput.value = addAISuffix(currentQuery);
            }

            // Update the URL
            urlParams.set('q', addAISuffix(currentQuery));
            const newUrl = window.location.pathname + '?' + urlParams.toString();
            window.history.replaceState({}, '', newUrl);
        }
    }
})(); 