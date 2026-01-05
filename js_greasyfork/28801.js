// ==UserScript==
// @name         Macro W Gaver.io God
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  gaver.io God made by PutinWarp
// @author       PutinWarp
// @match        http://gaver.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28801/Macro%20W%20Gaverio%20God.user.js
// @updateURL https://update.greasyfork.org/scripts/28801/Macro%20W%20Gaverio%20God.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 0.1;

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // here we put key (W)
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // here put W (*2)
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); //here put W (*3)
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}
var welcome="Hi nigger,check out my account for the new scripts";
alert(welcome);
//Made by PutinWarp aka SplinN...
