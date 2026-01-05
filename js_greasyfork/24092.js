// ==UserScript==
// @name         Цирк Уродов
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fastest Mass Ejector & Split Macro
// @author       Tom Burris
// @match        http://petridish.pw/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24092/%D0%A6%D0%B8%D1%80%D0%BA%20%D0%A3%D1%80%D0%BE%D0%B4%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/24092/%D0%A6%D0%B8%D1%80%D0%BA%20%D0%A3%D1%80%D0%BE%D0%B4%D0%BE%D0%B2.meta.js
// ==/UserScript==



window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms

function keydown(event) {
    if (event.keyCode == 81 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }

    if (event.keyCode == 86) { //key v
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    }

}

function keyup(event) {
    if (event.keyCode == 81) { // key W
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