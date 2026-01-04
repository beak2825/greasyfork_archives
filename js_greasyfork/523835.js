// ==UserScript==
// @name         thinkany pro
// @namespace    https://thinkany.ai/
// @version      0.1
// @description  free
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523835/thinkany%20pro.user.js
// @updateURL https://update.greasyfork.org/scripts/523835/thinkany%20pro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url === '/api/get-user-info') {
            return originalFetch(url, options)
                .then(response => {
                    const clonedResponse = response.clone();
                    return clonedResponse.json().then(data => {
                        if (data && data.data) {
                            data.data.credits.left_credits = 100;
                        }
                        const modifiedResponse = new Response(
                            JSON.stringify(data), {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            }
                        );
                        return modifiedResponse;
                    });
                });
        }
        return originalFetch(url, options);
    };
})();
