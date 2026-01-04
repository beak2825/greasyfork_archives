// ==UserScript==
// @name         Remove Duplicate Badges
// @namespace    https://www.snay.io/
// @version      0.1
// @description  Remove duplicate elements with class 'skin'
// @author       Alon
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479888/Remove%20Duplicate%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/479888/Remove%20Duplicate%20Badges.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to remove duplicate elements by name and image source
    function removeDuplicatesByNameAndImage() {
        // Find all elements with class 'skin'
        var skinElements = document.querySelectorAll('.skin');

        // Create an object to store unique name and image combinations
        var uniqueCombos = {};

        // Iterate through each element
        skinElements.forEach(function(element) {
            // Get the name and image source attributes of the element
            var name = element.getAttribute('name');
            var imageSrc = element.querySelector('img').getAttribute('src');

            // Combine name and image source to create a unique identifier
            var combo = name + '|' + imageSrc;

            // Check if the combination is already in the uniqueCombos object
            if (uniqueCombos[combo]) {
                // If it's a duplicate, remove the element
                element.remove();
            } else {
                // If it's not a duplicate, add it to the uniqueCombos object
                uniqueCombos[combo] = true;
            }
        });
    }

    // Function to initiate the observer after the website has fully loaded
    function setupObserver() {
        // Create a mutation observer instance
        var observer = new MutationObserver(removeDuplicatesByNameAndImage);

        // Define the target node (the parent element that contains '.skin' elements)
        var targetNode = document.body; // You may need to adjust this based on your HTML structure

        // Configuration of the observer:
        var config = { childList: true, subtree: true };

        // Start observing the target node for mutations
        observer.observe(targetNode, config);
    }

    // Wait until the entire website has loaded
    window.onload = function() {
        // Call the function to initiate the observer after the website has fully loaded
        setupObserver();
    };
})();
