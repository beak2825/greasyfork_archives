// ==UserScript==
// @name         Danbooru Upvotes Sorter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically adds "order:upvotes" to Danbooru searches and redirects immediately
// @author       nevi
// @match        https://*.donmai.us/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530398/Danbooru%20Upvotes%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/530398/Danbooru%20Upvotes%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to add order:upvotes to search and redirect if needed
    function addUpvotesOrdering() {
        // Get the search box input element
        const searchBox = document.querySelector('#tags, #search_tag_string, input[name="tags"]');
        if (!searchBox) return;
        
        // Get current URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const currentTags = urlParams.get('tags') || '';
        
        // Check if we're on a search page and if order:upvotes is not already in the search
        if (window.location.pathname.includes('/posts') && 
            !currentTags.includes('order:') && 
            currentTags.trim() !== '') {
            
            // Add order:upvotes to the search query
            const newTags = currentTags.trim() + ' order:upvotes';
            
            // Create new URL with updated search parameters
            urlParams.set('tags', newTags);
            const newUrl = window.location.pathname + '?' + urlParams.toString();
            
            // Redirect to the new URL immediately
            if (window.location.href !== newUrl) {
                window.location.href = newUrl;
                return; // Exit function after redirect
            }
        }
        
        // Add event listener to the search form submission
        const searchForm = searchBox.closest('form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                // Only modify if there's a search value and it doesn't already have an order parameter
                if (searchBox.value.trim() !== '' && !searchBox.value.includes('order:')) {
                    e.preventDefault(); // Prevent normal form submission
                    
                    // Add order:upvotes to the search term
                    const newSearch = searchBox.value.trim() + ' order:upvotes';
                    
                    // Create and navigate to the URL directly
                    const newUrlParams = new URLSearchParams();
                    newUrlParams.set('tags', newSearch);
                    const newUrl = '/posts?' + newUrlParams.toString();
                    window.location.href = newUrl;
                }
            });
        }
    }
    
    // Run the function when the page loads
    window.addEventListener('DOMContentLoaded', addUpvotesOrdering);
    
    // Also run it now in case the page is already loaded
    addUpvotesOrdering();
})();