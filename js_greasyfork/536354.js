// ==UserScript==
// @name         CPR Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Tracks completed organized crime scenarios by intercepting XHR and Fetch requests
// @author       Allenone[2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/536354/CPR%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/536354/CPR%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ENDPOINT = 'https://tornprobability.com:3000/api/SubmitCPR';
    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const request = GM_xmlhttpRequest || GM.xmlHttpRequest;

    let CheckpointPassRates = GM_getValue('CheckpointPassRates', {});

    // Prompt for API key if not stored
    let API_KEY = GM_getValue('api_key');
    if (!API_KEY) {
        API_KEY = prompt('Please enter your Torn API key (Minimal Access required):');
        if (!API_KEY) {
            alert('API key is required for functionality.');
            return;
        }
        GM_setValue('api_key', API_KEY);
    }

    async function submitCPRData(apiKey, checkpointPassRates) {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: API_ENDPOINT,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ apiKey, checkpointPassRates }),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log('CPR data submitted successfully');
                        resolve();
                    } else {
                        console.error('API error:', response.status, response.responseText);
                        reject(new Error('API error'));
                    }
                },
                onerror: (err) => {
                    console.error('Submission error:', err);
                    reject(err);
                }
            });
        });
    }

    function processCPRs(data) {
        const scenarioName = data.scenario.name;

        // Initialize scenario data if it doesn't exist
        if (!CheckpointPassRates[scenarioName]) {
            CheckpointPassRates[scenarioName] = {};
            data.playerSlots.forEach(slot => {
                CheckpointPassRates[scenarioName][slot.name] = slot.player === null ? slot.successChance : 0;
            });
        } else {
            // Update existing scenario data for empty slots
            data.playerSlots.forEach(slot => {
                if (slot.player === null) {
                    CheckpointPassRates[scenarioName][slot.name] = slot.successChance;
                }
            });
        }

        // Save updated CheckpointPassRates
        GM_setValue('CheckpointPassRates', CheckpointPassRates);
    }

    // Fetch Interception
    const win = (unsafeWindow || window);
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }

        let isRecruitingGroup = false;
        if (config?.body instanceof FormData) {
            isRecruitingGroup = config.body.get('group') === 'Recruiting';
        } else if (config?.body) {
            isRecruitingGroup = config.body.toString().includes('group=Recruiting');
        }

        if (!isRecruitingGroup) {
            return originalFetch.apply(this, arguments);
        }

        const response = await originalFetch.apply(this, arguments);
        try {
            const json = JSON.parse(await response.clone().text());
            if (json.success && json.data && json.data.length > 1) {
                json.data.forEach(processCPRs);
                // submit to server.
                submitCPRData(API_KEY, CheckpointPassRates);
            }
        } catch (err) {
            console.error('Error processing response:', err);
        }
        return response;
    };
})();