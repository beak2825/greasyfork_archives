// ==UserScript==
// @name         Collapced diep theme.
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Spins things around you. [P] to toggle.
// @author       hqfx (ft. 810i)
// @match        https://diep.io/*
// @downloadURL https://update.greasyfork.org/scripts/493183/Collapced%20diep%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/493183/Collapced%20diep%20theme.meta.js
// ==/UserScript==
window.arg1 = 0
window.arg2 = 0
CanvasRenderingContext2D.prototype.lineTo = new Proxy(CanvasRenderingContext2D.prototype.lineTo, {
    apply: function(target, thisArg, args) {
        args = [args[0]+window.arg1, args[1]+window.arg2];
        return Reflect.apply(target, thisArg, args);
    }
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'lineTo', {
    value: CanvasRenderingContext2D.prototype.lineTo,
    writable: false,
    configurable: false
});


let arg1 = 50;
let arg2 = 0;
let angle = 0;
let isRunning = false;

function movePoint() {
    if (!isRunning) {
        angle += 0.05;
        let radius = 5;
        let frequency = 5;
        let x = radius * Math.cos(frequency * angle);
        let y = radius * Math.sin(frequency * angle);
        window.arg1 = x;
        window.arg2 = y;
        //console.log(`arg1: ${window.arg1.toFixed(2)}, arg2: ${window.arg2.toFixed(2)}`);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 80) { // Key code for 'p'
        isRunning = !isRunning;
        window.arg1 = 0
        window.arg2 = 0
        //console.log(`isRunning: ${isRunning}`);
    }
});
setInterval(movePoint, 16);