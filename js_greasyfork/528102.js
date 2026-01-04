// ==UserScript==
// @name         Torn Stocks Info
// @namespace    Pampas
// @version      2.2
// @description  Show each Torn stock transaction separately with profit/loss and filtering, sorted by current value descending.
// @author       Pampas
// @match        https://www.torn.com/page.php?sid=stocks*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528102/Torn%20Stocks%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/528102/Torn%20Stocks%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const transactionElements = {}; // Cache DOM elements for smooth updating

    function promptForApiKey() {
        const apiKey = prompt('Please enter your Torn API key:');
        if (apiKey) {
            GM_setValue('tornApiKey', apiKey);
        } else {
            alert('Invalid API key. Please refresh the page and try again.');
        }
    }

    function calculateAdjustedPercentage(boughtPrice, currentPrice) {
        const rawPercentage = ((currentPrice - boughtPrice) / boughtPrice) * 100;
        return (rawPercentage - 0.1).toFixed(2);
    }

    function formatNumber(value) {
        if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
        if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
        return value.toFixed(2);
    }

    function createListContainer() {
        const listContainer = document.createElement('div');
        listContainer.id = 'tornStockList';
        listContainer.style.position = 'fixed';
        listContainer.style.padding = '10px';
        listContainer.style.background = '#242424';
        listContainer.style.color = 'white';
        listContainer.style.borderRadius = '5px';
        listContainer.style.bottom = '45%';
        listContainer.style.right = '5px';
        listContainer.style.zIndex = '1000';
        document.body.appendChild(listContainer);
        return listContainer;
    }

    function updateListContainer(listContainer, transactions, showAll = false) {
        listContainer.innerHTML = '';

        const sortedTransactions = Object.entries(transactions)
            .filter(([transId, transData]) => showAll || !GM_getValue(`hideTransaction_${transId}`, false))
            .sort(([, a], [, b]) => b.totalValue - a.totalValue);

        sortedTransactions.forEach(([transId, transData]) => {
            const listItem = document.createElement('div');
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.marginBottom = '5px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '10px';
            checkbox.checked = !GM_getValue(`hideTransaction_${transId}`, false);
            checkbox.addEventListener('change', () => {
                GM_setValue(`hideTransaction_${transId}`, !checkbox.checked);
                updateListContainer(listContainer, transactions);
            });

            const stockText = document.createElement('div');
            stockText.textContent = `${transData.name}: ${transData.adjustedProfitLossPercentage}% (${formatNumber(transData.totalCost)})`;
            stockText.style.color = transData.adjustedProfitLossPercentage < 0 ? '#ff6b6b' : '#74b816';

            listItem.appendChild(checkbox);
            listItem.appendChild(stockText);
            listContainer.appendChild(listItem);

            // Cache elements for smooth updates
            transactionElements[transId] = {
                stockText,
                transData
            };
        });

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh';
        refreshButton.className = 'torn-btn';
        refreshButton.addEventListener('click', fetchAndUpdateStockInfo);
        listContainer.appendChild(refreshButton);

        const redoButton = document.createElement('button');
        redoButton.textContent = 'Redo';
        redoButton.className = 'torn-btn';
        redoButton.style.marginLeft = '5px';
        redoButton.addEventListener('click', () => {
            Object.keys(transactions).forEach(transId => {
                GM_setValue(`hideTransaction_${transId}`, false);
            });
            updateListContainer(listContainer, transactions, true);
        });
        listContainer.appendChild(redoButton);
    }

    function getApiKey() {
        let apiKey = GM_getValue('tornApiKey');
        if (!apiKey) {
            promptForApiKey();
            apiKey = GM_getValue('tornApiKey');
        }
        return apiKey;
    }

    function fetchAndUpdateStockInfo() {
        const apiUrl = `https://api.torn.com/user/?selections=stocks&key=${getApiKey()}`;
        const transactions = {};

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const stockData = JSON.parse(response.responseText).stocks;

                const secondApiUrl = `https://api.torn.com/torn/?selections=stocks&key=${getApiKey()}`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: secondApiUrl,
                    onload: function(secondResponse) {
                        const stockInfo = JSON.parse(secondResponse.responseText).stocks;

                        Object.entries(stockData).forEach(([stockId, stock]) => {
                            const currentPrice = stockInfo[stockId].current_price;
                            const stockName = stockInfo[stockId].name;

                            Object.entries(stock.transactions).forEach(([transId, trans]) => {
                                const adjustedProfitLossPercentage = calculateAdjustedPercentage(trans.bought_price, currentPrice);
                                const totalCost = trans.shares * trans.bought_price;
                                const totalValue = trans.shares * currentPrice;

                                transactions[transId] = {
                                    name: stockName,
                                    adjustedProfitLossPercentage,
                                    totalCost,
                                    totalValue,
                                    shares: trans.shares,
                                    boughtPrice: trans.bought_price,
                                    stockId
                                };
                            });
                        });

                        updateListContainer(listContainer, transactions);
                        GM_setValue('tornTransactions', transactions);
                    }
                });
            },
            onerror: error => console.error('Error making API request:', error)
        });
    }

    function updatePrices() {
        const apiUrl = `https://api.torn.com/torn/?selections=stocks&key=${getApiKey()}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const stockInfo = JSON.parse(response.responseText).stocks;
                Object.values(transactionElements).forEach(({ stockText, transData }) => {
                    const currentPrice = stockInfo[transData.stockId].current_price;
                    const newPercentage = calculateAdjustedPercentage(transData.boughtPrice, currentPrice);
                    transData.adjustedProfitLossPercentage = newPercentage;
                    transData.totalValue = currentPrice * transData.shares;

                    stockText.textContent = `${transData.name}: ${newPercentage}% (${formatNumber(transData.totalCost)})`;
                    stockText.style.color = newPercentage < 0 ? '#ff6b6b' : '#74b816';
                });
            },
            onerror: error => console.error('Error updating prices:', error)
        });
    }

    let listContainer = document.getElementById('tornStockList');
    if (!listContainer) {
        listContainer = createListContainer();
    }

    fetchAndUpdateStockInfo();
    setInterval(updatePrices, 30000);
})();
