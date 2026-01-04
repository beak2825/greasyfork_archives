// ==UserScript==
// @name         Macro W Torneo Dual Flyers
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Cebar Como Raio Makuin
// @author       Krytex
// @match        http://dual-agar.online/*
// @match        http://dual-agar.me/dualplus/*
// @match        http://agarly.com/*
// @match        http://dual-agar.me/*
// @match        http:///ixagar.net/classic//*
// @match        http://dual-agar.me/dualplus//*
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36706/Macro%20W%20Torneo%20Dual%20Flyers.user.js
// @updateURL https://update.greasyfork.org/scripts/36706/Macro%20W%20Torneo%20Dual%20Flyers.meta.js
// ==/UserScript==



window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 57) { //key d
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode ==  vbKeyd) { //key d
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
    }
    if (event.keyCode == 83) { //key S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
}

function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}