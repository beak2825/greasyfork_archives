// ==UserScript==
// @name         Copy NeetCode
// @namespace    tzway
// @version      0.2
// @description  Adds a copy button to copy content from neetcode.io
// @author       tzway
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @match        *://neetcode.io/problems/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/513766/Copy%20NeetCode.user.js
// @updateURL https://update.greasyfork.org/scripts/513766/Copy%20NeetCode.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to copy formatted content excluding buttons with class 'copy-to-clipboard-button'
    function copyToClipboard(button) {
        const contentElement = document.querySelector('.my-article-component-container');

        // Create a deep clone of the content to avoid modifying the original element
        const contentClone = contentElement.cloneNode(true);

        // Remove all elements with the class 'copy-to-clipboard-button'
        const buttonsToExclude = contentClone.querySelectorAll('.copy-to-clipboard-button');
        buttonsToExclude.forEach(button => button.remove());

        // Create a temporary container to hold the cleaned content
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(contentClone);

        // Copy the cleaned HTML content to the clipboard
        navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([tempDiv.innerHTML], { type: 'text/html' }),
                'text/plain': new Blob([tempDiv.innerText], { type: 'text/plain' })
            })
        ]).then(() => {
            // Provide non-intrusive feedback
            button.innerText = 'Copied!'; // Change button text
            button.style.backgroundColor = '#4caf50'; // Optional: Change color to indicate success

            // Revert back to original after 2 seconds
            setTimeout(() => {
                button.innerText = 'Copy Content';
                button.style.backgroundColor = ''; // Revert color
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Function to add the copy button
    function addButton(targetElement) {
        // Check if the button already exists to prevent adding duplicates
        if (targetElement.querySelector('.copy-to-clipboard-button')) return;

        const button = document.createElement('button');
        button.classList.add('copy-to-clipboard-button');
        button.innerText = 'Copy Content';
        button.style.marginLeft = 'auto'; // Align to the right
        button.style.display = 'inline-block';

        // Set the parent container to flex to align the button to the right
        targetElement.style.display = 'flex';
        targetElement.style.alignItems = 'center'; // Align content vertically
        targetElement.appendChild(button);

        // Add the event listener to the button
        button.addEventListener('click', () => copyToClipboard(button));
    }

    // Function to observe changes in the DOM and reapply the button
    function observePage() {
        const targetNode = document.body;

        // Options for the observer (which mutations to observe)
        const config = { childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Re-add the button if the target element is found
                    const targetElement = document.querySelector('.question-tab > div:nth-child(1) > div:nth-child(1)');
                    if (targetElement) {
                        addButton(targetElement);
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    // Initialize observation of the page
    observePage();

})();