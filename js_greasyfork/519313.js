// ==UserScript==
// @name         Crown Coins Casino Always Active Missions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make all daily missions active on Crown Coins Casino
// @author       Angus
// @match        https://crowncoinscasino.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519313/Crown%20Coins%20Casino%20Always%20Active%20Missions.user.js
// @updateURL https://update.greasyfork.org/scripts/519313/Crown%20Coins%20Casino%20Always%20Active%20Missions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to modify the missions response
    function modifyMissionsResponse(response) {
        // Make sure we have the expected data structure
        if (response?.data?.data) {
            // Modify SC missions
            if (response.data.data.scMissions) {
                response.data.data.scMissions.forEach(mission => {
                    mission.status = "ACTIVE";
                });
            }

            // Modify GC missions
            if (response.data.data.gcMissions) {
                response.data.data.gcMissions.forEach(mission => {
                    mission.status = "ACTIVE";
                });
            }
        }
        return response;
    }

    // Intercept XMLHttpRequest
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;
    const setRequestHeader = XHR.setRequestHeader;

    XHR.open = function() {
        this._url = arguments[1];
        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function() {
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function() {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this._url.includes('api.crowncoinscasino.com/v2/daily-missions')) {
                try {
                    const response = JSON.parse(this.responseText);
                    const modifiedResponse = modifyMissionsResponse(response);

                    // Override the response
                    Object.defineProperty(this, 'responseText', {
                        value: JSON.stringify(modifiedResponse),
                        writable: false
                    });
                } catch (e) {
                    console.error('Error modifying missions response:', e);
                }
            }
        });
        return send.apply(this, arguments);
    };

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [resource, config] = args;

        // Check if this is the daily missions request
        if (resource.includes('api.crowncoinscasino.com/v2/daily-missions')) {
            const response = await originalFetch.apply(this, args);
            const clone = response.clone();
            const json = await clone.json();

            // Modify the response
            const modifiedJson = modifyMissionsResponse(json);

            // Create a new response with modified data
            return new Response(JSON.stringify(modifiedJson), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }

        // Pass through all other requests
        return originalFetch.apply(this, args);
    };
})();