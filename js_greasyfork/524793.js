// ==UserScript==
// @name         RGB Text Animation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds RGB animation to text while typing
// @author       Jyomama28
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524793/RGB%20Text%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/524793/RGB%20Text%20Animation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create style element for the animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes rgbText {
            0% { color: rgb(255, 0, 0); }
            33% { color: rgb(0, 255, 0); }
            66% { color: rgb(0, 0, 255); }
            100% { color: rgb(255, 0, 0); }
        }
        .rgb-animated {
            animation: rgbText 3s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // Function to handle input events
    function handleInput(event) {
        const element = event.target;

        // Check if the element is a text input or contenteditable
        if (
            element.tagName === 'INPUT' ||
            element.tagName === 'TEXTAREA' ||
            element.getAttribute('contenteditable') === 'true'
        ) {
            // Add the RGB animation class
            element.classList.add('rgb-animated');

            // Also animate the text content
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.style.animation = 'rgbText 3s linear infinite';
            }
        }
    }

    // Monitor for new elements being added to the page
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const inputs = node.querySelectorAll('input, textarea, [contenteditable="true"]');
                    inputs.forEach(input => {
                        input.addEventListener('input', handleInput);
                    });
                }
            });
        });
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add event listeners to existing input elements
    document.querySelectorAll('input, textarea, [contenteditable="true"]').forEach(input => {
        input.addEventListener('input', handleInput);
    });
})();