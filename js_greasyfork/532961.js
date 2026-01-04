// ==UserScript==
// @name         Bascos Pixverse Video Bypass & Credit Restorer
// @version      1.0
// @description  Exploit Pixverse video generation and restore credits on refresh
// @author       Basco
// @match        https://app.pixverse.ai/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1458338
// @downloadURL https://update.greasyfork.org/scripts/532961/Bascos%20Pixverse%20Video%20Bypass%20%20Credit%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/532961/Bascos%20Pixverse%20Video%20Bypass%20%20Credit%20Restorer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify the response for credits
    function modifyCreditsResponse(response) {
        console.log('Modifying credits response:', response);

        // Check if the response contains credit information and modify it
        if (response.data && response.data.Resp && response.data.Resp.credits) {
            // Set this to your desired credit count (e.g., restore credits to 100)
            response.data.Resp.credits = 100;
            console.log('Restored credits to:', response.data.Resp.credits);
        }

        return response;
    }

    // Intercepting and modifying the XHR response for credits
    const originalXHR = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            try {
                const response = JSON.parse(this.responseText);

                // If it's the /user/credits request, modify the response to restore credits
                if (this._url && this._url.includes('/creative_platform/user/credits')) {
                    modifyCreditsResponse(response);
                    this.responseText = JSON.stringify(response); // Set the modified response
                }

                // Log other responses if needed for debugging
                if (this._url && this._url.includes('/creative_platform/video/i2v')) {
                    console.log('Video generation response:', response);
                }
                if (this._url && this._url.includes('/creative_platform/video/list/personal')) {
                    console.log('Personal video list response:', response);
                }
                if (this._url && this._url.includes('/creative_platform/asset/list')) {
                    console.log('Asset list response:', response);
                }

            } catch (error) {
                console.error('Error while modifying XHR response:', error);
            }
        });
        originalXHR.apply(this, arguments);
    };

    // Log when a request to '/user/credits' is made to track credit status
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url && url.includes('/creative_platform/user/credits')) {
            console.log('Request to /user/credits made:', url);
        }
        this._url = url; // Store the URL in the XHR object for later reference
        originalOpen.apply(this, arguments);
    };

    // Adding debugging to monitor requests made by the script
    const originalConsoleLog = console.log;
    console.log = function (message, ...args) {
        if (message.includes('XHR load event')) {
            console.debug('XHR Load Event:', message);
        }
        originalConsoleLog.apply(this, [message, ...args]);
    };

})();