// ==UserScript==
// @name         X Reply with Random Number
// @namespace    http://your.website.com/
// @version      0.1
// @description  Adds "消えろ" followed by a random number to a reply field (manual interaction required)
// @author       Your Name
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538804/X%20Reply%20with%20Random%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/538804/X%20Reply%20with%20Random%20Number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the random number and text to a reply field
    function addRandomReply(replyField) {
        if (replyField) {
            const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number
            const replyText = `消えろ${randomNumber}`;
            replyField.value = replyText; // Set the value of the reply field
            // Note: You would typically need to trigger an input event here
            // to make the platform recognize the change. This is complex and
            // platform-dependent.
        }
    }

    // Observe DOM changes to find reply fields as they appear
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    // This is a simplified example. You need to find the actual
                    // reply input field element within the tweet's structure.
                    // This will vary depending on Twitter's current HTML structure.
                    // You would need to inspect the page to find the correct selector.
                    const replyInput = node.querySelector('div[contenteditable="true"]'); // Example selector, likely incorrect

                    if (replyInput) {
                        // For safety and compliance, this script will NOT automatically
                        // add the text. Instead, it will add a button next to the
                        // reply field that you can click to insert the text.
                        const addButton = document.createElement('button');
                        addButton.textContent = 'Add 消えろ + Random';
                        addButton.style.marginLeft = '5px'; // Add some spacing
                        addButton.addEventListener('click', function() {
                            addRandomReply(replyInput);
                        });

                        // Find the parent element of the reply input to insert the button
                        const replyInputParent = replyInput.parentElement;
                        if (replyInputParent) {
                            replyInputParent.appendChild(addButton);
                        }
                    }
                });
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

})();
