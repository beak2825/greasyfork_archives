// ==UserScript==
// @name         Torn OC API Example
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  calls external API to return probabilities of all outcomes
// @author       Allenone [2033011]
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @license      MIT
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/526412/Torn%20OC%20API%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/526412/Torn%20OC%20API%20Example.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function callOCAPI(endpoint, data = null, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            GM.xmlHttpRequest({
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
                            console.log(result);
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

    // P1, P2, P3, P4, P5, P6
    const parameters = [70, 70, 70, 70, 70, 70];
    callOCAPI('api/CalculateSuccess', {
        scenario: 'Blast from the Past',
        parameters
    });

    async function RoleNames() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://tornprobability.com:3000/api/GetRoleNames',
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log(data); // Log the response data to console
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => {
                    reject(err);
                }
            });
        });
    }

    RoleNames().catch(error => {
        console.error('Error fetching data:', error);
    });

    async function SupportedScenarios() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://tornprobability.com:3000/api/GetSupportedScenarios',
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log(data); // Log the response data to console
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => {
                    reject(err);
                }
            });
        });
    }

    SupportedScenarios().catch(error => {
        console.error('Error fetching data:', error);
    });

    async function RoleWeights() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://tornprobability.com:3000/api/GetRoleWeights',
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log(data); // Log the response data to console
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => {
                    reject(err);
                }
            });
        });
    }

    RoleWeights();

})();