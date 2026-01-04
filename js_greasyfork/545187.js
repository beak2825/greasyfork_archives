// ==UserScript==
// @name         Costco Rating Percentage Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert Costco review counts to percentages
// @author       You
// @match        https://www.costco.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/545187/Costco%20Rating%20Percentage%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/545187/Costco%20Rating%20Percentage%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to search within shadow DOM
    function querySelectorAllDeep(selector, root = document) {
        const elements = [];
        
        // Search in the current root
        elements.push(...root.querySelectorAll(selector));
        
        // Search in all shadow roots
        const allElements = root.querySelectorAll('*');
        for (const element of allElements) {
            if (element.shadowRoot) {
                elements.push(...querySelectorAllDeep(selector, element.shadowRoot));
            }
        }
        
        return elements;
    }

    // Helper function to find a single element in shadow DOM
    function querySelectorDeep(selector, root = document) {
        // Search in the current root first
        let element = root.querySelector(selector);
        if (element) return element;
        
        // Search in all shadow roots
        const allElements = root.querySelectorAll('*');
        for (const el of allElements) {
            if (el.shadowRoot) {
                element = querySelectorDeep(selector, el.shadowRoot);
                if (element) return element;
            }
        }
        
        return null;
    }

    function convertRatingCountsToPercentages() {
        // Find all elements with the primary-rating-count class (including shadow DOM)
        const ratingCountContainers = querySelectorAllDeep('.primary-rating-count');

        if (ratingCountContainers.length === 0) {
            console.info("This is not working")
            return;
        }

        // Extract all review counts from the span elements with aria-hidden="true"
        const countElements = [];
        const counts = [];
        let totalReviews = 0;

        ratingCountContainers.forEach(container => {
            // Find the span element with aria-hidden="true" that contains the count
            const countSpan = container.querySelector('span[aria-hidden="true"]');
            if (countSpan) {
                const countText = countSpan.textContent.trim();
                const count = parseInt(countText.replace(/[^\d]/g, '')) || 0;
                countElements.push(countSpan);
                counts.push(count);
                totalReviews += count;
            }
        });

        // If no reviews found, exit
        if (totalReviews === 0) {
            return;
        }

        // Convert counts to percentages and update the elements
        countElements.forEach((element, index) => {
            const count = counts[index];
            const percentage = ((count / totalReviews) * 100).toFixed(1);

            // Store original count as data attribute if not already stored
            if (!element.dataset.originalCount) {
                element.dataset.originalCount = element.textContent.trim();
            }

            // Update the text to show percentage
            element.textContent = `${percentage}% (${count})`;
            element.style.fontWeight = 'bold';
            element.style.color = '#0073e6';
        });

        console.info(`Converted ${countElements.length} rating counts to percentages. Total reviews: ${totalReviews}`);
    }

    function addToggleButton() {
        // Check if button already exists
        if (document.getElementById('rating-toggle-btn')) {
            return;
        }
        console.info("Adding button")

        // Find the specific ratings table (including shadow DOM)
        const ratingsTable = querySelectorDeep('[aria-labelledby="bv-reviews-rating-snapshot-container"].table[role="group"]');
        
        if (!ratingsTable) {
            console.info('Could not find ratings table for button placement');
            return;
        }

        // Create a container div for the button to position it nicely
        let buttonContainer = document.getElementById('rating-button-container');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.id = 'rating-button-container';
            buttonContainer.style.cssText = `
                margin: 10px 0;
                text-align: center;
            `;
            // Insert the container right after the ratings table
            ratingsTable.parentNode.insertBefore(buttonContainer, ratingsTable.nextSibling);
        }

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'rating-toggle-btn';
        toggleBtn.textContent = 'Show Counts';
        toggleBtn.style.cssText = `
            margin: 10px 0;
            padding: 8px 12px;
            background-color: #0073e6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;

        let isPercentageMode = true; // Start in percentage mode

        toggleBtn.addEventListener('click', function() {
            const ratingCountContainers = querySelectorAllDeep('.primary-rating-count');

            if (isPercentageMode) {
                // Switch back to original count
                ratingCountContainers.forEach(container => {
                    const countSpan = container.querySelector('span[aria-hidden="true"]');
                    if (countSpan && countSpan.dataset.originalCount) {
                        countSpan.textContent = countSpan.dataset.originalCount;
                        countSpan.style.color = '';
                        countSpan.style.fontWeight = '';
                    }
                });
                toggleBtn.textContent = 'Show Percentages';
            } else {
                // Switch to percentage mode
                convertRatingCountsToPercentages();
                toggleBtn.textContent = 'Show Counts';
            }

            isPercentageMode = !isPercentageMode;
        });

        // Insert the button into the container
        buttonContainer.appendChild(toggleBtn);
    }

    function initialize() {
        // Wait a bit for the page to load
        setTimeout(() => {
            console.info('Initializing Costco rating percentage converter...');
            convertRatingCountsToPercentages(); // Show percentages by default
            addToggleButton();
        }, 2000);
    }

    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also watch for dynamic content changes (including shadow DOM)
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check if any new nodes contain rating elements
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check in regular DOM
                        if (node.querySelector && node.querySelector('.primary-rating-count')) {
                            shouldUpdate = true;
                        }
                        // Check if node has shadow DOM with rating elements
                        if (node.shadowRoot && querySelectorDeep('.primary-rating-count', node.shadowRoot)) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });

        if (shouldUpdate) {
            setTimeout(() => {
                convertRatingCountsToPercentages(); // Show percentages by default for new content
                addToggleButton();
            }, 500);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also observe shadow roots that might be created dynamically
    const shadowObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.shadowRoot) {
                    // Observe the new shadow root
                    observer.observe(node.shadowRoot, {
                        childList: true,
                        subtree: true
                    });
                }
            });
        });
    });

    shadowObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();