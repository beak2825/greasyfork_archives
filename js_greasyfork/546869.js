// ==UserScript==
// @name         GoBattle.io Wing Dash Spam
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Spam Left (Q) and Right (X) Wing Dashes in GoBattle.io
// @author       Nightwave
// @match        https://gobattle.io/*
// @icon         https://gobattle.io/favicon.ico
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/546869/GoBattleio%20Wing%20Dash%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/546869/GoBattleio%20Wing%20Dash%20Spam.meta.js
// ==/UserScript==

/*
 * GoBattle.io Wing Dash Spam
 * Copyright (c) 2025 Nightwave
 * 
 * All Rights Reserved.
 * Redistribution, modification, or public sharing is strictly prohibited.
 */


/*
 * GoBattle.io Wing Dash Spam
 * Copyright (c) 2025 Nightwave
 *
 * Licensed under the MIT License.
 * You may use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of this script, provided that this copyright notice and license are included.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

(function() {
    'use strict';

    // ====== KEYBINDS ======
    const dash_left_button = "q";          // left dash (AA)
    const dash_right_button = "x";         // right dash (DD)
    const dash_frequency = 150;            // wing dash speed (ms)

    let dashLeftInterval = null;
    let dashRightInterval = null;
    let textfield = null;

    function getTextField() {
        if (!textfield) {
            textfield = document.getElementById("shinobit-textfield");
        }
        return textfield;
    }

    function tapKey(key, code, keyCode) {
        const eventOptionsDown = {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            location: 0,
            repeat: false,
            bubbles: true
        };
        const eventOptionsUp = { ...eventOptionsDown };
        document.dispatchEvent(new KeyboardEvent("keydown", eventOptionsDown));
        document.dispatchEvent(new KeyboardEvent("keyup", eventOptionsUp));
    }

    // ====== WING DASHES ======
    function dashLeft() {
        tapKey("c", "KeyC", 67);
        tapKey("w", "KeyW", 87);
        tapKey("a", "KeyA", 65);
        tapKey("a", "KeyA", 65);
    }

    function dashRight() {
        tapKey("c", "KeyC", 67);
        tapKey("w", "KeyW", 87);
        tapKey("d", "KeyD", 68);
        tapKey("d", "KeyD", 68);
    }

    // ====== EVENT LISTENERS ======
    document.addEventListener("keydown", event => {
        const currentTextField = getTextField();
        if (currentTextField === document.activeElement) return;

        switch(event.key) {
            case dash_left_button:
                if (!dashLeftInterval) {
                    dashLeft();
                    dashLeftInterval = setInterval(dashLeft, dash_frequency);
                }
                break;
            case dash_right_button:
                if (!dashRightInterval) {
                    dashRight();
                    dashRightInterval = setInterval(dashRight, dash_frequency);
                }
                break;
        }
    });

    document.addEventListener("keyup", event => {
        const currentTextField = getTextField();
        if (currentTextField === document.activeElement) return;

        switch(event.key) {
            case dash_left_button:
                clearInterval(dashLeftInterval);
                dashLeftInterval = null;
                break;
            case dash_right_button:
                clearInterval(dashRightInterval);
                dashRightInterval = null;
                break;
        }
    });

})();
