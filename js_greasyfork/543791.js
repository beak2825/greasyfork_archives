// ==UserScript==
// @name         Gobattle.io Fast Down + Attack (50ms)
// @namespace    https://gobattle.io/
// @version      1.1
// @description  Hold Q to spam down (S) and attack (V) every 50ms in Gobattle.io. Auto combo spam to help test inputs or show how keyboard automation works.
// @author       Kuwazy
// @match        https://gobattle.io/#!
// @match        https://alpha.gobattle.io/#!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gobattle.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543791/Gobattleio%20Fast%20Down%20%2B%20Attack%20%2850ms%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543791/Gobattleio%20Fast%20Down%20%2B%20Attack%20%2850ms%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const attackKey = "q";
    const intervalMs = 50;
    let intervalId = null;

    // Detect chat input to prevent spamming while typing
    const textfield = document.getElementById("shinobit-textfield");

    function pressKey(key, code, keyCode) {
        const eventData = {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            location: 0,
            repeat: false,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false
        };
        document.dispatchEvent(new KeyboardEvent("keydown", eventData));
        document.dispatchEvent(new KeyboardEvent("keyup", eventData));
    }

    function doAttackCombo() {
        pressKey("ArrowDown", "ArrowDown", 40); // S
        pressKey("v", "KeyV", 86);              // V
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === attackKey &&
            !intervalId &&
            textfield !== document.activeElement
        ) {
            intervalId = setInterval(doAttackCombo, intervalMs);
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === attackKey) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });
})();
