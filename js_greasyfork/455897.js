// ==UserScript==
// @name         egedraw rainbow
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  rainbow in egedraw
// @author       You
// @match        https://egedraw.glitch.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glitch.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455897/egedraw%20rainbow.user.js
// @updateURL https://update.greasyfork.org/scripts/455897/egedraw%20rainbow.meta.js
// ==/UserScript==

function rgbatohex(r,g,b,a=255) {
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return;
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    a = parseInt(a);
    r = ("00000" + r.toString(16)).slice(-2);
    g = ("00000" + g.toString(16)).slice(-2);
    b = ("00000" + b.toString(16)).slice(-2);
    a = ("00000" + a.toString(16)).slice(-2);
    if (a == 'ff') return "#"+r+g+b; else return "#"+r+g+b+a;
};
var f = 0.008;
var drw = draw;
draw = function(e) {
    try {drw(e)} catch {};
    if (!drawing) return;
    var i = e.clientX + e.clientY;
    var j = 255/2; /* idk what to call this variable */
    var red = Math.sin(f*i + 4) * j + j;
    var green = Math.sin(f*i + 2) * j + j;
    var blue = Math.sin(f*i) * j + j;
    colorPicker.value = rgbatohex(red,green,blue);
    localStorage.setItem('color', colorPicker.value);
};