// ==UserScript==
// @name         RW Rewards Value for Mobile
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Display the value of RW rewards on both PC and Mobile in Kiwi browser via Tampermonkey.
// @author       Unnamed199cz
// @match        https://www.torn.com/war.php?step=rankreport*
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @license      No Editing
// @downloadURL https://update.greasyfork.org/scripts/518841/RW%20Rewards%20Value%20for%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/518841/RW%20Rewards%20Value%20for%20Mobile.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // API Key configuration
    const API_KEY = "7PkTMZNBmWrelDi6"; // Replace with your API Key
    if (!API_KEY) {
        alert("No API key is provided. Please update the script with your Torn API key.");
        return;
    }

    // Global variables for caching
    let marketValueMap = new Map();
    let pointMarketValue = 0;

    // Observe dynamic content loading for rows
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const rows = document.querySelectorAll("div[class*='memberBonusRow']");
            rows.forEach((row) => {
                if (!row.dataset.processed) {
                    processRow(row);
                    row.dataset.processed = "true"; // Mark as processed
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Process individual row
    async function processRow(row) {
        const text = row.innerText;
        const startingIndex = text.indexOf("bonus respect, ") + 15;
        const awardsString = text.substring(startingIndex).trim();

        let rowTotalValue = 0;
        let totalBB = 0;

        const container = document.createElement("div");
        container.style.cssText = `
            background-color: ${document.body.classList.contains("dark-mode") ? "#002800" : "#b5e7a0"};
            padding: 10px;
            margin-top: 10px;
            font-size: 0.9em;
            word-wrap: break-word;
            max-width: 100%; /* Ensure container fits on small screens */
        `;

        for (const item of awardsString.split(", ")) {
            const details = await processItem(item);
            rowTotalValue += details.value;
            totalBB += details.bb || 0;

            const itemRow = document.createElement("div");
            itemRow.innerHTML = `${item} (${details.formattedValue})`;
            container.appendChild(itemRow);
        }

        const totalRow = document.createElement("div");
        totalRow.style.fontWeight = "bold";
        totalRow.innerText = `Total: ${formatNumber(rowTotalValue)} (${totalBB} Bunker Bucks)`;
        container.appendChild(totalRow);

        row.appendChild(container);
    }

    // Process individual items and fetch values
    async function processItem(item) {
        let value = 0;
        let bb = 0;

        if (item.includes("points")) {
            const pointValue = await getPointValue();
            const count = parseInt(item);
            value = pointValue * count;
            return { value, formattedValue: `${formatNumber(pointValue)} each` };
        }

        const cacheTypes = {
            "Armor Cache": { id: 1118, bb: 60 },
            "Melee Cache": { id: 1119, bb: 30 },
            "Small Arms Cache": { id: 1120, bb: 20 },
            "Medium Arms Cache": { id: 1121, bb: 50 },
            "Heavy Arms Cache": { id: 1122, bb: 70 },
        };

        for (const [name, details] of Object.entries(cacheTypes)) {
            if (item.includes(name)) {
                const count = parseInt(item);
                const cacheValue = await getCacheValue(details.id);
                value = cacheValue * count;
                bb = details.bb * count;
                return { value, bb, formattedValue: `${formatNumber(cacheValue)} each` };
            }
        }

        return { value: 0, formattedValue: "N/A" };
    }

    // Fetch cache value using API
    async function getCacheValue(itemId) {
        if (marketValueMap.has(itemId)) return marketValueMap.get(itemId);

        const response = await apiRequest(`https://api.torn.com/torn/${itemId}?selections=items`);
        const value = response?.items?.[itemId]?.market_value || 0;
        marketValueMap.set(itemId, value);
        return value;
    }

    // Fetch point value using API
    async function getPointValue() {
        if (pointMarketValue > 0) return pointMarketValue;

        const response = await apiRequest(`https://api.torn.com/market/?selections=pointsmarket`);
        pointMarketValue = response?.pointsmarket?.[Object.keys(response.pointsmarket)[0]]?.cost || 0;
        return pointMarketValue;
    }

    // API Request using GM.xmlHttpRequest for mobile compatibility
    async function apiRequest(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: `${url}&key=${API_KEY}`,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        console.error(`API request failed: ${response.statusText}`);
                        resolve(null);
                    }
                },
                onerror: (error) => {
                    console.error("API request error:", error);
                    reject(error);
                },
            });
        });
    }

    // Format numbers with units like k, M, B
    function formatNumber(num, digits = 1) {
        const units = ["", "k", "M", "B"];
        const i = Math.floor(Math.log10(num) / 3);
        return (num / 10 ** (i * 3)).toFixed(digits) + units[i];
    }
})();
