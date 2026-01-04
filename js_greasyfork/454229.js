// ==UserScript==
// @name           Disable yuque website hotkeys
// @description    disable website hotkeys which is implemented by JavaScript `addEventListener` and `stopImmediatePropagation` API.
// @author         yeshiqing
// @license        MIT
// @run-at         document-start
// @include        https://www.yuque.com/*
// @grant          none
// @version        0.0.6
// @namespace      https://github.com/yeshiqing/disable-website-hotkeys/yuque.js
// @icon           https://upload-images.jianshu.io/upload_images/1231311-1d5a2ebbd33475e1.png
// @downloadURL https://update.greasyfork.org/scripts/454229/Disable%20yuque%20website%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/454229/Disable%20yuque%20website%20hotkeys.meta.js
// ==/UserScript==

// Disable these keys when no keyboard modifier is pressed
let std_keycodes = new Set([
    // Add keycodes as desired
    // 37, 38, 39, 40 // Arrow Keys.
]);

// Disable these keys when Meta key is pressed.
let meta_keycodes = new Set([
    // Add keycodes as desired
    13 // Command + enter
]);

// Disable these keys when Alt key is pressed.
let alt_keycodes = new Set([
    // Add keycodes as desired
    // 83 // Alt + S
]);


let isMac = navigator.platform.indexOf('Mac') >= 0;

window.addEventListener('keydown', function (e) {
    let keycode_set;
    if (isMac ? e.metaKey : e.ctrlKey) {
        keycode_set = meta_keycodes;
    } else if (e.altKey) {
        keycode_set = alt_keycodes;
    } else {
        keycode_set = std_keycodes;
    }

    if (keycode_set.has(e.keyCode)) {
        e.stopImmediatePropagation();
    }
}, true);