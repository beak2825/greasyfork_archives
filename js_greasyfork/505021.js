// ==UserScript==
// @name         ChatGPT conversation Seeker ORIGINAL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search past conversations
// @author       Emree.el on instagram :)
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505021/ChatGPT%20conversation%20Seeker%20ORIGINAL.user.js
// @updateURL https://update.greasyfork.org/scripts/505021/ChatGPT%20conversation%20Seeker%20ORIGINAL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the search bar and button
    const searchBarContainer = document.createElement('div');
    searchBarContainer.style.position = 'fixed';
    searchBarContainer.style.top = '0';
    searchBarContainer.style.left = 'calc(50% + 280px)';
    searchBarContainer.style.transform = 'translateX(-50%)';
    searchBarContainer.style.zIndex = '9999';
    searchBarContainer.style.background = '#171717';
    searchBarContainer.style.padding = '5px';
    searchBarContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    searchBarContainer.style.display = 'flex';
    searchBarContainer.style.alignItems = 'center';

    // Create the search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Enter text to search';
    searchInput.style.marginRight = '5px';
    searchInput.style.padding = '5px';
    searchInput.style.fontSize = '14px'; // Make font size a bit smaller
    searchInput.style.backgroundColor = 'black';


    // Create the search button
    const searchButton = document.createElement('button');
    searchButton.textContent = 'Enter';
    searchButton.style.padding = '5px';
    searchButton.style.fontSize = '14px'; // Make font size a bit smaller

    // Append the input and button to the container
    searchBarContainer.appendChild(searchInput);
    searchBarContainer.appendChild(searchButton);

    // Append the container to the body
    document.body.appendChild(searchBarContainer);

    // Add event listener to the button
    searchButton.addEventListener('click', function() {
        const searchText = searchInput.value.trim().toLowerCase();
        const elements = document.querySelectorAll('a.flex.items-center.gap-2.p-2');

        elements.forEach(element => {
            const text = element.textContent.trim().toLowerCase();
            if (text.includes(searchText)) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    });
})();
