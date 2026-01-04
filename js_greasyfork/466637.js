// ==UserScript==
// @name         Omegle Dark Mode
// @namespace    http://www.example.com/
// @version      1.1
// @license MIT
// @description  Applies a dark mode look to Omegle. Change, use, modify the code as you wish, but if you post this script anywhere (modified or not), you MUST inform me. Failure to do so will be considered a violation of copyright laws and will be reported accordingly.
// @author       Cxsty
// @match        https://www.omegle.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466637/Omegle%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/466637/Omegle%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply custom CSS styles
    GM_addStyle(`
        body {
            background-color: #181818 !important;
            color: #d1d1d1 !important;
        }

        #header {
            background-color: #000000 !important;
        }

        #header img {
            filter: invert(1) !important;
        }

        #logbox {
            background-color: #282828 !important;
            border-radius: 10px !important;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2) !important;
        }

        #logbox p {
            color: #d1d1d1 !important;
        }

        /* Customize more styles as needed */
    `);

    // Modify elements and structure as needed
    function customizeOmegle() {
        // Example: Change logo image
        const logoImage = document.querySelector('#header img');
        if (logoImage) {
            logoImage.src = 'https://example.com/custom-logo.png';
        }

        // Example: Add custom footer
        const footerContainer = document.createElement('div');
        footerContainer.innerHTML = `
            <div style="text-align: center;">
                <p>Custom Footer</p>
            </div>
        `;
        document.body.appendChild(footerContainer);
    }

    // Wait for the Omegle page to fully load
    function waitForPageLoad() {
        const chatElement = document.querySelector('#chatbox');
        if (chatElement) {
            customizeOmegle();
        } else {
            setTimeout(waitForPageLoad, 1000);
        }
    }

    waitForPageLoad();
})();
