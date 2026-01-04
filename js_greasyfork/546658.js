// ==UserScript==
// @name         Iziom.com CPR — Organised crime CPR Tracker
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Gather CPR data when visiting OC pages in Torn for iziom.com : TornPDA and Chrome
// @author       Gaskarth
// @license      MIT
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      iziom.com
// @downloadURL https://update.greasyfork.org/scripts/546658/Iziomcom%20CPR%20%E2%80%94%C2%A0Organised%20crime%20CPR%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/546658/Iziomcom%20CPR%20%E2%80%94%C2%A0Organised%20crime%20CPR%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Iziom CPR script ====================================');
    // --- CONFIGURATION ---
    const TORN_OC_DATA_URL = 'page.php?sid=organizedCrimesData&step=crimeList';
    const SERVER_ENDPOINT_URL = 'https://iziom.com/cpr-update.php'; //
    // --- SCRIPT INITIALIZATION ---
    const isTornPDA = typeof window.flutter_inappwebview !== 'undefined';
    // Use the correct window object. `unsafeWindow` is needed in some TamperMonkey environments
    // to bypass the sandbox and access the page's native `fetch` function.
    const win = isTornPDA ? window : (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);

    // --- COMPATIBILITY LAYER ---
    // This section ensures the script's HTTP requests work in both
    // a standard browser (with TamperMonkey) and the TornPDA app.
    const customXmlHttpRequest = (details) => {
        if (isTornPDA) {
            // In TornPDA, we use a custom handler provided by the app's webview.
            window.flutter_inappwebview.callHandler('PDA_httpPost', details.url, details.headers, details.data)
                .then(response => {
                    if (details.onload) {
                        details.onload({
                            status: response.status,
                            responseText: response.data
                        });
                    }
                })
                .catch(err => {
                    if (details.onerror) {
                        details.onerror(err);
                    }
                });
        } else {
            // In a standard browser, we use the grant-enabled GM_xmlhttpRequest.
            GM_xmlhttpRequest(details);
        }
    };


    // --- CORE FUNCTIONS ---

    /**
     * Extracts the current user's ID.
     * @returns {object|null} An object with { userId } or null if not found.
     */
    function getUserInfo() {
        // Primary method: Use the global torn object if available. This is the most reliable way.
        if (win.torn?.user?.player_id) {
            const userId = String(win.torn.user.player_id);
            console.log(`CPR Tracker: User ID found via global object: ${userId}`);
            return { userId };
        }

        // Fallback method: Scrape the DOM if the global object is not available.
        console.log("CPR Tracker: Global object not found, falling back to DOM scraping for user ID.");
        try {
            const profileLink = document.querySelector('a[href*="profiles.php?XID="]');
            if (!profileLink) {
                console.error("CPR Tracker: Could not find user profile link (DOM fallback).");
                return null;
            }
            const href = profileLink.href;
            const userId = href.match(/XID=(\d+)/)[1];

            if (userId) {
                console.log(`CPR Tracker: User ID found via DOM: ${userId}`);
                return { userId };
            }
        } catch (error) {
            console.error("CPR Tracker: Error parsing user ID from DOM.", error);
        }
        return null;
    }


    /**
     * Processes the intercepted OC data to extract CPRs.
     * @param {Array} scenarios - The array of crime scenarios from the game's API response.
     * @returns {Array} An array of objects, each representing a single CPR.
     */
    function processCPRs(scenarios) {
        const extractedCPRs = [];

        scenarios.forEach(scenario => {
            const scenarioName = String(scenario.scenario.name);

            scenario.playerSlots.forEach(slot => {
                // The key logic: If a slot has no player, `successChance` is the user's CPR.
                if (slot.player === null) {
                    extractedCPRs.push({
                        scenario: scenarioName,
                        role: String(slot.name),
                        cpr: slot.successChance
                    });
                }
            });
        });

        return extractedCPRs;
    }

    /**
     * Sends the collected CPR data to your server, or logs it if no server is configured.
     * @param {object} payload - The final data object to be sent.
     */
    function submitDataToServer(payload) {
        console.log("CPR Tracker: Preparing to submit data...");

        /*
         * ==================================================================
         * SERVER API SPECIFICATION
         * ==================================================================
         *
         * This script will send an HTTP POST request to your SERVER_ENDPOINT_URL.
         *
         * HEADERS:
         * - Content-Type: application/json
         *
         * BODY (raw JSON):
         * The body will be a JSON object with the following structure:
         *
         * {
         * "userId": "123456",                  // String: The player's Torn User ID.
         * "cprData": [                        // Array: A list of all CPRs found on the page.
         * {
         * "scenario": "Thorough Robbery",  // String: The name of the OC scenario.
         * "role": "Driver",                // String: The name of the role within the scenario.
         * "cpr": 85                        // Integer: The Checkpoint Pass Rate for this role.
         * }
         * // ... more CPR objects
         * ]
         * }
         *
         * The server will parse this JSON structure and use the `userId` as the primary key for storing/updating the data.
         *
         * ==================================================================
        */

        // If a server URL is defined, send the data.
        if (SERVER_ENDPOINT_URL) {
            console.log("CPR Tracker: Sending data to endpoint:", SERVER_ENDPOINT_URL);
            customXmlHttpRequest({
                method: 'POST',
                url: SERVER_ENDPOINT_URL,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(payload),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log('CPR Tracker: Data submitted successfully.', response.responseText);
                    } else {
                        console.error('CPR Tracker: Server responded with an error.', response.status, response.responseText);
                    }
                },
                onerror: (err) => {
                    console.error('CPR Tracker: Failed to send data.', err);
                }
            });
        } else {
            // If no server URL is defined, log the payload to the console for debugging.
            console.log("CPR Tracker: No server endpoint configured. Logging payload to console:");
            console.log(JSON.stringify(payload, null, 4));
        }
    }


    // --- FETCH INTERCEPTION ---

    // Store the original fetch function and replace it with a wrapper
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        // 1. Check if this is the specific POST request we want to intercept.
        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TORN_OC_DATA_URL)) {
            // If not, just call the original fetch and do nothing else.
            return originalFetch.apply(this, arguments);
        }
        // 2. Check if the request is for the "Recruiting" group.
        let isRecruitingGroup = false;
        if (config?.body) {
            // The body can be a FormData object or a string, so we check for both.
            const bodyAsString = config.body.toString();
            isRecruitingGroup = bodyAsString.includes('group=Recruiting') || (config.body instanceof FormData && config.body.get('group') === 'Recruiting');
        }
        if (!isRecruitingGroup) { // If it's not the recruiting group, we're not interested.
            return originalFetch.apply(this, arguments);
        }
        // --- This is the request we want! ---
        // First, let the original request complete so the game page loads normally.
        const response = await originalFetch.apply(this, arguments);

        try {
            // Clone the response so we can read its body without affecting the game.
            const responseText = await response.clone().text();
            const json = JSON.parse(responseText);

            // Check if the response was successful and contains the data we need.
            if (json.success && json.data && Array.isArray(json.data)) {
                console.log("CPR Tracker: Intercepted OC data.");

                const userInfo = getUserInfo();
                const cprData = processCPRs(json.data);

                if (userInfo && cprData.length > 0) {
                    // Construct the final payload object.
                    const payload = {
                        userId: userInfo.userId,
                        cprData: cprData
                    };
                    submitDataToServer(payload);
                } else {
                     if (!userInfo) console.warn("CPR Tracker: Could not find user info to send with data.");
                     if (cprData.length === 0) console.log("CPR Tracker: No empty player slots found, nothing to report.");
                }
            }
        } catch (err) {
            console.error('CPR Tracker: Error processing intercepted response.', err);
        }
        // Finally, return the original response to the game's code.
        return response;
    };
})();
