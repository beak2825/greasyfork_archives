/* global OOCSI */
// ==UserScript==
// @name         OOCSI Message Handler
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Handle OOCSI messages and redirect to Amazon for purchasing
// @match        https://*.aooo.nl/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491638/OOCSI%20Message%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/491638/OOCSI%20Message%20Handler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Include the OOCSI library
    const script = document.createElement('script');
    script.src = "https://oocsi.aooo.nl/assets/js/oocsi-web.min.js";
    script.onload = function() {
        // Connect to the OOCSI server
        OOCSI.connect('wss://oocsi.aooo.nl/ws');

        // Subscribe to the channel and handle messages
        OOCSI.subscribe("amazonBuyChannel", function(msg) {
            var url = msg.data.url; // Assuming the URL is passed here
            var type = msg.data.type; // 'new' or 'used'
            // Append the type as a query parameter to handle on the Amazon page
            if (url && type) {
                window.open(url + '?purchaseType=' + type, '_blank').focus();
            }
        });
    };
    document.head.appendChild(script);
})();