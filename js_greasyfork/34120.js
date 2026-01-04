// ==UserScript==
// @name         Dual macro
// @namespace    http://tampermonkey.net/
// @version      ∞
// @description  G - Double | T - 16 split | S - Freeze cell
// @author       4M1X3
// @match        http://dual-agar.me/*
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/34120/Dual%20macro.user.js
// @updateURL https://update.greasyfork.org/scripts/34120/Dual%20macro.meta.js
// ==/UserScript==

function getPing(){
    let ping = Number($("#latency_box").text().replace(/latency:\s*(\d+)\s*ms/i, "$1"));
    return ping;
}

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 46.100; //in ms
var speed2 = 1; //in ms
var speed3 = 100; //in ms
var speed4 = 130; //in ms

function keydown(event) {
    if (event.keyCode == 643433443434343434343439 && EjectDown === true) { // key W
        EjectDown = true;
        setTimeout(eject, speed3);
    }
    if (event.keyCode == 71) { //key A
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 82) { //key D
        split();
        setTimeout(split, speed4);
    }
    if (event.keyCode == 84) { //key D
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    }
    if (event.keyCode == 32) { //key D
        setTimeout(speed2);
    }
    if (event.keyCode == 83) { //key S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
}

function keyup(event) {
    if (event.keyCode == 634434343434343434343434349) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 843434434347}); // key W
        window.onkeyup({keyCode: 4343434343434343434343434343434387});
        setTimeout(eject, speed3);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
}

//testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt