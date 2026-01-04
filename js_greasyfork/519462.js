// ==UserScript==
// @name         FoV Script
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A FoV script for the Diep.io game.
// @author       Altanis
// @match        *://diep.io/*
// @match        *://diep-io.rivet.game/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519462/FoV%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/519462/FoV%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
    NOTE: This will only work on the first server you connect to.
    If you connect to a different server, this script will no longer work (and may even crash the game).
    To use this script in a different server, reload.
    */

    const handler = {apply(r,o,args){Error.stackTraceLimit=0;return r.apply(o,args)}};Object.freeze = new Proxy(Object.freeze, handler)

    window.HEAPF32 = undefined;
    window.fov = [];

    const win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
    win.Object.defineProperty(win.Object.prototype, "HEAPF32", {
        get: function() {
            return undefined;
        },
        set: function(to) {
            if(!to || !this.HEAPU32) return;
            delete win.Object.prototype.HEAPF32;
            window.Module = this;
            window.Module.HEAPF32 = to;
            window.HEAPF32 = to;

            console.log("HEAPF32 found");
        },
        configurable: true,
        enumerable: true
    });


    const int = setInterval(function() {
        if (!document.querySelector('#home-screen[x-state="awaiting-spawn"] > #spawn-input > #pre-spawn-text')) return;
        Array.from(window.HEAPF32).map((val, index) => {
            if (val === 0.3499999940395355) { // 0.550000011920929
                window.fov.push(index);
                console.log('Got index', index);
            }
        });
        clearInterval(int);
    }, 150);

    document.addEventListener('keydown', async event => {
        if (event.key == '-') {
            console.log('Zooming out...');
            for (const fov of window.fov) {
                window.HEAPF32[fov] -= 0.1;
            }
        } else if (event.key == '+') {
            console.log('Zooming in...');
            for (const fov of window.fov) {
                window.HEAPF32[fov] += 0.1;
            }
        }
    });
})();