// ==UserScript==
// @name         Hide "GitHub Actions" Notifications in PR Conversations
// @namespace    https://github.com/thinkall/
// @version      0.1
// @description  Hide "GitHub Actions" div elements on GitHub pull request page so other comments will not be hidden.
// @author       thinkall
// @match        https://github.com/*/pull/*
// @grant        none
// @source       https://github.com/thinkall/tinytools
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482085/Hide%20%22GitHub%20Actions%22%20Notifications%20in%20PR%20Conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/482085/Hide%20%22GitHub%20Actions%22%20Notifications%20in%20PR%20Conversations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements with specified class names, except the last one
    function hideElementsExceptLast(className) {
        var elements = document.getElementsByClassName(className);

        // Hide all elements except the last one
        for (var i = 0; i < elements.length - 1; i++) {
            elements[i].style.display = 'none';
        }
    }

    // Function to click the "Load more" button
    function clickLoadMore() {
        var loadMoreButton = document.querySelector('.ajax-pagination-btn');
        if (loadMoreButton) {
            loadMoreButton.click();
        }
    }

    // Function to observe changes in the DOM and hide newly loaded elements
    function observeDOM() {
        var targetNode = document.body;

        var observerOptions = {
            childList: true, // Report changes to child elements
            subtree: true,   // Include all descendants of the target node
        };

        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Newly added nodes, check and hide elements
                    hideElementsExceptLast(classNamesToHide[0]);
                }
            });
        });

        mutationObserver.observe(targetNode, observerOptions);
    }

    // List of class names to hide
    var classNamesToHide = [
        'TimelineItem js-targetable-element',
        // Add more class names as needed
    ];

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        // Initial hiding of elements, except the last one
        hideElementsExceptLast(classNamesToHide[0]);

        // Start observing changes in the DOM
        observeDOM();

        // Click "Load more" repeatedly until not visible
        var loadMoreInterval = setInterval(function() {
            clickLoadMore();
        }, 1000); // Adjust the interval as needed, e.g., 1000 milliseconds (1 second)
    });
})();
