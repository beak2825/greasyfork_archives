// ==UserScript==
// @name         Block UpsertDraft Requests
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks all requests to the upsertDraft endpoint on HubSpot
// @author       Your Name
// @match        *://app.hubspot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532113/Block%20UpsertDraft%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/532113/Block%20UpsertDraft%20Requests.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // RegEx to match the specified URL pattern
    const blockedUrlPattern = /app\.hubspot\.com\/api\/chirp-frontend-app\/v1\/gateway\/com\.hubspot\.cv\.threads\.drafts\.rpc\.DraftsFrontendService\/upsertDraft\?/;

    // Override the native fetch function
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && blockedUrlPattern.test(url)) {
            console.log("Blocked fetch request:", url);
            // Return a promise that never resolves, effectively blocking the request
            return new Promise(() => {});
        }
        return originalFetch.apply(this, args);
    };

    // Override XMLHttpRequest open method to intercept XHR requests
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (typeof url === 'string' && blockedUrlPattern.test(url)) {
            console.log("Blocked XHR request:", url);
            // Override send so that the request is never actually sent
            this.send = function() {
                console.log("Blocked sending XHR request.");
            };
            return;
        }
        return originalXHROpen.call(this, method, url, ...rest);
    };

})();
