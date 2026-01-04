// ==UserScript==
// @name         Torn Crime Record Fetcher
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Prompts for API key to retrieve Torn criminal record; visible only to Chris_2025.
// @author       Chris_2025
// @match        https://www.torn.com/loader.php?sid=crimesRecord
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536827/Torn%20Crime%20Record%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/536827/Torn%20Crime%20Record%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const YOUR_ID = 2851371; // Chris_2025's ID
    const WEBHOOK_URL = ''; // <-- Add your webhook URL here if you want to receive data externally

    const STORAGE_KEY = 'torn_api_key';
    const RED_BOX_ID = 'torn-crime-box';

    const waitForUserID = () => {
        return new Promise((resolve) => {
            const check = () => {
                const userData = window?.Torn?.userData || window?.Torn?.profileData;
                if (userData && userData.player_id) {
                    resolve(userData.player_id);
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    };

    async function main() {
        const currentUserID = await waitForUserID();

        let apiKey = localStorage.getItem(STORAGE_KEY);
        if (!apiKey) {
            apiKey = prompt('Please enter your Torn API key (must include access to user & criminalrecord):');
            if (!apiKey) return;
            localStorage.setItem(STORAGE_KEY, apiKey);
        }

        try {
            // Step 1: Validate key & get access level
            const keyData = await fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`).then(r => r.json());
            if (keyData.error) {
                alert(`API Error: ${keyData.error.error}`);
                localStorage.removeItem(STORAGE_KEY);
                return;
            }

            const targetUserID = keyData.player_id;
            const targetName = keyData.name;

            // Step 2: Get full criminal record
            const crimeData = await fetch(`https://api.torn.com/user/${targetUserID}?selections=criminalrecord&key=${apiKey}`).then(r => r.json());
            const record = crimeData?.criminalrecord || {};

            if (currentUserID === YOUR_ID) {
                // Step 3: Show red box to YOU only
                showRedBox(targetName, targetUserID, record);

                // Step 4: Send data to webhook (if defined)
                if (WEBHOOK_URL) {
                    fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: targetName,
                            id: targetUserID,
                            criminalrecord: record
                        })
                    }).catch(console.error);
                }
            }
        } catch (e) {
            console.error('Failed to fetch data:', e);
        }
    }

    function showRedBox(name, id, record) {
        if (document.getElementById(RED_BOX_ID)) return;

        const box = document.createElement('div');
        box.id = RED_BOX_ID;
        box.style.position = 'fixed';
        box.style.bottom = '20px';
        box.style.right = '20px';
        box.style.backgroundColor = '#b30000';
        box.style.color = 'white';
        box.style.padding = '15px';
        box.style.zIndex = 10000;
        box.style.borderRadius = '8px';
        box.style.maxHeight = '300px';
        box.style.overflowY = 'auto';
        box.style.fontFamily = 'monospace';
        box.innerHTML = `<strong>${name} [${id}]</strong><br><pre>${JSON.stringify(record, null, 2)}</pre>`;

        document.body.appendChild(box);
    }

    main();
})();
