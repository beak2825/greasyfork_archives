// ==UserScript==
// @name         Arcadia Market Alert
// @namespace    https://github.com/Shikster/
// @version      2.0
// @description  Find items in the market and alert via Discord Webhook
// @author       Shikster
// @match        https://cp.arcadia-online.org/market/vending/
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://i.imgur.com/kqeQwJV.png
// @license      MT
// @downloadURL https://update.greasyfork.org/scripts/510265/Arcadia%20Market%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/510265/Arcadia%20Market%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchInterval;
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1288806809271930951/SSJYMYgIXH0ofPXZmO8BMlZZ4pC6RzQFd34PwpEPZe61zC0gY_zpUfQXnhXGaSRrT4yB';
    let sendQueue = [];
    let isSending = false;

    function createPopup() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = '9999';
        popup.style.backgroundColor = '#fff';
        popup.style.border = '2px solid #000';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.width = '500px';
        popup.style.maxWidth = '90%';

        popup.innerHTML = `
            <h2>Find Items in Market</h2>
            <label for="userId">User ID:</label>
            <input type="text" id="userId" placeholder="e.g. 293837046349299712" style="width: calc(100% - 10px); padding: 5px;">
            <br>
            <table id="itemsTable" style="width: 100%; margin-top: 10px; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Refine Rate(0-10)</th>
                        <th>Slots (0-4)</th>
                        <th>Max Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${[1, 2, 3, 4, 5].map(i => `
                        <tr>
                            <td><input type="text" id="item${i}_name" placeholder="Item ${i}" style="width: 100%;"></td>
                            <td><input type="number" id="item${i}_prefix" min="0" max="10" placeholder="Refine Rate" style="width: 100%;"></td>
                            <td><input type="number" id="item${i}_slots" min="0" max="4" placeholder="Slots" style="width: 100%;"></td>
                            <td><input type="number" id="item${i}_maxPrice" placeholder="Max Price" style="width: 100%;"></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <br>
            <label for="maxPages">Pages to Search:</label>
            <input type="number" id="maxPages" value="1" min="1" required style="width: calc(100% - 10px); padding: 5px;">
            <br>
            <label for="intervalTime">Search Interval (minutes):</label>
            <input type="number" id="intervalTime" value="5" min="1" required style="width: calc(100% - 10px); padding: 5px;">
            <br>
            <button id="startButton">Start Search</button>
            <button id="closeButton">Close</button>
        `;

        const storedUserId = GM_getValue('userId', '');
        popup.querySelector('#userId').value = storedUserId;

        document.body.appendChild(popup);

        popup.querySelector('#closeButton').addEventListener('click', function() {
            document.body.removeChild(popup);
        });

        popup.querySelector('#startButton').addEventListener('click', function() {
            const userId = popup.querySelector('#userId').value.trim();
            const maxPages = parseInt(popup.querySelector('#maxPages').value);
            const intervalTime = parseInt(popup.querySelector('#intervalTime').value) * 60 * 1000;

            GM_setValue('userId', userId);

            const items = [1, 2, 3, 4, 5].map(i => {
                const name = popup.querySelector(`#item${i}_name`).value.trim();
                const prefix = popup.querySelector(`#item${i}_prefix`).value || '';
                const slots = popup.querySelector(`#item${i}_slots`).value || '';
                const maxPrice = parseFloat(popup.querySelector(`#item${i}_maxPrice`).value) || 0;
                return { name, prefix, slots, maxPrice };
            }).filter(item => item.name); // Only include items with a name

            startSearchLoop(userId, items, maxPages, intervalTime);
            document.body.removeChild(popup);
        });
    }

    function sendToDiscord(content) {
        sendQueue.push(content);
        processQueue();
    }

    function processQueue() {
        if (isSending || sendQueue.length === 0) return;
        isSending = true;

        const content = sendQueue.shift();

        const payload = {
            content: content,
            username: 'Markt Rat',
            avatar_url: 'https://i.imgur.com/kqeQwJV.png'
        };

        fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Error sending message to Discord:', error);
        })
        .finally(() => {
            isSending = false;
            setTimeout(processQueue, 1000);
        });
    }

    function findItemOnPage(item, pageNumber, userID) {
        const searchQuery = `name=${encodeURIComponent(item.name)}&p=${pageNumber}`;
        const searchUrl = `/market/vending/?${searchQuery}`;

        fetch(searchUrl)
            .then(response => response.text())
            .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let items = doc.querySelectorAll('.item_name');

            items.forEach(itemElement => {
                const fullItemName = itemElement.innerText.trim();
                const row = itemElement.closest('tr');

                // Extract slot information directly from the correct table cell
                const slotText = row.querySelector('td.normalslotted').innerText.trim();
                const slots = slotText.match(/\[(\d+)\]/) ? slotText.match(/\[(\d+)\]/)[1] : '0';

                // Prefix logic
                const prefixValue = item.prefix !== '0' ? `+${item.prefix}` : '';
                const prefixMatch = (item.prefix === '0' || !item.prefix) || (prefixValue === itemElement.previousSibling.textContent.trim());

                // Ensure slots match exactly
                const slotsMatch = slots === item.slots.toString(); // Convert to string for comparison

                if (prefixMatch && fullItemName.toLowerCase() === item.name.toLowerCase() && slotsMatch) {
                    let priceElement = row.querySelector('td.text-end strong');
                    let priceText = priceElement ? priceElement.innerText.trim() : 'Price not found';
                    let price = parseFloat(priceText.replace(/[^0-9.-]+/g, "")); // Convert to number

                    if (price <= item.maxPrice) {
                        let shopElement = row.querySelector('a.link-to-shop');
                        let shopName = shopElement ? shopElement.innerText.trim() : 'Shop not found';
                        let shopLink = shopElement ? `https://cp.arcadia-online.org${shopElement.getAttribute('href')}` : 'Link not found';

                        // Adjust message content
                        let messageContent = `Eep! I found: "**${prefixValue ? prefixValue + ' ' : ''}${fullItemName}[${slots}]**"\n` +
                            `Price: **${priceText}**\n` +
                            `Shop: **${shopName}**\n` +
                            `Link: **${shopLink}**\n` +
                            `Squeek!\n` +
                            `<@${userID}>`;

                        sendToDiscord(messageContent);
                    }
                }
            });

        })
            .catch(error => {
            console.error(`Error fetching page ${pageNumber}:`, error);
        });
    }




    function searchAndFind(userID, items, maxPages) {
        items.forEach(item => {
            for (let i = 1; i <= maxPages; i++) {
                findItemOnPage(item, i, userID);
            }
        });
    }

    function startSearchLoop(userID, items, maxPages, intervalTime) {
        if (searchInterval) {
            clearInterval(searchInterval);
        }

        searchAndFind(userID, items, maxPages);

        searchInterval = setInterval(() => {
            console.log(`Searching for items: ${items.map(i => `${i.prefix ? i.prefix + ' ' : ''}${i.name}`).join(', ')}`);
            searchAndFind(userID, items, maxPages);
        }, intervalTime);
    }

    createPopup();
})();
