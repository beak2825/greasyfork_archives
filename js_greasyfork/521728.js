// ==UserScript==
// @name         Bypass CORS Restrictions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix CORS issues for video resources
// @author       YourName
// @match        *://*/*
// @grant        unsafeWindow
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521728/Bypass%20CORS%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/521728/Bypass%20CORS%20Restrictions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Overriding the fetch API
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(...args) {
        const [resource, options = {}] = args;

        // Modify headers to bypass CORS restrictions
        const modifiedOptions = {
            ...options,
            headers: {
                ...options.headers,
                'Origin': 'https://ddys.pro', // Replace with the origin required by the server
            }
        };

        const response = await originalFetch(resource, modifiedOptions);

        // Modify the response if necessary
        const modifiedResponse = new Response(response.body, {
            ...response,
            headers: {
                ...response.headers,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': '*',
            }
        });

        return modifiedResponse;
    };

    // Overriding XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                // Modify CORS headers in the response
                Object.defineProperty(this, 'responseText', {
                    get: function() {
                        return this.responseText.replace(
                            'Access-Control-Allow-Origin: https://ddys.pro',
                            'Access-Control-Allow-Origin: *'
                        );
                    }
                });
            }
        });

        originalXhrOpen.call(this, method, url, async, user, password);
    };
})();