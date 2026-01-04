// ==UserScript==
// @name         GPT Search Bar
// @namespace    makiisthenes
// @author       Michael Peres
// @version      2024-10-28
// @description  Add a search bar to filter chats based on chat names
// @license            MIT
// @author       You
// @match        *://chatgpt.com/c/*
// @match              https://chat.openai.com/
// @match              https://chat.openai.com/?model=*
// @match              https://chat.openai.com/c/*
// @match              https://chat.openai.com/g/*
// @match              https://chat.openai.com/gpts
// @match              https://chat.openai.com/gpts/*
// @match              https://chat.openai.com/share/*
// @match              https://chat.openai.com/share/*/continue
// @match              https://chatgpt.com/
// @match              https://chatgpt.com/?model=*
// @match              https://chatgpt.com/c/*
// @match              https://chatgpt.com/g/*
// @match              https://chatgpt.com/gpts
// @match              https://chatgpt.com/gpts/*
// @match              https://chatgpt.com/share/*
// @match              https://chatgpt.com/share/*/continue
// @match              https://new.oaifree.com/
// @match              https://new.oaifree.com/?model=*
// @match              https://new.oaifree.com/c/*
// @match              https://new.oaifree.com/g/*
// @match              https://new.oaifree.com/gpts
// @match              https://new.oaifree.com/gpts/*
// @match              https://new.oaifree.com/share/*
// @match              https://new.oaifree.com/share/*/continue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514466/GPT%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/514466/GPT%20Search%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the specific div element to be present in the DOM
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                callback(targetElement);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Create the search input element
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search chats...');
    searchInput.style.margin = '10px';
    searchInput.style.padding = '5px';

    // Function to filter chat names based on search input
    const filterChats = () => {
        const searchTerm = searchInput.value.toLowerCase();

        // Targeting <li> elements as parent containers for chat items
        const chatItems = document.querySelectorAll('li');

        chatItems.forEach(item => {
            // Target the child div that contains the chat name
            const chatNameElement = item.querySelector('div.relative.grow.overflow-hidden.whitespace-nowrap');

            if (chatNameElement) {
                const isVisible = chatNameElement.textContent.toLowerCase().includes(searchTerm);

                // Log matching for debugging purposes

                // Add or remove the 'hidden' class from the <li> element itself
                if (isVisible) {
                    item.classList.remove('hidden');  // Show the entire <li> element if match
                } else {
                    item.classList.add('hidden');  // Hide the <li> element if no match
                }
            }
        });
    };

    // Add event listener to search input
    searchInput.addEventListener('input', filterChats);

    // Wait for the target container and append the search input
    waitForElement('div.flex.flex-col.gap-2.pb-2.text-token-text-primary.text-sm.mt-5.false', (targetElement) => {
        targetElement.insertBefore(searchInput, targetElement.firstChild);
    });

})();
