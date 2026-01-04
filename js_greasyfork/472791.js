// ==UserScript==
// @name         WARNING REMOVER
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  Removes that shit of warning that is annoying
// @author       Wh1t3Bl4ckPT
// @match        scriptblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472791/WARNING%20REMOVER.user.js
// @updateURL https://update.greasyfork.org/scripts/472791/WARNING%20REMOVER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the HTML content you want to remove
    const targetHTML = '<cloudflare-app app="welcome-bar" data-style="prominent" style="z-index: 10000;"><alert-message><alert-message-content>If you get “server error” please use incognito mode in the meanwhile we work on this issue.<a class="alert-cta-button" target="_blank" href="https://support.google.com/accounts/answer/32050?hl=en&amp;co=GENIE.Platform%3DDesktop">How to clear cache?</a></alert-message-content></alert-message></cloudflare-app>';

    // Find and remove the specified HTML element
    function removeElement() {
        const elements = document.getElementsByTagName('cloudflare-app');
        for (const element of elements) {
            if (element.outerHTML === targetHTML) {
                element.remove();
            }
        }
    }

    // Run the removeElement function when the document is ready
    window.addEventListener('load', removeElement);
})();
