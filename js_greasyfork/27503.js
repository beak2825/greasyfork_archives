// ==UserScript==
// @name         Macros Por ZeroAgar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       NEL99
// @match        http://agar.io/*
// @include      https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27503/Macros%20Por%20ZeroAgar.user.js
// @updateURL https://update.greasyfork.org/scripts/27503/Macros%20Por%20ZeroAgar.meta.js
// ==/UserScript==

console.log("iReal Zoi Zub <3 ~ Nel");

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var ejecting = false;
var splitSpeed = 40;
var ejectSpeed = 28;
var DuracionDelay = 35;

function keydown(event) {
    if (event.keyCode == 87 && ejecting === false) {
        ejecting = true;
        setTimeout(eject, ejectSpeed);
    }
    function DarSplit() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
    }
    if (event.keyCode == 16) {
        split();
        setTimeout(split, splitSpeed);
        setTimeout(split, splitSpeed*2);
        setTimeout(split, splitSpeed*3);
    }
    if (event.keyCode == 83) {
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    } // Detener movimiento
       if (event.keyCode == 69) {
        DarSplit();
        setTimeout(DarSplit, DuracionDelay);
    } // Doublesplit (Split 2x)
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