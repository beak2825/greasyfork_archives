// ==UserScript==
// @name         Add "Copy" Button to ChatGPT Questions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add copy buttons to your prompts on ChatGPT, in case you need to ask the same question twice
// @author       Lak
// @match        chat.openai.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491916/Add%20%22Copy%22%20Button%20to%20ChatGPT%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/491916/Add%20%22Copy%22%20Button%20to%20ChatGPT%20Questions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    function copyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    // Function to add a copy button to an element
    function addCopyButton(element) {
        const existingCopyButton = element.querySelector('[aria-label="Copier"]');
        if (!existingCopyButton) {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> ';
            copyButton.className = "flex items-center gap-1.5 rounded-md p-1 text-xs hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible md:group-[.final-completion]:visible";
            copyButton.ariaLabel = 'Copier';
            const buttonPosition = element.querySelector('.mt-1');
            if (buttonPosition) {
                const firstChild = buttonPosition.firstElementChild;
                if (firstChild) {
                    buttonPosition.insertBefore(copyButton, firstChild);
                } else {
                    buttonPosition.appendChild(copyButton);
                }
            }

            copyButton.addEventListener('click', () => {
                const innerText = element.querySelector('[class*="text-message"]').innerText.trim();
                copyTextToClipboard(innerText);

                // Change the copy button icon to a checkmark temporarily
                const originalIcon = copyButton.innerHTML;
                copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';

                setTimeout(() => {
                    // Revert the copy button icon to the original
                    copyButton.innerHTML = originalIcon;
                }, 1500); // 1.5 seconds delay for reverting the button icon
            });
        }
    }

    // Observer callback function
    function observeCallback(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) {
                        const elements = document.querySelectorAll('[data-testid*="conversation-turn-"]');
                        for (let i = 0; i < elements.length; i += 2) {
                            addCopyButton(elements[i]);
                        }
                    }
                }
            }
        }
    }



    // Create a Mutation Observer
    const observer = new MutationObserver(observeCallback);

    // Start observing the entire document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
