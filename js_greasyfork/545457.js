// ==UserScript==
// @name         OC Success Chance 2.0 (Variable CPR)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Dynamic OC success chance calculator using API endpoints
// @author       Modified By TreeMapper from Allenone [2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      tornprobability.com
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/545457/OC%20Success%20Chance%2020%20%28Variable%20CPR%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545457/OC%20Success%20Chance%2020%20%28Variable%20CPR%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Setting DEBUG to true to enable all logging
    const DEBUG = true;
    const request = GM.xmlHttpRequest || GM.xmlhttpRequest;
    let observer;
    let scenarioData = {};

    function log(...args) {
        if (DEBUG) console.log('[OC Success]', ...args);
    }

    function logError(...args) {
        console.error('[OC Success]', ...args);
    }

    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

    async function callOCAPI(endpoint, data = null, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            // Log the API call details before sending the request
            log(`Calling API endpoint: ${endpoint}`);
            if (data) {
                log('Request payload:', data);
            }

            request({
                method: data ? 'POST' : 'GET',
                url: `https://tornprobability.com:3000/${endpoint}`,
                headers: data ? { 'Content-Type': 'application/json' } : {},
                data: data ? JSON.stringify(data) : null,
                signal: controller.signal,
                onload: (response) => {
                    clearTimeout(timeoutId);
                    try {
                        const result = JSON.parse(response.responseText);
                        if (response.status >= 200 && response.status < 300) {
                            resolve(result);
                        } else {
                            reject(new Error(result.error || 'API error'));
                        }
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }

    async function fetchScenarioData() {
        try {
            // Log which initial API calls are being made
            log('Fetching initial scenario data from API...');
            const [supportedScenarios, roleMappings] = await Promise.all([
                callOCAPI('api/GetSupportedScenarios'),
                callOCAPI('api/GetRoleNames')
            ]);

            scenarioData = supportedScenarios.reduce((acc, scenario) => {
                const roles = roleMappings[scenario.name];
                if (roles) {
                    acc[scenario.name] = {
                        paramCount: scenario.parameters,
                        paramOrder: Object.keys(roles)
                            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                            .slice(0, scenario.parameters)
                    };
                }
                return acc;
            }, {});

            log('Loaded scenario data:', scenarioData);
        } catch (error) {
            logError('Failed to initialize scenario data:', error);
        }
    }

    async function processOCElement(element) {
        try {
            const ocName = element.querySelector('.panelTitle___aoGuV')?.textContent?.trim();
            const scenario = scenarioData[ocName];

            if (!scenario) {
                log('Skipping unsupported OC:', ocName);
                return;
            }

            const parameters = [];
            const slots = element.querySelectorAll('.wrapper___Lpz_D');

            for (const slotKey of scenario.paramOrder) {
                const slot = Array.from(slots).find(s => {
                    const fiberKey = Object.keys(s).find(k => k.startsWith('__reactFiber$'));
                    const fiberNode = s[fiberKey];
                    return fiberNode?.return?.key === `slot-${slotKey}`;
                });

                const chanceElement = slot?.querySelector('.successChance___ddHsR');
                // Check if the chanceElement exists and hasn't been processed for editing yet
                if (chanceElement && !chanceElement.hasAttribute('data-editable-setup')) {
                    // Make the element editable and change its background
                    chanceElement.setAttribute('contenteditable', 'true');
                    chanceElement.style.backgroundColor = 'black';

                    // Add an event listener for user input
                    chanceElement.addEventListener('input', () => {
                        log('User edited a success chance. Recalculating...');
                        // Remove the processed class to allow the element to be processed again
                        element.classList.remove('oc-processed');
                        // Trigger the main processing loop
                        processOCs();
                    });

                    // Set a flag to prevent adding the listener multiple times
                    chanceElement.setAttribute('data-editable-setup', 'true');
                }

                const chanceText = chanceElement?.textContent;
                // Remove both '%' and any non-breaking spaces before parsing
                const chance = chanceText ? parseFloat(chanceText.replace(/%|\u00A0/g, '')) : 0;
                parameters.push(chance);
            }

            if (parameters.length !== scenario.paramCount) {
                logError(`Parameter count mismatch for ${ocName}`);
                return;
            }
            // Log the request body for the calculation API call
            log(`Preparing to calculate success for ${ocName} with parameters:`, parameters);

            const result = await callOCAPI('api/CalculateSuccess', {
                scenario: ocName,
                parameters
            });

            if (result?.successChance) {
                injectSuccessChance(element, result.successChance);
            }
        } catch (error) {
            logError('OC processing failed:', error);
        }
    }

    function injectSuccessChance(element, chance) {
        const display = element.querySelector('.oc-success-display') || document.createElement('p');
        display.className = 'oc-success-display';
        display.textContent = `Success Chance: ${(chance * 100).toFixed(2)}%`;
        element.querySelector('.panelTitle___aoGuV')?.after(display);
    }

    function processOCs() {
        document.querySelectorAll('.wrapper___U2Ap7:not(.oc-processed)').forEach(element => {
            element.classList.add('oc-processed');
            processOCElement(element);
        });
    }

    async function initialize() {
        await fetchScenarioData();

        const rootNode = document.querySelector('#factionCrimes-root, #faction-crimes-root') || document.body;
        observer = new MutationObserver(processOCs);
        observer.observe(rootNode, observerConfig);

        document.querySelector('.buttonsContainer___aClaa')?.addEventListener('click', () => {
            document.querySelectorAll('.wrapper___U2Ap7.oc-processed').forEach(el => {
                el.classList.remove('oc-processed');
            });
            setTimeout(processOCs, 500);
        });

        processOCs();
    }

    // Initialize script
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();
