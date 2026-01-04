// ==UserScript==
// @name         NovelUpdates Tag Sorter
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Sort NovelUpdates series finder results by tag count
// @author       MasuRii
// @match        https://www.novelupdates.com/series-finder/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527520/NovelUpdates%20Tag%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/527520/NovelUpdates%20Tag%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    //  USER CONFIGURATION -  IMPORTANT!
    // ========================================================================
    //  Set this to 'true' to enable console logging for debugging,
    //  or 'false' to disable console logs for cleaner console output.
    const enableLogging = false; // <===== ADJUST THIS TO 'true' TO ENABLE LOGGING, 'false' TO DISABLE
    // ========================================================================
    //  END USER CONFIGURATION
    // ========================================================================

    // Function to count tags within a search result box
    function countTags(searchBox) {
        return searchBox.querySelectorAll('.genre[id="etagme"]').length;
    }

    // Function to perform GLOBAL sorting across all containers and preserve elements in first container
    function sortAllContainersGlobally() {
        const searchResultContainers = document.querySelectorAll('.w-blog-content.other');
        let allSearchResultBoxes = [];

        if (searchResultContainers.length > 0) {
            searchResultContainers.forEach(container => {
                // Collect ALL search result boxes from ALL containers
                const containerBoxes = Array.from(container.querySelectorAll('.search_main_box_nu'));
                allSearchResultBoxes = allSearchResultBoxes.concat(containerBoxes);
            });

            if (allSearchResultBoxes.length > 0) {
                const seriesData = [];

                allSearchResultBoxes.forEach(box => {
                    const tagCount = countTags(box);
                    seriesData.push({ box: box, tagCount: tagCount });
                });

                seriesData.sort((a, b) => b.tagCount - a.tagCount); // GLOBAL sort

                // Clear search result boxes from ALL containers, preserving other elements in the first container
                searchResultContainers.forEach((container, index) => {
                    const existingBoxes = Array.from(container.querySelectorAll('.search_main_box_nu'));
                    existingBoxes.forEach(box => {
                        container.removeChild(box); // Remove existing boxes individually
                    });
                    if (index === 0) {
                        if (enableLogging) console.log("Preserving elements in the first container.");
                        // Do NOT clear innerHTML of the first container
                    } else {
                        container.innerHTML = ''; // Clear innerHTML for subsequent containers
                    }
                });


                // Re-populate containers with sorted results
                let seriesIndex = 0;
                searchResultContainers.forEach(container => {
                    const containerBoxLimit = 10; // Example: Limit of 10 series per container (adjust as needed)
                    let boxCount = 0;
                    while (seriesIndex < seriesData.length && boxCount < containerBoxLimit) {
                        container.appendChild(seriesData[seriesIndex].box); // Append sorted box
                        seriesIndex++;
                        boxCount++;
                    }
                });

                if (enableLogging) console.log("NovelUpdates search results sorted by tag count (descending) - GLOBAL Sort (Preserve First Container Elements).");

            } else {
                if (enableLogging) console.log("No search results found in any container for sorting.");
            }
        } else {
            if (enableLogging) console.error("Could not find any search result containers (.w-blog-content.other) for sorting.");
        }
    }

    // Create the floating re-sort button (same as before, bottom right)
    function createSortButton() {
        const sortButton = document.createElement('button');
        sortButton.textContent = 'Sort by Tags';
        sortButton.className = 'btnrev review';

        sortButton.style.position = 'fixed';
        sortButton.style.bottom = '20px'; // Bottom right position
        sortButton.style.right = '20px';
        sortButton.style.zIndex = '1000';
        sortButton.style.padding = '8px 15px';
        sortButton.style.borderRadius = '5px';
        sortButton.style.cursor = 'pointer';

        sortButton.addEventListener('click', function(event) {
            event.preventDefault();
            if (enableLogging) console.log("Sort by Tags button clicked!");
            sortAllContainersGlobally(); // Call the GLOBAL sorting function
        });

        document.body.appendChild(sortButton);
    }

    // Perform initial GLOBAL sort on page load AND create the button
    sortAllContainersGlobally(); // Call GLOBAL sort on initial load
    createSortButton();

})();