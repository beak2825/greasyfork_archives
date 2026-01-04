// ==UserScript==
// @name         GC Virtupets Item Search Links
// @namespace     https://greasyfork.org/en/users/1291562-zarotrox
// @version      1.21
// @description  Adds a Virtupets search link for items in Inventory, SDB, Item List, and Trading Post.
// @author       Zarotrox
// @match        https://www.grundos.cafe/*
// @icon         https://i.ibb.co/44SS6xZ/Zarotrox.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511964/GC%20Virtupets%20Item%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/511964/GC%20Virtupets%20Item%20Search%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add Virtupets search link to a specific item
    function addVirtupetsLink(item, itemName) {
        // Check if the search links div already exists to avoid duplication
        let searchLinksDiv = item.querySelector('.searchhelp');
        if (!searchLinksDiv) {
            // Create a new div for the search links if it doesn't exist
            searchLinksDiv = document.createElement('div');
            searchLinksDiv.className = 'searchhelp';
            item.appendChild(searchLinksDiv);
        }

        // Create a new anchor element for the Virtupets search link
        const newLink = document.createElement('a');
        newLink.href = `https://virtupets.net/search?q=${encodeURIComponent(itemName)}`;
        newLink.title = `Search Virtupets for ${itemName}`; // Set the title correctly
        newLink.target = '_blank';

        // Create an image element for the link
        const img = document.createElement('img');
        img.src = 'https://virtupets.net/assets/images/vp.png'; // Replace with appropriate icon
        img.alt = 'Virtupets Search';
        img.title = `Search Virtupets for ${itemName}`; // Set the title correctly here as well
        img.className = 'search-helper-virtupets'; // Adjust class as necessary

        // Append the image to the anchor
        newLink.appendChild(img);

        // Append the anchor to the search links div
        searchLinksDiv.appendChild(newLink);
    }

    // Function to process inventory items (inv-item class)
    function processInventoryItems() {
        const inventoryItems = document.querySelectorAll('.inv-item');

        inventoryItems.forEach(item => {
            const itemNameSpan = item.querySelector('.item-info span'); // Get the span containing the item name

            if (itemNameSpan) {
                const itemName = itemNameSpan.textContent.trim();
                addVirtupetsLink(item, itemName);
            }
        });
    }

    // Function to process SDB items (sdb-item- id)
    function processSDBItems() {
        const sdbItems = document.querySelectorAll('div[id^="sdb-item-"].data.flex-column.small-gap.break');

        sdbItems.forEach(item => {
            const itemNameStrong = item.querySelector('strong'); // Get the strong tag containing the item name

            if (itemNameStrong) {
                const itemName = itemNameStrong.textContent.trim();
                addVirtupetsLink(item, itemName);
            }
        });
    }

 // Function to process items in the item list
function processItemList() {
    const itemListItems = document.querySelectorAll('.itemList.margin-1 .inv-item');

    itemListItems.forEach(item => {
        const itemNameStrong = item.querySelector('strong'); // Get the strong tag containing the item name

        if (itemNameStrong) {
            const itemName = itemNameStrong.textContent.trim();
            addVirtupetsLink(item, itemName);
        }
    });
}


    // Function to process Trading Post items
    function processTradingPostItems() {
        const tradingPostItems = document.querySelectorAll('.trade-item');

        tradingPostItems.forEach(item => {
            const itemNameSpan = item.querySelector('.item-info span'); // Get the span containing the item name

            if (itemNameSpan) {
                const itemName = itemNameSpan.textContent.trim();
                addVirtupetsLink(item, itemName);
            }
        });
    }

    // Function to add CSS styles
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .inv-item-name {
                font-weight: bold; /* Makes item names bold */
            }
            .searchhelp a {
                margin-right: 5px; /* Adds spacing between links */
            }
        `;
        document.head.appendChild(style);
    }

    // Execute the CSS addition and all processing functions
    addCustomStyles();
    processInventoryItems();
    processSDBItems();
    processItemList(); // Process item list items
    processTradingPostItems(); // Process trading post items

})();
