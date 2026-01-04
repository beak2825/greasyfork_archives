// ==UserScript==
// @name         Torn Bazaar Searcher with Price Alerts, and Persistence.
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Search Torn bazaar with price alerts and data persistence.
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/item.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @license      GPU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/507387/Torn%20Bazaar%20Searcher%20with%20Price%20Alerts%2C%20and%20Persistence.user.js
// @updateURL https://update.greasyfork.org/scripts/507387/Torn%20Bazaar%20Searcher%20with%20Price%20Alerts%2C%20and%20Persistence.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const savedApiKey = localStorage.getItem('apiKey');
    let API_KEY = savedApiKey || prompt('Please enter your Torn API key:');
    if (!savedApiKey && API_KEY) {
        localStorage.setItem('apiKey', API_KEY);
    }
    const API_ITEMS_URL = `https://api.torn.com/torn/?selections=items&key=${API_KEY}`;
    let allItems = [];
    let itemId = null;
    let bazaarLimit = localStorage.getItem('bazaarLimit') || null;
    let intervalId = null;
    let isMinimized = localStorage.getItem('isMinimized') === 'true';
    let savedItems = JSON.parse(localStorage.getItem('allItems')) || null;
    let searchBox = document.createElement('div');
    searchBox.id = 'searchBox';
    searchBox.style.position = 'fixed';
    searchBox.style.top = '10px';
    searchBox.style.right = '10px';
    searchBox.style.width = '300px';
    searchBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    searchBox.style.color = 'white';
    searchBox.style.padding = '10px';
    searchBox.style.zIndex = '10000';
    searchBox.style.border = '2px solid white';
    searchBox.innerHTML = `
        <button id="minimizeButton" style="padding: 2px 5px; background-color: #4CAF50; color: white; font-weight: bold; border: none; cursor: pointer; width: 100%;">${isMinimized ? '+' : '-'}</button>
        <div id="header" style="cursor: move; background-color: rgba(0, 0, 0, 0.8); padding: 5px;"></div>
        <div id="content" style="display: ${isMinimized ? 'none' : 'block'};">
            <h3>Bazaar Search</h3>
            <input type="text" id="itemInput" placeholder="Enter item name" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <ul id="suggestionList" style="list-style-type: none; padding: 0; max-height: 100px; overflow-y: auto;"></ul>
            <input type="number" id="bazaarCostLimit" placeholder="Bazaar Cost Limit" value="${bazaarLimit || ''}" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <button id="searchButton" style="width: 100%; padding: 10px; background-color: #4CAF50; color: white; font-weight: bold; border: none; cursor: pointer; margin-top: 10px;">Search</button>
            <div id="resultsBox" style="margin-top: 10px; max-height: 400px; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(searchBox);
    function fetchAllItems() {
        if (savedItems) {
            allItems = savedItems;
        } else {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API_ITEMS_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        let data = JSON.parse(response.responseText);
                        allItems = Object.keys(data.items).map(itemId => ({
                            id: itemId,
                            name: data.items[itemId].name
                        }));
                        localStorage.setItem('allItems', JSON.stringify(allItems));
                    }
                }
            });
        }
    }
    function showSuggestions(input) {
        const suggestionList = document.getElementById('suggestionList');
        suggestionList.innerHTML = '';
        const matches = allItems.filter(item => item.name.toLowerCase().includes(input.toLowerCase()));
        matches.slice(0, 10).forEach(match => {
            const li = document.createElement('li');
            li.style.cursor = 'pointer';
            li.style.padding = '5px';
            li.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            li.style.marginBottom = '5px';
            li.textContent = match.name;
            li.onclick = function() {
                document.getElementById('itemInput').value = match.name;
                document.getElementById('suggestionList').innerHTML = '';
            };
            suggestionList.appendChild(li);
        });
    }
    function getItemIDByName(itemName) {
        const item = allItems.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        return item ? item.id : null;
    }
    function fetchBazaarPrices(itemId) {
        const API_BAZAAR_URL = `https://api.torn.com/market/${itemId}?selections=bazaar&key=${API_KEY}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_BAZAAR_URL,
            onload: function(response) {
                if (response.status === 200) {
                    let data = JSON.parse(response.responseText);
                    let itemBazaar = data.bazaar;
                    displayBazaarResults(itemBazaar);
                }
            }
        });
    }
    function displayBazaarResults(itemBazaar) {
        let resultsBox = document.getElementById('resultsBox');
        resultsBox.innerHTML = '';
        if (itemBazaar && itemBazaar.length > 0) {
            itemBazaar.sort((a, b) => a.cost - b.cost);
            for (let item of itemBazaar) {
                const itemName = document.getElementById('itemInput').value;
                const itemMarketLink = `https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=${encodeURIComponent(itemName)}`;
                resultsBox.innerHTML += `
                    <div style="border-bottom: 1px solid #ccc; padding: 10px;">
                        <p><strong>Price:</strong> $${item.cost} - <strong>Quantity:</strong> ${item.quantity}</p>
                        <a href="${itemMarketLink}" target="_blank" style="text-decoration: none;">
                            <button style="padding: 5px 10px; background-color: #007BFF; color: white; border: none; cursor: pointer;">Go to Item Market</button>
                        </a>
                    </div>
                `;
                if (bazaarLimit && item.cost <= bazaarLimit) {
                    notifyUser(item.cost);
                }
            }
        } else {
            resultsBox.innerHTML = 'No items found in the bazaar.';
        }
    }
    function notifyUser(price) {
        GM_notification({
            title: 'Price Alert!',
            text: `Item found at $${price} or below.`,
            timeout: 5000
        });
        let audio = new Audio('https://www.myinstants.com/media/sounds/bell.mp3');
        audio.play();
    }
    document.getElementById('itemInput').addEventListener('input', function() {
        const input = document.getElementById('itemInput').value;
        if (input.length > 1) {
            showSuggestions(input);
        }
    });
    document.getElementById('bazaarCostLimit').addEventListener('input', function() {
        bazaarLimit = parseFloat(document.getElementById('bazaarCostLimit').value);
        localStorage.setItem('bazaarLimit', bazaarLimit);
    });
    document.getElementById('searchButton').addEventListener('click', function() {
        let itemName = document.getElementById('itemInput').value;
        itemId = getItemIDByName(itemName);
        if (itemId) {
            fetchBazaarPrices(itemId);
            clearInterval(intervalId);
            intervalId = setInterval(() => fetchBazaarPrices(itemId), 30000);
        } else {
            document.getElementById('resultsBox').innerText = 'Item not found.';
        }
    });
    document.getElementById('minimizeButton').addEventListener('click', function() {
        if (isMinimized) {
            document.getElementById('content').style.display = 'block';
            document.getElementById('minimizeButton').innerText = '-';
            localStorage.setItem('isMinimized', 'false');
            isMinimized = false;
        } else {
            document.getElementById('content').style.display = 'none';
            document.getElementById('minimizeButton').innerText = '+';
            localStorage.setItem('isMinimized', 'true');
            isMinimized = true;
        }
    });
    const header = document.getElementById('header');
    header.onmousedown = function(event) {
                let shiftX = event.clientX - searchBox.getBoundingClientRect().left;
        let shiftY = event.clientY - searchBox.getBoundingClientRect().top;
        document.body.append(searchBox);
        moveAt(event.pageX, event.pageY);
        function moveAt(pageX, pageY) {
            searchBox.style.left = pageX - shiftX + 'px';
            searchBox.style.top = pageY - shiftY + 'px';
        }
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);
        header.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            header.onmouseup = null;
        };
    };
    header.ondragstart = function() {
        return false;
    };
    fetchAllItems();
})();
