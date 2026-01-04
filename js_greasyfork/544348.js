// ==UserScript==
// @name         Flat MMO - Display Item Names
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display item names underneath their pictures in Flat MMO database
// @author       Carlos
// @match        https://flatmmo.com/db/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544348/Flat%20MMO%20-%20Display%20Item%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/544348/Flat%20MMO%20-%20Display%20Item%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format item names (replace underscores with spaces and capitalize)
    function formatItemName(name) {
        return name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    // Function to add names to items
    function addItemNames() {
        // Find all database entries
        const dbEntries = document.querySelectorAll('.db-entry[data-entry]');

        dbEntries.forEach(entry => {
            // Skip if name already added
            if (entry.querySelector('.item-name-label')) {
                return;
            }

            // Get the item name from data-entry attribute
            const itemName = entry.getAttribute('data-entry');

            if (itemName) {
                // Format the name
                const formattedName = formatItemName(itemName);

                // Create name element
                const nameElement = document.createElement('div');
                nameElement.className = 'item-name-label';
                nameElement.textContent = formattedName;

                // Style the name element
                nameElement.style.cssText = `
                    text-align: center;
                    font-size: 11px;
                    font-weight: bold;
                    color: #333;
                    background-color: rgba(255, 255, 255, 0.9);
                    padding: 2px 4px;
                    margin-top: 2px;
                    border-radius: 3px;
                    line-height: 1.2;
                    word-wrap: break-word;
                    max-width: 70px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                `;

                // Add the name element to the entry
                entry.appendChild(nameElement);
            }
        });
    }

    // Function to observe for new content (in case items are loaded dynamically)
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if new db-entry elements were added
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('db-entry')) {
                                setTimeout(addItemNames, 100);
                            } else if (node.querySelectorAll) {
                                const newEntries = node.querySelectorAll('.db-entry[data-entry]');
                                if (newEntries.length > 0) {
                                    setTimeout(addItemNames, 100);
                                }
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to load, then add names
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addItemNames, 500);
            observeChanges();
        });
    } else {
        setTimeout(addItemNames, 500);
        observeChanges();
    }

    // Also run when search function might filter items
    const originalSearch = window.search;
    if (typeof originalSearch === 'function') {
        window.search = function(ele) {
            originalSearch(ele);
            setTimeout(addItemNames, 100);
        };
    }

})();