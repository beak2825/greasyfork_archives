// ==UserScript==
// @name         Change User Agent to Pixel 3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change User Agent to Pixel 3 with Chrome 126
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501848/Change%20User%20Agent%20to%20Pixel%203.user.js
// @updateURL https://update.greasyfork.org/scripts/501848/Change%20User%20Agent%20to%20Pixel%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User-Agent para Google Pixel 3 con Chrome 126
    const newUserAgent = 'Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.190821.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

    // Modificar el User-Agent en XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.setRequestHeader('User-Agent', newUserAgent);
        return originalOpen.apply(this, arguments);
    };

    // Modificar el User-Agent en fetch
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function() {
        const [url, options] = arguments;
        const modifiedOptions = {
            ...options,
            headers: {
                ...options?.headers,
                'User-Agent': newUserAgent
            }
        };
        return originalFetch.call(this, url, modifiedOptions);
    };

    // Modificar el User-Agent en GM_xmlhttpRequest
    function modifyGMRequest(details) {
        details.requestHeaders = details.requestHeaders || [];
        details.requestHeaders.push({
            name: 'User-Agent',
            value: newUserAgent
        });
        return { requestHeaders: details.requestHeaders };
    }

    // Monitorea solicitudes de GM_xmlhttpRequest
    const originalGM_xmlhttpRequest = GM_xmlhttpRequest;
    GM_xmlhttpRequest = function(details) {
        const modifiedDetails = modifyGMRequest(details);
        return originalGM_xmlhttpRequest.call(this, modifiedDetails);
    };

    console.log('User-Agent cambiará a:', newUserAgent);
})();