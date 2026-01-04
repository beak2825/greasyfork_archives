// ==UserScript==
// @name         OC Success Chance 2.0
// @namespace    http://tampermonkey.net/
// @version      2.1.6
// @description  Dynamic OC success chance calculator using API endpoints - Enhanced for mobile/desktop compatibility
// @author       Allenone [2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      tornprobability.com
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529563/OC%20Success%20Chance%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/529563/OC%20Success%20Chance%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG = false;
    const request = GM.xmlHttpRequest || GM.xmlhttpRequest;
    let observer;
    let scenarioData = {};
    let initialized = false;

    function log(...args) {
        if (DEBUG) console.log('[OC Success]', ...args);
    }

    function logError(...args) {
        console.error('[OC Success]', ...args);
    }

    const observerConfig = {
        childList: true,
        subtree: true
    };

    async function callOCAPI(endpoint, data = null, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const hasAbort = typeof AbortController !== 'undefined';
            const controller = hasAbort ? new AbortController() : null;
            let aborted = false;

            const timeoutId = setTimeout(() => {
                aborted = true;
                if (controller) {
                    controller.abort();
                } else {
                    reject(new Error('Request timeout'));
                }
            }, timeout);

            const options = {
                method: data ? 'POST' : 'GET',
                url: `https://tornprobability.com:3000/${endpoint}`,
                headers: data ? { 'Content-Type': 'application/json' } : {},
                data: data ? JSON.stringify(data) : null,
                ...(hasAbort ? { signal: controller.signal } : {})
            };

            request({
                ...options,
                onload: (response) => {
                    if (aborted) return;
                    clearTimeout(timeoutId);
                    if (!response) {
                        reject(new Error('No response received'));
                        return;
                    }
                    try {
                        const result = JSON.parse(response.responseText);
                        if (response.status >= 200 && response.status < 300) {
                            resolve(result);
                        } else {
                            reject(new Error(result.error || `HTTP ${response.status}`));
                        }
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => {
                    if (!aborted) {
                        clearTimeout(timeoutId);
                        reject(err);
                    }
                },
                ontimeout: () => {
                    if (!aborted) {
                        clearTimeout(timeoutId);
                        reject(new Error('Request timeout'));
                    }
                }
            });
        });
    }

    async function fetchScenarioData() {
        const cacheKey = 'oc_scenario_data_cache';
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24 hours cache
                    scenarioData = data;
                    log('Loaded cached scenario data');
                    return;
                }
            } catch (e) {
                logError('Cache parse error:', e);
            }
        }

        try {
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

            localStorage.setItem(cacheKey, JSON.stringify({
                data: scenarioData,
                timestamp: Date.now()
            }));

            log('Fetched and cached scenario data:', scenarioData);
        } catch (error) {
            logError('Failed to fetch scenario data:', error);
            // Keep any existing scenarioData for partial functionality
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

                const chanceText = slot?.querySelector('.successChance___ddHsR')?.textContent;
                const chance = chanceText ? parseFloat(chanceText.replace('%', '')) : 0;
                parameters.push(chance);
            }

            if (parameters.length !== scenario.paramCount) {
                logError(`Parameter count mismatch for ${ocName}: expected ${scenario.paramCount}, got ${parameters.length}`);
                return;
            }

            // Add a unique nonce to prevent caching issues with identical requests
            const calcData = {
                scenario: ocName,
                parameters,
                nonce: Date.now() + Math.random().toString(36)
            };

            const result = await callOCAPI('api/CalculateSuccess', calcData);

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
            // Use requestIdleCallback for better performance on mobile/low-end devices
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(() => processOCElement(element));
            } else {
                setTimeout(() => processOCElement(element), 0);
            }
        });
    }

    function setupObserver(container) {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            let hasAdditions = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    hasAdditions = true;
                    break;
                }
            }
            if (hasAdditions) {
                requestIdleCallback ? requestIdleCallback(processOCs) : setTimeout(processOCs, 0);
            }
        });

        observer.observe(container, observerConfig);
        log('DOM observer setup on:', container);
    }

    function setupClickHandler() {
        const buttonsContainer = document.querySelector('.buttonsContainer___aClaa');
        if (buttonsContainer) {
            buttonsContainer.addEventListener('click', () => {
                // Remove processed class from existing elements to allow re-processing if needed
                document.querySelectorAll('.wrapper___U2Ap7.oc-processed').forEach(el => {
                    el.classList.remove('oc-processed');
                });
                // No setTimeout needed; observer will handle new additions
                // But force a process for any immediately available
                requestIdleCallback ? requestIdleCallback(processOCs) : setTimeout(processOCs, 50);
            }, { passive: true });
            log('Click handler setup');
        }
    }

    async function initialize() {
        if (initialized) return;
        initialized = true;

        await fetchScenarioData();

        let container = document.querySelector('#factionCrimes-root, #faction-crimes-root');
        if (!container) {
            container = document.body; // Fallback
        }

        setupObserver(container);
        setupClickHandler();

        // Initial process
        requestIdleCallback ? requestIdleCallback(processOCs) : setTimeout(processOCs, 0);
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();