// ==UserScript==
// @name         Torn Item List Fetcher
// @namespace    heartflower.torn.com
// @version      1.1
// @description  Fetches item quantities on Torn and displays them on Flipping Time
// @author       Heartflower
// @match        https://www.torn.com/item.php
// @match        http://xaert.local/flipping-time/
// @icon         https://i.ibb.co/L5dpQPS/hf-favicon.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/489241/Torn%20Item%20List%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/489241/Torn%20Item%20List%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Running');

    let ITEMS = {}

    let storedItems = GM_getValue('item-qty');
    if (storedItems) {
        console.log('Stored item IDs found');
        ITEMS = JSON.parse(storedItems);
    }


    function fetchItemQty() {
        console.log('Fetching item qty');
        let contentWrapper = document.body.querySelector('.content-wrapper');

        if (!contentWrapper) {
            setTimeout(fetchItemQty, 100);
            return;
        }

        let thumbnailWraps = contentWrapper.querySelectorAll('.thumbnail-wrap');

        if(!thumbnailWraps || thumbnailWraps.length === 0) {
            setTimeout(fetchItemQty, 100);
            return;
        }

        thumbnailWraps.forEach(element => {
            let li = element.parentNode;
            let itemID = li.getAttribute('data-item');
            let category = li.getAttribute('data-category');
            let name = element.getAttribute('aria-label');
            let qty = li.getAttribute('data-qty');
            let timestamp = new Date()

            console.log(`Name: ${name}, quantity: ${qty}`);

            let itemDetails = {
                id: itemID,
                name: name,
                type: category,
                quantity: qty,
                timestamp: timestamp
            }

            ITEMS[itemID] = itemDetails;
            GM_setValue('item-qty', JSON.stringify(ITEMS));
        });

        deleteOldItemDetails();
    }

    function deleteOldItemDetails() {
        let currentTime = new Date();
        let yesterday = new Date().setHours(new Date().getHours() - 24);

        for (let key in ITEMS) {
            let timestamp = new Date(ITEMS[key].timestamp).getTime(); // Convert timestamp to milliseconds

            if (timestamp < yesterday) {
                delete ITEMS[key];
            }
        }

        GM_setValue('item-qty', JSON.stringify(ITEMS));
    }

    function placeItemQty() {
        let storedItems = GM_getValue('item-qty');
        if (storedItems) {
            console.log('Stored item IDs found');
            ITEMS = JSON.parse(storedItems);
        }

        console.log(storedItems);

        console.log('Placing item qty');
        let tableBody = document.getElementById('settings-table-body');

        if (!tableBody) {
            setTimeout(placeItemQty, 100);
            return;
        }

        let tableRows = tableBody.querySelectorAll('.table-row');

        tableRows.forEach(row => {
            let itemIdElement = row.querySelector('.item-id');

            if (!itemIdElement) {
                return;
            }

            let itemID = parseInt(itemIdElement.querySelector('.item-id-label').textContent);
            let qtyCell = row.querySelector('.inventory');

            let item = ITEMS[itemID];
            if (item) {
                let qty = parseInt(item.quantity).toLocaleString('en-US');

                qtyCell.textContent = qty;
            }

        });

        highlightSettingsRows();
    }

    // Add a refresh inventory button
    function addRefreshInventoryButton() {
        console.log('Adding refresh inventory button');
        let robotSettings = document.body.querySelector('.robot-settings');
        let lastChild = robotSettings.lastElementChild;

        let div = document.createElement('div');
        let button = document.createElement('button');

        div.className = 'refresh-inventory-div';
        button.className = 'refresh-inventory-button';
        button.onclick = placeItemQty;
        button.textContent = 'Refresh Inventory';

        div.appendChild(button);
        robotSettings.insertBefore(div, lastChild);

    }

    // Function to run fetchItemQty() on click
    function handleClick(event) {
        console.log('click');
        fetchItemQty();
    }


    if (window.location.href === "https://www.torn.com/item.php") {
        fetchItemQty();

        // Attach click event listener to document body
        document.body.addEventListener('click', handleClick);
    } else if (window.location.href === "http://localhost:8888/Flipping%20Time/" || window.location.href === 'http://xaert.local/flipping-time/' || window.location.href === 'http://192.168.0.108/flipping-time/') {
        placeItemQty();
        addRefreshInventoryButton();
    }

})();