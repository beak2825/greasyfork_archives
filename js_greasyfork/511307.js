// ==UserScript==
// @name         Torn Inventory Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Highlight specific items in Torn inventory based on their names and adjust text color for dark mode
// @author       Pampy
// @match        https://www.torn.com/item.php
// @grant        none
// @license      Pampas
// @downloadURL https://update.greasyfork.org/scripts/511307/Torn%20Inventory%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/511307/Torn%20Inventory%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const itemsToHighlight = {
        'Can Goose Juice': 'red',
        'Can of Damp Valley': 'red',
        'Can of Crocozade': 'red',
        'Can of Munster': 'orange',
        'Can of Santa Shooters': 'orange',
        'Can of Red Cow': 'yellow',
        'Can of Rockstar Rudolph': 'yellow',
        'Can of Taurine Elite': 'green',
        'Can of X-MASS': 'green'
    };

    function isDarkMode() {
        const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
        // Assuming dark mode if the background color is dark
        const rgb = bodyBackgroundColor.match(/\d+/g);
        const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
        return brightness < 0.5;
    }

    function highlightItems() {
        const itemElements = document.querySelectorAll('[data-sort]');
        console.log(`Found ${itemElements.length} items with data-sort attribute`);
        const textColor = isDarkMode() ? 'black' : 'black';
        const fontWeight = 'bold'; // Always bold
        itemElements.forEach(itemElement => {
            const itemName = itemElement.getAttribute('data-sort');
            console.log(`Item name: ${itemName}`);
            for (const [name, color] of Object.entries(itemsToHighlight)) {
                if (itemName.includes(name)) {
                    console.log(`Highlighting item: ${name} with color: ${color}`);
                    itemElement.style.backgroundColor = color;
                    itemElement.style.color = textColor;
                    itemElement.style.fontWeight = fontWeight;
                    itemElement.style.setProperty('background-color', color, 'important');
                    itemElement.style.setProperty('color', textColor, 'important');
                    itemElement.style.setProperty('font-weight', fontWeight, 'important');
                }
            }
        });
    }

    window.addEventListener('load', () => {
        setTimeout(highlightItems, 2000); // Delay by 2 seconds
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                highlightItems();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
