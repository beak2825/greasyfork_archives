// ==UserScript==
// @name         Wall Glitch Vertix
// @namespace    http://vertix.io/
// @version      1.02
// @description  allows into walls through corners, 'q' to start, 'e' to end
// @author       Meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31616/Wall%20Glitch%20Vertix.user.js
// @updateURL https://update.greasyfork.org/scripts/31616/Wall%20Glitch%20Vertix.meta.js
// ==/UserScript==

function wallShift() {
    setTimeout(function() {
        keys.d = 1;
        setTimeout (function() {
            keys.d = 0;
            setTimeout (function() {
                keys.u = 1;
                setTimeout (function() {
                    keys.u = 0;
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

var active = false;
var interval = void 0;

function activate(event) { //'q' to activate
    event.preventDefault();
    if (event.keyCode === 81 && !active) {
        active = true;
        interval = setInterval(wallShift, 10);
    }
}

function deactivate(event) { //'e' to deactivate
    event.preventDefault();
    if (event.keyCode === 69) {
        active = false;
        clearInterval(interval);
    }
}

c.addEventListener("keydown", activate, false);
c.addEventListener("keyup", deactivate, false);