// ==UserScript==
// @name         Force DeepSqueak Model
// @version      1.0
// @author       Grok
// @description  Force the current chat's model to newer deepsqueak model
// @match        https://character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/1446999
// @downloadURL https://update.greasyfork.org/scripts/543645/Force%20DeepSqueak%20Model.user.js
// @updateURL https://update.greasyfork.org/scripts/543645/Force%20DeepSqueak%20Model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_HISTORY = 5;
    let xhrHistory = []; // Array to store details of the last MAX_HISTORY requests

    // --- XHR Interception ---

    // Override XMLHttpRequest methods to capture requests
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._requestDetails = {
            method: method.toUpperCase(),
            url: url,
            headers: {},
            body: null
        };
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (this._requestDetails) {
            this._requestDetails.headers[header] = value;
        }
        return originalSetRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._requestDetails) {
            this._requestDetails.body = body;
            console.log('Captured XHR:', this._requestDetails.method, this._requestDetails.url);
            xhrHistory.push({ ...this._requestDetails });
            if (xhrHistory.length > MAX_HISTORY) {
                xhrHistory.shift(); // Remove oldest entry
            }
        }
        return originalSend.apply(this, arguments);
    };

    // --- Replay Logic ---

    function replayLastRequests() {
        console.log(`Starting replay of ${xhrHistory.length} requests...`);
        if (xhrHistory.length === 0) {
            alert('No XHR requests captured yet in this session.');
            return;
        }

        // Confirmation prompt
        if (!confirm(`WARNING:\n\nYou are about to replay the last ${xhrHistory.length} captured requests.\nThis can cause unintended side effects like creating duplicate data or performing actions multiple times.\n\nPATCH requests will have their payload replaced with:\n{"preferred_model_type":"MODEL_TYPE_DEEP_SYNTH"}\n\nDo you want to proceed?`)) {
            console.log("Replay cancelled by user.");
            return;
        }

        // Replay each captured request
        xhrHistory.forEach((reqDetails, index) => {
            let payload = reqDetails.body;
            let headers = { ...reqDetails.headers };

            // Special handling for PATCH requests
            if (reqDetails.method === 'PATCH') {
                const newPayload = { "preferred_model_type": "MODEL_TYPE_DEEP_SYNTH" };
                payload = JSON.stringify(newPayload);
                headers['Content-Type'] = 'application/json;charset=UTF-8';
                delete headers['Content-Length']; // Let GM_xmlhttpRequest handle this
                console.log(`Replaying Request #${index + 1} (PATCH MODIFIED): ${reqDetails.url}`, 'Payload:', newPayload);
            } else {
                console.log(`Replaying Request #${index + 1} (${reqDetails.method}): ${reqDetails.url}`);
            }

            // Use GM_xmlhttpRequest to replay the request
            try {
                GM_xmlhttpRequest({
                    method: reqDetails.method,
                    url: reqDetails.url,
                    headers: headers,
                    data: payload,
                    timeout: 30000, // 30-second timeout
                    onload: function(response) {
                        console.log(`Replay #${index + 1} SUCCESS (${reqDetails.method} ${reqDetails.url}):`, {
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText.substring(0, 200) + (response.responseText.length > 200 ? '...' : '')
                        });
                    },
                    onerror: function(response) {
                        console.error(`Replay #${index + 1} FAILED (${reqDetails.method} ${reqDetails.url}):`, {
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText || 'No response text'
                        });
                    },
                    ontimeout: function() {
                        console.error(`Replay #${index + 1} TIMEOUT (${reqDetails.method} ${reqDetails.url})`);
                    }
                });
            } catch (error) {
                console.error(`Replay #${index + 1} ERROR (${reqDetails.method} ${reqDetails.url}):`, error.message);
            }
        });

        alert(`Finished attempting to replay ${xhrHistory.length} requests. Check the console (F12) for details.`);
    }

    // --- Register Menu Command ---
    GM_registerMenuCommand('1. Switch any model on the current chat', null, 'r');
    GM_registerMenuCommand('2. Then click to the button below!', null, 'r');
    GM_registerMenuCommand('Replay Last 5 XHR Requests', replayLastRequests, 'r');

})();