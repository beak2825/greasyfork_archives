// ==UserScript==
// @name         Light or Dark
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  library to determine if the color parameter is a 'light' or a 'dark' color
// @author       escctrl
// @version      1.0
// @grant        none
// @license      MIT
// ==/UserScript==

// helper function to determine whether a color (the background in use) is light or dark
// https://awik.io/determine-color-bright-dark-using-javascript/
function lightOrDark(color) {
    var r, g, b, hsp;
    if (color.match(/^rgb/)) { color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1]; g = color[2]; b = color[3]; }
    else { color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
        r = color >> 16; g = color >> 8 & 255; b = color & 255; }
    hsp = Math.sqrt( 0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b) );
    if (hsp>127.5) { return 'light'; } else { return 'dark'; }
}