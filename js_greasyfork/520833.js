// ==UserScript==
// @name         Torn Dual Item Market Tables - Bonuses Included
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Display your item market listings and public listings with bonuses for the same item in Torn
// @author       You
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520833/Torn%20Dual%20Item%20Market%20Tables%20-%20Bonuses%20Included.user.js
// @updateURL https://update.greasyfork.org/scripts/520833/Torn%20Dual%20Item%20Market%20Tables%20-%20Bonuses%20Included.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const YOUR_API_KEY = 'FULL ACCES API KEY HERE';
    const PUBLIC_API_KEY = 'PUBLIC API KEY HERE';

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            return response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };

    const createContainer = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '80px';
        container.style.right = '20px';
        container.style.width = '400px';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';
        container.style.backgroundColor = '#1e1e1e';
        container.style.border = '1px solid #444';
        container.style.borderRadius = '8px';
        container.style.padding = '10px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        container.style.zIndex = '1000';
        container.style.color = '#fff';
        return container;
    };

    const createTable = (title, headers, rows) => {
        const tableContainer = document.createElement('div');
        tableContainer.style.marginBottom = '20px';

        const tableTitle = document.createElement('h3');
        tableTitle.textContent = title;
        tableTitle.style.textAlign = 'center';
        tableTitle.style.color = '#fff';
        tableContainer.appendChild(tableTitle);

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.color = '#fff';

        // Add headers
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.padding = '8px';
            th.style.borderBottom = '2px solid #444';
            th.style.backgroundColor = '#333';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Add rows
        rows.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(data => {
                const td = document.createElement('td');
                td.textContent = data;
                td.style.padding = '8px';
                td.style.borderBottom = '1px solid #444';
                td.style.backgroundColor = '#2a2a2a';
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        tableContainer.appendChild(table);
        return tableContainer;
    };

    const buildTables = async () => {
        const container = createContainer();

        // Fetch data for the top table (your listings)
        const yourListingsUrl = `https://api.torn.com/v2/user/itemmarket?key=${YOUR_API_KEY}&offset=0`;
        const yourData = await fetchData(yourListingsUrl);

        let itemID = null;
        let itemRarity = null;
        let itemBonusName = null;
        let itemPrice = null;
        let itemUID = null;  // Store the UID of your item
        let topTableRows = [];

        if (yourData && yourData.itemmarket) {
            topTableRows = yourData.itemmarket.map(item => {
                itemID = item.item.id; // Save the item ID for second API call
                itemRarity = item.item.rarity; // Save the rarity for filtering
                itemBonusName = item.item.bonuses?.[0]?.title || 'N/A'; // Save the bonus title for filtering
                itemPrice = item.price; // Save your item price for comparison
                itemUID = item.item.uid; // Save your item UID
                const bonus = item.item.bonuses?.[0] || { title: 'N/A', description: 'N/A' };
                const damage = item.item.stats?.damage || 'N/A'; // Safe check for damage
                const accuracy = item.item.stats?.accuracy || 'N/A'; // Safe check for accuracy
                return [
                    item.item.name,
                    `$${item.price.toLocaleString()}`,
                    `Damage: ${damage}`,
                    `Accuracy: ${accuracy}`,
                    bonus.title,
                    bonus.description.match(/\d+%/)?.[0] || 'N/A', // Extract percentage
                ];
            });
        }

        const topTable = createTable(
            "Your Item Market Listings",
            ['Item', 'Price', 'Damage', 'Accuracy', 'Bonus', 'Percentage'],
            topTableRows
        );
        container.appendChild(topTable);

        // Fetch data for the bottom table (public listings)
        if (itemID && itemBonusName !== 'N/A') {
            // Dynamically use bonus name in the API URL
            const publicListingsUrl = `https://api.torn.com/v2/market/${itemID}/itemmarket?key=${PUBLIC_API_KEY}&bonus=${encodeURIComponent(itemBonusName)}&offset=0`;
            const publicData = await fetchData(publicListingsUrl);

            let bottomTableRows = [];
            if (publicData && publicData.itemmarket && publicData.itemmarket.listings) {
                // Filter public listings based on rarity, bonus name, and price
                bottomTableRows = publicData.itemmarket.listings.filter(listing => {
                    // Check if the rarity, bonus, and price match
                    const bonus = listing.itemDetails.bonuses?.[0] || { title: 'N/A' };
                    const isRarityMatch = listing.itemDetails.rarity === itemRarity;
                    const isBonusMatch = bonus.title === itemBonusName;
                    const isPriceLowerOrEqual = listing.price <= itemPrice; // Only include if price is not higher than your item
                    return isRarityMatch && isBonusMatch && isPriceLowerOrEqual;
                }).map(listing => {
                    const bonus = listing.itemDetails.bonuses?.[0] || { title: 'N/A', description: 'N/A' };
                    const damage = listing.itemDetails.stats?.damage || 'N/A'; // Safe check for damage
                    const accuracy = listing.itemDetails.stats?.accuracy || 'N/A'; // Safe check for accuracy
                    return {
                        uid: listing.itemDetails.uid,  // Store the UID of the item
                        price: listing.price,
                        details: [
                            `$${listing.price.toLocaleString()}`,
                            `Damage: ${damage}`,
                            `Accuracy: ${accuracy}`,
                            bonus.title,
                            bonus.description.match(/\d+%/)?.[0] || 'N/A', // Extract percentage
                        ]
                    };
                });
            }

            // Sort the bottom table listings by price, descending
            bottomTableRows.sort((a, b) => b.price - a.price);

            // Check if the highest-priced item matches your item UID
            if (bottomTableRows.length > 0 && bottomTableRows[0].uid === itemUID) {
                // Remove the highest-priced item from the bottom table
                bottomTableRows.shift(); // Remove the first item in the array
            }

            // Create and display the bottom table if there are any listings
            if (bottomTableRows.length > 0) {
                const bottomTable = createTable(
                    "Public Market Listings for the Same Item",
                    ['Price', 'Damage', 'Accuracy', 'Bonus', 'Percentage'],
                    bottomTableRows.map(row => row.details)  // Extract details for table rows
                );
                container.appendChild(bottomTable);
            } else {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.textContent = "No public listings match the rarity, bonus, or price of your item.";
                noResultsMessage.style.color = '#fff';
                container.appendChild(noResultsMessage);
            }
        } else {
            console.warn("No valid item ID or bonus found in your market listings.");
        }

        document.body.appendChild(container);
    };

    // Run the script when the page loads
    window.addEventListener('load', buildTables);
})();
