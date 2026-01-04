// ==UserScript==
// @name         ChatGPT Shortcut for Google Search
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add a ChatGPT button inside the Google search bar container
// @author       jamubc
// @match        https://www.google.com/search*
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/518980/ChatGPT%20Shortcut%20for%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/518980/ChatGPT%20Shortcut%20for%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if there’s a search query in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (query) {
        // Locate the main search bar container with class 'RNNXgb'
        const searchBarContainer = document.querySelector('.RNNXgb');

        if (searchBarContainer) {
            // Create a ChatGPT button
            const button = document.createElement('button');
            button.textContent = "Ask ChatGPT";
            button.style.marginLeft = '10px'; // Space between other elements
            button.style.padding = '6px 10px';
            button.style.backgroundColor = '#1f1f1f';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '12px';
            button.style.display = 'flex';
            button.style.alignItems = 'center';

            // Add functionality to the button
            button.addEventListener('click', () => {
                const chatGPTUrl = `https://chat.openai.com/?q=${encodeURIComponent(query)}`;
                window.open(chatGPTUrl, '_blank');
            });

            // Insert the button at the end of the search bar container
            const buttonContainer = searchBarContainer.querySelector('.BKRPef');
            if (buttonContainer) {
                buttonContainer.appendChild(button);
            } else {
                console.error("Button container {} not found inside the search bar.");
                console.error("An error will occur when google updates their website.");
            }
        } else {
            console.error("Search bar container {} not found.");
            console.error("An error will occur when google updates their website.");
        }
    }
})();
