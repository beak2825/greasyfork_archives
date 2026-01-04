// ==UserScript==
// @name         Copy Green Text on OpenAI Playground
// @version      0.1
// @description  Create a button that copies the text of all green spans on a page
// @match        https://beta.openai.com/playground
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @author       Taylor Bell
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/999210
// @downloadURL https://update.greasyfork.org/scripts/456740/Copy%20Green%20Text%20on%20OpenAI%20Playground.user.js
// @updateURL https://update.greasyfork.org/scripts/456740/Copy%20Green%20Text%20on%20OpenAI%20Playground.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    window.onload = function() {
        const button = document.createElement('button');
        button.innerText = 'Copy Green Text';

        // Add the specified classes to the button
        button.classList.add('btn', 'btn-sm', 'btn-filled', 'btn-neutral');

        // Add a click event listener to the button
        button.addEventListener('click', async () => {
            // When clicked, get all the green span elements and their text
            const greenSpans = document.querySelectorAll('span[style*="background-color: var(--green"]');
            const greenText = [...greenSpans].map(x => x.innerText).join('');

            // Copy the text to the clipboard
            try {
                await navigator.clipboard.writeText(greenText);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });

        // Keep checking for the element to append the button to
        const interval = setInterval(() => {
            // Find the element
            const headerActions = document.querySelector('div.pg-header > div.pg-header-section.pg-header-actions');

            // Check if the element exists
            if (headerActions) {
                // Append the button to the page
                headerActions.appendChild(button);

                // Clear the interval
                clearInterval(interval);
            }
        }, 500); // Check every 500ms
    }
})();
