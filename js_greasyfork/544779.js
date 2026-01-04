// ==UserScript==
// @name         Roblox Friends List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Showing "hidden" friend lists
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544779/Roblox%20Friends%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/544779/Roblox%20Friends%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store original fetch
    const originalFetch = window.fetch;

    // Intercept all fetch requests
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);

        // Check if this is a MustHideConnections request
        if (args[0] && args[0].includes && args[0].includes('MustHideConnections')) {
            // Clone response to avoid consumption issues
            const clonedResponse = response.clone();

            // Override the json method
            const originalJson = response.json;
            response.json = async function() {
                const data = await originalJson.call(clonedResponse);

                // Force the feature to appear as "Denied" so friends list shows
                const modifiedData = {
                    ...data,
                    access: "Denied",
                    shouldPrompt: false
                };

                return modifiedData;
            };
        }

        return response;
    };

    // Also intercept XMLHttpRequest for completeness
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._url && this._url.includes('MustHideConnections')) {
            const originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const originalResponse = this.responseText;
                        const data = JSON.parse(originalResponse);

                        if (data.access === "Granted") {
                            const modifiedData = {
                                ...data,
                                access: "Denied",
                                shouldPrompt: false
                            };

                            // Override responseText
                            Object.defineProperty(this, 'responseText', {
                                get: function() { return JSON.stringify(modifiedData); },
                                configurable: true
                            });
                        }
                    } catch (e) {
                        // Silently handle parsing errors
                    }
                }

                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this);
                }
            };
        }

        return originalXHRSend.apply(this, args);
    };
})();