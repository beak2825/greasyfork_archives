// ==UserScript==
// @name         Hovering Back Button (Bottom Right)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a hovering back button to the bottom right corner of the webpage
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503303/Hovering%20Back%20Button%20%28Bottom%20Right%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503303/Hovering%20Back%20Button%20%28Bottom%20Right%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    let backButton = document.createElement('button');
    backButton.id = 'backButton';
    backButton.innerText = 'Back';
    
    // Apply styles to the button
    backButton.style.position = 'fixed';
    backButton.style.bottom = '20px'; // Position from the bottom of the page
    backButton.style.right = '20px'; // Position from the right of the page
    backButton.style.padding = '10px 20px';
    backButton.style.backgroundColor = 'rgba(128, 128, 128, 0.5)'; // Gray background with 50% transparency
    backButton.style.color = 'white';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.cursor = 'pointer';
    backButton.style.fontSize = '16px';
    backButton.style.transition = 'background-color 0.3s ease';

    // Add hover effect
    backButton.addEventListener('mouseenter', function() {
        backButton.style.backgroundColor = 'rgba(80, 80, 80, 0.7)'; // Slightly darker gray with 70% transparency on hover
    });

    backButton.addEventListener('mouseleave', function() {
        backButton.style.backgroundColor = 'rgba(128, 128, 128, 0.5)'; // Original gray with 50% transparency
    });

    // Add click event to go back
    backButton.addEventListener('click', function() {
        window.history.back();
    });

    // Append the button to the body
    document.body.appendChild(backButton);

})();