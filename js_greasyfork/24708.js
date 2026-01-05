// ==UserScript==
// @name         Macros Den4ikYT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BEST MACROS MAZA FAKA
// @author       Beast
// @match        http://agar.io/*
// @match        http://petridish.pw/*
// @match        http://gota.io/web/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24708/Macros%20Den4ikYT.user.js
// @updateURL https://update.greasyfork.org/scripts/24708/Macros%20Den4ikYT.meta.js
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
    if (event.keyCode == 68) { //key D
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 69) { //key E
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    }
    if (event.keyCode == 70) { //key F
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

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
}