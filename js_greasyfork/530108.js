// ==UserScript==
// @name         Stealth Canvas Quiz Untracker
// @namespace    7549a111-af08-40ea-a952-539c6d8e2021
// @version      2.0.0
// @description  Stealthily blocks Canvas tracking without modifying jQuery.ajax, which is detectable by canvas.
// @author       Streetmemes
// @license      MIT
// @include      /^https:\/\/canvas\.[a-z0-9]*?\.[a-z]*?\/?(.*)?/
// @include      /^https:\/\/[a-z0-9]*?\.instructure\.com\/?(.*)?/
// @icon         https://canvas.instructure.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530108/Stealth%20Canvas%20Quiz%20Untracker.user.js
// @updateURL https://update.greasyfork.org/scripts/530108/Stealth%20Canvas%20Quiz%20Untracker.meta.js
// ==/UserScript==

// Intercept XMLHttpRequest to filter out tracking events
(function() {
    const log = (msg, ...data) => console.log(`[StealthInterceptor] ${msg}`, ...data);

    // Simulating XMLHttpRequest.prototype.open and send
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // Mock intercepting network requests
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._isTrackingRequest = /events|page_views/.test(url); // Match events and page_views
        return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(data) {
        if (this._isTrackingRequest) {
            try {
                const parsedData = JSON.parse(data);

                if (parsedData.quiz_submission_events) {
                    // Remove page activity events, but allow "quiz_started"
                    parsedData.quiz_submission_events = parsedData.quiz_submission_events.filter(
                        (e) => !e.event_type.includes("page") || e.event_type === "quiz_started"
                    );

                    if (parsedData.quiz_submission_events.length === 0) {
                        log("🚫 Blocking tracking request (empty payload).");
                        return; // Block the request completely if no events remain
                    }

                    log("✂️ Modified tracking request:", parsedData);
                    data = JSON.stringify(parsedData); // Modify request data
                }
            } catch (e) {
                log("⚠️ Error modifying request:", e);
            }
        }
        return originalSend.call(this, data);
    };
})();
