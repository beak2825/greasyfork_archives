// ==UserScript==
// @name         Chegg to Homeworkify
// @namespace    https://github.com/Niloy-Sarker/scripts/
// @version      0.10
// @description  Replace "See Answer" button with Homeworkify Button. Automatically copies chegg link to clipboard (Need to enable clipboard site permission).
// @author       Niloy
// @match        https://www.chegg.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482591/Chegg%20to%20Homeworkify.user.js
// @updateURL https://update.greasyfork.org/scripts/482591/Chegg%20to%20Homeworkify.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Replace the following values with your desired new link and text
    var newLink = 'https://homeworkify.st/';
    var newText = '🔍 on Homeworkify';

    var elements = document.querySelectorAll('[data-test="has-answer-content"] a');

    elements.forEach(function(element) {
        // Replace link and text
        element.href = newLink;
        element.textContent = newText;
        
        // Add an event listener to each element
        element.addEventListener('click', function(event) {
            // Prevent the default link behavior
            event.preventDefault();
            
            // Copy the current site link to the clipboard
            const currentLink = window.location.href;
            navigator.clipboard.writeText(currentLink);
            
            // Open the destination site
            window.location.href = newLink;
        });
    });
})();