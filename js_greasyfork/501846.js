// ==UserScript==
// @name         Advanced User Agent Changer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change User Agent to Pixel 3 with Chrome 126 for XMLHttpRequest and fetch
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501846/Advanced%20User%20Agent%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/501846/Advanced%20User%20Agent%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User-Agent para Google Pixel 3 con Chrome 126
    const newUserAgent = 'Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.190821.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

    // Modifica el User-Agent en XMLHttpRequest
    const originalXMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        if (arguments[1]) {
            this.setRequestHeader('User-Agent', newUserAgent);
        }
        return originalXMLHttpRequestOpen.apply(this, arguments);
    };

    // Modifica el User-Agent en fetch
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

    // Modifica el User-Agent en GM_xmlhttpRequest
    const originalGM_xmlhttpRequest = GM_xmlhttpRequest;
    GM_xmlhttpRequest = function(details) {
        details.requestHeaders = details.requestHeaders || [];
        details.requestHeaders.push({
            name: 'User-Agent',
            value: newUserAgent
        });
        return originalGM_xmlhttpRequest(details);
    };

    // Verifica el User-Agent en las solicitudes
    function logUserAgent() {
        console.log('User-Agent para todas las solicitudes:', newUserAgent);
    }

    // Ejecuta la función de verificación
    logUserAgent();

    // Escucha el evento de carga para aplicar los cambios
    window.addEventListener('load', logUserAgent);

})();