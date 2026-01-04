// ==UserScript==
// @name         Cryzen static sight
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Makes aim sight static (does not actually effect your real spread)
// @author       StickySkull
// @match        https://cryzen.io/*
// @icon         https://media.discordapp.net/attachments/921558341791129671/1174770981894639656/image.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480064/Cryzen%20static%20sight.user.js
// @updateURL https://update.greasyfork.org/scripts/480064/Cryzen%20static%20sight.meta.js
// ==/UserScript==

const SIZE = {
    x: 0.0,
    y: 0.0
};
const propertyToGet = "spread";
const defineProperty = Object.defineProperty;
!(propertyToGet in window.Object.prototype) && defineProperty(window.Object.prototype, propertyToGet, { writable: true });
window.Object.defineProperty = new Proxy(defineProperty, {
    apply(target, thisArg, args) {
        if (args[1] == propertyToGet) {
            let spread;
            args[2] = {
                set(value) {},
                get() {
                    return SIZE;
                }
            }
        }
        return Reflect.apply(...arguments);
    }
});