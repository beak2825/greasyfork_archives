// ==UserScript==
// @name         Mass Bazaar and Trade adder for Torn.com
// @namespace    http://tampermonkey.net/
// @version      7.4
// @description  Toggle all selected items on Torn.com and set maximum quantity and price
// @author       Fists [2830940]
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492876/Mass%20Bazaar%20and%20Trade%20adder%20for%20Torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/492876/Mass%20Bazaar%20and%20Trade%20adder%20for%20Torncom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to toggle items based on partial item name, set quantity, and set price
    function toggleItems() {
        var button = document.getElementById('toggleButton');
        button.style.transform = 'translate(-4px, 4px)';
        button.style.backgroundColor = '#7B1FA2';
        setTimeout(function() {
            button.style.transform = '';
            button.style.backgroundColor = '#AB47BC';
        }, 200);

        var itemNameInput = document.getElementById('itemNameInput');
        var itemPriceInput = document.getElementById('itemPriceInput');
        var itemName = itemNameInput.value.trim().toLowerCase();
        var itemPrice = parseFloat(itemPriceInput.value.trim());

        // Select all items using both the old and new class names
        var items = document.querySelectorAll('.clearfix[data-group="child"], .item___jLJcf');
        items.forEach(function(item) {
            var itemNameElement = item.querySelector('.name-wrap .t-overflow, .desc___VJSNQ span b');
            var itemNameText = itemNameElement ? itemNameElement.textContent.trim().toLowerCase() : '';
            var itemPriceElement = item.querySelector('.input-money');
            var itemQuantityElement = item.querySelector('.amount input[type="text"]');
            var checkbox = item.querySelector('.amount-main-wrap .amount .checkbox-css');

            if (itemNameText.includes(itemName)) {
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                } else if (itemQuantityElement) {
                    itemQuantityElement.value = '999999999';
                    itemQuantityElement.dispatchEvent(new Event('input', { bubbles: true }));
                }

                var currentPrice = parseFloat(itemPriceElement.value.trim());
                if (!isNaN(itemPrice) && itemPriceInput.value.trim() !== '' && currentPrice !== itemPrice) {
                    itemPriceElement.value = itemPrice;
                    itemPriceElement.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });
    }

    function createInputs() {
        var button = document.createElement('button');
        button.textContent = 'Toggle Selected Items';
        button.id = 'toggleButton';
        button.addEventListener('click', toggleItems);

        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '15px';
        button.style.zIndex = '99999';
        button.style.backgroundColor = '#AB47BC';
        button.style.color = 'white';
        button.style.padding = '10px 20px';
        button.style.transition = 'transform 0.2s ease, background-color 0.2s ease';

        document.body.appendChild(button);

        var itemNameInput = document.createElement('input');
        itemNameInput.type = 'text';
        itemNameInput.placeholder = 'Enter item name';
        itemNameInput.id = 'itemNameInput';
        itemNameInput.style.position = 'fixed';
        itemNameInput.style.top = 'calc(10px + 50px)';
        itemNameInput.style.right = '15px';
        itemNameInput.style.zIndex = '99999';
        itemNameInput.style.height = '36px';
        itemNameInput.style.width = '200px';
        itemNameInput.style.fontSize = '13px';

        document.body.appendChild(itemNameInput);

        var itemPriceInput = document.createElement('input');
        itemPriceInput.type = 'number';
        itemPriceInput.placeholder = 'Enter item price';
        itemPriceInput.id = 'itemPriceInput';
        itemPriceInput.style.position = 'fixed';
        itemPriceInput.style.top = 'calc(56px + 50px)';
        itemPriceInput.style.right = '15px';
        itemPriceInput.style.zIndex = '99999';
        itemPriceInput.style.height = '36px';
        itemPriceInput.style.width = '200px';
        itemPriceInput.style.fontSize = '13px';

        document.body.appendChild(itemPriceInput);

        var creditText = document.createElement('div');
        creditText.textContent = 'Made by Fists [2830940] and ChatGPT';
        creditText.style.position = 'fixed';
        creditText.style.top = 'calc(92px + 50px)';
        creditText.style.right = '15px';
        creditText.style.zIndex = '99999';
        creditText.style.textAlign = 'center';
        creditText.style.fontSize = '10px';
        creditText.style.color = 'white';

        document.body.appendChild(creditText);

        var backgroundBox = document.createElement('div');
        backgroundBox.style.position = 'fixed';
        backgroundBox.style.top = 'calc(-3px)';
        backgroundBox.style.right = 'calc(-3px)';
        backgroundBox.style.width = '220px';
        backgroundBox.style.height = '170px';
        backgroundBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        backgroundBox.style.zIndex = '99998';

        document.body.appendChild(backgroundBox);

        backgroundBox.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    setTimeout(createInputs, 2000);
})();
