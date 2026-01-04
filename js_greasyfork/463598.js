// ==UserScript==
// @name         Disable Ynet Auto-Refresh (New)
// @namespace    Violentmonkey Scripts
// @description  Disable auto-refresh on Ynet.co.il (2023 working version)
// @author       Raynor
// @license      GNU
// @match        https://*.ynet.co.il/*
// @grant        none
// @version      1.1.20230409
// @downloadURL https://update.greasyfork.org/scripts/463598/Disable%20Ynet%20Auto-Refresh%20%28New%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463598/Disable%20Ynet%20Auto-Refresh%20%28New%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function disableAutoRefresh() {
        // Get all the meta elements on the page
        const metaTags = document.getElementsByTagName('meta');

        // Loop through the meta elements
        for (let i = 0; i < metaTags.length; i++) {
            // Check if the meta element has an http-equiv attribute with a value of "refresh"
            if (metaTags[i].getAttribute('http-equiv') === 'refresh') {
                // Remove the meta element
                metaTags[i].parentNode.removeChild(metaTags[i]);
            }
        }

        // Get all the iframe elements on the page
        const iframes = document.getElementsByTagName('iframe');

        // Loop through the iframe elements
        for (let i = 0; i < iframes.length; i++) {
            // Disable the iframe's automatic reloading by setting its src attribute to its current value
            const iframeSrc = iframes[i].src;
            iframes[i].src = '';
            iframes[i].src = iframeSrc;
        }

        // Get all the script elements on the page
        const scripts = document.getElementsByTagName('script');

        // Loop through the script elements
        for (let i = 0; i < scripts.length; i++) {
            // Check if the script element contains a call to the "location.reload" function
            if (scripts[i].textContent.includes('location.reload()')) {
                // Remove the script element
                scripts[i].parentNode.removeChild(scripts[i]);
            }
        }

        // Remove the "Refresh" HTTP header from the response headers
        const refreshHeader = document.querySelector('meta[http-equiv="Refresh"], meta[http-equiv="refresh"]');
        if (refreshHeader) {
            const headers = new Headers({ 'Content-Type': 'text/html' });
            headers.set('Refresh', '0;url=' + window.location.href);
            const response = new Response(document.documentElement.innerHTML, {
                status: 200,
                statusText: 'OK',
                headers: headers
            });
            Object.defineProperty(document, 'readyState', { value: 'interactive' });
            Object.defineProperty(document, 'body', { value: null });
            Object.defineProperty(document, 'documentElement', { value: null });
            Object.defineProperty(document, 'head', { value: null });
            window.stop();
            document.open();
            document.close();
            Object.defineProperties(document, {
                'readyState': { value: 'complete' },
                'body': { value: response.body },
                'documentElement': { value: response.body.parentNode },
                'head': { value: response.body.querySelector('head') }
            });
        }
    console.log("disableAutoRefresh() executed successfully.");
    }

    if (document.readyState === 'complete') {
        disableAutoRefresh();
    } else {
        window.addEventListener('load', disableAutoRefresh);
    }
})();