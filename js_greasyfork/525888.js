// ==UserScript==
// @name         Extract Session from CityIndex iFrame
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts the session parameter from the iFrame URL and copies it to the clipboard
// @match        https://www.cityindex.com/*/forex-trading/*/
// @license MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/525888/Extract%20Session%20from%20CityIndex%20iFrame.user.js
// @updateURL https://update.greasyfork.org/scripts/525888/Extract%20Session%20from%20CityIndex%20iFrame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractSession() {
        const iframe = document.getElementsByTagName("iframe")[0];
        if (!iframe) {
            console.log("No iframe found.");
            return;
        }

        const url = new URL(iframe.src);
        const session = url.searchParams.get("session");

        if (session) {
            GM_setClipboard(session);
            console.log("Session copied to clipboard:", session);
        } else {
            console.log("Session parameter not found.");
        }
    }

    // Wait for the iframe to load
    window.addEventListener('load', () => {
        setTimeout(extractSession, 3000); // Wait a bit to ensure the iframe is loaded
    });
})();