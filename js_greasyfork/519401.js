// ==UserScript==
// @name         Pokellector Toggle Visibility Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a toggle button to show/hide cards checked with the class 'checked' on Pokellector.
// @author       ArthurShelby
// @match        https://www.pokellector.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokellector.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519401/Pokellector%20Toggle%20Visibility%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/519401/Pokellector%20Toggle%20Visibility%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Hide Completed'; // Initial text
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.padding = '10px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';

    // Add the button to the page
    document.body.appendChild(toggleButton);

    // Add toggle functionality
    let isHidden = false; // Initial state: visible
    toggleButton.addEventListener('click', () => {
        document.querySelectorAll('.checked').forEach(el => {
            el.style.display = isHidden ? '' : 'none'; // Toggle visibility
        });
        isHidden = !isHidden; // Update toggle state
        toggleButton.textContent = isHidden ? 'Show Completed' : 'Hide Completed'; // Update button text
    });
})();
