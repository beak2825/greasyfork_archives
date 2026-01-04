// ==UserScript==
// @name         BazaarWatcher
// @namespace    https://github.com/0xymandias
// @version      1.2
// @description  Display total number of items and their value in the bazaar on the events page when the bazaar is open and you're in Hospital. Click to see item details sorted by price.
// @author       smokey_ [2492729]
// @match        https://www.torn.com/page.php?sid=events
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/497155/BazaarWatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/497155/BazaarWatcher.meta.js
// ==/UserScript==

// Copyright © 2034 smokey_ [2492729] <relatii@sri.ro,>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

(function() {
    'use strict';

    // API Key and URLs
    const API_KEY = 'API_KEY_HERE';
    const BAZAAR_API_URL = `https://api.torn.com/user/?selections=bazaar&key=${API_KEY}`;
    const PROFILE_API_URL = `https://api.torn.com/user/?selections=profile&key=${API_KEY}&comment=SmokeysBazaarWatcher`;

    // Function to fetch profile data from API
    function fetchProfileData() {
        GM_xmlhttpRequest({
            method: "GET",
            url: PROFILE_API_URL,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.basicicons && data.basicicons.icon35) {
                        fetchBazaarData();
                    }
                } else {
                    console.error('Failed to fetch profile data');
                }
            }
        });
    }

    // Function to fetch bazaar data from API
    function fetchBazaarData() {
        GM_xmlhttpRequest({
            method: "GET",
            url: BAZAAR_API_URL,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    displayBazaarInfo(data.bazaar);
                } else {
                    console.error('Failed to fetch bazaar data');
                }
            }
        });
    }

    // Function to display bazaar info
    function displayBazaarInfo(bazaarItems) {
        let totalItems = 0;
        let totalValue = 0;

        bazaarItems.forEach(item => {
            totalItems += item.quantity;
            totalValue += item.price * item.quantity;
        });

        const infoText = `Total Items in Bazaar: ${totalItems}, Total Value: $${totalValue.toLocaleString()}`;

        // Create and style the info div
        const infoDiv = document.createElement('div');
        infoDiv.style.padding = '10px';
        infoDiv.style.backgroundColor = '#000';
        infoDiv.style.color = '#fff';
        infoDiv.style.marginBottom = '10px';
        infoDiv.style.fontSize = '16px';
        infoDiv.style.cursor = 'pointer';
        infoDiv.textContent = infoText;

        // Create a table to display item details
        const tableDiv = document.createElement('div');
        tableDiv.style.display = 'none';
        tableDiv.style.position = 'absolute';
        tableDiv.style.top = '100px'; // Adjusted to fit below Torn Header
        tableDiv.style.left = '50px'; // Adjusted to center it between window edge and navigation panel
        tableDiv.style.backgroundColor = '#000';
        tableDiv.style.color = '#fff';
        tableDiv.style.padding = '10px';
        tableDiv.style.maxHeight = '80vh';
        tableDiv.style.overflowY = 'auto';
        tableDiv.style.zIndex = '1000';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.color = '#fff';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background-color: #333;">
                <th style="border: 1px solid #555; padding: 8px;">Item Name</th>
                <th style="border: 1px solid #555; padding: 8px;">Quantity</th>
                <th style="border: 1px solid #555; padding: 8px;">Price</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        bazaarItems.sort((a, b) => b.price - a.price).forEach(item => {
            const row = document.createElement('tr');
            row.style.backgroundColor = '#222';
            row.innerHTML = `
                <td style="border: 1px solid #555; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #555; padding: 8px;">${item.quantity}</td>
                <td style="border: 1px solid #555; padding: 8px;">$${item.price.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        tableDiv.appendChild(table);

        // Toggle the display of the table on info div click
        infoDiv.addEventListener('click', () => {
            tableDiv.style.display = tableDiv.style.display === 'none' ? 'block' : 'none';
        });

        // Insert the info div and table div at the top of the page
        const container = document.querySelector('.titleContainer___QrlWP');
        if (container) {
            container.insertAdjacentElement('afterend', infoDiv);
            document.body.appendChild(tableDiv);
        } else {
            console.error('Container not found');
        }
    }

    // Add custom CSS to make the text white
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        body, td {
            color: #fff !important;
        }
    `;
    document.head.appendChild(style);

    // Wait for the page to load fully before executing the script
    window.addEventListener('load', fetchProfileData);
})();
