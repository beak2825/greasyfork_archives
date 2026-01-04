// ==UserScript==
// @name Moomoo.io Zoom hack
// @author Murka
// @description Allows to change zoom of the game using mouse wheels
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.8
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447069/Moomooio%20Zoom%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/447069/Moomooio%20Zoom%20hack.meta.js
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

    const log = console.log;
    function linker(value) {
        const hook = {
            0: value,
            toString: (radix) => hook[0].toString(radix),
            valueOf: () => hook[0].valueOf(),
            get length() {
                return hook[0].length;
            }
        };
        return hook;
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

    // Bypass checkTrusted, so it will just return a callback
    createHook(Object.prototype, "checkTrusted", function(that, symbol, value) {
        delete Object.prototype.checkTrusted;
        that.checkTrusted = (callback) => callback;
    })

    // You can change to your own scale factor
    const scale = {
        width: 192,
        height: 108
    };

    // Intercept when assigning value to maxScreenHeight, then add our hooks to it
    createHook(Object.prototype, "maxScreenHeight", function(that, symbol, value) {
        delete Object.prototype.maxScreenHeight;
        that.maxScreenWidth = linker(1920 + scale.width * 3);
        that.maxScreenHeight = linker(1080 + scale.height * 3);
    })

    let wheels = 0;
    window.addEventListener("wheel", function(event) {
        const { maxScreenWidth, maxScreenHeight } = window.config || {};
        if (event.target.id !== "gameCanvas") return;

        // Used to create a small gap, so users could easily find the default scale
        if (maxScreenWidth[0] === 1920 && maxScreenHeight[0] === 1080) wheels += 1;
        if (wheels % 5 !== 0) return;

        const { width, height } = scale;
        maxScreenWidth[0] = Math.max(width, maxScreenWidth[0] + (event.deltaY > 0 ? -width : width));
        maxScreenHeight[0] = Math.max(height, maxScreenHeight[0] + (event.deltaY > 0 ? -height : height));
        window.dispatchEvent(new Event("resize"));
    })

})();