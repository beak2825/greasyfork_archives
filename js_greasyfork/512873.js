// ==UserScript==
// @name         Mass Bazaar and Trade adder for Torn.com
// @namespace    http://tampermonkey.net/
// @version      7.6
// @description  Toggle all selected items on Torn.com and set maximum quantity and price with a minimal interface toggle button and support for formatted prices like '1m', '1k', etc., adjusted interface positions and smaller round button.
// @author       Fists (Mod by Heart)
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/trade.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512873/Mass%20Bazaar%20and%20Trade%20adder%20for%20Torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/512873/Mass%20Bazaar%20and%20Trade%20adder%20for%20Torncom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let controlsVisible = false;

    function parsePrice(priceText) {
        const units = {
            k: 1e3,
            m: 1e6,
            b: 1e9,
            t: 1e12
        };
        priceText = priceText.toLowerCase().trim();
        const unit = priceText.slice(-1);
        if (units[unit]) {
            return parseFloat(priceText.slice(0, -1)) * units[unit];
        }
        return parseFloat(priceText.replace(/,/g, ''));
    }

    function toggleItems() {
        const itemNameInput = document.getElementById('itemNameInput');
        const itemPriceInput = document.getElementById('itemPriceInput');
        const itemName = itemNameInput.value.trim().toLowerCase();
        const itemPrice = parsePrice(itemPriceInput.value.trim());

        if (!itemName && isNaN(itemPrice)) {
            alert("Please enter an item name or a valid price.");
            return;
        }

        const items = document.querySelectorAll('.clearfix[data-group="child"], .item___jLJcf');
        let itemsFound = false;

        items.forEach(function(item) {
            const itemNameElement = item.querySelector('.name-wrap .t-overflow, .desc___VJSNQ span b');
            const itemNameText = itemNameElement ? itemNameElement.textContent.trim().toLowerCase() : '';
            const itemPriceElement = item.querySelector('.input-money');
            const itemQuantityElement = item.querySelector('.amount input[type="text"]');
            const checkbox = item.querySelector('.amount-main-wrap .amount .checkbox-css');

            if (itemNameText.includes(itemName)) {
                itemsFound = true;
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                }
                if (itemQuantityElement) {
                    itemQuantityElement.value = '999999999';
                    itemQuantityElement.dispatchEvent(new Event('input', { bubbles: true }));
                }

                const currentPrice = parsePrice(itemPriceElement.value.trim());
                if (!isNaN(itemPrice) && itemPriceInput.value.trim() !== '' && currentPrice !== itemPrice) {
                    itemPriceElement.value = itemPrice;
                    itemPriceElement.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });

        if (!itemsFound) {
            alert("No matching items found.");
        }
    }

    function createInterface() {
        const smallButton = document.createElement('button');
        smallButton.id = 'toggleSmallButton';
        smallButton.textContent = '+';
        smallButton.style.position = 'fixed';
        smallButton.style.bottom = '50px'; // Position adjustment
        smallButton.style.right = '15px';
        smallButton.style.zIndex = '99999';
        smallButton.style.width = '40px'; // Smaller width
        smallButton.style.height = '40px'; // Smaller height
        smallButton.style.borderRadius = '50%';
        smallButton.style.backgroundColor = '#AB47BC';
        smallButton.style.color = 'white';
        smallButton.style.fontSize = '20px'; // Smaller font size
        smallButton.style.border = 'none';
        smallButton.style.cursor = 'pointer';
        smallButton.style.display = 'block';

        smallButton.addEventListener('click', () => toggleControls(true));

        document.body.appendChild(smallButton);

        const controlContainer = document.createElement('div');
        controlContainer.id = 'controlContainer';
        controlContainer.style.position = 'fixed';
        controlContainer.style.top = '80px'; // Adjusted down
        controlContainer.style.right = '15px';
        controlContainer.style.zIndex = '99998';
        controlContainer.style.display = 'none';

        document.body.appendChild(controlContainer);

        const mainButton = document.createElement('button');
        mainButton.textContent = 'Select Item';
        mainButton.style.margin = '10px';
        mainButton.style.padding = '10px 20px';
        mainButton.style.backgroundColor = '#7B1FA2';
        mainButton.style.color = 'white';
        mainButton.style.border = 'none';
        mainButton.style.borderRadius = '5px';
        mainButton.style.cursor = 'pointer';
        mainButton.addEventListener('click', toggleItems);

        controlContainer.appendChild(mainButton);

        const itemNameInput = document.createElement('input');
        itemNameInput.type = 'text';
        itemNameInput.placeholder = 'Enter item name';
        itemNameInput.id = 'itemNameInput';
        itemNameInput.style.display = 'block';
        itemNameInput.style.margin = '10px';
        itemNameInput.style.padding = '10px';
        itemNameInput.style.width = '200px';

        controlContainer.appendChild(itemNameInput);

        const itemPriceInput = document.createElement('input');
        itemPriceInput.type = 'text';
        itemPriceInput.placeholder = 'Enter item price (e.g., 1m, 1k)';
        itemPriceInput.id = 'itemPriceInput';
        itemPriceInput.style.display = 'block';
        itemPriceInput.style.margin = '10px';
        itemPriceInput.style.padding = '10px';
        itemPriceInput.style.width = '200px';

        controlContainer.appendChild(itemPriceInput);

        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = '-';
        minimizeButton.style.position = 'absolute';
        minimizeButton.style.top = '5px';
        minimizeButton.style.right = '5px';
        minimizeButton.style.width = '50px';
        minimizeButton.style.height = '50px';
        minimizeButton.style.borderRadius = '50%';
        minimizeButton.style.backgroundColor = '#FF5722';
        minimizeButton.style.color = 'white';
        minimizeButton.style.border = 'none';
        minimizeButton.style.cursor = 'pointer';

        minimizeButton.addEventListener('click', () => toggleControls(false));

        controlContainer.appendChild(minimizeButton);
    }

    function toggleControls(show) {
        controlsVisible = show;
        document.getElementById('controlContainer').style.display = show ? 'block' : 'none';
        document.getElementById('toggleSmallButton').style.display = show ? 'none' : 'block';
    }

    setTimeout(createInterface, 2000);
})();
