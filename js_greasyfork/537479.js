// ==UserScript==
// @name         Faction CPR Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Tracks CPR data for organized crimes by intercepting Fetch requests, compatible with TornPDA and PC
// @author       Allenone[2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/537479/Faction%20CPR%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/537479/Faction%20CPR%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ENDPOINT = 'https://tornprobability.com:3000/api/SubmitCPR';
    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const STORAGE_PREFIX = 'FactionCPRTracker_';
    const isTornPDA = typeof window.flutter_inappwebview !== 'undefined';

    // Storage functions
    const getValue = isTornPDA
    ? (key, def) => JSON.parse(localStorage.getItem(key) || JSON.stringify(def))
    : GM_getValue;
    const setValue = isTornPDA
    ? (key, value) => localStorage.setItem(key, JSON.stringify(value))
    : GM_setValue;

    // HTTP request function
    const xmlhttpRequest = isTornPDA
    ? (details) => {
        window.flutter_inappwebview.callHandler('PDA_httpPost', details.url, details.headers, details.data)
            .then(response => {
            details.onload({
                status: response.status,
                responseText: response.data
            });
        })
            .catch(err => details.onerror(err));
    }
    : GM_xmlhttpRequest;

    // API key handling
    let API_KEY;
    if (isTornPDA) {
        API_KEY = "###PDA-APIKEY###"; // Hardcoded for TornPDA Change this manually if you want to use a different key.
        setValue(`${STORAGE_PREFIX}api_key`, API_KEY);
    } else {
        API_KEY = getValue(`${STORAGE_PREFIX}api_key`, null);
        if (!API_KEY) {
            API_KEY = prompt('Please enter your Torn API key (Public Access):');
            if (!API_KEY) {
                alert('Faction CPR Tracker: API key is required for functionality.');
                return;
            }
            setValue(`${STORAGE_PREFIX}api_key`, API_KEY);
            if (API_KEY) {
                submitCPRData(API_KEY, getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {}));
            }
        }
    }

    async function submitCPRData(apiKey, checkpointPassRates) {
        return new Promise((resolve, reject) => {
            xmlhttpRequest({
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
        let CheckpointPassRates = getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {});

        if (!CheckpointPassRates[scenarioName]) {
            CheckpointPassRates[scenarioName] = {};
            data.playerSlots.forEach(slot => {
                CheckpointPassRates[scenarioName][slot.name] = slot.player === null ? slot.successChance : 0;
            });
        } else {
            data.playerSlots.forEach(slot => {
                if (slot.player === null) {
                    CheckpointPassRates[scenarioName][slot.name] = slot.successChance;
                }
            });
        }

        setValue(`${STORAGE_PREFIX}CheckpointPassRates`, CheckpointPassRates);
    }

    // Fetch Interception
    const win = isTornPDA ? window : (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
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
                const API_KEY = getValue(`${STORAGE_PREFIX}api_key`, null);
                if (API_KEY) {
                    submitCPRData(API_KEY, getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {}));
                }
            }
        } catch (err) {
            console.error('Error processing response:', err);
        }
        return response;
    };
})();