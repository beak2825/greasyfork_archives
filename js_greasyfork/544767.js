// ==UserScript==
// @name          Torn Armory Tracker
// @namespace     http://tampermonkey.net/
// @version       5.0
// @description   for Levy
// @author        aquagloop
// @match         https://www.torn.com/item.php
// @match         https://www.torn.com/factions.php*
// @grant         GM_xmlhttpRequest
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @connect       script.google.com
// @license       MIT
// @connect       script.googleusercontent.com
// @connect       api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/544767/Torn%20Armory%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/544767/Torn%20Armory%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzkyrBvaAxEqkHU5Z1zk_nZdCcNUftZnWZZ5NPQySf94je2fHJ4dKLPT5aiiBOe4J7j/exec";
    let TORN_API_KEY;

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
                        isDataFetched = true;
                        console.log("Armory Tracker: Successfully fetched tracked items.", trackedItemsData);

                        const itemsContainer = document.querySelector('.items-wrap, #faction-armoury-tabs');
                        if (itemsContainer) {
                            const existingElements = itemsContainer.querySelectorAll('.armory-tracker-btn, .owner-label');
                            existingElements.forEach(el => el.parentElement.removeChild(el));
                            processItems(itemsContainer);
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

    function setupApiKey() {
        const storageKey = "TornArmoryTracker_ApiKey";
        let apiKey = GM_getValue(storageKey, null);

        if (!apiKey) {
            apiKey = prompt("Torn Armory Tracker: Please enter your public Torn API key");
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

    function main() {
        if (WEB_APP_URL.includes("PASTE_YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE")) {
            unsafeWindow.alert("USERSCRIPT ERROR: Please configure your WEB_APP_URL.");
            return;
        }

        if (!setupApiKey()) {
            return;
        }

        console.log("Armory Tracker: Script started.");
        fetchTrackedItems();

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

        const observer = new MutationObserver(() => {
            const itemsContainer = document.querySelector('.items-wrap, #faction-armoury-tabs');
            if (itemsContainer) {
                processItems(itemsContainer);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function processItems(container) {
        if (!isDataFetched) {
            return;
        }

        const onInventoryPage = window.location.href.includes('item.php');
        const items = container.querySelectorAll('li[data-item], ul.item-list > li');

        items.forEach(item => {
            if (item.querySelector('.armory-tracker-btn, .owner-label') || item.classList.contains('list-title')) {
                return;
            }

            const category = item.dataset.category || item.querySelector('.type')?.textContent.trim();
            const hasBonus = item.querySelector('.bonuses-wrap i[title], ul.bonuses li.bonus i[title]');
            const nameWrap = item.querySelector('.name-wrap') || item.querySelector('.name.bold');
            const uid = item.dataset.armoryid || item.dataset.id || item.querySelector('[data-armoryid]')?.dataset.armoryid;
            const trackedCategories = ['Primary', 'Secondary', 'Melee', 'Defensive', 'Armor'];

            if (!category || !trackedCategories.includes(category) || !hasBonus || !nameWrap || !uid) {
                return;
            }

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
            } else if (onInventoryPage) {
                const trackerButton = document.createElement('button');
                trackerButton.textContent = 'Log';
                trackerButton.className = 'torn-btn armory-tracker-btn';
                Object.assign(trackerButton.style, {
                    width: 'auto',
                    padding: '0 8px',
                    height: '20px',
                    fontSize: '10px',
                    lineHeight: '18px',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    marginLeft: '10px'
                });
                nameWrap.appendChild(trackerButton);
            }
        });
    }

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
                    let bonusText = 'N/A',
                        bonusValue = 'N/A';
                    if (bonusIcon && bonusIcon.title) {
                        const titleHtml = bonusIcon.getAttribute('title');
                        const nameMatch = titleHtml.match(/<b>(.*?)<\/b>/);
                        if (nameMatch) bonusText = nameMatch[1];
                        const valueMatch = titleHtml.match(/(\d+[\.]?\d* ?%)/);
                        if (valueMatch) bonusValue = valueMatch[0].replace(/\s/g, '');
                    }

                    const payload = {
                        uid,
                        weaponName,
                        bonus: bonusText,
                        bonusValue,
                        originalOwner,
                        ownerFaction
                    };
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

    function sendData(data, buttonEl) {
        const payload = {
            action: "add",
            ...data
        };

        const updateUIToSuccess = () => {
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

            buttonEl.replaceWith(ownerLabel);
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: WEB_APP_URL,
            data: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                updateUIToSuccess();
            },
            onerror: function(response) {
                console.log("GM_xmlhttpRequest triggered 'onerror'. This is expected. Assuming success.", response);
                updateUIToSuccess();
            }
        });
    }

    main();

})();
