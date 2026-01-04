// ==UserScript==
// @name         Bypass Roblox TOS agreement
// @namespace    http://roblox.com/
// @version      1.02
// @description  Remove Roblox TOS Agreement dialog
// @author       tresk
// @match        https://www.roblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498373/Bypass%20Roblox%20TOS%20agreement.user.js
// @updateURL https://update.greasyfork.org/scripts/498373/Bypass%20Roblox%20TOS%20agreement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove TOS Agreement dialog and re-enable scrolling
    function removeTOSDialog() {
        const tosagreement = document.querySelector('div#user-agreements-checker-modal');

        if (tosagreement) {
            tosagreement.parentNode.remove();
            document.body.style.overflow = "visible"; // Re-enable scrolling
            clearInterval(riceman);
        }
    }

    const riceman = setInterval(removeTOSDialog, 1);
})();