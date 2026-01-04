// ==UserScript==
// @name         Fast Macros And Respawn With "Q"
// @namespace    Fast Macros And Respawn With "Q"
// @version      1.1
// @description  Fastest Mass Ejector & Split Macro
// @author       Kareem Olim (HUNter)
// @match        *.agma.io/*
// @match        *.alis.io/*
// @match        *.gaver.io/*
// @match        *.gota.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/41094/Fast%20Macros%20And%20Respawn%20With%20%22Q%22.user.js
// @updateURL https://update.greasyfork.org/scripts/41094/Fast%20Macros%20And%20Respawn%20With%20%22Q%22.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 20; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 65) { //key A
        split();
        setTimeout(split, speed);
    }
        if (event.keyCode == 81) { //key Q
            closeStats();
            rspwn(document.getElementById('nick').value);
    }
    if (event.keyCode == 68) { //key D
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
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

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //Why You Look Here O_o
}