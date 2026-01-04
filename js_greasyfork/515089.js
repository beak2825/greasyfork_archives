// ==UserScript==
// @name         Trello Card URL Copy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button with an icon to cards that copies their URL to the clipboard. Useful for adding a card link to a checklist.
// @author       David McEwen
// @match        https://trello.com/b/*
// @grant        GM_setClipboard
// @icon         https://trello.com/favicon.ico
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/515089/Trello%20Card%20URL%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/515089/Trello%20Card%20URL%20Copy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // function to add copy buttons to all Trello cards
    function addCopyButtons() {
        const cards = document.querySelectorAll('[data-testid="list-card"]');

        // if no new cards are found, exit the function
        if (cards.length === 0) {
            return;
        }

        cards.forEach(card => {
            // check if the button is already added
            if (card.querySelector('.copy-url-btn')) return;

            // create the copy button
            const button = document.createElement('button');
            button.innerHTML = '📋'; // Unicode copy icon
            button.className = 'copy-url-btn';
            button.title = 'Copy Card URL';
            button.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: none; /* No background */
                border: none; /* No border */
                padding: 0; /* No padding */
                font-size: 16px; /* Adjust size for visibility */
                cursor: pointer;
                z-index: 10; /* Ensure it's above other elements */
                transition: transform 0.1s; /* Smooth transition for scaling */
            `;

            button.onclick = function (e) {
                e.stopPropagation(); // Prevent triggering other card events

                // get card URL from the card's link element
                const cardLink = card.querySelector('a[data-testid="card-name"]');
                if (cardLink) {
                    const cardUrl = cardLink.href;
                    GM_setClipboard(cardUrl);

                    // Ssale down the button briefly to indicate success
                    button.style.transform = 'scale(0.8)';

                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 50); // duration of the click effect
                }
            };

            // append the button to the card's container
            const cardContainer = card.querySelector('[data-testid="trello-card"]');
            if (cardContainer) {
                cardContainer.style.position = 'relative';
                cardContainer.appendChild(button);
            }
        });
    }

    const observer = new MutationObserver(addCopyButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    addCopyButtons();
})();
