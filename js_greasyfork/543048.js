// ==UserScript==
// @name         Torn Stats Faction CPR Tracker (Debug Version)
// @namespace    http://tampermonkey.net/
// @version      1.1.2-debug
// @description  Tracks CPR data for organized crimes by intercepting Fetch requests, compatible with TornPDA and PC, with debug logging added
// @author       Allenone[2033011], IceBlueFire[776]
// @license      MIT
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      tornstats.com
// @downloadURL https://update.greasyfork.org/scripts/543048/Torn%20Stats%20Faction%20CPR%20Tracker%20%28Debug%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543048/Torn%20Stats%20Faction%20CPR%20Tracker%20%28Debug%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const STORAGE_PREFIX = 'TSFactionCPRTracker_';
    const isTornPDA = typeof window.flutter_inappwebview !== 'undefined';

    // Storage functions
    const getValue = isTornPDA
        ? (key, def) => JSON.parse(localStorage.getItem(key) || JSON.stringify(def))
        : GM_getValue;
    const setValue = isTornPDA
        ? (key, value) => localStorage.setItem(key, JSON.stringify(value))
        : GM_setValue;
    const deleteValue = isTornPDA
        ? (key, value) => localStorage.removeItem(key)
        : GM_deleteValue;

    // HTTP request function
    const xmlhttpRequest = isTornPDA
        ? (details) => {
            console.log('[DEBUG] Sending PDA request to Torn Stats:', details);
            window.flutter_inappwebview.callHandler('PDA_httpPost', details.url, details.headers, details.data)
                .then(response => {
                    details.onload({
                        status: response.status,
                        responseText: response.data
                    });
                })
                .catch(err => {
                    console.error('[DEBUG] PDA HTTP error:', err);
                    details.onerror(err);
                });
        }
        : GM_xmlhttpRequest;

    // API key handling (hardcoded)
    const API_KEY = '######Torn api key for torn stats used here#########';
    console.log('[DEBUG] Using API key:', API_KEY);
    setValue(`${STORAGE_PREFIX}api_key`, API_KEY);

    async function submitCPRData(apiKey, checkpointPassRates) {
        console.log('[DEBUG] Submitting CPR Data to Torn Stats with key:', apiKey);
        console.log('[DEBUG] Payload:', checkpointPassRates);

        return new Promise((resolve, reject) => {
            xmlhttpRequest({
                method: 'POST',
                url: 'https://www.tornstats.com/api/v2/' + apiKey + '/crime_pass_rates/store',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(checkpointPassRates),
                onload: (response) => {
                    console.log('[DEBUG] Torn Stats Response Status:', response.status);
                    console.log('[DEBUG] Torn Stats Response Text:', response.responseText);

                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        console.log('[DEBUG] Parsed Torn Stats Response JSON:', jsonResponse);

                        if (jsonResponse.status === false && jsonResponse.message === 'ERROR: User not found.') {
                            console.warn('[DEBUG] Invalid API key. Please verify it is correct.');
                            reject(new Error('Invalid API key'));
                            return;
                        }
                    } catch (e) {
                        console.error('[DEBUG] JSON parse error:', e);
                    }

                    if (response.status >= 200 && response.status < 300) {
                        console.log('[DEBUG] CPR data submitted successfully');
                        resolve();
                    } else {
                        console.error('[DEBUG] API error during submission:', response.status, response.responseText);
                        reject(new Error('API error'));
                    }
                },
                onerror: (err) => {
                    console.error('[DEBUG] Submission error:', err);
                    reject(err);
                }
            });
        });
    }

    function processCPRs(data) {
        const scenarioName = String(data.scenario.name);
        let CheckpointPassRates = getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {});
        console.log('[DEBUG] Processing CPRs for scenario:', scenarioName);

        if (!CheckpointPassRates[scenarioName]) {
            CheckpointPassRates[scenarioName] = {};
            data.playerSlots.forEach(slot => {
                const slotName = String(slot.name);
                CheckpointPassRates[scenarioName][slotName] = slot.player === null ? slot.successChance : 0;
            });
        } else {
            data.playerSlots.forEach(slot => {
                const slotName = String(slot.name);
                if (slot.player === null) {
                    CheckpointPassRates[scenarioName][slotName] = slot.successChance;
                }
            });
        }

        setValue(`${STORAGE_PREFIX}CheckpointPassRates`, CheckpointPassRates);
        console.log('[DEBUG] Updated CheckpointPassRates:', CheckpointPassRates);
    }

    // Fetch Interception
    const win = isTornPDA ? window : (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
    const originalFetch = win.fetch;
    win.fetch = async function (resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }

        console.log('[DEBUG] Intercepted fetch to:', url);

        let isRecruitingGroup = false;
        if (config?.body instanceof FormData) {
            isRecruitingGroup = config.body.get('group') === 'Recruiting';
        } else if (config?.body) {
            isRecruitingGroup = config.body.toString().includes('group=Recruiting');
        }

        console.log('[DEBUG] Is Recruiting Group:', isRecruitingGroup);

        if (!isRecruitingGroup) {
            return originalFetch.apply(this, arguments);
        }

        const response = await originalFetch.apply(this, arguments);
        try {
            const text = await response.clone().text();
            const json = JSON.parse(text);

            console.log('[DEBUG] Fetch Response JSON:', json);

            if (json.success && json.data && json.data.length > 1) {
                json.data.forEach(processCPRs);
                console.log('[DEBUG] Calling submitCPRData...');
                submitCPRData(API_KEY, getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {}));
            } else {
                console.log('[DEBUG] JSON not valid or not enough data to process.');
            }
        } catch (err) {
            console.error('[DEBUG] Error processing response:', err);
        }

        return response;
    };

    // Optional: force submission after 5 seconds (useful for debug)
    setTimeout(() => {
        const CheckpointPassRates = getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {});
        console.log('[DEBUG] Manual post after timeout:', CheckpointPassRates);
        submitCPRData(API_KEY, CheckpointPassRates);
    }, 5000);
})();
