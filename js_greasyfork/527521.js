// ==UserScript==
// @name         NovelUpdates Tag Filter
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Filters NovelUpdates series finder results GLOBALLY to show only series with a minimum tag count (with manual filter button).
// @author       MasuRii
// @match        https://www.novelupdates.com/series-finder/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527521/NovelUpdates%20Tag%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/527521/NovelUpdates%20Tag%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    //  USER CONFIGURATION -  IMPORTANT!
    // ========================================================================
    //  Modify the number below to set the minimum number of tags a series must have
    //  to be displayed in the search results.
    //  For example:
    //     - Set to 5 to show series with 5 or more tags.
    //     - Set to 10 to show series with 10 or more tags (default).
    //     - Set to 0 to show all series (no tag count filtering).
    const minTagCount = 3;  // <=====  ADJUST THIS NUMBER TO CHANGE MINIMUM TAG COUNT
    // ========================================================================
    //  END USER CONFIGURATION
    // ========================================================================

    // Function to count tags within a search result box
    function countTags(searchBox) {
        return searchBox.querySelectorAll('.genre[id="etagme"]').length;
    }

    // Function to perform GLOBAL filtering across all containers
    function filterGlobalByTagCount() {
        const searchResultContainers = document.querySelectorAll('.w-blog-content.other');
        let allSearchResultBoxes = [];

        if (searchResultContainers.length > 0) {
            searchResultContainers.forEach(container => {
                // Collect ALL search result boxes from ALL containers
                const containerBoxes = Array.from(container.querySelectorAll('.search_main_box_nu'));
                allSearchResultBoxes = allSearchResultBoxes.concat(containerBoxes);
            });

            if (allSearchResultBoxes.length > 0) {
                const seriesToRemove = []; // Array to store series boxes to be removed

                allSearchResultBoxes.forEach(box => {
                    const tagCount = countTags(box);
                    // console.log(`Series: ${box.querySelector('.search_title a').textContent.trim()} - Tag Count: ${tagCount}`); // Debug: Log series title and tag count - Optional Debugging

                    if (tagCount < minTagCount) {
                        seriesToRemove.push(box); // Add to removal list if tag count is below threshold
                    }
                });

                console.log("Series to remove (count):", seriesToRemove.length); // Debug: Log number of series to remove

                seriesToRemove.forEach(box => {
                    box.remove(); // Remove series boxes that don't meet tag count
                });

                console.log("Global series filtering by tag count completed.");

            } else {
                console.log("No search results found within any container.");
            }
        } else {
            console.error("Could not find any search result containers (.w-blog-content.other).");
        }
    }

    // Create the floating re-filter button (bottom right, slightly higher)
    function createFilterButton() {
        const filterButton = document.createElement('button');
        filterButton.textContent = 'Filter by Tags';
        filterButton.className = 'btnrev review';

        filterButton.style.position = 'fixed';
        filterButton.style.bottom = '60px';  // <==== Increased bottom value to move button higher (was 20px)
        filterButton.style.right = '20px';
        filterButton.style.zIndex = '1000';
        filterButton.style.padding = '8px 15px';
        filterButton.style.borderRadius = '5px';
        filterButton.style.cursor = 'pointer';

        filterButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log("Filter by Tags button clicked!");
            filterGlobalByTagCount(); // Call the GLOBAL filtering function
        });

        document.body.appendChild(filterButton);
    }

    // Perform initial GLOBAL filter on page load AND create the button
    filterGlobalByTagCount(); // Call GLOBAL filter on initial load
    createFilterButton();

})();