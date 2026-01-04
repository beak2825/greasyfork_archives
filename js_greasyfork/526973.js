// ==UserScript==
// @name         RIA Novosti Chat Copy
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Allows copying of commenter's name and message from RIA Novosti chat widgets.
// @author       You
// @match        https://ria.ru/*
// @grant        none
// @run-at       document-idle  // Important: Ensures script runs after dynamic content loads
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526973/RIA%20Novosti%20Chat%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/526973/RIA%20Novosti%20Chat%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper Functions ---

    // Function to find a specific ancestor by selector
    function findAncestor(el, selector) {
        while ((el = el.parentElement) && !el.matches(selector));
        return el;
    }

    // Function to extract the quoted message and author
    function getQuoteData(messageDiv) {
        const quoteDiv = messageDiv.querySelector('.chat__lenta-quote');
        if (quoteDiv) {
            const author = quoteDiv.querySelector('.chat__lenta-quote-author')?.textContent.trim() || "";
            const quote = quoteDiv.querySelector('.chat__lenta-quote-message')?.textContent.trim() || "";
            return { author, quote };
        }
        return null;
    }


    // Function to create the copy button
    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.classList.add('copy-button');  // Add a class for styling
        button.style.cssText = `
            margin-left: 10px;
            padding: 2px 5px;
            font-size: 12px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background-color: #f0f0f0;
            cursor: pointer;
        `; // Basic styling
        return button;
    }

    // Function to handle the copy action
    function handleCopyClick(event) {
        const button = event.currentTarget;
        const messageDiv = findAncestor(button, '.chat__lenta-item');
        if (!messageDiv) return;

        const nameElement = messageDiv.querySelector('.chat__lenta-item-name-text');
        const messageElement = messageDiv.querySelector('.chat__lenta-item-message-text');
        const dateElement = messageDiv.querySelector('.chat__lenta-item-date');


        if (!nameElement || !messageElement || !dateElement) return;


        const name = nameElement.textContent.trim();
        const message = messageElement.textContent.trim();
        const date = dateElement.textContent.trim();
        const quoteData = getQuoteData(messageDiv);


        let textToCopy = `${name} (${date}):\n${message}\n`;
        if(quoteData) {
          textToCopy = `${name} (${date}) [Reply to ${quoteData.author}: "${quoteData.quote}"]:\n${message}\n`;
        }

        // Use the Clipboard API (modern browsers)
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Optionally, provide visual feedback (e.g., change button text)
            button.textContent = 'Copied!';
            setTimeout(() => { button.textContent = 'Copy'; }, 1000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
             // Fallback for older browsers (less reliable, may require user interaction)
            try {
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                button.textContent = 'Copied!';
                setTimeout(() => { button.textContent = 'Copy'; }, 1000);
            }
            catch (fallbackErr)
            {
                console.error("Fallback copy failed", fallbackErr);
                alert('Copy failed.  Please copy manually.');
            }

        });
    }


    function processNewMessages(mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('chat__lenta-item'))
                {
                    addCopyButtonToMessage(node);
                } else if (node.nodeType === Node.ELEMENT_NODE && node.querySelectorAll)
                {
                    //check for subnodes
                    const messages = node.querySelectorAll('.chat__lenta-item');
                    messages.forEach(addCopyButtonToMessage);
                }
            }
          }
        }
      }


    function addCopyButtonToMessage(messageDiv) {
        if (messageDiv.querySelector('.copy-button')) {
            return; // Button already exists
        }

        const header = messageDiv.querySelector('.chat__lenta-item-header');
        if (!header) return;

        const copyButton = createCopyButton();
        copyButton.addEventListener('click', handleCopyClick);
        header.appendChild(copyButton);  // Add the button to the header
    }


    function addCopyButtonsToExistingMessages()
    {
        // Find all existing messages
        const existingMessages = document.querySelectorAll('.chat__lenta-item');
        existingMessages.forEach(addCopyButtonToMessage);
    }

    // --- Main Execution ---

    //First, add to existings
    addCopyButtonsToExistingMessages();

    // Set up a MutationObserver to watch for new messages being added
    const chatContainer = document.querySelector('.chat__lenta .the-in-scroll__content');

    if(chatContainer)
    {
        const observer = new MutationObserver(processNewMessages);
        observer.observe(chatContainer, { childList: true, subtree: true });
    } else
    {
        console.error("RIA Chat Copy userscript: Could not find chat container.");
    }


})();