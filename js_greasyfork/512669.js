// ==UserScript==
// @name         View Bazaar Anytime
// @namespace    heart.torn.com
// @version      1
// @description  View anyone's bazaar from hospital, jail, or traveling!
// @author       Heart [3034011]
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/512669/View%20Bazaar%20Anytime.user.js
// @updateURL https://update.greasyfork.org/scripts/512669/View%20Bazaar%20Anytime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let removeKeyLink = true;
    let maximumCalls = 40;
    let apiCallCount = 0;

    let itemIDs = [];
    let itemUIDs = [];
    let allItems = [];
    let fetchOffset = 0;

    let userName = '';
    let userID = '';

    let apiKey = '';
    let storedAPIKey = localStorage.getItem('hf-public-apiKey');

    if (storedAPIKey) {
        apiKey = storedAPIKey;
    }

    function checkElement() {
        let contentWrapper = document.querySelector('.content-wrapper');

        if (contentWrapper) {
            let messageContent = document.querySelector('.msg.right-round');
            let originalText = messageContent.textContent;

            if (messageContent && messageContent.textContent.includes('This area is unavailable')) {
                if (userName == '') {
                    userName = 'Unknown';
                }

                let newText = `${userName}'s bazaar is fetched by the "View Bazaar Anytime" script with the help of the API!`;
                messageContent.textContent = newText;

                if (apiKey !== '') {
                    fetchBazaarData();

                    if (removeKeyLink === true) {
                        let link = document.createElement('a');
                        link.href = '#'; // Set a placeholder href

                        link.textContent = ' Click here to remove your (public) API key!';

                        link.addEventListener('click', function(event) {
                            event.preventDefault();

                            localStorage.removeItem('hf-public-apiKey');
                            alert('API key successfully removed!');
                            link.remove();

                            let enterLink = document.createElement('a');
                            enterLink.href = '#'; // Set a placeholder href

                            enterLink.textContent = ' Click here to enter your (public) API key!';

                            enterLink.addEventListener('click', function(event) {
                                event.preventDefault();
                                promptAPIKey();
                                link.remove();
                            });

                            messageContent.appendChild(enterLink);
                        });

                        messageContent.appendChild(link);
                    }

                } else {
                    let link = document.createElement('a');
                    link.href = '#'; // Set a placeholder href
                    link.textContent = ' Click here to enter your (public) API key!';

                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        promptAPIKey();
                    });

                    messageContent.appendChild(link);
                }
            }
        }
    }

    function promptAPIKey() {
        let enterAPIKey = prompt('Enter a public API key here:');

        if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
            localStorage.setItem('hf-public-apiKey', enterAPIKey);
            alert('API key set successfully');

            fetchBazaarData();
        } else {
            alert('No valid API key entered!');
        }
    }

    function checkUserID() {
        let url = new URL(window.location.href);
        userID = url.searchParams.get('userId');

        let apiUrl = `https://api.torn.com/user/${userID}?key=${apiKey}&selections=basic&comment=ViewBazaarAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                userName = data.name;
                console.log(userName);
            })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function createTable(data) {
        let contentWrapper = document.querySelector('.content-wrapper');

        let tableDiv = document.createElement('div');
        tableDiv.style.paddingTop = '16px';

        let table = document.createElement('table');
        table.style.margin = '0 auto';
        table.style.background = 'var(--default-bg-panel-color)';
        table.style.width = '100%';

        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        tbody.style.borderRadius = '5px';

        // Create table headers
        let headers = ['Image', 'Name', 'Bonus', 'Damage', 'Accuracy', 'Price each', 'Stock'];
        let headerRow = document.createElement('tr');
        headers.forEach(function(header) {
            let th = document.createElement('th');
            th.style.padding = '4px';
            th.textContent = header;
            th.style.background = 'var(--tabs-active-bg-gradient)';
            th.style.color = 'var(--default-color)';
            th.style.fontWeight = 'bold';
            th.style.textAlign = 'center';
            th.style.padding = '8px 4px';
            th.style.borderBottom = '1px solid grey';
            th.style.borderBottomColor = 'var(--default-panel-divider-outer-side-color)';

            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        data.forEach(function(item, index) {
            let row = document.createElement('tr');
            row.style.borderBottom = '1px solid grey';
            row.style.borderBottomColor = 'var(--default-panel-divider-outer-side-color)';

            let itemID = item.ID;
            let itemUID = item.UID;
            let bonusText = '';
            let damage = 'N/A';
            let accuracy = 'N/A';

            if (itemUID) {
                itemUIDs.push({ uid: itemUID, index: index });
                bonusText = 'Loading...';
            }

            // Store itemID with index
            itemIDs.push({ id: itemID, index: index, price: item.price });

            createCell('Image', row, itemID);
            createCell(item.name, row);
            createCell(bonusText, row);
            createCell(damage, row);
            createCell(accuracy, row);
            createCell(item.price.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0}), row);
            createCell(item.quantity, row);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableDiv.appendChild(table);
        contentWrapper.appendChild(tableDiv);

        fetchMarketDataForItems();
        fetchItemDetailsForUIDs();
    }

    function createCell(text, row, itemID) {
        let cell = document.createElement('td');

        if (text == 'Image') {
            let img = document.createElement('img');
            img.src = `/images/items/${itemID}/large.png`;
            img.srcset = `/images/items/${itemID}/large.png 1x, /images/items/${itemID}/large@2x.png 2x, /images/items/${itemID}/large@3x.png 3x, /images/items/${itemID}/large@4x.png 4x`;
            img.alt = 'Item Image';
            img.style.height = '25px';
            cell.appendChild(img);
        } else {
            cell.textContent = text;
        }

        cell.style.color = 'var(--default-color)';
        cell.style.textAlign = 'center';
        cell.style.verticalAlign = 'middle';
        cell.style.padding = '4px';

        row.appendChild(cell);
    }

    function fetchBazaarData() {
        let apiUrl = `https://api.torn.com/user/${userID}?key=${apiKey}&selections=bazaar&comment=ViewBazaarAnytime&offset=${fetchOffset}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Aggregate items from the current fetch
                allItems = allItems.concat(data.bazaar);

                // Check if more items need to be fetched (if count is 100, there might be more)
                if (data.bazaar.length === 100) {
                    fetchOffset += 100; // Increment offset for the next batch
                    fetchBazaarData(); // Fetch the next batch
                } else {
                    // All items fetched, proceed to sorting
                    sortAndDisplayItems();
                }
            })
            .catch(error => console.error('Error fetching bazaar data: ' + error));
    }

    function sortAndDisplayItems() {
        // Define quality order for sorting
        const qualityOrder = {
            'Red': 1,
            'Orange': 2,
            'Yellow': 3,
            'N/A': 4 // Use 'N/A' if no quality or for lowest quality items
        };

        // Sort items first by quality, then by price (descending)
        allItems.sort((a, b) => {
            const qualityA = itemUIDs.find(item => item.uid === a.UID)?.quality || 'N/A';
            const qualityB = itemUIDs.find(item => item.uid === b.UID)?.quality || 'N/A';

            if (qualityOrder[qualityA] !== qualityOrder[qualityB]) {
                return qualityOrder[qualityA] - qualityOrder[qualityB];
            }

            // Sort by price within the same quality
            return b.price - a.price;
        });

        // Create the table after sorting
        createTable(allItems);
    }

    function fetchMarketDataForItems() {
        let itemsToFetch = Math.min(maximumCalls, itemIDs.length);

        for (let i = 0; i < itemsToFetch; i++) {
            let { id, index, price } = itemIDs[i];
            fetchMarketData(id, index, price);
        }

        if (itemIDs.length > maximumCalls) {
            setTimeout(function () {
                fetchMarketDataForItems();
            }, 60000); // Wait for 60 seconds before fetching more data
        }
    }

    function fetchMarketData(itemID, index, bazaarPrice) {
        let apiUrl = `https://api.torn.com/market/${itemID}?selections=bazaar&key=${apiKey}&comment=ViewBazaarAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.bazaar && data.bazaar.length > 0) {
                    let lowestPrice = data.bazaar[0].cost;

                    // Update table with lowest bazaar price
                    let table = document.querySelector('table');
                    let cell = table.rows[index + 1].cells[5];
                    cell.textContent = bazaarPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0});

                    // Remove from itemIDs
                    itemIDs = itemIDs.filter(item => item.id !== itemID);
                } else {
                    throw new Error('No items found in the bazaar');
                }
            })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchItemDetailsForUIDs() {
        console.log('Fetching all item details');
        let itemsToFetch = Math.min(maximumCalls, itemUIDs.length);

        for (let i = 0; i < itemsToFetch; i++) {
            let { uid, index } = itemUIDs[i];
            fetchItemDetails(uid, index);
        }

        if (itemUIDs.length > maximumCalls) {
            setTimeout(function () {
                fetchItemDetailsForUIDs();
            }, 60000); // Wait for 60 seconds before fetching more data
        }
    }

    function fetchItemDetails(itemUID, index) {
        console.log('Fetching item details');

        let apiUrl = `https://api.torn.com/torn/${itemUID}?selections=itemdetails&key=${apiKey}&comment=ViewBazaarAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.itemdetails) {
                    let rarity = data.itemdetails.rarity || '';
                    let quality = data.itemdetails.quality || '';
                    let bonuses = data.itemdetails.bonuses || {};
                    let damage = data.itemdetails.damage || 'N/A';
                    let accuracy = data.itemdetails.accuracy || 'N/A';

                    let bonusText = '';

                    if (Object.keys(bonuses).length === 1) {
                        let bonus = bonuses[Object.keys(bonuses)[0]];
                        bonusText = `<p style="padding:4px">${bonus.value}% ${bonus.bonus}</p>`;
                    } else if (Object.keys(bonuses).length === 2) {
                        Object.keys(bonuses).forEach(key => {
                            let bonus = bonuses[key];
                            bonusText += `<p style="padding:4px">${bonus.value}% ${bonus.bonus}</p>`;
                        });
                    }

                    // Update table with bonus text, damage, and accuracy
                    let table = document.querySelector('table');
                    let row = table.rows[index + 1];
                    row.cells[2].innerHTML = `<p style="padding:4px">${rarity}<p>${quality} Quality</p>${bonusText}`;
                    row.cells[3].textContent = damage;
                    row.cells[4].textContent = accuracy;

                    // Remove from itemUIDs
                    itemUIDs = itemUIDs.filter(item => item.uid !== itemUID);
                } else {
                    throw new Error('No item details found');
                }
            })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    checkUserID();
    setTimeout(checkElement, 300);

})();
