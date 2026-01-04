// ==UserScript==
// @name         Azure Function Inspector with Dynamic Token
// @namespace    https://tampermonkey.net/
// @version      0.01
// @description  Fetch Azure Functions dynamically with Bearer Token extracted from the Azure Portal and log token expiry.
// @author       JoaoWorkspace
// @match        https://portal.azure.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526790/Azure%20Function%20Inspector%20with%20Dynamic%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/526790/Azure%20Function%20Inspector%20with%20Dynamic%20Token.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const subscriptionId = '<YOUR_SUBSCRIPTION_ID>';
    const functionApps = ['PTFUNC01PP', 'PTFUNC001PP'];
    const apiVersion = '2021-01-01';

    let bearerToken = null;

    // Function to decode a JWT token and log its expiry
    function logTokenExpiry(token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);

            if (payload.exp) {
                const expTimestamp = payload.exp;
                const expiryDate = new Date(expTimestamp * 1000);
                const formattedDate = expiryDate.toUTCString();
                console.log(`Bearer Token expires on: ${formattedDate}`);
            } else {
                console.warn('Token does not contain an "exp" field.');
            }
        } catch (error) {
            console.error('Failed to decode the token or extract expiry:', error);
        }
    }

    // Override fetch to capture the Bearer Token
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        // Check if the request contains the Bearer Token
        if (args[0].includes('management.azure.com') && response.headers) {
            const authHeader = response.headers.get('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                bearerToken = authHeader.split(' ')[1];
                console.log('Bearer Token Captured:', bearerToken);
                logTokenExpiry(bearerToken); // Log token expiry when captured
            }
        }

        return response;
    };

    async function fetchFunctionAppsFunctions(functionApp) {
        if (!bearerToken) {
            throw new Error('Bearer Token not captured yet.');
        }

        const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Web/sites/${functionApp}/functions?api-version=${apiVersion}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                },
                onload: (response) => {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.value.map(func => ({
                            FunctionName: func.name,
                            Enabled: func.properties.config.disabled ? false : true
                        })));
                    } else {
                        console.error(`Failed to fetch functions for ${functionApp}:`, response);
                        reject(response);
                    }
                },
                onerror: (error) => {
                    console.error('Error fetching functions:', error);
                    reject(error);
                }
            });
        });
    }

    async function main() {
        try {
            console.log('Waiting for Bearer Token...');
            while (!bearerToken) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait for token capture
            }

            const allFunctions = {};
            for (const functionApp of functionApps) {
                const functions = await fetchFunctionAppsFunctions(functionApp);
                allFunctions[functionApp] = functions;
            }

            console.log('Fetched Functions:', allFunctions);

            // Find duplicates
            const allFunctionNames = functionApps.flatMap(app => allFunctions[app]);
            const duplicates = allFunctionNames.reduce((acc, func) => {
                const key = `${func.FunctionName}|${func.Enabled}`;
                if (!acc[key]) {
                    acc[key] = { ...func, Count: 0 };
                }
                acc[key].Count++;
                return acc;
            }, {});

            const duplicateList = Object.values(duplicates).filter(item => item.Count > 1);

            console.log('Duplicate Functions:', duplicateList);

            alert(`Duplicate Functions:\n${JSON.stringify(duplicateList, null, 2)}`);
        } catch (error) {
            console.error('Error in main process:', error);
        }
    }

    main();
})();