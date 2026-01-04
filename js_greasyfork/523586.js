// ==UserScript==
// @name         NPTEL Course Filter by Keywords (Hard Block Button)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Add a button to manually filter courses by keywords and keep track of the blocked count without resetting it.
// @author       TharunSachin
// @license      MIT
// @match        https://onlinecourses.nptel.ac.in/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523586/NPTEL%20Course%20Filter%20by%20Keywords%20%28Hard%20Block%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523586/NPTEL%20Course%20Filter%20by%20Keywords%20%28Hard%20Block%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of predefined keywords
    const keywords = ["Comput", "stati", "algor", "simulat", "network", "inform", "data"];

    // A buffer to store the total blocked courses
    let totalBlockedCount = 0;

    // Function to check if the title contains any of the keywords
    function containsKeyword(titleText, keywords) {
        const titleTextLower = titleText.toLowerCase();
        return keywords.some(keyword => titleTextLower.includes(keyword.toLowerCase()));
    }

    // Function to filter and remove courses, updating the blocked count
    function filterCourses() {
        const courseCards = document.querySelectorAll('.col-md-4.col-sm-6.col-sm-12.style-scope.course-cards');
        let blockedCount = 0;

        courseCards.forEach(courseCard => {
            const titleDiv = courseCard.querySelector('.course-card-title.style-scope.course-card');
            if (titleDiv) {
                const titleText = titleDiv.getAttribute('title') || '';
                if (!containsKeyword(titleText, keywords)) {
                    courseCard.remove(); // Remove the course card if it doesn't match the keywords
                    blockedCount++; // Increment blocked count for this action
                }
            }
        });

        // Add the blocked count from this filtering session to the buffer
        totalBlockedCount += blockedCount;

        // Update the displayed blocked count
        updateBlockedCount();
    }

    // Function to update the blocked count on the page
    function updateBlockedCount() {
        const blockedCountDisplay = document.getElementById('blocked-count-display');
        if (blockedCountDisplay) {
            blockedCountDisplay.innerText = `Blocked Courses: ${totalBlockedCount}`;
        }
    }

    // Create and display the blocked count and manual block button
    function displayBlockedCountAndButton() {
        const displayContainer = document.createElement('div');
        displayContainer.style.position = 'fixed';
        displayContainer.style.top = '10px';
        displayContainer.style.left = '10px';
        displayContainer.style.padding = '10px';
        displayContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        displayContainer.style.color = 'white';
        displayContainer.style.fontSize = '16px';
        displayContainer.style.zIndex = '1000';
        displayContainer.style.display = 'flex';
        displayContainer.style.alignItems = 'center';

        // Blocked count text
        const blockedCountDisplay = document.createElement('span');
        blockedCountDisplay.id = 'blocked-count-display';
        displayContainer.appendChild(blockedCountDisplay);

        // Hard Block button
        const blockButton = document.createElement('button');
        blockButton.innerText = 'Hard Block Courses';
        blockButton.style.marginLeft = '10px';
        blockButton.style.padding = '5px 10px';
        blockButton.style.backgroundColor = '#f44336';
        blockButton.style.color = 'white';
        blockButton.style.border = 'none';
        blockButton.style.cursor = 'pointer';

        blockButton.addEventListener('click', () => {
            filterCourses(); // Trigger filtering when button is clicked
        });

        displayContainer.appendChild(blockButton);

        document.body.appendChild(displayContainer);
    }

    // Function to handle the "Load More" button event
    function setupLoadMoreButton() {
        const loadMoreButton = document.getElementById('load-more-button');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                setTimeout(() => {
                    filterCourses(); // Re-filter after new content loads
                }, 1000); // Delay for loading time
            });
        }
    }

    // Initialize the script when content is ready
    const checkInterval = setInterval(() => {
        const courseCards = document.querySelectorAll('.col-md-4.col-sm-6.col-sm-12.style-scope.course-cards');
        if (courseCards.length > 0) {
            clearInterval(checkInterval);
            displayBlockedCountAndButton(); // Display blocked count and Hard Block button
            filterCourses(); // Initial filtering of courses
            setupLoadMoreButton(); // Setup listener for dynamic content
        }
    }, 500);
})();