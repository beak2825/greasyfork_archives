// ==UserScript==
// @name         PS4/PS5 Controller on bonk.io and hitbox.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Map PS4 controller stick + D-pad + custom buttons to keyboard for Bonk.io etc.
// @author       pro9905
// @match        https://bonk.io/gameframe-release.html
// @match        https://hitbox.io/game2.html
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541073/PS4PS5%20Controller%20on%20bonkio%20and%20hitboxio.user.js
// @updateURL https://update.greasyfork.org/scripts/541073/PS4PS5%20Controller%20on%20bonkio%20and%20hitboxio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;

    function log(...args) {
        if (DEBUG) console.log(...args);
    }

    const deadzone = 0.2;

    const keyState = {
        W: false,
        A: false,
        S: false,
        D: false,
        ' ': false,
        X: false,
        Shift: false
    };

    const sources = {
        W: { stick: false, button: false, dpad: false },
        A: { stick: false, dpad: false },
        S: { stick: false, dpad: false },
        D: { stick: false, dpad: false }
    };

    function getKeyCode(key) {
        if (key === ' ') return 32;
        if (key === 'Shift') return 16;
        if (key === 'X') return 88;
        return key.toUpperCase().charCodeAt(0);
    }

    function triggerKey(key, isPressed) {
        if (keyState[key] === isPressed) return;
        keyState[key] = isPressed;

        const eventType = isPressed ? 'keydown' : 'keyup';
        const keyCode = getKeyCode(key);

        const keyboardEvent = new KeyboardEvent(eventType, {
            key: key,
            code: key === ' ' ? 'Space' : key,
            keyCode,
            which: keyCode,
            location: key === 'Shift' ? 1 : 0,
            bubbles: true
        });

        if (document.hasFocus()) {
            log(`${eventType}: ${key}`);
            document.dispatchEvent(keyboardEvent);
        }
    }

    function updateKey(key) {
        const active = Object.values(sources[key]).some(Boolean);
        triggerKey(key, active);
    }

    function mapControllerToKeys() {
        const gamepads = navigator.getGamepads();
        const gamepad = [...gamepads].find(gp => gp && gp.connected);
        if (!gamepad) return;

        const buttons = gamepad.buttons;
        const [leftX = 0, leftY = 0] = gamepad.axes || [];

        sources.W.stick = leftY < -deadzone;
        sources.S.stick = leftY > deadzone;

        sources.A.stick = leftX < -deadzone;
        sources.D.stick = leftX > deadzone;

        sources.W.dpad = buttons[12]?.pressed;
        sources.S.dpad = buttons[13]?.pressed;
        sources.A.dpad = buttons[14]?.pressed;
        sources.D.dpad = buttons[15]?.pressed;

        sources.W.button = buttons[0]?.pressed;

        const pressSpace = buttons[2]?.pressed || buttons[6]?.pressed;
        triggerKey(' ', pressSpace);

        const combo = buttons[1]?.pressed || buttons[7]?.pressed;
        triggerKey('X', combo);
        triggerKey('Shift', combo);

        updateKey('W');
        updateKey('A');
        updateKey('S');
        updateKey('D');
    }

    function loop() {
        mapControllerToKeys();
        requestAnimationFrame(loop);
    }

    loop();
})();