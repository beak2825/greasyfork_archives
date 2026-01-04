// ==UserScript==
// @name         Torn Dump Fetch Button (RFCV from Cookie) TEST
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a button to Torn dump page that dynamically fetches RFCV (rfc_v) from cookies. Adjusts position for desktop or mobile.
// @author       pilvlp [2796461]
// @match        https://www.torn.com/dump.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521050/Torn%20Dump%20Fetch%20Button%20%28RFCV%20from%20Cookie%29%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/521050/Torn%20Dump%20Fetch%20Button%20%28RFCV%20from%20Cookie%29%20TEST.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to get RFCV (rfc_v) value from cookies
    function getRFCVFromCookies() {
        const match = document.cookie.split('; ').find(row => row.startsWith('rfc_v='))?.split('=')[1];
        return match || null;
    }

    // Detect if the device is mobile
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    // Function to create and style the button
    function createFetchButton() {
        const button = document.createElement("button");
        button.id = "torn-fetch-button";
        button.textContent = "Fetch Dump";

        if (isMobileDevice()) {
            // Mobile: Center-bottom and move up 25%
            button.style.cssText = `
                position: fixed;
                bottom: 25%;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 18px;
                background-color: #0078D4;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                z-index: 10000;
                text-align: center;
            `;
        } else {
            // Desktop: Fixed position
            button.style.cssText = `
                position: fixed;
                top: 350px;
                right: 500px;
                padding: 10px 15px;
                background-color: #0078D4;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                z-index: 10000;
            `;
        }

        return button;
    }

    // Function to append the button to the body
    function placeFetchButton() {
        const rfcv = getRFCVFromCookies();

        if (!rfcv) {
            console.error("RFCV not found in cookies. Button will not be added.");
            return;
        }

        const button = createFetchButton();
        document.body.appendChild(button);

        // Add click event to the button
        button.addEventListener("click", () => {
            fetch(`https://www.torn.com/dump.php?step=search&rfcv=${rfcv}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "x-requested-with": "XMLHttpRequest",
                    cookie: document.cookie
                },
                method: "POST"
            })
                .then(response => response.text())
                .then(data => {
                    console.log("Fetch response received.");
                    console.log(data);
                })
                .catch(error => {
                    console.error("Fetch failed:", error);
                });
        });
    }

    // Execute script when DOM is ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
        placeFetchButton();
    } else {
        window.addEventListener("DOMContentLoaded", placeFetchButton);
        window.addEventListener("load", placeFetchButton);
    }
})();
