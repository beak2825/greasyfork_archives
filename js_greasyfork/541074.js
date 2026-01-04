// ==UserScript==
// @name         PS4/PS5 Controller → F13–F24 Virtual Keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Map PS4/PS5 controller to F13–F24 keys. Left stick & D-pad control same movement keys for Bonk.io, etc.
// @author       pro9905
// @match        https://bonk.io/gameframe-release.html
// @match        https://hitbox.io/game2.html
// @license      All Rights Reserved © 2025 [pro9905/mythicturbo]
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541074/PS4PS5%20Controller%20%E2%86%92%20F13%E2%80%93F24%20Virtual%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/541074/PS4PS5%20Controller%20%E2%86%92%20F13%E2%80%93F24%20Virtual%20Keys.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const deadzone = 0.2;

    const keyState = {};
    const virtualKeys = {
        up: 'F13',
        down: 'F14',
        left: 'F15',
        right: 'F16',
        x: 'F17',
        square: 'F18',
        circle: 'F19',
        triangle: 'F20',
        l1: 'F21',
        l2: 'F22',
        r1: 'F23',
        r2: 'F24'
    };

    const keyCodes = {
        F13: 124, F14: 125, F15: 126, F16: 127,
        F17: 128, F18: 129, F19: 130, F20: 131,
        F21: 132, F22: 133, F23: 134, F24: 135
    };

    for (const key of Object.values(virtualKeys)) {
        keyState[key] = false;
    }

    function triggerKey(key, pressed) {
        if (keyState[key] === pressed) return;
        keyState[key] = pressed;

        const event = new KeyboardEvent(pressed ? 'keydown' : 'keyup', {
            key,
            code: key,
            keyCode: keyCodes[key],
            which: keyCodes[key],
            bubbles: true
        });

        document.dispatchEvent(event);
    }

    function loop() {
        const gamepads = navigator.getGamepads();
        const gp = [...gamepads].find(g => g && g.connected);
        if (!gp) return requestAnimationFrame(loop);

        const [lx, ly] = gp.axes;
        const b = gp.buttons;

        const up    = ly < -deadzone || b[12]?.pressed;
        const down  = ly > deadzone || b[13]?.pressed;
        const left  = lx < -deadzone || b[14]?.pressed;
        const right = lx > deadzone || b[15]?.pressed;

        triggerKey(virtualKeys.up, up);
        triggerKey(virtualKeys.down, down);
        triggerKey(virtualKeys.left, left);
        triggerKey(virtualKeys.right, right);

        triggerKey(virtualKeys.x, b[0]?.pressed);
        triggerKey(virtualKeys.circle, b[1]?.pressed);
        triggerKey(virtualKeys.square, b[2]?.pressed);
        triggerKey(virtualKeys.triangle, b[3]?.pressed);

        triggerKey(virtualKeys.l1, b[4]?.pressed);
        triggerKey(virtualKeys.r1, b[5]?.pressed);
        triggerKey(virtualKeys.l2, b[6]?.pressed);
        triggerKey(virtualKeys.r2, b[7]?.pressed);

        requestAnimationFrame(loop);
    }

    loop();
})();
