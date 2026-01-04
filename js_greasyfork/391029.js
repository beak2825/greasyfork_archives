// ==UserScript==
// @name         Keybind HIT Return for Turkernator
// @namespace    https://github.com/Kadauchi
// @version      1.0.1
// @description  Return any HIT with a press of a key.
// @author       Kadauchi
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/391029/Keybind%20HIT%20Return%20for%20Turkernator.user.js
// @updateURL https://update.greasyfork.org/scripts/391029/Keybind%20HIT%20Return%20for%20Turkernator.meta.js
// ==/UserScript==

const eventCode = 'NumpadSubtract'; // Visit https://keycode.info/ and use the event.code to change this value.
const useCtrlKey = true;
const useShiftKey = true;
const useAltKey = false;
const useMetaKey = false;

document.addEventListener('keydown', (event) => {
  if (event.code === eventCode) {
    if (useCtrlKey && !event.ctrlKey) return;
    if (useShiftKey && !event.shiftKey) return;
    if (useAltKey && !event.altKey) return;
    if (useMetaKey && !event.metaKey) return;
    TKNR.hitReturn();
  }
});