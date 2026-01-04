// ==UserScript==
// @name         ChatGPT Character Counter
// @namespace    https://leaked.tools/
// @version      1.4
// @description  Adds a character counter to message fields on chatgpt.com
// @author       Sango
// @match        *://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523513/ChatGPT%20Character%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/523513/ChatGPT%20Character%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const maxCharacters = 32732;

function addCharacterCounter(element, position) {
    // Avoid adding multiple counters to the same element
    if (position.previousElementSibling && position.previousElementSibling.classList.contains('character-counter')) {
        return;
    }

    // Create the counter element
    const counter = document.createElement('div');
    counter.className = 'character-counter flex items-center justify-center';
    counter.style.fontSize = '14px';
    counter.style.color = '#555';
    counter.style.marginRight = '5px';
    counter.textContent = `0/${maxCharacters}`;

    // Insert the counter before the element
    position.insertAdjacentElement('beforebegin', counter);

    // Update the counter when the content changes
    const updateCounter = () => {
        const content = element.value || element.textContent.trim();
        const currentLength = content.length;
        counter.textContent = `${currentLength}/${maxCharacters}`;

        // Change color if limit exceeded
        if (currentLength > maxCharacters) {
            counter.style.color = '#ffa700';
        } else {
            counter.style.color = '#555';
        }
    };

    // Listen for content changes
    if (element.tagName.toLowerCase() === 'textarea') {
        element.addEventListener('keyup', updateCounter);
    } else {
        const observer = new MutationObserver(updateCounter);
        observer.observe(element, { childList: true, subtree: true, characterData: true });
    }

    updateCounter(); // Initialize the counter
}


    function observeFields() {
        const observer = new MutationObserver(() => {
            const editableDivs = document.querySelectorAll('div[contenteditable="true"]');
            editableDivs.forEach((editableDiv) => {
                if (!editableDiv.dataset.counterAdded) {
                    editableDiv.dataset.counterAdded = true; // Mark this div as processed
                    addCharacterCounter(editableDiv, editableDiv.parentElement.parentElement.parentElement.parentElement.querySelector(".flex.gap-x-1:last-of-type>.min-w-8"));
                }
            });

            const textareas = document.querySelectorAll('textarea:not([placeholder="Message ChatGPT"])');
            textareas.forEach((textarea) => {
                if (!textarea.dataset.counterAdded) {
                    textarea.dataset.counterAdded = true; // Mark this textarea as processed
                    addCharacterCounter(textarea, textarea.parentElement.parentElement.parentElement.querySelector(".flex.justify-end>.btn"));
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeFields();
})();
