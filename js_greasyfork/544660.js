// ==UserScript==
// @name         Torn Armory Tracker 
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Logs weapons and displays the original owner if an item is already tracked.
// @author       aquagloop
// @match        https://www.torn.com/item.php*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      script.google.com
// @license MIT
// @connect      script.googleusercontent.com
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/544660/Torn%20Armory%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/544660/Torn%20Armory%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyx3Z5osxEunU3EADF97VRJhkMw-4I-G0iNPQbGhiDy9MvZ7PS5oPLAPipsZ_FN2tZI/exec";
    // The TORN_API_KEY is now loaded from storage or prompted from the user.
    let TORN_API_KEY;
    // --- END CONFIGURATION ---

    let trackedItemsData = {};
    let isDataFetched = false;


    function fetchTrackedItems() {
        console.log("Armory Tracker: Fetching tracked items from Google Sheet...");
        GM_xmlhttpRequest({
            method: "GET",
            url: WEB_APP_URL,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.status === "success") {
                        trackedItemsData = result.data;
                        isDataFetched = true; // Set the flag to true now that we have the data.
                        console.log("Armory Tracker: Successfully fetched tracked items.", trackedItemsData);

                        // Force a re-processing of all items now that we have the correct data.
                        const itemsList = document.querySelector('#all-items');
                        if (itemsList) {
                            // First, remove any buttons or labels our script might have already added.
                            const existingElements = itemsList.querySelectorAll('.armory-tracker-btn, .owner-label');
                            existingElements.forEach(el => el.parentElement.removeChild(el));
                            // Now, process the list again with the correct data.
                            processItems(itemsList);
                        }
                    } else {
                        console.error("Armory Tracker: Error fetching data from Google Sheet -", result.message);
                    }
                } catch (e) {
                    console.error("Armory Tracker: Failed to parse response from Google Sheet.", e);
                }
            },
            onerror: function(response) {
                console.error("Armory Tracker: Network error while fetching from Google Sheet.", response);
            }
        });
    }

    /**
     * Checks for a stored API key, or prompts the user for one.
     * @returns {boolean} - True if an API key is available, false otherwise.
     */
    function setupApiKey() {
        // The key used to store the API key in Tampermonkey's storage
        const storageKey = "TornArmoryTracker_ApiKey";

        let apiKey = GM_getValue(storageKey, null);

        // If no key is stored, prompt the user for it.
        if (!apiKey) {
            apiKey = prompt("Torn Armory Tracker: Please enter your public Torn API key");

            // If the user entered a key, save it. Otherwise, abort.
            if (apiKey && apiKey.trim() !== "") {
                GM_setValue(storageKey, apiKey);
                console.log("Armory Tracker: API Key saved.");
            } else {
                alert("Torn Armory Tracker: An API key is required for the script to function. The script will now stop. Please refresh the page to try again.");
                return false;
            }
        }

        TORN_API_KEY = apiKey;
        return true;
    }


    /**
     * Main function that runs when the script starts.
     */
    function main() {
        // First, check for the Web App URL placeholder
        if (WEB_APP_URL.includes("PASTE_YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE")) {
            unsafeWindow.alert("USERSCRIPT ERROR: Please configure your WEB_APP_URL.");
            return;
        }

        // Setup the API key. If it fails (e.g., user cancels prompt), stop the script.
        if (!setupApiKey()) {
            return;
        }

        console.log("Armory Tracker: Script started.");
        fetchTrackedItems(); // Fetch the data as soon as the script loads.

        // --- Event Delegation Setup ---
        document.body.addEventListener('click', function(event) {
            const trackerButton = event.target.closest('.armory-tracker-btn');
            if (trackerButton && !trackerButton.disabled) {
                event.preventDefault();
                event.stopPropagation();
                const itemElement = trackerButton.closest('li[data-item]');
                if (itemElement) {
                    handleItemClick(itemElement, trackerButton);
                }
            }
        }, true);

        // --- Mutation Observer ---
        const observer = new MutationObserver(() => {
            const itemsList = document.querySelector('#all-items');
            if (itemsList) {
                processItems(itemsList);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Adds "Log" buttons or owner labels to items.
     * @param {HTMLElement} itemsList - The <ul> element containing the list of items.
     */
    function processItems(itemsList) {
        // Don't add any buttons or labels until the initial data fetch is complete.
        if (!isDataFetched) {
            return;
        }

        const items = itemsList.querySelectorAll('li[data-item]');
        items.forEach(item => {
            if (item.querySelector('.armory-tracker-btn, .owner-label')) return;

            const category = item.dataset.category;
            const weaponCategories = ['Primary', 'Secondary', 'Melee'];
            if (!weaponCategories.includes(category)) return;

            const hasBonus = item.querySelector('.bonuses-wrap i[title]');
            const hasDamage = item.querySelector('.bonus-attachment-item-damage-bonus');
            if (!hasBonus && !hasDamage) return;

            const nameWrap = item.querySelector('.name-wrap');
            if (nameWrap) {
                const uid = item.dataset.armoryid || item.dataset.id;

                // If the item is already tracked, show the owner's name.
                if (trackedItemsData[uid]) {
                    const ownerLabel = document.createElement('span');
                    ownerLabel.textContent = `Owner: ${trackedItemsData[uid]}`;
                    ownerLabel.className = 'owner-label';
                    Object.assign(ownerLabel.style, {
                        fontSize: '10px',
                        color: '#888',
                        marginLeft: '10px',
                        verticalAlign: 'middle'
                    });
                    nameWrap.appendChild(ownerLabel);
                }
                // Otherwise, show the "Log" button.
                else {
                    const trackerButton = document.createElement('button');
                    trackerButton.textContent = 'Log';
                    trackerButton.className = 'torn-btn armory-tracker-btn';
                    Object.assign(trackerButton.style, {
                        width: 'auto', padding: '0 8px', height: '20px',
                        fontSize: '10px', lineHeight: '18px', verticalAlign: 'middle',
                        cursor: 'pointer', marginLeft: '10px'
                    });
                    nameWrap.appendChild(trackerButton);
                }
            }
        });
    }

    /**
     * Gathers data and sends it to the spreadsheet.
     * @param {HTMLElement} itemEl - The list item `<li>` element.
     * @param {HTMLElement} buttonEl - The button that was clicked.
     */
    function handleItemClick(itemEl, buttonEl) {
        buttonEl.textContent = '...';
        buttonEl.disabled = true;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=profile&key=${TORN_API_KEY}`,
            onload: function(response) {
                try {
                    const apiData = JSON.parse(response.responseText);
                    if (apiData.error) throw new Error(`Torn API Error: ${apiData.error.error}`);

                    const originalOwner = apiData.name;
                    const ownerFaction = apiData.faction ? apiData.faction.faction_name : 'N/A';
                    const uid = itemEl.dataset.armoryid || itemEl.dataset.id;
                    const weaponName = itemEl.querySelector('.name')?.textContent.trim() || 'Unknown';

                    const bonusIcon = itemEl.querySelector('.bonuses-wrap i[title]');
                    let bonusText = 'N/A', bonusValue = 'N/A';
                    if (bonusIcon && bonusIcon.title) {
                        const titleHtml = bonusIcon.getAttribute('title');
                        const nameMatch = titleHtml.match(/<b>(.*?)<\/b>/);
                        if (nameMatch) bonusText = nameMatch[1];
                        const valueMatch = titleHtml.match(/(\d+[\.]?\d* ?%)/);
                        if (valueMatch) bonusValue = valueMatch[0].replace(/\s/g, '');
                    }

                    const payload = { uid, weaponName, bonus: bonusText, bonusValue, originalOwner, ownerFaction };
                    sendData(payload, buttonEl);

                } catch (e) {
                    unsafeWindow.alert(`Failed to process Torn API data. Your key may be invalid.\nError: ${e.message}`);
                    buttonEl.textContent = 'Log';
                    buttonEl.disabled = false;
                }
            },
            onerror: () => {
                unsafeWindow.alert("A network error occurred while trying to contact the Torn API.");
                buttonEl.textContent = 'Log';
                buttonEl.disabled = false;
            }
        });
    }

    /**
     * Sends the final payload to the Google Sheet.
     * @param {object} data - The complete data object to send.
     * @param {HTMLElement} buttonEl - The button that was clicked.
     */
    function sendData(data, buttonEl) {
        const payload = { action: "add", ...data };

        const updateUIToSuccess = () => {
            // Update local data cache so we don't need to re-fetch.
            trackedItemsData[data.uid] = data.originalOwner;

            const ownerLabel = document.createElement('span');
            ownerLabel.textContent = `Owner: ${data.originalOwner}`;
            ownerLabel.className = 'owner-label';
            Object.assign(ownerLabel.style, {
                fontSize: '10px',
                color: '#888',
                marginLeft: '10px',
                verticalAlign: 'middle'
            });

            // Replace the button with the new label for instant feedback.
            buttonEl.replaceWith(ownerLabel);
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: WEB_APP_URL,
            data: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
            onload: function(response) {
                updateUIToSuccess();
            },
            onerror: function(response) {
                console.log("GM_xmlhttpRequest triggered 'onerror'. This is expected. Assuming success.", response);
                updateUIToSuccess();
            }
        });
    }

    // Run the main function
    main();

})();