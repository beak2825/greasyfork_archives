// ==UserScript==
// @name         Torn Stocks Info
// @namespace    Pampas
// @version      1.6
// @description  Fetch Torn stocks information using API and display adjusted profit/loss percentage as a list on the stocks page with manual and automatic refresh
// @author       You
// @match        https://www.torn.com/page.php?sid=stocks
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487427/Torn%20Stocks%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/487427/Torn%20Stocks%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to prompt the user for their API key
    function promptForApiKey() {
        const apiKey = prompt('Please enter your Torn API key:');
        if (apiKey) {
            GM_setValue('tornApiKey', apiKey);
        } else {
            alert('Invalid API key. Please refresh the page and try again.');
        }
    }

    // Function to calculate adjusted profit/loss percentage considering the sale fee
    function calculateAdjustedPercentage(boughtPrice, currentPrice) {
        const rawPercentage = ((currentPrice - boughtPrice) / boughtPrice) * 100;
        const adjustedPercentage = (rawPercentage - 0.1).toFixed(2);
        return adjustedPercentage;
    }

    // Function to create and update the list container
    function createListContainer() {
        const listContainer = document.createElement('div');
        listContainer.id = 'tornStockList';
        listContainer.style.position = 'fixed';
        listContainer.style.padding = '10px';
        listContainer.style.background = 'rgba(0, 0, 0, 0.8)';
        listContainer.style.color = 'white';
        listContainer.style.borderRadius = '5px';
        listContainer.style.bottom = '50%'; // Adjusted position to the middle right
        listContainer.style.right = '5px'; // Adjusted position to the middle right
        listContainer.style.zIndex = '1000';

        document.body.appendChild(listContainer);

        return listContainer;
    }

    // Function to update the list container with stock information
    function updateListContainer(listContainer, stockInfo) {
        // Clear the content of the list container before updating
        listContainer.innerHTML = '';

        for (const stockId in stockInfo) {
            const stockData = stockInfo[stockId];

            const listItem = document.createElement('div');
            listItem.textContent = `${stockData.name}: ${stockData.adjustedProfitLossPercentage}%`;
            listItem.style.marginBottom = '5px';

            if (stockData.adjustedProfitLossPercentage < 0) {
                listItem.style.color = 'red';
            } else {
                listItem.style.color = 'green';
            }

            listContainer.appendChild(listItem);
        }

        // Add a manual refresh button
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh';
        refreshButton.style.marginTop = '5px';
        refreshButton.style.color = 'white';
        refreshButton.style.background = 'black'; // Set the background color
        refreshButton.style.border = '1px solid white'; // Add a border
        refreshButton.addEventListener('click', fetchAndUpdateStockInfo);
        listContainer.appendChild(refreshButton);
    }

    // Function to get the stored API key or prompt the user for a new one
    function getApiKey() {
        let apiKey = GM_getValue('tornApiKey');
        if (!apiKey) {
            promptForApiKey();
            apiKey = GM_getValue('tornApiKey');
        }
        return apiKey;
    }

    // Function to fetch and update stock information
    function fetchAndUpdateStockInfo() {
        const apiUrl = `https://api.torn.com/user/?selections=stocks&key=${getApiKey()}`;
        const stockInfo = GM_getValue('tornStockInfo', {});

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const stockData = JSON.parse(response.responseText).stocks;

                // Extract stock ID and bought price
                for (const stockId in stockData) {
                    const boughtPrice = stockData[stockId].transactions[Object.keys(stockData[stockId].transactions)[0]].bought_price;

                    // URL for the second API request to get detailed stock information
                    const secondApiUrl = `https://api.torn.com/torn/?selections=stocks&key=${getApiKey()}&stock_id=${stockId}&bought_price=${boughtPrice}`;

                    // Make the second API request
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: secondApiUrl,
                        onload: function(secondResponse) {
                            const detailedStockInfo = JSON.parse(secondResponse.responseText);

                            // Calculate adjusted profit/loss percentage considering the sale fee
                            const currentPrice = detailedStockInfo.stocks[stockId].current_price;
                            const adjustedProfitLossPercentage = calculateAdjustedPercentage(boughtPrice, currentPrice);

                            // Update stock information
                            stockInfo[stockId] = {
                                name: detailedStockInfo.stocks[stockId].name,
                                adjustedProfitLossPercentage: adjustedProfitLossPercentage
                            };

                            // Update the list container with stock information
                            updateListContainer(listContainer, stockInfo);

                            // Store updated stock information
                            GM_setValue('tornStockInfo', stockInfo);
                        },
                        onerror: function(error) {
                            console.error('Error making second API request:', error);
                        }
                    });
                }

                // Remove stocks that are not present in the current API response
                for (const storedStockId in stockInfo) {
                    if (!stockData[storedStockId]) {
                        delete stockInfo[storedStockId];
                    }
                }

                // Update the list container with stock information
                updateListContainer(listContainer, stockInfo);

                // Store updated stock information
                GM_setValue('tornStockInfo', stockInfo);
            },
            onerror: function(error) {
                console.error('Error making API request:', error);
            }
        });
    }

    // Create or get the list container
    let listContainer = document.getElementById('tornStockList');
    if (!listContainer) {
        listContainer = createListContainer();
    }

    // Initial fetch on page load
    fetchAndUpdateStockInfo();

    // Automatic refresh every 30 seconds
    setInterval(fetchAndUpdateStockInfo, 30000); // 30000 milliseconds = 30 seconds
})();
