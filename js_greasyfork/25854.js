// ==UserScript==
// @name         Macro by RistPlay 2
// @namespace    http://tampermonkey.net/
// @version      MakroByRistPlay2
// @description  try to take over the world!
// @author       RistPlay
// @match        http://agar.io/*
// @include      https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25854/Macro%20by%20RistPlay%202.user.js
// @updateURL https://update.greasyfork.org/scripts/25854/Macro%20by%20RistPlay%202.meta.js
// ==/UserScript==

console.log("Macro by RistPlay");

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var ejecting = false;
var splitSpeed = 26;
var ejectSpeed = 28;

function keydown(event) {
    if (event.keyCode == 87 && ejecting === false) {
        ejecting = true;
        setTimeout(eject, ejectSpeed);
    }
    if (event.keyCode == 84) {
        split();
        setTimeout(split, splitSpeed);
        setTimeout(split, splitSpeed*2);
        setTimeout(split, splitSpeed*3);
    }
}

function keyup(event) {
    if (event.keyCode == 87) {
        ejecting = false;
    }
}

function eject() {
    if (ejecting) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(eject, ejectSpeed);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}