// ==UserScript==
// @name         Big Revive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  revive big and stronk
// @author       NootNooot
// @match        https://www.torn.com/profiles.php?XID=*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/543668/Big%20Revive.user.js
// @updateURL https://update.greasyfork.org/scripts/543668/Big%20Revive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getSuccessChance() {
        const regex = /(\d+(?:\.\d+)?)%\s+chance of success/i;
        const text = document.body.innerText;
        const match = text.match(regex);
        return match ? parseFloat(match[1]) : null;
    }

    GM_addStyle(`
            .user-information,
            .buttons-list > a:not(.profile-button-revive) {
                display: none !important;
            }

            .profile-button-revive {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                font-size: 24px !important;
                padding: 200px 400px !important;
                z-index: 9999 !important;
            }
        `);

    function styleConfirmButton() {
        GM_addStyle(`
             .confirm-action-yes {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                 font-size: 50px !important;
                 padding: 200px 400px !important;
                 z-index: 9999;
             }

         `);
    }

    let successThreshold = parseFloat(localStorage.getItem('reviveSuccessThreshold')) || 50;

    function waitForTextAndApply() {
        const interval = setInterval(() => {
            const chance = getSuccessChance();
            if (chance !== null) {
                clearInterval(interval);
                if (chance > successThreshold) {
                    styleConfirmButton();
                }
            }
        }, 100); // checks every 100ms until it finds the percentage
    }

    waitForTextAndApply();
})();