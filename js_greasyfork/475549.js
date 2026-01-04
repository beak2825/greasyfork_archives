// ==UserScript==
// @name         Arras.ios Funni Name Generator
// @version      1.0.0
// @description  Generates funni names
// @author       TheThreeBowlingBulbs
// @match        *://arras.io/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/812261
// @downloadURL https://update.greasyfork.org/scripts/475549/Arrasios%20Funni%20Name%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/475549/Arrasios%20Funni%20Name%20Generator.meta.js
// ==/UserScript==
let p = 0;
let z = 0;
let buffer;
let FOV = 7360167565013653043n;
let pos = 1183664;

Uint8Array = new Proxy(Uint8Array, {
    construct(target, args) {
        if (p || z) buffer = new DataView(args[0]);
        if (p) {
            setInterval(() => {
                buffer.setBigInt64(pos, FOV);
            });
        };
        if (z) {
            setInterval(() => {
                buffer.setBigInt64(parseInt(localStorage.pos), FOV);
            });
        };
        return new target(...args);
    },
});

document.addEventListener('keydown', function(e) {
    if (e.code === 'KeyX' && e.shiftKey) {
        p = !p;
    };
    if (e.code === 'KeyK' && e.shiftKey) {
        z = !z;
    }
});

let t = setInterval(() => {
    if (buffer) {
        for (let count = -400; count < 400; count += 8) {
            if (buffer.getBigInt64(1183664 + count) === 6014191085069377247n) {
                pos = 1183664 + count;
                localStorage.pos = pos;
                clearInterval(t);
                break;
            }
        }
    }
});

let h = String.prototype.includes;
String.prototype.includes = function(e) {
    if (e === '==UserScript==') e = 'forforofrfosefiofiojsdjiodgiohjasdgdgs';
    return h.apply(this, arguments);
};

JSON.stringify = new Proxy(JSON.stringify, {
    apply(shift, array, args) {
        if (args[0].fingerprints) {
            args[0].fingerprints.canvas = args[0].tracking.legacyToken = args[0].fingerprints.unicode = args[0].report = Math.random();
            args[0].window.innerWidth = args[0].window.innerHeight = Infinity;
        };
        return shift.apply(array, args);
    }
});