// ==UserScript==
// @name         YouTube with Material Design
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply Material Design 1 styles to YouTube using Materialize
// @author       You
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js
// @downloadURL https://update.greasyfork.org/scripts/505462/YouTube%20with%20Material%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/505462/YouTube%20with%20Material%20Design.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        // Add Materialize initialization code if needed
        M.AutoInit();

        // Custom CSS to style YouTube elements
        GM_addStyle(`
            /* Example of Material Design styles */
            .ytp-chrome-bottom {
                background-color: #ffffff !important; /* Material Design background color */
            }

            .ytp-play-button {
                border-radius: 50% !important; /* Material Design rounded button */
            }

            /* Add more styles as needed */
        `);

        // Example of how to use Materialize classes in YouTube (may need adjustments)
        let subscribeButton = document.querySelector('#subscribe-button');
        if (subscribeButton) {
            subscribeButton.classList.add('btn', 'waves-effect', 'waves-light');
        }
    });
})();
