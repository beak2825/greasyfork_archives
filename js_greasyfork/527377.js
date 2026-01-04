// ==UserScript==
// @name         Facebook Profile ID Extractor (OSINT)
// @version      1.2
// @description  Extracts Facebook profile ID with a close button
// @author       SH3LL
// @match        https://www.facebook.com/*
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/527377/Facebook%20Profile%20ID%20Extractor%20%28OSINT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527377/Facebook%20Profile%20ID%20Extractor%20%28OSINT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let popup = null; // Store the popup element
    let labelAdded = false;

    function createPopup() {
        popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 65px;
            right: 43%;
            background-color: black;
            border: 1px solid #ccc;
            padding: 10px;
            padding-right: 18px;
            border-radius: 5px;
            z-index: 9999;
            font-weight: bold;
        `;

        // Create close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;'; // "x" character
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            color: white;
            padding-top: 5px;
            padding-left: 5px;
        `;
        closeButton.onclick = function() {
            if (popup) {
                popup.remove();
                popup = null;
                labelAdded = false;
            }
        };

        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    }

    function extractInfo() {
        if (labelAdded) return;

        try {
            const userIdRegex = /"userID":"(\d+)"/;
            const userIdMatch = document.documentElement.outerHTML.match(userIdRegex);

            if (userIdMatch && userIdMatch[1]) {
                const userId = userIdMatch[1];
                const link = document.createElement('a');
                link.href = "https://www.facebook.com/profile.php?id=" + userId;
                link.target = "_blank";
                link.style.color = 'Chartreuse';
                link.innerText = "User ID: " + userId;

                if (!popup) {
                    createPopup();
                }
                popup.appendChild(link);
                labelAdded = true;
            } else {
                console.error("Facebook ID not found.");
                return;
            }
        } catch (e) {
            console.error("Error processing request: " + e.message);
            if (!popup) {
                createPopup();
            }
            return;
        }
    }

    const checkInterval = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(checkInterval);
            extractInfo();
        }
    }, 500);

})();