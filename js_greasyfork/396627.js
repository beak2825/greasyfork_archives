// ==UserScript==
// @name        AutoClick
// @author      QtheConqueror
// @namespace   Automation
// @description Hold ` key to repeatedly click element under mouse
// @version     3.0
// @include     http:*
// @include     https:*
// @grant       none
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/396627/AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/396627/AutoClick.meta.js
// ==/UserScript==

var cps = 0; // Clicks per Second: 0 = as fast as possible

if (window.attachEvent) {
    document.attachEvent('onmousemove', mouseMv);
} else {
    document.addEventListener('mousemove', mouseMv, false);
}
document.addEventListener('keydown', keyDown);

var x, y;
var interval, timeout;
var rate = (cps ? 1000 / (cps / 3) : 0);

/**
 * Summary: Listens for mouse movement and exports position to variables x & y.
 * @param {Event} e 
 */
function mouseMv(e) {
    if (!e) e = window.event;

    if (typeof e.pageY == 'number') {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
}

/**
 * Summary: Listens for keydown event
 * @param {Event} e 
 */
function keyDown(e) {``
    var char = e.key
    if (char == '`' || char == '~') {
        interval = setInterval(click, rate, x, y);
        timeout = setTimeout(clearInterval, 200, interval)
    }
}

/** 
 * Summary: Clicks element at positions (x, y) on document.
 * @param {number} x - X coordinate of document element.
 * @param {number} y - Y coordinate of document element.
 */
function click() {
    document.elementFromPoint(x, y).click();
}
