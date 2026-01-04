// ==UserScript==
// @name         GPT-4 Unlocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlocks GPT-4 on ChatGPT.com
// @author       Rxzen-GPT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487333/GPT-4%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/487333/GPT-4%20Unlocker.meta.js
// ==/UserScript==

(function() {
    // Replace the ChatGPT API endpoint with the GPT-4 API endpoint
    const originalEndpoint = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=";
    const newEndpoint = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-002:generateText?key=";

    // Intercept and modify the API request
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.startsWith(originalEndpoint)) {
            url = url.replace(originalEndpoint, newEndpoint);
        }
        return originalFetch(url, options);
    };
})();