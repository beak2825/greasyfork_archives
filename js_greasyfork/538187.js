// ==UserScript==
// @name          Neopets - Jellyneo Item Name Scraper for Aber List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scrapes unique r99 item names from the current Jellyneo Item Database page
// @license      MIT
// @author       God
// @match        https://items.jellyneo.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538187/Neopets%20-%20Jellyneo%20Item%20Name%20Scraper%20for%20Aber%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/538187/Neopets%20-%20Jellyneo%20Item%20Name%20Scraper%20for%20Aber%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a Set to store unique item names for the current page
    const itemNames = new Set();

    // Select all <a> elements with href starting with "https://items.jellyneo.net/item/"
    const itemLinks = document.querySelectorAll('a[href^="https://items.jellyneo.net/item/"]');

    // Extract item names and add to Set
    itemLinks.forEach(link => {
        if (link.classList.contains('no-link-icon')) {
            const itemName = link.textContent.trim();
            if (itemName) {
                itemNames.add(itemName);
            }
        }
    });

    // Create a display box
    const displayBox = document.createElement('div');
    displayBox.id = 'item-name-box';
    displayBox.style.position = 'fixed';
    displayBox.style.top = '10px';
    displayBox.style.right = '10px';
    displayBox.style.width = '250px';
    displayBox.style.maxHeight = '80vh';
    displayBox.style.overflowY = 'auto';
    displayBox.style.backgroundColor = '#f0f0f0';
    displayBox.style.border = '1px solid #333';
    displayBox.style.padding = '10px';
    displayBox.style.zIndex = '1000';
    displayBox.style.fontFamily = 'Arial, sans-serif';
    displayBox.style.fontSize = '14px';

    // Add title to the box
    const title = document.createElement('h3');
    title.textContent = 'r99 Item Names';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '16px';
    displayBox.appendChild(title);

    // Add item names to the box or show a message if none found
    if (itemNames.size > 0) {
        const nameList = document.createElement('ul');
        nameList.style.listStyle = 'none';
        nameList.style.padding = '0';
        nameList.style.margin = '0';
        itemNames.forEach(name => {
            const listItem = document.createElement('li');
            listItem.textContent = name;
            listItem.style.marginBottom = '5px';
            nameList.appendChild(listItem);
        });
        displayBox.appendChild(nameList);
    } else {
        const noItems = document.createElement('p');
        noItems.textContent = 'No r99 items found on this page.';
        noItems.style.margin = '0';
        displayBox.appendChild(noItems);
    }

    // Append the box to the body
    document.body.appendChild(displayBox);
})();