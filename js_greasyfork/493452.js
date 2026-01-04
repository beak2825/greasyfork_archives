// ==UserScript==
// @name         Fetch Logger
// @namespace    http://tampermonkey.net/
// @version      0.2 
// @description  Logs fetch requests in a GUI for user viewing
// @author       zuxity
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493452/Fetch%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/493452/Fetch%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for logging fetch requests
    const logContainer = document.createElement('div');
    logContainer.style.position = 'fixed';
    logContainer.style.top = '0';
    logContainer.style.right = '0';
    logContainer.style.background = '#fff';
    logContainer.style.border = '1px solid #ccc';
    logContainer.style.padding = '10px';
    logContainer.style.maxWidth = '300px';
    logContainer.style.overflow = 'auto';
    logContainer.style.zIndex = '9999';
    document.body.appendChild(logContainer);

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        return originalFetch(url, options)
            .then(response => {
                // Log the fetch request
                logFetch(url, options, response);
                return response;
            })
            .catch(error => {
                // Log errors
                logError(url, options, error);
                throw error;
            });
    };

    // Function to log fetch requests
    function logFetch(url, options, response) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `URL: ${url}, Method: ${options.method}, Status: ${response.status}`;
        logContainer.appendChild(logEntry);
    }

    // Function to log errors
    function logError(url, options, error) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `Error fetching ${url}: ${error}`;
        logContainer.appendChild(logEntry);
    }
})();
