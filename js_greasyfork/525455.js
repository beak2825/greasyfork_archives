// ==UserScript==
// @name         Torn Faction Inventory Sum
// @namespace    http://tornfactioninventorybyak.net/
// @version      1.2.1.1
// @description  Fetch and sum item quantities from the Torn API for a faction. Stores API key in local storage.
// @author       -A-K-[3455584]
// @license      MIT
// @match        https://www.torn.com/index.php    
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525455/Torn%20Faction%20Inventory%20Sum.user.js
// @updateURL https://update.greasyfork.org/scripts/525455/Torn%20Faction%20Inventory%20Sum.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = "tornApiKey";
    const categories = ["armor", "boosters", "caches", "drugs", "medical", "temporary", "weapons"];

    async function fetchCategoryInventory(apiKey, category) {
        const url = `https://api.torn.com/faction/?selections=${category}&key=${apiKey}`;
        console.log(`🔄 Fetching data for category: ${category} from ${url}`);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`❌ HTTP Error: ${response.status} - ${response.statusText}`);
                return { category, quantity: 0, error: true };
            }

            const data = await response.json();
            if (data.error) {
                console.error(`⚠️ API Error: ${data.error.error} (Code: ${data.error.code})`);
                handleApiError(data.error.code);
                return { category, quantity: 0, error: true };
            }

            let totalQuantity = 0;
            if (data[category] && Array.isArray(data[category])) {
                data[category].forEach(item => {
                    totalQuantity += parseInt(item.quantity) || 0;
                    console.log(`   ➕ ${item.name}: ${item.quantity}`);
                });
            }

            console.log(`✅ Total for ${category}: ${totalQuantity}`);
            return { category, quantity: totalQuantity };

        } catch (error) {
            console.error("❌ Error fetching data:", error);
            return { category, quantity: 0, error: true };
        }
    }

    async function fetchAndSumInventory(apiKey) {
        let totalSum = 0;
        let categoryTotals = [];
        let hasError = false;

        for (const category of categories) {
            const result = await fetchCategoryInventory(apiKey, category);
            if (result.error) {
                hasError = true;
                break;
            }
            totalSum += result.quantity;
            categoryTotals.push(result);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to prevent rate limiting
        }

        if (!hasError) {
            displayResult(totalSum, categoryTotals);
        }
    }

    function displayResult(totalQuantity, categoryTotals) {
        let resultDiv = document.getElementById("inventoryTotal");
        if (!resultDiv) {
            resultDiv = document.createElement("div");
            resultDiv.id = "inventoryTotal";
            resultDiv.style.padding = "10px";
            resultDiv.style.marginTop = "10px";
            resultDiv.style.background = "#1e1e1e";
            resultDiv.style.color = "#fff";
            resultDiv.style.borderRadius = "5px";
            document.getElementById("column1").appendChild(resultDiv);
        }

        let categoryText = categoryTotals.map(ct => `<li>${ct.category}: ${ct.quantity}</li>`).join("");
        resultDiv.innerHTML = `<strong>Total Quantity of Items:</strong> ${totalQuantity}<br><ul>${categoryText}</ul>`;
    }

    function getStoredApiKey() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function saveApiKey(apiKey) {
        localStorage.setItem(STORAGE_KEY, apiKey);
    }

    function promptForApiKey() {
        let apiKey = prompt("🔑 Enter your Torn API key:");
        if (apiKey) {
            saveApiKey(apiKey);
            return apiKey;
        }
        return null;
    }

    function handleApiError(errorCode) {
        let message = "";

        switch (errorCode) {
            case 1:
            case 2:
                message = "❌ Incorrect API Key. Please enter a valid Minimal Access API Key.";
                break;
            case 5:
                message = "⏳ Too many requests. Please wait and try again.";
                return;
            case 10:
                message = "🚔 Your API key is disabled because the owner is in federal jail.";
                break;
            case 13:
                message = "🕒 Your API key is disabled due to inactivity (7+ days). Log in to Torn to reactivate it.";
                break;
            case 16:
                message = "🔑 API Key has **insufficient access level**. Please enter a **Minimal Access API Key**.";
                break;
            case 18:
                message = "⏸️ Your API Key is **paused**. Do you want to enter a new one?";
                break;
            default:
                message = "⚠️ An API error occurred. Please check your key and try again.";
        }

        if (message) {
            if (confirm(`${message}\n\nWould you like to enter a new API key?`)) {
                const newApiKey = prompt("🔑 Enter a new Torn API key:");
                if (newApiKey) {
                    saveApiKey(newApiKey);
                    fetchAndSumInventory(newApiKey);
                }
            }
        }
    }

    function createFetchButton() {
        const container = document.getElementById("column1");
        if (!container) {
            console.warn("⚠️ Column1 div not found!");
            return;
        }

        const button = document.createElement("button");
        button.innerText = "Fetch Inventory Sum";
        button.style.padding = "8px 12px";
        button.style.marginTop = "10px";
        button.style.background = "#0078D7";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.display = "block";
        button.style.width = "100%";

        button.onclick = function () {
            let apiKey = getStoredApiKey();
            if (!apiKey) {
                apiKey = promptForApiKey();
            }

            if (apiKey) {
                fetchAndSumInventory(apiKey);
            }
        };

        container.appendChild(button);
    }

    setTimeout(createFetchButton, 2000);
})();