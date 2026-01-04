// ==UserScript==
// @name         User-Agent Switcher for Fluxus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Switch user-agent to Google Chrome for Fluxus
// @author       You
// @match        *://fluxus.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518927/User-Agent%20Switcher%20for%20Fluxus.user.js
// @updateURL https://update.greasyfork.org/scripts/518927/User-Agent%20Switcher%20for%20Fluxus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Define the Google Chrome user-agent string (Windows version)
    const chromeUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";
    
    // Modify the navigator.userAgent directly (although some sites may block this)
    Object.defineProperty(navigator, 'userAgent', {
        get: function() { return chromeUserAgent; }
    });
    
    // Intercept the XMLHttpRequest to modify the user-agent for network requests
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        arguments[1] = url;
        arguments[3] = chromeUserAgent; // Override the user-agent for the request
        originalOpen.apply(this, arguments);
    };

    // Intercept the fetch API to modify the user-agent for network requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        init = init || {};
        init.headers = init.headers || {};
        init.headers['User-Agent'] = chromeUserAgent; // Override user-agent for fetch requests
        return originalFetch(input, init);
    };
    
    console.log("User-Agent has been switched to Google Chrome for Fluxus!");
})();
