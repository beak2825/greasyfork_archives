// ==UserScript==
// @name         automatically bot youtube views with proxy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  free youtube proxy viewbot
// @author       fredtheceo
// @match        https://www.youtube.com/watch?v=vzSPvrBAd9U*
// @grant        GM_xmlhttpRequest
// @connect      * // Allow any domain for GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/516599/automatically%20bot%20youtube%20views%20with%20proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/516599/automatically%20bot%20youtube%20views%20with%20proxy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refreshRate = 10; // seconds
    const viewCount = 5; // total number of views you want to simulate
    const proxyUrl = 'https://your-proxy-url.example.com'; // Replace with your proxy URL

    let counter = 0;

    function loadSession() {
        if (counter < viewCount) {
            console.log(`Viewing (${counter + 1}): ${window.location.href}`);
            counter++;

            // Make a request to the proxy instead of reloading the page directly
            GM_xmlhttpRequest({
                method: "GET",
                url: `${proxyUrl}?targetUrl=${encodeURIComponent(window.location.href)}`,
                onload: function(response) {
                    if (response.status === 200) {
                        console.log('View simulated through proxy.');
                    } else {
                        console.log('Failed to simulate view.');
                    }
                },
                onerror: function() {
                    console.log('Error connecting to proxy.');
                }
            });

            // Refresh the page after the set interval
            setTimeout(() => {
                window.location.reload();
            }, refreshRate * 1000); // convert seconds to milliseconds
        } else {
            console.log(`Completed ${viewCount} views.`);
        }
    }

    // Start the loading session
    loadSession();
})();