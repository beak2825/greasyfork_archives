// ==UserScript==
// @name         Change User Agent to Pixel 3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change User Agent to Pixel 3 with Chrome 126
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501847/Change%20User%20Agent%20to%20Pixel%203.user.js
// @updateURL https://update.greasyfork.org/scripts/501847/Change%20User%20Agent%20to%20Pixel%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User-Agent para Google Pixel 3 con Chrome 126
    const newUserAgent = 'Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.190821.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

    // Intercepta las solicitudes HTTP y modifica el User-Agent
    function modifyRequestHeaders(details) {
        details.requestHeaders.push({
            name: 'User-Agent',
            value: newUserAgent
        });
        return { requestHeaders: details.requestHeaders };
    }

    // Escucha las solicitudes y modifica el User-Agent
    GM_xmlhttpRequest({
        method: 'GET',
        url: window.location.href,
        onload: function(response) {
            console.log('Request made with new User-Agent');
        },
        onerror: function(error) {
            console.error('Error:', error);
        }
    });

    // Escucha eventos de solicitud y modifica el User-Agent
    window.addEventListener('beforeunload', () => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href,
            headers: {
                'User-Agent': newUserAgent
            }
        });
    });
})();