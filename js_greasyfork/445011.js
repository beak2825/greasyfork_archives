// ==UserScript==
// @name         Diep.io Transparent Mode
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Press Q to randomize, X for more transparency Z for less transparency and B to reset
// @author       xScripty
// @license      MIT
// @match        https://diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445011/Diepio%20Transparent%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/445011/Diepio%20Transparent%20Mode.meta.js
// ==/UserScript==
const canvas = document.getElementById ('canvas');
const ctx = canvas.getContext ('2d');

document.addEventListener('keydown', function (event)
    {
       if (event.key == 'q')
       {
           ctx.globalAlpha = Math.random();
       }
       if (event.key == 'x')
       {
           ctx.globalAlpha -= 0.01;
       }
       if (event.key == 'z')
       {
           ctx.globalAlpha += 0.01;
       }
       if (event.key == 'b')
       {
           ctx.globalAlpha = 1;
       }
});