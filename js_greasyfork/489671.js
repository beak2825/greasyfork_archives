// ==UserScript==
// @name         YouTube Shorts Hider
// @namespace    http://tampermonkey.net/
// @version      2024-03-11
// @description  Hides YouTube Shorts
// @author       ricvillagrana
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/489671/YouTube%20Shorts%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/489671/YouTube%20Shorts%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hideShorts = function() {
        // Get all elements with id "dismissible"
        var elements = document.querySelectorAll("#dismissible");

        // Loop through each element
        elements.forEach(function(element) {
            // Check if the element contains a child node with id "title" and its text content is "Shorts"
            var titleNode = element.querySelector("#title");
            if (titleNode && titleNode.textContent.trim() === "Shorts") {
                // If condition is met, set display to none
                element.style.display = "none";
            }
        });
    };

    document.addEventListener('DOMContentLoaded', hideShorts);

    // Callback function to execute when mutations are observed
    function handleMutations(mutationsList, observer) {
        // Loop through each mutation
        mutationsList.forEach(function(mutation) {
            // Check if nodes were added or removed
            if (mutation.type === 'childList') {
                // Execute the function to hide elements
                hideShorts();
            }
        });
    }

    // Create a new MutationObserver
    var observer = new MutationObserver(handleMutations);

    // Configure the observer to watch for changes in the DOM
    var observerConfig = { childList: true, subtree: true };

    // Start observing the document
    observer.observe(document.body, observerConfig);
})();