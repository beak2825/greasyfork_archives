// ==UserScript==
// @name         Collapse Unchanged Files
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Collapse "Unchanged Files..." because they are annoying
// @author       You
// @match        https://github.com/*/pull/*/files
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523041/Collapse%20Unchanged%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/523041/Collapse%20Unchanged%20Files.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const triggerButton = document.createElement('button');
    triggerButton.textContent = 'Collapse Unchanged Files';
    triggerButton.classList.add('trigger-button'); // Add a CSS class for styling

    // Style the button (you can customize this)
    triggerButton.style.position = 'fixed';
    triggerButton.style.bottom = '20px';
    triggerButton.style.right = '20px';
    triggerButton.style.padding = '10px 20px';
    triggerButton.style.background = '#007bff';
    triggerButton.style.color = 'white';
    triggerButton.style.border = 'none';
    triggerButton.style.borderRadius = '5px';
    triggerButton.style.cursor = 'pointer';

    // Add an event listener to the button
    triggerButton.addEventListener('click', () => {
        // Your script logic here
        const h3Elements = document.querySelectorAll('h3');
        const targetH3 = Array.from(h3Elements).find(h3 => h3.innerText.includes('Unchanged files'));

        if (targetH3) {
            const parentElement = targetH3.parentElement;
            const buttons = parentElement.querySelectorAll('button[aria-label="Toggle diff contents"]:not([aria-expanded="false"])');

            buttons.forEach(button => {
                button.click();
            });
        }
    });

    // Append the button to the document body (or any other desired parent element)
    document.body.appendChild(triggerButton);
})();