// ==UserScript==
// @name         Square remove blank space at bottom of pages.
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Square has a mostly useless element that takes up room for no reason on the bottom of most of their pages.... I myself had 0 issues at least so far. Do better Square.
// @author       ChatGPT
// @author       NickTh3M4l4chi
// @match        https://*.squareup.com/dashboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504410/Square%20remove%20blank%20space%20at%20bottom%20of%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/504410/Square%20remove%20blank%20space%20at%20bottom%20of%20pages.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to add custom CSS
    function addCustomCSS() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #market-icon-sprite {
                display: none !important;
            }

            .appointments-container .app-layout__content.appointments-full-height-layout.fullcalendar-upgrade-layout {
                height: calc(100vh - 5px) !important;
                padding: 15px 15px 0 15px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Add the custom CSS when the DOM is fully loaded
    window.addEventListener('load', function() {
        addCustomCSS();
    }, false);
})();
