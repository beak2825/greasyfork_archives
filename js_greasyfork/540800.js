// ==UserScript==
// @name         Universal Logger
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Logs network requests, user interactions, and DOM mutations
// @author       4koy
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540800/Universal%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/540800/Universal%20Logger.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to log fetch API calls
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        console.log("Intercepted fetch request:", args);
        return originalFetch(...args).then(response => {
            console.log("API response:", response);
            return response;
        }).catch(err => {
            console.error("Fetch request error:", err);
            throw err;
        });
    };

    // Function to log XMLHttpRequests
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const open = xhr.open;
        const send = xhr.send;

        // Intercept open method to log the URL and method
        xhr.open = function(method, url, ...rest) {
            console.log(`Intercepted XMLHttpRequest: ${method} ${url}`);
            return open.call(this, method, url, ...rest);
        };

        // Intercept send method to log the data being sent
        xhr.send = function(data) {
            console.log("Sending data via XMLHttpRequest:", data);
            return send.call(this, data);
        };

        return xhr;
    };

    // Log DOM mutations
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            console.log("DOM Mutation detected:", mutation);
        }
    });

    // Optionally log console output as well
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog("Console log output:", ...args);
    };

    const originalConsoleError = console.error;
    console.error = function(...args) {
        originalConsoleError("Console error:", ...args);
    };

    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        originalConsoleWarn("Console warning:", ...args);
    };

})();
