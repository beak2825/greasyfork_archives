// ==UserScript==
// @name         PC Lot Value Extractor
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Extract lot values and convert to JSON with Retail Buy and Sell Prices
// @author       You
// @match        https://www.pricecharting.com/lot-value-calculator
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499622/PC%20Lot%20Value%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/499622/PC%20Lot%20Value%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a button to the page
    const button = document.createElement('button');
    button.textContent = 'Extract Values';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = 'calc(80% - 60px)';
    button.style.zIndex = 1000;
    document.body.appendChild(button);

    // Function to extract values and convert to JSON
    async function extractValues() {
        const data = [];

        // Function to extract data
        function extractData() {
            const rows = document.querySelectorAll('#cart-contents tbody tr');
            const tempData = [];

            rows.forEach((row, index) => {
                const name = row.querySelector('td a').textContent.trim();
                const console = row.querySelector('td.console').textContent.trim();
                const condition = row.querySelector('td.condition select option:checked').textContent.trim();
                const price = row.querySelector('td.numeric.price span').textContent.trim();

                tempData.push({
                    position: index + 1,
                    name: name,
                    console: console,
                    condition: condition,
                    price: price
                });
            });

            return tempData;
        }

        // Function to change the price type
        async function changePriceType(priceType) {
            const selectElement = document.querySelector('#PriceType');
            selectElement.value = priceType;
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);

            // Wait for the page to update prices (you may need to adjust the delay)
            return new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Extract Retail Buy Prices
        await changePriceType('retail_buy');
        const retailBuyData = extractData();

        // Extract Retail Sell Prices
        await changePriceType('retail_sell');
        const retailSellData = extractData();

        // Combine the data
        retailBuyData.forEach((item, index) => {
            item.retailBuyPrice = item.price;
            item.retailSellPrice = retailSellData[index].price;
            delete item.price;
            data.push(item);
        });

        const result = {
            itemCount: data.length,
            items: data
        };

        const json = JSON.stringify(result, null, 2);
        displayModal(json);
    }

    // Function to display the extracted JSON in a modal
    function displayModal(json) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = 1001;
        modal.style.maxWidth = '80%';
        modal.style.maxHeight = '80%';
        modal.style.overflow = 'auto';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginBottom = '10px';

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(json).then(() => {
                document.body.removeChild(modal);
            });
        });
        buttonContainer.appendChild(copyButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        buttonContainer.appendChild(closeButton);

        modal.appendChild(buttonContainer);

        const pre = document.createElement('pre');
        pre.textContent = json;
        modal.appendChild(pre);

        document.body.appendChild(modal);
    }

    // Add event listener to the button
    button.addEventListener('click', extractValues);
})();
