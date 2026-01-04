// ==UserScript==
// @name         Deepl No Limit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unlimited DeepL Translation
// @author       null
// @match        https://*.deepl.com/translator
// @match        https://*.deepl.com/*/translator
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532771/Deepl%20No%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/532771/Deepl%20No%20Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept network requests
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        // Check if the request is the one we need to intercept
        if (url.startsWith('https://w.deepl.com/web') && options && options.method === 'post') {
            // Perform the original fetch request
            const response = await originalFetch(url, options);

            // Clone the response so we can manipulate it
            const clonedResponse = response.clone();
            const jsonResponse = await clonedResponse.json();

            // Modify the JSON response
            if (jsonResponse.result && jsonResponse.result.proAvailable) {
                jsonResponse.result.proAvailable = false;
            }

            // Create a new response with the modified JSON
            const modifiedResponse = new Response(JSON.stringify(jsonResponse), {
                status: clonedResponse.status,
                statusText: clonedResponse.statusText,
                headers: clonedResponse.headers,
            });

            // Return the modified response
            return modifiedResponse;
        }

        // If it's not the URL we want to intercept, proceed as normal
        return originalFetch(url, options);
    };
})();
