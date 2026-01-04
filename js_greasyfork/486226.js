// ==UserScript==
// @name         WhatsApp Web Full Screen
// @description  Disable margins and use all available screen space for chats on WhatsApp Web.
// @version      1.2
// @author       https://github.com/z4dri05
// @supportURL   https://github.com/z4dri05/WhatsAppWebFullScreen
// @match        https://web.whatsapp.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/1256011
// @downloadURL https://update.greasyfork.org/scripts/486226/WhatsApp%20Web%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/486226/WhatsApp%20Web%20Full%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        html, body {
            /* Fill the window and disable scrolling */
            height: 100% !important;
            width: 100% !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #000 !important;
        }

        /* The trick: move #app 20px upwards to hide the top bar */
        #app {
            position: fixed !important;
            top: -20px !important; /* Adjust this value to hide the desired height of the top bar */
            left: 0 !important;
            width: 100vw !important;
            height: calc(100vh + 19px) !important;
            /* Adding 19px prevents cropping at the bottom */
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
        }

        .app-wrapper-web,
        .two,
        ._1jJ70,
        ._3ArsE,
        ._2gzeB,
        ._1C6Zl {
            /* Ensure everything adjusts to 100% */
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #000 !important;
        }
    `);
})();
