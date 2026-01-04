// ==UserScript==
// @name         Middle Text Ellipsis for ChatGPT
// @namespace    http://yournamespace.example.com
// @version      1.1
// @description  Adds a button to trim the middle part of text inside `.text-message` elements on chatgpt.com.
// @match        *://*.chatgpt.com/*
// @license      MIT
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/507814/Middle%20Text%20Ellipsis%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/507814/Middle%20Text%20Ellipsis%20for%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to trim the middle of a string, keeping the first and last parts with an ellipsis in the middle
    const trimMiddle = (text, startChars, endChars) => {
        if (text.length <= startChars + endChars) return text;
        return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
    };

    // Function to apply the trimming logic to all eligible `.text-message` elements
    const applyTrim = () => {
        const textMessages = document.querySelectorAll(".text-message");
        // console.log("Applying trim to text messages:", textMessages);
        Array.from(textMessages).map((messageElement, index, allMessages) => {
            // Only apply the function to the last fifth of the elements
            if (index > allMessages.length * 0.8) return;

            // Traverse through specific child elements of the current '.text-message' element
            Array.from(messageElement.children[0].children[0]?.children).map((childElement, childIndex) => {
                childElement.innerHTML = trimMiddle(childElement.innerHTML, 16, 16); // Adjusted to 16 chars
            });
        });
        // alert("Trim applied to the last fifth of text-message elements!"); // Notify when trim is applied
    };

    // Function to create and inject the button
    const createButton = () => {
        const button = document.createElement('button');
        button.id = "radix-r3";
        button.className = 'flex h-6 w-6 items-center justify-center rounded-full border border-token-border-light text-xs text-token-text-secondary';
        button.setAttribute('aria-haspopup', 'menu');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('data-state', 'closed');
        button.innerHTML = '✂️'; // Icon for trimming messages

        // When the button is clicked, apply the trim function
        button.addEventListener('click', applyTrim);

        // Log a message when the button is created
        // console.log("Trim button created!");

        // Find the composer-parent element and append the button to its sibling children
        const composerParent = document.querySelector('.composer-parent');
        if (composerParent && composerParent.parentElement) {
            const siblings = composerParent.parentElement.children;
            if (siblings.length > 1) {
                siblings[1].appendChild(button); // Appending to the second child (sibling of composer-parent)
                // console.log("Trim button appended to the second sibling of composer-parent.");
            } else {
                console.error("Sibling element not found for appending the button");
            }
        } else {
            console.error("Composer parent element not found or it has no parent for appending the button");
        }
    };

    // Observe DOM changes to ensure elements are fully loaded
    const observer = new MutationObserver(() => {
        const composerParent = document.querySelector('.composer-parent');
        if (composerParent) {
            createButton(); // Create and append the button when composer-parent is found
            observer.disconnect(); // Stop observing after the button is appended
        }
    });

    // Start observing the document body for child element changes (DOM loading)
    observer.observe(document.body, { childList: true, subtree: true });

})();
