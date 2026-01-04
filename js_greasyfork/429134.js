// ==UserScript==
// @name         rainbow
// @description  made with much love
// @version      0.0.1
// @author       Cazka#1820
// @match        *://digdig.io/
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @grant        none
// @namespace https://greasyfork.org/users/541070s
// @downloadURL https://update.greasyfork.org/scripts/429134/rainbow.user.js
// @updateURL https://update.greasyfork.org/scripts/429134/rainbow.meta.js
// ==/UserScript==

let i = 0;

const { set: fillStyleSetter } = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "fillStyle");
Object.defineProperty(CanvasRenderingContext2D.prototype, "fillStyle", {
    set(value) {
        i = 1;
        fillStyleSetter.call(this, value);
    }
});
const { set: globalAlphaSetter } = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "globalAlpha");
Object.defineProperty(CanvasRenderingContext2D.prototype, "globalAlpha", {
    set(value) {
        if(i == 1 && value > 0.25) i = 2;
        else i = 0;
        globalAlphaSetter.call(this, value);
    }
});
const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'];
window.CanvasRenderingContext2D.prototype.fillRect = new Proxy(window.CanvasRenderingContext2D.prototype.fillRect, {
    apply(target, thisArgs, args) {
        if(i==2) {
            thisArgs.fillStyle = colors[(Math.floor((Date.now() / 100) + 2.5*thisArgs.globalAlpha)) % colors.length];
            thisArgs.globalAlpha *= 0.8;
        }
        i = 0;
        Reflect.apply(target, thisArgs, args);
    }
});