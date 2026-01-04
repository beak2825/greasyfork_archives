// ==UserScript==
// @name         Mouse Throttler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Throttles your cursor to make it run at 20hz. Useful for websites that have lag induced by a high cursor polling rate. Also features auto-precision when your mouse stops moving to ensure unaltered cursor aim. Keywords: throttle mouse lag cursor lag starblast.io starblast dueling fps uncap bypass unlimiter unlock mod 60fps bugfix
// @author       ✨Stardust™
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506696/Mouse%20Throttler.user.js
// @updateURL https://update.greasyfork.org/scripts/506696/Mouse%20Throttler.meta.js
// ==/UserScript==

(function() {
    console.log('It actually worked?');

    let lastTime = 0;
    let mouseStoppedTimeout;

    //\// ////////////////////////////////// // //////////// ////////////////// // //////////// //
   //*// ∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨∨ // <!<!<!<!<!<! EDIT THROTTLE RATE // <!<!<!<!<!<! //
  /*/*/ let throttleRateInMiliseconds = 50 // <!<!<!<!<!<! 16.66(6) = 1 FRAME // <!<!<!<!<!<! //
 //*// ∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧∧ // <!<!<!<!<!<! 16.666666, not (6) // <!<!<!<!<!<! //
//\// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ // \\\\\\\\\\\\ \\\\\\\\\\\\\\\\\\ // \\\\\\\\\\\\ //

function throttle(callback, limit) {
    return function(event) {
        const now = Date.now();

        if (now - lastTime >= limit) {
            lastTime = now;
            callback(event); }
        else {
            event.stopImmediatePropagation(); }

        clearTimeout(mouseStoppedTimeout);

        mouseStoppedTimeout = setTimeout(() => {callback(event);}, limit); }; }

    document.addEventListener('mousemove', throttle((event) => { /*You can put other stuff here if you need, but you won't need to*/ }, throttleRateInMiliseconds), true); }) ();