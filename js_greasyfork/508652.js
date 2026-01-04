// ==UserScript==
// @name         ChatGPT 4o-mini Default model
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script modifies the requests to use gpt-4o mini by default
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @icon         data:image/png;base64,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
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/508652/ChatGPT%204o-mini%20Default%20model.user.js
// @updateURL https://update.greasyfork.org/scripts/508652/ChatGPT%204o-mini%20Default%20model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this.responseURL === 'https://chatgpt.com/backend-api/conversation') {
                try {
                    const requestPayload = JSON.parse(this._requestData || '{}');
                    if (requestPayload.model && requestPayload.model !== 'gpt-4o-mini') {
                        console.log('Modifying model to gpt-4o-mini');
                        requestPayload.model = 'gpt-4o-mini';
                        this._requestData = JSON.stringify(requestPayload);
                    }
                } catch (e) {
                    console.error("Couldn't fetch payload:", e);
                }
            }
        });
        return originalOpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function() {
        const url = arguments[0];
        const options = arguments[1] || {};

        if (url === 'https://chatgpt.com/backend-api/conversation' && options.body) {
            try {
                const body = JSON.parse(options.body);
                if (body.model && body.model !== 'gpt-4o-mini') {
                    console.log('Set default model to gpt-4o-mini');
                    body.model = 'gpt-4o-mini';
                    options.body = JSON.stringify(body);
                }
            } catch (e) {
                console.error('Error modifying request payload:', e);
            }
        }

        return originalFetch.apply(this, arguments);
    };
})();
