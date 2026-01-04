// ==UserScript==
// @name         Streamable Video Expiration Checker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Checks if a Streamable video expires soon or was uploaded with an account based on upload date if no expiration date is found.
// @author       You
// @match        *://streamable.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540288/Streamable%20Video%20Expiration%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/540288/Streamable%20Video%20Expiration%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function checkExpiration() {
        const scriptElement = document.querySelector('#loop-theme-variables-container > script');
        if (!scriptElement) {
            alert('Script element not found.');
            return;
        }

        let jsonData;
        try {
            jsonData = JSON.parse(scriptElement.textContent.trim());
        } catch (e) {
            alert('Error parsing JSON: ' + e);
            return;
        }

        const now = new Date();

        if (jsonData.expires) {
            const expirationDate = new Date(jsonData.expires);
            const diffMilliseconds = expirationDate - now;
            const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);

            if (diffDays > 2) {
                alert(`✅ Video was uploaded using a registered account.\n(${diffDays.toFixed(2)} days left until expiration).`);
            } else {
                alert(`⚠️ Video was uploaded as a guest.\n(${diffDays.toFixed(2)} days left until expiration).`);
            }
        } else {
            if (!jsonData.uploadDate) {
                alert('No expiration date or upload date found.');
                return;
            }

            const uploadDate = new Date(jsonData.uploadDate);
            const diffMilliseconds = now - uploadDate;
            const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);

            if (diffDays > 3) {
                alert(`✅ No expiration date found.\nThe video has been online for ${diffDays.toFixed(2)} days.\nAssuming it was uploaded with a registered account.`);
            } else {
                alert(`⚠️ No expiration date found.\nThe video was uploaded only ${diffDays.toFixed(2)} days ago.\nPossibly uploaded as a guest.`);
            }
        }
    }

    window.addEventListener('load', checkExpiration);
})();
