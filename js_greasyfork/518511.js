// ==UserScript==
// @name         WOW Vegas Always Happy Hour
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Always enable happy hour on WOW Vegas
// @author       Your name
// @match        https://www.wowvegas.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518511/WOW%20Vegas%20Always%20Happy%20Hour.user.js
// @updateURL https://update.greasyfork.org/scripts/518511/WOW%20Vegas%20Always%20Happy%20Hour.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to modify the happy hour response
    function modifyHappyHourResponse(response) {
        // Get current date and create dates for start/end times
        const now = new Date();
        const startDate = new Date(now);
        const endDate = new Date(now);

        // Set start time to 24 hours ago
        startDate.setHours(now.getHours() - 24);
        // Set end time to 24 hours from now
        endDate.setHours(now.getHours() + 24);

        // Modify the happy hour settings
        if (response.cashier.happy_hour_store_settings) {
            response.cashier.happy_hour_store_settings.enable_happy_hour = true;
            response.cashier.happy_hour_store_settings.from_datetime = startDate.toISOString();
            response.cashier.happy_hour_store_settings.to_datetime = endDate.toISOString();
        }

        return response;
    }

    // Helper function to modify the player info response
    function modifyPlayerInfoResponse(response) {
        const now = new Date();
        const twentyFourHoursAgo = Math.floor(now.getTime() / 1000) - (24 * 60 * 60);

        // Find and modify the lastHappyHourPurchase in extraInfo
        if (response.extraInfo) {
            const happyHourInfo = response.extraInfo.find(info => info.key === 'lastHappyHourPurchase');
            if (happyHourInfo) {
                happyHourInfo.value = twentyFourHoursAgo.toString();
            }
        }

        return response;
    }

    // Intercept XMLHttpRequest
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;
    const setRequestHeader = XHR.setRequestHeader;

    XHR.open = function () {
        this._url = arguments[1];
        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function () {
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                try {
                    if (this._url.includes('cms4.wowvegas.com/api/static/v1/casino-settings')) {
                        const response = JSON.parse(this.responseText);
                        const modifiedResponse = modifyHappyHourResponse(response);

                        // Override the response
                        Object.defineProperty(this, 'responseText', {
                            value: JSON.stringify(modifiedResponse),
                            writable: false
                        });
                    } else if (this._url.includes('ps.wowvegas.com/ps/ips/getPlayerInfo')) {
                        const response = JSON.parse(this.responseText);
                        const modifiedResponse = modifyPlayerInfoResponse(response);

                        // Override the response
                        Object.defineProperty(this, 'responseText', {
                            value: JSON.stringify(modifiedResponse),
                            writable: false
                        });
                    }
                } catch (e) {
                    console.error('Error modifying response:', e);
                }
            }
        });
        return send.apply(this, arguments);
    };

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const [resource, config] = args;

        // Check if this is the casino settings request
        if (resource.includes('cms4.wowvegas.com/api/static/v1/casino-settings')) {
            const response = await originalFetch.apply(this, args);
            const clone = response.clone();
            const json = await clone.json();

            // Modify the response
            const modifiedJson = modifyHappyHourResponse(json);

            // Create a new response with modified data
            return new Response(JSON.stringify(modifiedJson), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }

        // Check if this is the player info request
        if (resource.includes('ps.wowvegas.com/ps/ips/getPlayerInfo')) {
            const response = await originalFetch.apply(this, args);
            const clone = response.clone();
            const json = await clone.json();

            // Modify the response
            const modifiedJson = modifyPlayerInfoResponse(json);

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
