// ==UserScript==
// @name         Cheapest Price By Unit
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Simple sort by unit button for Dead Frontier Marketplace - Find cheap credits based on the price of 1 credit!
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534328/Cheapest%20Price%20By%20Unit.user.js
// @updateURL https://update.greasyfork.org/scripts/534328/Cheapest%20Price%20By%20Unit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the button and add the Unit Price column
    function createSortButton() {
        // Check if the button already exists to avoid duplicates
        if (document.getElementById('sortButton')) return;

        const btn = document.createElement('button');
        btn.id = 'sortButton'; // Set an ID for the button
        btn.style.position = 'absolute';
        btn.style.left = '608px';
        btn.style.width = 'max-content'; // This will override the previous width
        btn.innerText = 'Sort/1';
        btn.style.cursor = 'pointer';



        const salePriceSpan = document.querySelector('#tradesLabels span:nth-child(4)');

        if (salePriceSpan) {
            salePriceSpan.insertAdjacentElement('afterend', btn);
        }

        // Add Unit Price header
        const unitPriceHeader = document.createElement('span');
        unitPriceHeader.innerText = 'Unit Price';
        unitPriceHeader.style.position = 'absolute';
        unitPriceHeader.style.left = '100px'; // Adjust position as needed
        unitPriceHeader.style.width = 'max-content';


        // Add click event
        btn.addEventListener('click', () => {
            sortItemsByPricePerCredit();
            salePriceSpan.insertAdjacentElement('afterend', unitPriceHeader);
        });
    }

    // Function to parse item data and sort
    function sortItemsByPricePerCredit() {
        const items = Array.from(document.querySelectorAll('.fakeItem'));
        let quantity = 1;
        // Map items to objects with price per credit
        const itemData = items.map(item => {
            const datatype = item.getAttribute('data-type') || '';
            const firstPart = datatype.split('_')[0];

            const itemType = unsafeWindow.getItemType(unsafeWindow.globalData[firstPart]);
            if (itemType === 'armour') {
                quantity = 1;
            } else {
                const quantityStr = item.querySelector('.itemName')?.dataset?.cash || '';
                const quantityAttr = item.dataset?.quantity || '';
                quantity = parseInt(quantityAttr) || 1; // Fallback to 1 if quantity is not found
            }
            const priceStr = item.querySelector('.salePrice')?.innerText || '';
            const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;

            // Calculate price per credit
            const pricePerCreditItem = priceNum / quantity;

            // Calculate unit price
            const unitPrice = priceNum / quantity;

            // Add unit price to the item element
            //const unitPriceDiv = document.createElement('div');

            // Check if the unit price div already exists
            let unitPriceDiv = item.querySelector('.unitPrice');
            if (!unitPriceDiv) {
                // Create unit price div if it doesn't exist
                unitPriceDiv = document.createElement('div');
                unitPriceDiv.className = 'unitPrice';
                item.appendChild(unitPriceDiv);
            }

            unitPriceDiv.className = 'unitPrice';
            //const formattedUnitPrice = `$${unitPrice.toFixed(0)}`; // Format to 0 decimal places with dollar sign
            const formattedUnitPrice = `$${Math.round(unitPrice).toLocaleString()}`;
            unitPriceDiv.innerText = formattedUnitPrice; // Set the formatted price
            unitPriceDiv.style.position = 'absolute'; // Set position to absolute
            unitPriceDiv.style.left = '115px'; // Set left position
            unitPriceDiv.style.color = '#FFCC00'; // Set text color to yellow
            item.appendChild(unitPriceDiv);


            return {
                element: item,
                pricePerCredit: pricePerCreditItem
            };
        });

        itemData.sort((a, b) => a.pricePerCredit - b.pricePerCredit);

        // Reorder DOM
        const parent = document.querySelector('.marketDataHolder');
        if (parent) {
            // Remove all items
            parent.innerHTML = '';
            // Append sorted items
            itemData.forEach(data => {
                parent.appendChild(data.element);
            });
        }
    }

    /*
     * Code below of this script is derived from the "Dead Frontier - Fast Services" script by Shrike00
     * Original source: https://update.greasyfork.org/scripts/472536/Dead%20Frontier%20-%20Fast%20Services.user.js
     * Copyright (c) Shrike00
     * Licensed under the MIT License.
     */
    // Initial button creation and observer setup
    function waitForItemDisplay(callback, timeout) {
        const start = performance.now();
        const check = setInterval(function() {
            if (document.getElementById("itemDisplay") !== null) {
                clearInterval(check);
                callback();
            } else if (performance.now() - start > timeout) {
                clearInterval(check);
            }
        }, 100);
    }
    function main() {
        waitForItemDisplay(function() {
            // Initial addition of button.
            createSortButton();
            // Mutation observer to check for changes to the marketplace child nodes, re-adding the event listener
            // whenever the selectMarket element is re-added (which happens when the market tab is changed).
            const callback = function(mutationList, observer) {
                for (const record of mutationList) {
                    const element = record.addedNodes[0];
                    if (element !== undefined && element.id === "selectMarket") {
                        createSortButton();
                    }
                }
            }
            const observer = new MutationObserver(callback);
            const marketplace = document.getElementById("marketplace");
            observer.observe(marketplace, {childList: true});
        }, 5000);
    }

    main();

})();