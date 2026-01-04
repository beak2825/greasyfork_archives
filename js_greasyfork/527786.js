
// ==UserScript==
// @name         Mathspace Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhances Mathspace with helpful features.
// @author       You
// @match        https://mathspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527786/Mathspace%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/527786/Mathspace%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a button to reveal hints more easily (if available)
    function addHintButton() {
        const hintButton = document.querySelector('button[aria-label*="Hint"]');
        if (hintButton) {
            hintButton.style.backgroundColor = 'lightgreen'; // Make it more visible
            hintButton.style.color = 'black';
            hintButton.style.fontWeight = 'bold';
            hintButton.addEventListener('click', function() {
                console.log("Hint button clicked!"); // Optional: Log to console
            });
        }
    }

    // Make important elements more visible (e.g., question area)
    function enhanceVisibility() {
        const questionArea = document.querySelector('.question-container'); // Adjust selector as needed
        if (questionArea) {
            questionArea.style.border = '2px solid blue'; // Highlight the question area
        }
    }

    // Add a quick link to the Mathspace help center
    function addHelpLink() {
        const helpLink = document.createElement('a');
        helpLink.href = 'https://help.mathspace.co/'; // Replace with the correct help URL
        helpLink.textContent = 'Mathspace Help';
        helpLink.target = '_blank'; // Open in a new tab
        helpLink.style.display = 'block';
        helpLink.style.marginTop = '10px';
        document.body.appendChild(helpLink); // Or append to a more appropriate container
    }

    // Observe changes in the DOM to dynamically add features as Mathspace loads content.
    const observer = new MutationObserver(function(mutations) {
        addHintButton();
        enhanceVisibility();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    addHintButton();
    enhanceVisibility();
    addHelpLink();

})();
