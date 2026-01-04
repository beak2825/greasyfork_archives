// ==UserScript==
// @name         Diep.io Borderless
// @namespace    https://diep.io
// @version      1.0
// @description  Diep.io theme without borders!
// @author       Binary
// @match        https://diep.io/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426075/Diepio%20Borderless.user.js
// @updateURL https://update.greasyfork.org/scripts/426075/Diepio%20Borderless.meta.js
// ==/UserScript==

// [level up bar, score bar, health bar, *score bar for the 4 team colors*]
const whitelistedStrokes = ['rgb(255,222,67)', 'rgb(67,255,145)', 'rgb(133,227,125)', 'rgb(0,178,225)', 'rgb(241,78,84)', 'rgb(0,225,110)', 'rgb(191,127,245)'];
// [blue stroke, red stroke, green stroke, purple stroke], primarily used to take care of circle tank borders. this patch disappears if the tank is hit though (since they temporarily turn red)
const blacklistedFills = ['rgb(0,133,168)', 'rgb(180,58,63)', 'rgb(0,168,82)', 'rgb(143,95,183)'];

const strokeDesc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle');
const fillDesc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'fillStyle');

strokeDesc.set = new Proxy(strokeDesc.set, {
    apply(t, thisArg, args) {
        if (!whitelistedStrokes.includes(args[0])) args[0] = 'rgba(0,0,0,0)';
        return Reflect.apply(t, thisArg, args);
    }
});
fillDesc.set = new Proxy(fillDesc.set, {
    apply(t, thisArg, args) {
        if (blacklistedFills.includes(args[0])) args[0] = 'rgba(0,0,0,0)';
        return Reflect.apply(t, thisArg, args);
    }
});
Object.defineProperty(CanvasRenderingContext2D.prototype, 'strokeStyle', strokeDesc);
Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillStyle', fillDesc);
