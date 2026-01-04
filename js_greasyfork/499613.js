// ==UserScript==
// @name         Google Fi Messages
// @namespace    http://tampermonkey.net/
// @version      2024-07-03
// @description  Adds filtering to show only unread messages.
// @author       gofreddo
// @match        https://messages.google.com/web/conversations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499613/Google%20Fi%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/499613/Google%20Fi%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide conversation items with data-e2e-is-unread="false"
    function hideUnreadFalseItems() {
        // Select all mws-conversation-list-item elements
        const conversationItems = document.querySelectorAll('mws-conversation-list-item');

        // Loop through each conversation item
        conversationItems.forEach(item => {
            // Find the child 'a' element with the attribute data-e2e-is-unread
            const aElement = item.querySelector('a[data-e2e-is-unread]');
            // Check if the attribute value is "false"
            if (aElement && aElement.getAttribute('data-e2e-is-unread') === 'false') {
                // Hide the conversation item
                item.style.display = 'none';
            }
        });
    }

    // Function to show all conversation items
    function showAll() {
        // Select all mws-conversation-list-item elements
        const conversationItems = document.querySelectorAll('mws-conversation-list-item');

        // Loop through each conversation item
        conversationItems.forEach(item => {
            item.style.display = '';
        });
    }

    // Function to add the "Unread" and "Show All" links to the main-nav-header
    function addNavLinks() {
        // Select the div with class "main-nav-header"
        const mainNavHeader = document.querySelector('.main-nav-header');

        if (mainNavHeader) {
            // Create the "Unread" link
            if (!mainNavHeader.querySelector('.unread-link')) {
                const unreadLink = document.createElement('a');
                unreadLink.href = '#';
                unreadLink.textContent = 'Unread';
                unreadLink.className = 'unread-link';
                unreadLink.style.marginLeft = '10px'; // Add some margin for better spacing

                // Add a click event listener to run hideUnreadFalseItems when clicked
                unreadLink.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent the default link behavior
                    hideUnreadFalseItems();
                });

                // Append the "Unread" link to the main-nav-header
                mainNavHeader.appendChild(unreadLink);
            }

            // Create the "Show All" link
            if (!mainNavHeader.querySelector('.show-all-link')) {
                const showAllLink = document.createElement('a');
                showAllLink.href = '#';
                showAllLink.textContent = 'Show All';
                showAllLink.className = 'show-all-link';
                showAllLink.style.marginLeft = '10px'; // Add some margin for better spacing

                // Add a click event listener to run showAll when clicked
                showAllLink.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent the default link behavior
                    showAll();
                });

                // Append the "Show All" link to the main-nav-header
                mainNavHeader.appendChild(showAllLink);
            }
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Check if nodes were added
            mutation.addedNodes.forEach(node => {
                addNavLinks();
            });
        });
    });

    // Configure the observer to watch for child node additions
    const config = { childList: true, subtree: true };

    // Start observing the body or the container element that holds the conversation items
    observer.observe(document.body, config);

    // Initial run to add the nav links
    addNavLinks();

})();
