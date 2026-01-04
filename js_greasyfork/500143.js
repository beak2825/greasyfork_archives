// ==UserScript==
// @name         Vanis Fixed Mouse Hold
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @author       Big watermelon
// @description  allows you to fixed mouse hold on vanis.io
// @match        https://vanis.io
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/500143/Vanis%20Fixed%20Mouse%20Hold.user.js
// @updateURL https://update.greasyfork.org/scripts/500143/Vanis%20Fixed%20Mouse%20Hold.meta.js
// ==/UserScript==

const hotkey = "e";

var currentMouse = { x: 0, y: 0 };
var lastMouse = false;
Object.defineProperties(MouseEvent.prototype, {
    clientX: {
        get: function() {
            return lastMouse?.x || this.x;
        }
    },
    clientY: {
        get: function() {
            return lastMouse?.y || this.y;
        }
    }
});
unsafeWindow.addEventListener("mousemove", ({ x, y }) => {
    if (lastMouse === true) lastMouse = { x, y };
    currentMouse = { x, y };
});
unsafeWindow.addEventListener("keydown", event => {
    if (!lastMouse && event.key === hotkey) lastMouse = true;
});
unsafeWindow.addEventListener("keyup", event => {
    if (lastMouse && event.key === hotkey) lastMouse = false;
});
