// ==UserScript==
// @name         Torn Faction Armory - Detailed Snapshot to Sheet
// @namespace    Torn.Armory.Snapshot.Recorder
// @version      2.1
// @description  Scrapes detailed weapon and armor information from the faction armory page and sends it to a Google Sheet via a Web App.
// @author       GNSC4 [268863] (Adapted from Skeletron's item.php script logic)
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536083/Torn%20Faction%20Armory%20-%20Detailed%20Snapshot%20to%20Sheet.user.js
// @updateURL https://update.greasyfork.org/scripts/536083/Torn%20Faction%20Armory%20-%20Detailed%20Snapshot%20to%20Sheet.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('Faction Armory Snapshot Userscript: Initializing (v2.1)...');

    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby1rSurAkpYoajOwAJzPd4ibGJQOxPHFGUfF1bwYcxGPZrZ_OvHpj4e8XXiPF9e5I9l/exec';

    const mainButtonContainerId = 'faction-armory-sheet-exporter-button-container';
    const sendButtonId = 'sendFactionArmoryDataToSheetBtn';
    let uiCreated = false;
    let initializationInterval = null;
    let initializationAttempts = 0;
    const MAX_INITIALIZATION_ATTEMPTS = 40;
    const TARGET_ARMORY_ELEMENT_ID = '#faction-armoury-tabs';

    GM_addStyle(`
        #${mainButtonContainerId} {
            border: 1px solid #444;
            margin-bottom: 10px;
            background-color: #333;
            padding: 10px;
            position: relative;
            z-index: 9999;
        }
        #${mainButtonContainerId} .title-gray {
            background-color: #222 !important;
            color: #fff !important;
            padding: 8px !important;
            font-size: 16px !important;
        }
        #${mainButtonContainerId} .cont-gray {
            background-color: #282828 !important;
            padding: 10px !important;
        }
        #${mainButtonContainerId} p {
            color: #ccc !important;
            margin-bottom: 8px !important;
        }
        #${sendButtonId} {
            background-color: #555 !important;
            color: #fff !important;
            border: 1px solid #666 !important;
        }
        #${sendButtonId}:hover {
            background-color: #666 !important;
        }
        #${sendButtonId}:disabled {
            background-color: #444 !important;
            color: #888 !important;
            cursor: not-allowed;
        }
    `);

    function createUI() {
        if (uiCreated || document.getElementById(mainButtonContainerId)) {
            if (initializationInterval) clearInterval(initializationInterval);
            return false;
        }
        console.log('Faction Armory Snapshot: createUI() called.');

        const armoryTabsRoot = document.querySelector(TARGET_ARMORY_ELEMENT_ID);
        if (!armoryTabsRoot) {
            console.error(`Faction Armory Snapshot: CRITICAL - Target element "${TARGET_ARMORY_ELEMENT_ID}" NOT FOUND when createUI was called.`);
            return false;
        }
        console.log(`Faction Armory Snapshot: Target element "${TARGET_ARMORY_ELEMENT_ID}" found by createUI.`);

        const cont = document.createElement('div');
        cont.id = mainButtonContainerId;

        const titleCont = document.createElement('div');
        titleCont.className = 'title-gray top-round';
        titleCont.setAttribute('role', 'heading');
        titleCont.setAttribute('aria-level', '5');
        titleCont.innerHTML = '<span class="t-black">Faction Armory Snapshot to Sheet</span>';
        cont.appendChild(titleCont);

        const desc = document.createElement('div');
        desc.className = 'cont-gray bottom-round p10';
        desc.innerHTML = `
            <p>Click the button to scrape details (UIDs, stats, rarity, bonuses) for all visible items in the faction armory and send them to your Google Sheet.</p>
            <p><b>Important:</b> Scroll down within each weapon/armor category to ensure all items are loaded and visible before clicking.</p>
        `;

        const btnWrap = document.createElement('div');
        btnWrap.style.display = 'flex';
        btnWrap.style.justifyContent = 'start';
        btnWrap.style.marginTop = '10px';

        const sendButton = document.createElement('button');
        sendButton.id = sendButtonId;
        sendButton.type = 'button';
        sendButton.className = 'torn-btn';
        sendButton.innerHTML = 'Send Armory Data to Sheet';
        sendButton.style.width = 'auto';
        sendButton.style.padding = '0 15px';
        sendButton.style.height = '30px';
        sendButton.style.lineHeight = '30px';

        btnWrap.appendChild(sendButton);
        desc.appendChild(btnWrap);
        cont.appendChild(desc);

        armoryTabsRoot.parentNode.insertBefore(cont, armoryTabsRoot);
        uiCreated = true;
        console.log(`Faction Armory Snapshot: UI elements CREATED and inserted before "${TARGET_ARMORY_ELEMENT_ID}".`);
        if (initializationInterval) {
            clearInterval(initializationInterval);
            console.log('Faction Armory Snapshot: UI created, clearing initialization interval.');
        }

        sendButton.addEventListener('click', async () => {
            console.log('Faction Armory Snapshot: "Send Armory Data to Sheet" button clicked.');
            if (WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' || WEB_APP_URL === '' || !WEB_APP_URL.startsWith('https://script.google.com/')) {
                alert('ERROR: Userscript not configured correctly. Please check the WEB_APP_URL in the script.');
                console.error('Faction Armory Snapshot: WEB_APP_URL is not configured.');
                return;
            }
            sendButton.disabled = true;
            sendButton.innerHTML = 'Scraping & Sending...';
            try {
                const allItems = await scrapeFactionArmory();
                if (Object.keys(allItems).length > 0) {
                    await sendDataToSheet(allItems);
                } else {
                    sendButton.innerHTML = 'No items found/scraped.';
                    alert('No items were found or scraped from the armory page. Make sure items are visible and you are on a weapon/armor tab.');
                    console.log('Faction Armory Snapshot: No items scraped.');
                }
            } catch (error) {
                console.error('Faction Armory Snapshot: Error during scrape/send:', error);
                sendButton.innerHTML = 'Error Occurred!';
                alert(`An error occurred: ${error.message}. Check console for details.`);
            } finally {
                setTimeout(() => {
                    sendButton.disabled = false;
                    sendButton.innerHTML = 'Send Armory Data to Sheet';
                }, 3000);
            }
        });
        return true;
    }

    async function scrapeFactionArmory() {
        console.log('Faction Armory Snapshot: Starting scrapeFactionArmory()...');
        const items = {};

        const activeTabPanel = document.querySelector('#faction-armoury-tabs > div.ui-tabs-panel[role="tabpanel"][aria-hidden="false"]');
        if (!activeTabPanel) {
            console.warn('Faction Armory Snapshot: No active tab panel found. Ensure you are on a weapon/armor tab.');
            return items;
        }
        console.log(`Faction Armory Snapshot: Active tab panel found: #${activeTabPanel.id}`);

        const itemList = activeTabPanel.querySelector('ul.item-list');
        if (!itemList) {
            console.warn(`Faction Armory Snapshot: ul.item-list not found within active panel: #${activeTabPanel.id}`);
            return items;
        }
        console.log(`Faction Armory Snapshot: Processing item list in #${activeTabPanel.id}`);

        let listCategory = itemList.getAttribute('data-category');
        if (!listCategory) {
            if (activeTabPanel.id.includes('weapons')) listCategory = 'Weapon';
            else if (activeTabPanel.id.includes('armour')) listCategory = 'Armour';
            else listCategory = activeTabPanel.id.replace('armoury-', '');
        }
        listCategory = listCategory || 'Unknown Category';

        Array.from(itemList.children).forEach(listItem => {
            if (listItem.tagName !== 'LI') return;

            const imgWrap = listItem.querySelector('div.img-wrap');
            if (!imgWrap) return;

            const uid = imgWrap.getAttribute('data-armoryid');
            // const genericId = imgWrap.getAttribute('data-itemid'); // Not sent

            if (!uid) return;
            if (items[uid]) return;

            const nameElement = listItem.querySelector('div.name');
            let itemName = nameElement ? nameElement.textContent.trim() : 'Unknown Name';
            if (itemName.includes(`[${uid}]`)) itemName = itemName.replace(`[${uid}]`, '').trim();

            const itemData = {
                UID: uid, type: listCategory, name: itemName,
                rarity: '', damage: null, accuracy: null, armor: null, quantity: 1,
                bonuses: [], circulation: null, market_value: null, quality: null
            };

            const glowElement = imgWrap.querySelector('img.torn-item[class*="glow-"]');
            if (glowElement) {
                for (const className of glowElement.classList) {
                    if (className.startsWith("glow-")) {
                        itemData.rarity = className.slice(5).charAt(0).toUpperCase() + className.slice(6);
                        break;
                    }
                }
            }

            const statsElements = listItem.querySelectorAll('ul.bonuses > li.left');
            statsElements.forEach(statLi => {
                const iconElement = statLi.querySelector('i');
                const valueElement = statLi.querySelector('span');
                if (iconElement && valueElement) {
                    if (!statLi.classList.contains('bonus')) {
                        const valueText = valueElement.textContent.trim();
                        const value = parseFloat(valueText);
                        if (!isNaN(value)) {
                            if (iconElement.className.includes('damage')) itemData.damage = value;
                            else if (iconElement.className.includes('accuracy')) itemData.accuracy = value;
                            else if (iconElement.className.includes('defence') || iconElement.className.includes('defense')) itemData.armor = value;
                        }
                    }
                }
            });

            const bonusIcons = listItem.querySelectorAll('ul.bonuses > li.bonus i[title]');
            bonusIcons.forEach(icon => {
                const tooltipHTML = icon.getAttribute('title');
                if (tooltipHTML) {
                    let bonusName = '';
                    let bonusValue = '';

                    // Create a temporary div to parse HTML content of tooltip
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = tooltipHTML;

                    // Try to get name from <strong> tag first
                    const strongTag = tempDiv.querySelector('strong');
                    if (strongTag) {
                        bonusName = strongTag.textContent.trim();
                    } else {
                        // Fallback: Get all text, remove value, then clean up
                        let allText = tempDiv.textContent.trim();
                        const valueMatch = allText.match(/([\d.,]+%?(\s*(increased|decreased|chance|damage|turns|reduction|ignores|for|below|by|of|to|an|a))?(\s+.*)?)$/i);

                        if (valueMatch && valueMatch[0]) { // valueMatch[0] is the full matched value string
                            bonusValue = valueMatch[1].trim(); // The value part
                            // Remove the value part and any preceding/trailing spaces/colons from allText to get the name
                            bonusName = allText.replace(valueMatch[0], '').replace(/:$/, '').trim();
                        }
                        if (!bonusName) { // If name is still empty, use the whole text before trying to extract just value
                           bonusName = allText.split(/[\d.,]+%/)[0].trim(); // Get text before first percentage
                        }
                         bonusName = bonusName.replace(/<br\/?>/gi, ' ').replace(/\s\s+/g, ' ').trim();
                    }

                    bonusName = bonusName || 'Special Bonus'; // Default if still empty

                    // Extract value again if it wasn't part of the name extraction logic
                    if (!bonusValue) {
                        const valueOnlyMatch = tempDiv.textContent.match(/([\d.,]+%?)/);
                        if (valueOnlyMatch && valueOnlyMatch[1]) {
                            bonusValue = valueOnlyMatch[1];
                        }
                    }

                    itemData.bonuses.push({ name: bonusName, value: bonusValue });
                }
            });
            items[uid] = itemData;
        });
        console.log(`Faction Armory Snapshot: Scrape complete. Found ${Object.keys(items).length} items in active tab.`);
        return items;
    }

    async function sendDataToSheet(data) {
        // ... (sendDataToSheet logic remains the same) ...
        console.log('Faction Armory Snapshot: Sending data to Google Sheet...');
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: WEB_APP_URL,
                data: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                onload: function (response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.status === 'success') {
                            console.log('Faction Armory Snapshot: Data sent successfully:', result.message);
                            alert(`Snapshot data sent to Google Sheet: ${result.message}`);
                            resolve(result);
                        } else {
                            console.error('Faction Armory Snapshot: Error from Google Sheet Web App:', result.message, result.errorDetails);
                            alert(`Error sending data: ${result.message}\nDetails: ${result.errorDetails || 'N/A'}`);
                            reject(new Error(result.message || 'Unknown error from web app.'));
                        }
                    } catch (e) {
                        console.error('Faction Armory Snapshot: Error parsing response:', response.responseText, e);
                        alert('Error parsing server response. Check console.');
                        reject(e);
                    }
                },
                onerror: function (error) {
                    console.error('Faction Armory Snapshot: GM_xmlhttpRequest error:', error);
                    alert('Failed to send data. Check console (e.g., CORS, network issue, or incorrect Web App URL).');
                    reject(error);
                }
            });
        });
    }

    function attemptUIInitialization(reason) {
        // ... (attemptUIInitialization logic remains the same) ...
        console.log(`Faction Armory Snapshot: attemptUIInitialization called (Reason: ${reason}). uiCreated: ${uiCreated}, Attempts: ${initializationAttempts}`);
        if (uiCreated) {
            if (initializationInterval) clearInterval(initializationInterval);
            return;
        }
        const armoryTabsDiv = document.querySelector(TARGET_ARMORY_ELEMENT_ID);
        if (armoryTabsDiv) {
            console.log(`Faction Armory Snapshot: Target "${TARGET_ARMORY_ELEMENT_ID}" found by attemptUIInitialization.`);
            if (!document.getElementById(mainButtonContainerId)) {
                 if (createUI()) {
                    if (initializationInterval) clearInterval(initializationInterval);
                 }
            } else {
                uiCreated = true;
                if (initializationInterval) clearInterval(initializationInterval);
            }
        } else {
             console.log(`Faction Armory Snapshot: Target "${TARGET_ARMORY_ELEMENT_ID}" NOT found by attemptUIInitialization.`);
        }
    }

    console.log('Faction Armory Snapshot: Setting up MutationObserver for document.body.');
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        if (uiCreated) {
            return;
        }
        const armoryTabsDiv = document.querySelector(TARGET_ARMORY_ELEMENT_ID);
        if (armoryTabsDiv) {
            console.log(`Faction Armory Snapshot: Target "${TARGET_ARMORY_ELEMENT_ID}" detected by MutationObserver callback.`);
            if (createUI()) {
                // UI created
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    initializationInterval = setInterval(() => {
        initializationAttempts++;
        if (uiCreated || initializationAttempts > MAX_INITIALIZATION_ATTEMPTS) {
            clearInterval(initializationInterval);
            if (!uiCreated && initializationAttempts > MAX_INITIALIZATION_ATTEMPTS) {
                console.error('Faction Armory Snapshot: Max initialization attempts reached. UI not created.');
            }
            return;
        }
        attemptUIInitialization(`IntervalAttempt_${initializationAttempts}`);
    }, 500);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Faction Armory Snapshot: DOMContentLoaded event fired.');
            attemptUIInitialization('DOMContentLoaded');
        });
    } else {
        console.log(`Faction Armory Snapshot: Document already ${document.readyState}.`);
        attemptUIInitialization(`readyState_${document.readyState}`);
    }
    console.log('Faction Armory Snapshot: End of script execution (initial setup phase). Interval and Observer are active.');
})();
