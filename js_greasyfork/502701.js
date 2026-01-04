// ==UserScript==
// @name         Nexus Mods Download History Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fetch mod names and descriptions from Nexus Mods download history
// @match        https://www.nexusmods.com/users/myaccount?tab=download+history
// @match        https://www.nexusmods.com/baldursgate3/users/myaccount?tab=download+history
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502701/Nexus%20Mods%20Download%20History%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/502701/Nexus%20Mods%20Download%20History%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let modData = [];

    // Function to create and show the overlay
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'fetch-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.color = 'white';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '10000';
        overlay.innerHTML = `
            <div style="background: #333; padding: 20px; border-radius: 10px; max-width: 80%; max-height: 80%; overflow: hidden; position: relative;">
                <button id="close-overlay" style="position: absolute; top: 10px; right: 10px; background: #666; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer;">X</button>
                <div id="fetch-status"></div>
                <button id="toggle-list">Show</button>
                <button id="export-json" style="margin-left: 10px;">Export 0 Items</button>
                <div id="mod-list" style="display: none; margin-top: 10px; max-height: 300px; overflow-y: auto; border: 1px solid #555; padding: 10px; background: #444;"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add toggle functionality for the list
        document.getElementById('toggle-list').addEventListener('click', function() {
            const modList = document.getElementById('mod-list');
            const isVisible = modList.style.display === 'block';
            modList.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? 'Show' : 'Hide';

            if (!isVisible) {
                modList.innerHTML = '';
                modData.forEach(mod => {
                    const modItem = document.createElement('div');
                    modItem.innerHTML = `<strong>${mod.name}</strong>: ${mod.description}`;
                    modList.appendChild(modItem);
                });
            }
        });

        // Add functionality to close the overlay
        document.getElementById('close-overlay').addEventListener('click', function() {
            document.getElementById('fetch-overlay').remove();
        });

        // Add functionality to export JSON
        document.getElementById('export-json').addEventListener('click', function() {
            const blob = new Blob([JSON.stringify(modData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mod_data.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Function to fetch mod data and update the list
    async function fetchModData() {
        createOverlay();
        const response = await fetch('https://www.nexusmods.com/Core/Libs/Common/Managers/Mods?GetDownloadHistory', {
            headers: {
                'Referer': 'https://www.nexusmods.com/users/myaccount?tab=download+history'
            }
        });
        const data = await response.json();
        const entries = data.data;
        const total = entries.length;
        let completed = 0;

        const status = document.getElementById('fetch-status');
        const exportButton = document.getElementById('export-json');

        for (const entry of entries) {
            const [image, modName, , , , , , , modId, modSite] = entry;
            if(modSite == 'baldursgate3'){
                const url = `https://www.nexusmods.com/${modSite}/mods/${modId}`;

                try {
                    const modResponse = await fetch(url);
                    let text = await modResponse.text();
                    text = text.replaceAll('class="bbc_spoiler_content"', '').replaceAll('<div class="bbc_spoiler_show">Show</div>','').replaceAll('Spoiler: ','');
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const descriptionElement = doc.querySelector('.mod_description_container');
                    const description = descriptionElement ? descriptionElement.innerText : 'No description available';

                    modData.push({ name: modName, description });

                } catch (error) {
                    console.error(`Error fetching ${url}:`, error);
                }
            }

            completed++;
            status.textContent = `Fetching URL ${completed} of ${total}`;
            exportButton.textContent = `Export ${completed} Items`;
        }
    }

    // Start fetching when the script runs
    fetchModData();
})();
