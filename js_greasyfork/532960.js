// ==UserScript==
// @name         Force 720p Video Quality on Pixverse
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Forces video quality to 720p for video creation requests on Pixverse (Targeting Video Creation Only)
// @author       Basco
// @match        https://app.pixverse.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532960/Force%20720p%20Video%20Quality%20on%20Pixverse.user.js
// @updateURL https://update.greasyfork.org/scripts/532960/Force%20720p%20Video%20Quality%20on%20Pixverse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override XMLHttpRequest to capture outgoing requests
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // Intercept the open method to store request URL
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;  // Store URL
        return originalOpen.apply(this, arguments);
    };

    // Intercept the send method to modify the request body
    XMLHttpRequest.prototype.send = function(body) {
        // Focus only on the video creation requests (URLs that include /create or /i2v)
        if ((this._url.includes('/creative_platform/video/i2v') || this._url.includes('/creative_platform/video/create')) && body) {
            try {
                let requestBody = JSON.parse(body);
                // Modify the quality field to 720p if it's present
                if (requestBody.quality) {
                    console.log('[Debug] Modifying quality to 720p');
                    requestBody.quality = '720p'; // Force 720p quality
                } else {
                    console.warn('[Debug] No quality field found in request body.');
                }

                // Convert the modified body back to JSON string
                body = JSON.stringify(requestBody);
            } catch (error) {
                console.error('[Debug] Error parsing request body:', error);
            }
        }

        // Send the modified request
        return originalSend.apply(this, [body]);
    };

    // Add event listeners to capture the response and debug
    const originalXHRonload = XMLHttpRequest.prototype.onload;
    XMLHttpRequest.prototype.onload = function() {
        // Capture the response data for video creation requests
        if (this._url.includes('/creative_platform/video/i2v') || this._url.includes('/creative_platform/video/create')) {
            try {
                console.log('[Debug] XHR load event for:', this._url);
                console.log('[Debug] Response:', this.responseText);

                // Parse and log the response
                const response = JSON.parse(this.responseText);
                if (response.error) {
                    console.error('[Debug] Error in response:', response.error);
                } else {
                    console.log('[Debug] Video creation successful:', response);
                }
            } catch (error) {
                console.error('[Debug] Error handling response:', error);
            }
        }

        return originalXHRonload.apply(this, arguments);
    };

    // Error logging for debugging
    const originalXHRonerror = XMLHttpRequest.prototype.onerror;
    XMLHttpRequest.prototype.onerror = function() {
        console.error('[Debug] XHR Error for:', this._url);
        return originalXHRonerror.apply(this, arguments);
    };

})();