// ==UserScript==
// @name         [R] Memory AutoFire [V] Memory AutoSpin
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  JOIN OUR DISCORD FOR MORE: https://discord.gg/S3ZzgDNAuG
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539096/%5BR%5D%20Memory%20AutoFire%20%5BV%5D%20Memory%20AutoSpin.user.js
// @updateURL https://update.greasyfork.org/scripts/539096/%5BR%5D%20Memory%20AutoFire%20%5BV%5D%20Memory%20AutoSpin.meta.js
// ==/UserScript==

const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
win.Object.defineProperty(win.Object.prototype, "HEAPF32", {
        get: function() {
            return undefined;
        },
        set: function(newHeapF32) {
            if (!newHeapF32 || !this.HEAPU32) return;
            delete win.Object.prototype.HEAPF32;
            window.Module = this;
            window.Module.HEAPF32 = newHeapF32;
            win.Module = window.Module;
            win.aim = false;
            initialize();
        },
        configurable: true,
        enumerable: true
    });

let states = {
    autofire: false,
    autospin: false,
}

let pressed_keys = new Set();

function read_states(){
    switch(window.Module.HEAPF32[18009]){
        case 0:
            states.autofire = false;
            states.autospin = false;
            break
        case 3.587324068671532e-43:
            states.autofire = true;
            states.autospin = false;
            break
        case 1.401298464324817e-45:
            states.autofire = false;
            states.autospin = true;
            break
        case 3.60133705331478e-43:
            states.autofire = true;
            states.autospin = true;
            break
    }
}

function initialize() {
    document.addEventListener("keydown", (e) => {
        read_states();
        if (e.code === "KeyR") {
            if (states.autofire) {
                input.inGameNotification('[Memory] Auto Fire: Off', 14425003);
                window.Module.HEAPF32[18009] = states.autospin ? 1.401298464324817e-45 : 0;
            } else {
                input.inGameNotification('[Memory] Auto Fire: On', 14425003);
                window.Module.HEAPF32[18009] = states.autospin ? 3.60133705331478e-43 : 3.587324068671532e-43;
            }
        }
        if (e.code === "KeyV") {
            if (states.autospin) {
                input.inGameNotification('[Memory] Auto Spin: Off', 14425003);
                window.Module.HEAPF32[18009] = states.autofire ? 3.587324068671532e-43 : 0;
            } else {
                input.inGameNotification('[Memory] Auto Spin: On', 14425003);
                window.Module.HEAPF32[18009] = states.autofire ? 3.60133705331478e-43 : 1.401298464324817e-45;
            }
        }
    });
}