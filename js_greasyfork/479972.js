// ==UserScript==
// @name        Keyboard controls for RainyCafe
// @namespace   https://slampisko.github.io
// @version     1.1
// @description Use Space to toggle both streams, comma or period to toggle only one of them, and arrow keys for volumes.
// @author      slampisko
// @match       https://*rainycafe.com/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=rainycafe.com
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479972/Keyboard%20controls%20for%20RainyCafe.user.js
// @updateURL https://update.greasyfork.org/scripts/479972/Keyboard%20controls%20for%20RainyCafe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CAFE = 0;
    const RAIN = 1;
    const VOL_MULTIPLIER = 1.5;
    const TOGGLES = document.querySelectorAll('input[type=checkbox]');
    const VOLUME_RANGES = document.querySelectorAll('input ~ input');

    /*
    To remap, simple characters (letters, symbols) or one of the special key values can be used:
    https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    To disable, just delete the offending line.
    */
    const HOTKEYS = {
        ",": () => TOGGLES[CAFE].click(),
        ".": () => TOGGLES[RAIN].click(),
        " ": () => TOGGLES.forEach(t => t.click()),

        "h": () => lowerVolume(CAFE),
        "ArrowLeft": () => lowerVolume(CAFE),
        "l": () => raiseVolume(CAFE),
        "ArrowRight": () => raiseVolume(CAFE),

        "j": () => lowerVolume(RAIN),
        "ArrowDown": () => lowerVolume(RAIN),
        "k": () => raiseVolume(RAIN),
        "ArrowUp": () => raiseVolume(RAIN),

        // No-op (default)
        "": () => {},
    }

    function getHotkey(key) {
        return HOTKEYS[Object.hasOwn(HOTKEYS, key) ? key : ""]
    }

    function changeVolume(input_index, multiplier) {
        const input = VOLUME_RANGES[input_index];
        const target_value = Number(input.value) * multiplier;
        input.value = Math.min(Math.max(Number(input.min), target_value), Number(input.max));
        input.onchange();
    }

    function raiseVolume(input_index) {
        changeVolume(input_index, VOL_MULTIPLIER);
    }

    function lowerVolume(input_index) {
        changeVolume(input_index, 1/VOL_MULTIPLIER);
    }

    document.body.addEventListener("keyup", (evt) => {
        if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) getHotkey(evt.key)();
    });
})();
