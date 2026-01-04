// ==UserScript==
// @name          Moonwalker
// @namespace     http://tampermonkey.net/
// @version       1.2.1
// @description   Join us! - https://discord.gg/3xDbJ8QD8f
// @author        GoBattle Hacks Official
// @match         *://gobattle.io/*
// @match         *://*.gobattle.io/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/543238/Moonwalker.user.js
// @updateURL https://update.greasyfork.org/scripts/543238/Moonwalker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RIGHT_ARROW_TRIGGER_KEY = "=";
    const LEFT_ARROW_TRIGGER_KEY = "-";
    const PRESS_FREQUENCY = 20;

    const RIGHT_ARROW_TARGET_KEY = "ArrowRight";
    const LEFT_ARROW_TARGET_KEY = "ArrowLeft";

    let textfield = null;
    let activeIntervalId = null;
    let activeDirection = null;

    window.addEventListener('load', () => {
        textfield = document.getElementById("shinobit-textfield");
    });

    function stopActivePress() {
        if (activeIntervalId) {
            clearInterval(activeIntervalId);
            activeIntervalId = null;
        }
        activeDirection = null;
    }

    function startPressingKey(targetKey, direction) {
        stopActivePress();

        pressKey(targetKey);
        activeIntervalId = setInterval(() => pressKey(targetKey), PRESS_FREQUENCY);
        activeDirection = direction;
    }

    document.addEventListener("keydown", event => {
        const isTypingInChat = textfield ? textfield === document.activeElement : false;

        if (isTypingInChat) {
            return;
        }

        if (event.key === RIGHT_ARROW_TRIGGER_KEY) {
            event.preventDefault();
            if (activeDirection === 'right') {
                stopActivePress();
            } else {
                startPressingKey(RIGHT_ARROW_TARGET_KEY, 'right');
            }
        } else if (event.key === LEFT_ARROW_TRIGGER_KEY) {
            event.preventDefault();
            if (activeDirection === 'left') {
                stopActivePress();
            } else {
                startPressingKey(LEFT_ARROW_TARGET_KEY, 'left');
            }
        }
    });

    function pressKey(key) {
        let keyCode, which, code;

        switch (key) {
            case "ArrowRight":
                keyCode = 39;
                which = 39;
                code = "ArrowRight";
                break;
            case "ArrowLeft":
                keyCode = 37;
                which = 37;
                code = "ArrowLeft";
                break;
            default:
                console.warn(`Unsupported key: ${key}`);
                return;
        }

        const event_props = {
            "key": key,
            "keyCode": keyCode,
            "which": which,
            "code": code,
            "location": 0,
            "altKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "shiftKey": false,
            "repeat": false
        };

        document.dispatchEvent(new KeyboardEvent("keydown", event_props));
        document.dispatchEvent(new KeyboardEvent("keyup", event_props));
    }
})();