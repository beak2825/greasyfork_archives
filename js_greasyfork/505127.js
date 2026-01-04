// ==UserScript==
// @name         Capture bindSNS Request and Response
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Capture and store the bindSNS request and response
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505127/Capture%20bindSNS%20Request%20and%20Response.user.js
// @updateURL https://update.greasyfork.org/scripts/505127/Capture%20bindSNS%20Request%20and%20Response.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Store the request and response in global variables
    window.bindSNSRequest = null;
    window.bindSNSResponse = null;

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        return originalFetch.apply(this, args).then(response => {
            if (url.includes("bindSNS")) {
                console.log("Captured bindSNS request:", url);
                window.bindSNSRequest = url;

                // Clone the response so we can read it
                response.clone().text().then(text => {
                    console.log("Captured bindSNS response:", text);
                    window.bindSNSResponse = text;
                });
            }
            return response;
        });
    };

    // Intercept XMLHttpRequests (if needed)
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener("readystatechange", function() {
            if (this.readyState === 4 && url.includes("bindSNS")) {  // readyState 4 means the request is done
                console.log("Captured bindSNS request:", url);
                window.bindSNSRequest = url;
                console.log("Captured bindSNS response:", this.responseText);
                window.bindSNSResponse = this.responseText;
            }
        });
        originalXhrOpen.apply(this, arguments);
    };
})();
