// ==UserScript==
// @name         ChatGPT Share Messages
// @namespace    https://greasyfork.org/en/users/1444872-tlbstation
// @version      1.8
// @description  Adds a share button to the action bar of each message in ChatGPT.
// @icon         https://i.ibb.co/jZ3HpwPk/pngwing-com.png
// @author       TLBSTATION
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529849/ChatGPT%20Share%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/529849/ChatGPT%20Share%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addShareButtons() {
        document.querySelectorAll('.flex.items-center.justify-start.rounded-xl.p-1').forEach(actionContainer => {
            if (!actionContainer || actionContainer.querySelector('.share-button')) return; // Prevent duplicates

            // Locate the exact div where icons are placed
            const buttonGroup = actionContainer.querySelector('.flex.items-center.transition-opacity');
            if (!buttonGroup) return;

            // Find the message text
            const messageContainer = actionContainer.closest('.flex.w-full');
            if (!messageContainer) return;

            const messageTextElement = messageContainer.querySelector('.prose');
            if (!messageTextElement) return;
            const messageText = messageTextElement.innerText.trim();

            // Create the Share button
            const shareButton = document.createElement('span');
            shareButton.setAttribute('data-state', 'closed');
            shareButton.innerHTML = `
                <button class="rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary share-button" aria-label="Share message" title="Share message">
                    <span class="flex h-[30px] w-[30px] items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2929 3.29289C11.6834 2.90237 12.3166 2.90237 12.7071 3.29289L16.7071 7.29289C17.0976 7.68342 17.0976 8.31658 16.7071 8.70711C16.3166 9.09763 15.6834 9.09763 15.2929 8.70711L13 6.41421V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V6.41421L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L11.2929 3.29289ZM4 14C4.55228 14 5 14.4477 5 15V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V15C3 14.4477 3.44772 14 4 14Z" fill="currentColor"></path>
                        </svg>
                    </span>
                </button>
            `;

            // Share functionality
            shareButton.querySelector('button').addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({ text: messageText }).catch(err => console.error('Sharing failed:', err));
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(messageText).then(() => {
                        alert('Message copied to clipboard!');
                    }).catch(err => console.error('Failed to copy text: ', err));
                }
            });

            // Find the "Edit in Canvas" button
            const editCanvasButton = buttonGroup.querySelector('[aria-label="Edit in canvas"]');
            if (editCanvasButton) {
                // Insert the share button **directly after** "Edit in Canvas"
                editCanvasButton.parentNode.insertAdjacentElement('afterend', shareButton);
            } else {
                // Fallback: Append at the end if "Edit in Canvas" isn't found
                buttonGroup.appendChild(shareButton);
            }
        });
    }

    // Observe new messages and apply the button dynamically
    const observer = new MutationObserver(addShareButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    addShareButtons();
})();
