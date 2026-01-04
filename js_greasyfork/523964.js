// ==UserScript==
// @name         Error 404 Button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a button to trigger an "Error 404" page replacement.
// @author       Game Dude
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523964/Error%20404%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/523964/Error%20404%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    const button = document.createElement('button');
    button.textContent = '◯';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#dc3545';
    button.style.color = '#fff';
    button.style.fontSize = '18px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    // Add a hover effect
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#c82333';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#dc3545';
    });

    // Append the button to the document body
    document.body.appendChild(button);

    // Add a click event listener to the button
    button.addEventListener('click', () => {
        // Clear the body content
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Create a new style element for the page
        const style = document.createElement('style');
        style.textContent = `
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f8f9fa;
            }
            h1 {
                font-size: 3rem;
                color: #dc3545;
            }
        `;
        document.head.appendChild(style);

        // Create and append the "Error 404" message
        const errorMessage = document.createElement('h1');
        errorMessage.textContent = 'Error 404: Page Not Found';
        document.body.appendChild(errorMessage);

        // Remove the button from memory
        button.remove();
    });
})();
