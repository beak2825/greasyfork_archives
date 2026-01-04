// ==UserScript==
// @name Moomoo.io Game grid removal
// @author Murka
// @description Removes the game grid
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.4
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/446976/Moomooio%20Game%20grid%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/446976/Moomooio%20Game%20grid%20removal.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
    MooMooForge: https://github.com/MooMooForge
*/

(function() {
    "use strict";

    // Change to true or false
    const GRID_ENABLED = false;
    function inRange(value, min, max) {
        return value > min && value < max;
    }

    function createHook(target, prop, callback) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() { return this[symbol]; },
            set(value) { callback(this, symbol, value); },
            configurable: true
        })
    }

    createHook(window, "config", function(that, symbol, value) {
        if (typeof value === "object" && value.hasOwnProperty("maxScreenHeight")) {
            delete window.config;
            Object.defineProperty(window, "config", {
                value: value,
                configurable: false,
                writeable: false
            })
        }
    })

    CanvasRenderingContext2D.prototype.moveTo = new Proxy(CanvasRenderingContext2D.prototype.moveTo, {
        apply(target, _this, args) {

            if (!GRID_ENABLED) {
                const [ x, y ] = args;
                const { maxScreenWidth, maxScreenHeight } = window.config || {};;
                if (inRange(x, 0, maxScreenWidth) || inRange(y, 0, maxScreenHeight)) return null;
            }

            return target.apply(_this, args);
        }
    })

})();