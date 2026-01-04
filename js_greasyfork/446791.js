// ==UserScript==
// @name Sploop.io Zoom hack
// @author Murka
// @description Allows to change zoom of the game using mouse wheels
// @icon https://sploop.io/img/ui/favicon.png
// @version 1.1
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/446791/Sploopio%20Zoom%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/446791/Sploopio%20Zoom%20hack.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
*/

(function() {
    "use strict";

    const log = console.log;
    function createHook(target, prop, callback) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                callback(this, symbol, value);
            },
            configurable: true
        })
    }

    function findKey(target, value) {
        for (const key in target) {
            if (target[key] === value) return key;
        }
        return null;
    }

    const CONFIG = {
        maxWidth: {
            key: null,
            value: 1824 + 100 * 5,
            actual: 1824 + 100 * 5,
        },
        maxHeight: {
            key: null,
            value: 1026 + 100 * 5,
            actual: 1026 + 100 * 5,
        }
    };

    const dW = CONFIG.maxWidth.value;
    const dH = CONFIG.maxHeight.value;
    createHook(Object.prototype, "_a", function(that, symbol, value) {
        delete Object.prototype._a;
        that._a = value;

        const { maxWidth, maxHeight } = CONFIG;
        maxWidth.key = findKey(that, 1824);
        maxHeight.key = findKey(that, 1026);

        Object.defineProperty(that, maxWidth.key, { get: () => maxWidth.value })
        Object.defineProperty(that, maxHeight.key, { get: () => maxHeight.value })
    });

    const lerp = (start, end, factor) => {
        return (1 - factor) * start + factor * end;
    }

    const event = new Event("resize");
    const loop = () => {
        window.requestAnimationFrame(loop);

        const { maxWidth, maxHeight } = CONFIG;
        const blend = 0.09;
        maxWidth.value = lerp(maxWidth.value, maxWidth.actual, blend);
        maxHeight.value = lerp(maxHeight.value, maxHeight.actual, blend);
        window.dispatchEvent(event);
    }
    window.requestAnimationFrame(loop);

    let scale = 1;
    window.addEventListener("wheel", function(event) {
        const { maxWidth, maxHeight } = CONFIG;
        if (event.target.id !== "game-canvas" || maxWidth.key === null || maxHeight.key === null) return;

        if (event.deltaY < 0) {
            scale *= 1.1;
        } else {
            scale /= 1.1;
        }
        maxWidth.actual = dW * scale;
        maxHeight.actual = dH * scale;
    })

})();