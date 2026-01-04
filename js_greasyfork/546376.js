// ==UserScript==
// @name         No more AI overview
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically adds "-gemini" to all Google searches to remove AI overviews
// @author       You
// @match        https://www.google.com/search*
// @match        https://www.google.com/
// @match        https://google.com/search*
// @match        https://google.com/
// @grant        none
// @run-at       document-start
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/546376/No%20more%20AI%20overview.user.js
// @updateURL https://update.greasyfork.org/scripts/546376/No%20more%20AI%20overview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add -gemini to search query if not already present
    function addAiFilter(query) {
        if (!query.includes('-gemini') && !query.includes('- gemini')) {
            return query + ' -gemini';
        }
        return query;
    }

    // Function to modify the current search if we're on a search results page
    function modifyCurrentSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentQuery = urlParams.get('q');

        if (currentQuery && !currentQuery.includes('-gemini') && !currentQuery.includes('- gemini')) {
            const newQuery = addAiFilter(currentQuery);
            urlParams.set('q', newQuery);
            const newUrl = window.location.pathname + '?' + urlParams.toString();
            window.history.replaceState({}, '', newUrl);
            window.location.reload();
        }
    }

    // Function to intercept search form submissions
    function interceptSearchForms() {
        // Handle the main search form
        const searchForms = document.querySelectorAll('form[action="/search"], form[action="https://www.google.com/search"]');

        searchForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const searchInput = form.querySelector('input[name="q"]');
                if (searchInput && searchInput.value) {
                    searchInput.value = addAiFilter(searchInput.value);
                }
            });
        });

        // Handle search input fields directly
        const searchInputs = document.querySelectorAll('input[name="q"]');
        searchInputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    this.value = addAiFilter(this.value);
                }
            });
        });
    }

    // Function to observe for dynamically added elements
    function observeForSearchElements() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    interceptSearchForms();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Main execution
    function init() {
        // If we're on a search results page, modify the current search
        if (window.location.pathname === '/search') {
            modifyCurrentSearch();
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                interceptSearchForms();
                observeForSearchElements();
            });
        } else {
            interceptSearchForms();
            observeForSearchElements();
        }

        // Also intercept any programmatic navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(state, title, url) {
            if (url && url.includes('/search?q=')) {
                const urlObj = new URL(url, window.location.origin);
                const query = urlObj.searchParams.get('q');
                if (query && !query.includes('-gemini') && !query.includes('- gemini')) {
                    urlObj.searchParams.set('q', addAiFilter(query));
                    url = urlObj.pathname + urlObj.search;
                }
            }
            return originalPushState.apply(this, [state, title, url]);
        };

        history.replaceState = function(state, title, url) {
            if (url && url.includes('/search?q=')) {
                const urlObj = new URL(url, window.location.origin);
                const query = urlObj.searchParams.get('q');
                if (query && !query.includes('-gemini') && !query.includes('- gemini')) {
                    urlObj.searchParams.set('q', addAiFilter(query));
                    url = urlObj.pathname + urlObj.search;
                }
            }
            return originalReplaceState.apply(this, [state, title, url]);
        };
    }

    // Start the script
    init();
})();