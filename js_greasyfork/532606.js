// ==UserScript==
// @name         Block Specific JS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block specific JavaScript files from loading
// @author       Your Name
// @match        *://*.sinodan.link/*  // Adjust this to match the specific pages you want
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532606/Block%20Specific%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/532606/Block%20Specific%20JS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of JavaScript URLs to block
    const blockedScripts = [
        'https://m.sinodan.link/js/js4.js?v=71',
    ];

    // Override the fetch function
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
        if (blockedScripts.some(blockedUrl => url.includes(blockedUrl))) {
            console.log(`Blocked script: ${url}`);
            return Promise.reject(new Error('Blocked script'));
        }
        return originalFetch.apply(this, args);
    };

    // Override XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (blockedScripts.some(blockedUrl => url.includes(blockedUrl))) {
            console.log(`Blocked script: ${url}`);
            this.abort(); // Cancel the request
            return;
        }
        return originalXhrOpen.apply(this, arguments);
    };
})();
