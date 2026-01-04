// ==UserScript==
// @name         Anti Devtools Detector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blocks loading of JavaScript files containing "devtools" or "test" in their names
// @author       Your name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492957/Anti%20Devtools%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/492957/Anti%20Devtools%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept requests and block those containing "devtools" or "test" in their names
    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
        const url = resource instanceof Request ? resource.url : resource;
        if (url.includes("devtools") || url.includes("test")) {
            console.log("Blocked request:", url);
            return new Promise((resolve, reject) => {
                reject(new Error("Blocked by Tampermonkey"));
            });
        } else {
            return originalFetch.apply(this, arguments);
        }
    };
})();
