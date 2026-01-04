// ==UserScript==
// @name         Torn Item Value Finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show the market value of Torn items when the item name is entered
// @author       LOKaa [2834316]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/515195/Torn%20Item%20Value%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/515195/Torn%20Item%20Value%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = localStorage.getItem('torn_api_key') || '';

    // Create a floating menu
    const floatingMenu = document.createElement('div');
    floatingMenu.style.position = 'fixed';
    floatingMenu.style.top = '20px';
    floatingMenu.style.right = '20px';
    floatingMenu.style.backgroundColor = 'white';
    floatingMenu.style.padding = '20px';
    floatingMenu.style.border = '1px solid #ccc';
    floatingMenu.style.zIndex = '9999';

    // Create an input box for entering the item list
    const inputBox = document.createElement('input');
    inputBox.placeholder = 'Enter item list';
    inputBox.style.width = '250px';
    inputBox.style.fontSize = '16px';

    // Create a div to display the total value
    const totalValueDiv = document.createElement('div');
    totalValueDiv.style.marginTop = '10px';
    totalValueDiv.style.color = 'green';
    totalValueDiv.style.fontSize = '20px';

    // Create a container div for buttons with styling
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.marginTop = '10px';
    buttonContainer.style.border = '1px solid #ccc';
    buttonContainer.style.padding = '5px';

    // Create a clear button with border
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.style.border = '1px solid #ccc';
    clearButton.style.marginRight = '10px';
    clearButton.addEventListener('click', () => {
        inputBox.value = '';
        totalValueDiv.textContent = '';
    });

    // Create a button to enter API key with border
    const apiKeyButton = document.createElement('button');
    apiKeyButton.textContent = apiKey ? 'Edit API Key' : 'Enter API Key';
    apiKeyButton.style.border = '1px solid #ccc';
    apiKeyButton.addEventListener('click', () => {
        apiKey = prompt('Enter your Torn API Key:', apiKey);
        if (apiKey) {
            localStorage.setItem('torn_api_key', apiKey);
            apiKeyButton.textContent = 'Edit API Key';
            inputBox.value = '';
            totalValueDiv.textContent = '';
        }
    });

    // Append elements to the button container
    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(apiKeyButton);

    // Append elements to the floating menu
    floatingMenu.appendChild(inputBox);
    floatingMenu.appendChild(totalValueDiv);
    floatingMenu.appendChild(buttonContainer);

    // Append the floating menu to the body
    document.body.appendChild(floatingMenu);

    // Event listener for the input box
    inputBox.addEventListener('input', () => {
        const itemText = inputBox.value.trim();
        if (itemText === '') {
            totalValueDiv.textContent = '';
            return;
        }

        // Split the input text into items
        const items = itemText.split(', ');

        // Initialize the total value
        let totalValue = 0;

        // Function to find an item by name
        function findItemByName(itemData, itemName) {
            for (const key in itemData) {
                if (itemData.hasOwnProperty(key)) {
                    const item = itemData[key];
                    if (item.name.toLowerCase() === itemName.toLowerCase()) {
                        return item;
                    }
                }
            }
            return null;
        }

        // Create an array of promises for fetching item values
        const itemValuePromises = items.map((itemText) => {
            const [quantity, itemName] = itemText.split('x ').map(s => s.trim());
            const apiUrl = `https://api.torn.com/torn/?selections=items&key=${apiKey}`;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    onload: function(response) {
                        const itemData = JSON.parse(response.responseText).items;
                        const item = findItemByName(itemData, itemName);
                        if (item) {
                            const marketValue = item.market_value;
                            const itemTotalValue = quantity * marketValue;
                            totalValue += itemTotalValue;
                            resolve(itemTotalValue);
                        } else {
                            resolve(0);
                        }
                    },
                });
            });
        });

        // Calculate the total value when all promises resolve
        Promise.all(itemValuePromises).then((values) => {
            totalValueDiv.textContent = `Total Value: $${totalValue.toLocaleString()}`;
        });
    });
})();
