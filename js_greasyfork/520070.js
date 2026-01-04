// ==UserScript==
// @name         Torn Utilities with Stock Tracker and Bazaar Watcher
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Torn utilities with Stock Tracker, Bazaar Watcher, and a toggleable compact UI.
// @author       YourName
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520070/Torn%20Utilities%20with%20Stock%20Tracker%20and%20Bazaar%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/520070/Torn%20Utilities%20with%20Stock%20Tracker%20and%20Bazaar%20Watcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ** CSS for Compact and Full UI ** //
    const styles = `
        #utility-overlay {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            border: 1px solid #555;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            padding: 10px;
            box-sizing: border-box;
            transition: width 0.3s, height 0.3s, opacity 0.3s;
        }
        #utility-overlay.minimized {
            display: none;
        }
        #minimized-ui-button {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border: 1px solid #555;
            border-radius: 8px;
            z-index: 9999;
            font-size: 20px;
            text-align: center;
            line-height: 36px;
            cursor: pointer;
        }
        #minimized-ui-button:hover {
            background-color: rgba(50, 50, 50, 0.9);
        }
        .section {
            margin-bottom: 10px;
            padding: 10px;
            background: #222;
            border-radius: 5px;
        }
        .section h3 {
            margin: 0 0 10px 0;
            color: #00ffff;
        }
        button {
            background-color: #444;
            color: white;
            border: none;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
        }
        button:hover {
            background-color: #666;
        }
        .result-container {
            max-height: 200px;
            overflow-y: auto;
            background: #333;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .result-container p {
            margin: 5px 0;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // ** Add UI Overlay Container ** //
    const overlay = document.createElement('div');
    overlay.id = 'utility-overlay';
    overlay.innerHTML = `
        <button id="toggle-ui-button">Minimize</button>

        <!-- Stock Tracker -->
        <div class="section" id="stock-tracker-section">
            <h3>Stock Tracker</h3>
            <div id="stocks-result" class="result-container">Loading stocks...</div>
        </div>

        <!-- Bazaar Watcher -->
        <div class="section" id="bazaar-watcher-section">
            <h3>Bazaar Watcher</h3>
            <div id="bazaar-items-result" class="result-container"></div>
            <div class="input-container">
                <input type="text" id="item-id" placeholder="Item ID">
                <input type="number" id="min-price" placeholder="Min Price">
                <input type="number" id="max-price" placeholder="Max Price">
                <button id="add-bazaar-item">Add Item</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Add Minimized Button
    const minimizedButton = document.createElement('div');
    minimizedButton.id = 'minimized-ui-button';
    minimizedButton.textContent = '+';
    document.body.appendChild(minimizedButton);

    // ** Toggle UI Logic ** //
    const overlayElement = document.getElementById('utility-overlay');
    minimizedButton.addEventListener('click', () => {
        overlayElement.classList.remove('minimized');
        minimizedButton.style.display = 'none';
    });

    document.getElementById('toggle-ui-button').addEventListener('click', () => {
        overlayElement.classList.add('minimized');
        minimizedButton.style.display = 'block';
    });

    // ** Torn API Key Placeholder (Replace with your key) ** //
    const API_KEY = 'YOUR_API_KEY'; // Replace with your Torn API Key

    // ** Bazaar Watcher Variables ** //
    let bazaarItems = JSON.parse(localStorage.getItem('bazaarItems')) || [];
    const bazaarAPI = 'https://tornpal.com/api/v1/markets/clist';

    // ** Save Bazaar Items to Local Storage ** //
    function saveBazaarItems() {
        localStorage.setItem('bazaarItems', JSON.stringify(bazaarItems));
    }

    // ** Render Bazaar Items in UI ** //
    function renderBazaarItems() {
        const resultContainer = document.getElementById('bazaar-items-result');
        resultContainer.innerHTML = bazaarItems.length
            ? bazaarItems
                  .map(
                      (item) =>
                          `<p>${item.name || 'Item'} (ID: ${item.id}) - Min: $${item.min_price}, Max: $${item.max_price}</p>`
                  )
                  .join('')
            : '<p>No items being watched. Add one above!</p>';
    }

    // ** Add Item to Bazaar Watcher ** //
    document.getElementById('add-bazaar-item').onclick = () => {
        const id = document.getElementById('item-id').value.trim();
        const minPrice = parseFloat(document.getElementById('min-price').value.trim());
        const maxPrice = parseFloat(document.getElementById('max-price').value.trim());

        if (!id || isNaN(minPrice) || isNaN(maxPrice)) {
            alert('Please provide valid inputs.');
            return;
        }

        bazaarItems.push({ id, min_price: minPrice, max_price: maxPrice });
        saveBazaarItems();
        renderBazaarItems();
        alert(`Item with ID ${id} added to watcher.`);
    };

    // ** Fetch Bazaar Data for Items ** //
    async function fetchBazaarData() {
        const notifications = [];
        for (const item of bazaarItems) {
            try {
                const response = await fetch(`${bazaarAPI}/${item.id}`);
                const data = await response.json();
                const listings = data.listings || [];

                const cheapest = listings.reduce((min, curr) => (curr.price < min.price ? curr : min), {
                    price: Infinity,
                });

                if (cheapest.price < item.min_price) {
                    notifications.push(
                        `BUY ALERT: Item ID ${item.id} is available for $${cheapest.price} (Below $${item.min_price})`
                    );
                } else if (cheapest.price > item.max_price) {
                    notifications.push(
                        `SELL ALERT: Item ID ${item.id} is listed for $${cheapest.price} (Above $${item.max_price})`
                    );
                }
            } catch (error) {
                console.error(`Error fetching bazaar data for Item ID ${item.id}:`, error);
            }
        }

        const resultContainer = document.getElementById('bazaar-items-result');
        if (notifications.length) {
            resultContainer.innerHTML += notifications
                .map((message) => `<div class="notification">${message}</div>`)
                .join('');
        }
    }

    // ** Stock Tracker Logic ** //
    async function fetchStocks() {
        const resultContainer = document.getElementById('stocks-result');
        resultContainer.innerHTML = 'Fetching stock data...';

        try {
            const response = await fetch(`https://api.torn.com/user/?selections=stocks&key=${API_KEY}`);
            const data = await response.json();

            if (data.error) throw new Error(data.error.error);

            if (data.stocks) {
                const stockInfo = Object.values(data.stocks).map(
                    (stock) =>
                        `<p>${stock.name}: ${stock.held_shares.toLocaleString()} shares worth $${stock.total_worth.toLocaleString()}</p>`
                );
                resultContainer.innerHTML = stockInfo.join('');
            } else {
                resultContainer.innerHTML = '<p>No stock data available.</p>';
            }
        } catch (error) {
            console.error('Error fetching stocks:', error);
            resultContainer.innerHTML = `<p>Error fetching stocks: ${error.message}</p>`;
        }
    }

    // ** Auto-Refresh Logic ** //
    function startAutoRefresh() {
        renderBazaarItems();
        fetchStocks();
        fetchBazaarData();

        setInterval(() => {
            fetchStocks();
            fetchBazaarData();
        }, 30000);
    }

    // ** Start Script ** //
    startAutoRefresh();
})();