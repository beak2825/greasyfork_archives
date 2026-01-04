// ==UserScript==
// @name         GoBattle.io Autoshield
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Autoshield for gb
// @author       Nightwave
// @match        https://gobattle.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547075/GoBattleio%20Autoshield.user.js
// @updateURL https://update.greasyfork.org/scripts/547075/GoBattleio%20Autoshield.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const downKey = { key: "ArrowDown", code: "ArrowDown", keyCode: 40 };

    const delayBeforeDown = 120;  // Wait after attack before pressing Down (ms)
    const holdTime = 450;         // How long to hold Down (ms) - adjust for your weapon

    function pressKey({ key, code, keyCode }) {
        document.dispatchEvent(new KeyboardEvent("keydown", {
            key, code, keyCode, which: keyCode, bubbles: true
        }));
    }

    function releaseKey({ key, code, keyCode }) {
        document.dispatchEvent(new KeyboardEvent("keyup", {
            key, code, keyCode, which: keyCode, bubbles: true
        }));
    }

    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "v") {
            // Wait a bit, then hold down
            setTimeout(() => {
                pressKey(downKey);
            }, delayBeforeDown);

            // Release after holdTime
            setTimeout(() => {
                releaseKey(downKey);
            }, delayBeforeDown + holdTime);
        }
    });
})();
