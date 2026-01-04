// ==UserScript==
// @name         Enhanced Google Sorry Page and Recaptcha Handler (Network Error Code Detection)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Handles Google "Sorry" pages and monitors Recaptcha errors based on network response codes.
// @author       Anonymous
// @match        *://www.google.com/sorry/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_closeTab
// @downloadURL https://update.greasyfork.org/scripts/520525/Enhanced%20Google%20Sorry%20Page%20and%20Recaptcha%20Handler%20%28Network%20Error%20Code%20Detection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520525/Enhanced%20Google%20Sorry%20Page%20and%20Recaptcha%20Handler%20%28Network%20Error%20Code%20Detection%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CONFIGURABLE OPTIONS
    const CLOSE_DELAY = 3000;       // Time before closing the tab (in ms)
    const REOPEN_DELAY = 5000;      // Time before reopening the referrer page (in ms)
    const MAX_RETRIES = 3;          // Maximum retry attempts
    const RETRY_INTERVAL = 10000;   // Retry interval for page reload
    const FALLBACK_URL = "https://www.google.com"; // Fallback page

    const referrerURL = document.referrer || FALLBACK_URL;
    const retryKey = 'sorry_page_retries';
    let retryCount = parseInt(sessionStorage.getItem(retryKey)) || 0;

    // ERROR RESPONSE CODES TO MONITOR
    const ERROR_CODES = [429, 500, 503, 504]; // 429: Too Many Requests, 500-504: Server errors

    // FETCH ERROR INTERCEPTOR
    const monitorNetworkErrors = () => {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            return originalFetch(...args).then(response => {
                if (ERROR_CODES.includes(response.status)) {
                    triggerErrorHandler(`Fetch Error: ${response.status} - ${response.statusText}`);
                }
                return response;
            }).catch(error => {
                triggerErrorHandler(`Fetch Network Error: ${error.message}`);
                throw error;
            });
        };

        // XMLHttpRequest ERROR INTERCEPTOR
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            this.addEventListener("load", function () {
                if (ERROR_CODES.includes(this.status)) {
                    triggerErrorHandler(`XHR Error: ${this.status} - ${this.statusText}`);
                }
            });
            this.addEventListener("error", function () {
                triggerErrorHandler("XHR Network Error occurred.");
            });
            originalSend.apply(this, arguments);
        };
    };

    // ERROR HANDLER
    const triggerErrorHandler = (message) => {
        console.warn(message);
        createNotification(message, true);
        attemptRetry();
    };

    // NOTIFICATION UI
    const createNotification = (message, isError = false) => {
        const existingNotification = document.getElementById("custom-notification");
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement("div");
        notification.id = "custom-notification";
        notification.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            padding: 10px;
            background-color: ${isError ? '#ff4444' : '#ffcc00'};
            color: #000;
            font-size: 14px;
            z-index: 9999;
            border: 1px solid ${isError ? '#cc0000' : '#ffaa00'};
            border-radius: 4px;
        `;
        notification.innerHTML = `
            <span>${message}</span>
            <div style="margin-top: 5px;">
                <button id="cancel-action" style="margin-right: 10px;">Cancel</button>
                <button id="retry-action">Retry Now</button>
            </div>
        `;
        document.body.appendChild(notification);

        document.getElementById("cancel-action").addEventListener("click", () => {
            notification.remove();
            sessionStorage.removeItem(retryKey);
        });

        document.getElementById("retry-action").addEventListener("click", () => {
            sessionStorage.removeItem(retryKey);
            window.location.reload();
        });
    };

    // RETRY HANDLER
    const attemptRetry = () => {
        retryCount++;
        sessionStorage.setItem(retryKey, retryCount);

        if (retryCount <= MAX_RETRIES) {
            console.log(`Retry attempt ${retryCount}/${MAX_RETRIES}`);
            setTimeout(() => window.location.reload(), RETRY_INTERVAL);
        } else {
            console.error("Max retries exceeded.");
            createNotification("Max retries reached. Try again later or manually solve the issue.", true);
            sessionStorage.removeItem(retryKey);
        }
    };

    // TAB MANAGEMENT
    const attemptCloseAndReopen = () => {
        setTimeout(() => {
            console.log("Closing tab...");
            try {
                GM_closeTab();
            } catch {
                console.warn("GM_closeTab failed. Redirecting to fallback...");
                window.location.href = FALLBACK_URL;
            }
        }, CLOSE_DELAY);

        setTimeout(() => {
            console.log("Reopening referrer...");
            GM_openInTab(referrerURL, { active: true, insert: true });
        }, REOPEN_DELAY);
    };

    // MAIN LOGIC
    const main = () => {
        console.log("Monitoring network errors...");
        monitorNetworkErrors();
        createNotification(`Google "Sorry" page detected. Retrying if necessary...`);
        attemptCloseAndReopen();
    };

    main();
})();
