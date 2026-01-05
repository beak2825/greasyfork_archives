// ==UserScript==
// @name         Macro W for Beta.Alis.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Beta.Alis.io G0d!
// @author       SplinN X PutinWarp
// @match        http://beta.alis.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29198/Macro%20W%20for%20BetaAlisio.user.js
// @updateURL https://update.greasyfork.org/scripts/29198/Macro%20W%20for%20BetaAlisio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 0.00001;

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // I think 
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // that 
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // nosx gay !!!
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}
//Made by PutinWarp aka SplinN...