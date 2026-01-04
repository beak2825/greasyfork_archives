// ==UserScript==
// @name         Table Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add search functionality to a table
// @author       You
// @match        https://app.diagrams.net/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491102/Table%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/491102/Table%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to initialize the search functionality
    function initTableSearch() {
        // Check if the search input already exists
        if ($('#tableSearch').length === 0) {
            // Add a search input box above the table
            var searchInput = $('<input type="text" id="tableSearch" placeholder="Search...">');
            $('.odFileListGrid').before(searchInput);

            // Add an event listener to the search input
            $('#tableSearch').on('input', function() {
                var searchTerm = $(this).val().toLowerCase();

                // Iterate through each table row and hide those that don't match the search term
                $('.odFileListGrid tr').each(function() {
                    var title = $(this).find('.odFileTitle').text().toLowerCase();
                    if (title.includes(searchTerm)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        }
    }

    // Function to reinitialize the search functionality after the table is updated
    function reinitializeSearch() {
        // Disconnect the existing observer if any
        if (observer) {
            observer.disconnect();
        }

        // Use MutationObserver to detect changes in the DOM
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the table is added to the DOM
                if ($(mutation.target).find('.odFileListGrid').length > 0) {
                    // Disconnect the observer to stop further monitoring
                    observer.disconnect();
                    // Initialize the search functionality
                    initTableSearch();
                    // Re-run the observer to detect future changes
                    observeTableChanges();
                }
            });
        });

        // Start observing changes in the DOM
        observeTableChanges();
    }

    // Function to observe changes in the table
    function observeTableChanges() {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the search functionality
    initTableSearch();

    // Initialize the observer for the first time
    var observer = new MutationObserver(reinitializeSearch);
    observeTableChanges();

})();