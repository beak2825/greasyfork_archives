// ==UserScript==
// @name         Skip Button Logger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Creates a "Skip Button" that logs its click count
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502482/Skip%20Button%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/502482/Skip%20Button%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize click count
    let clickCount = 0;

    // Create and style the button
    const button = document.createElement('button');
    button.id = 'skipButton'; // Unique identifier
    button.textContent = 'Skip Button';

    // Add common button classes for compatibility
    button.classList.add('btn', 'btn-primary', 'button', 'btn-default', 'ui-button', 'btn-lg');

    // Style the button to ensure visibility
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#007bff'; // Blue color
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontWeight = 'bold';

    // Append the button to the body
    document.body.appendChild(button);

    // Function to handle button clicks
    button.addEventListener('click', () => {
        clickCount++;
        console.log(`Skip Button clicked ${clickCount} time(s).`);
    });

})();
