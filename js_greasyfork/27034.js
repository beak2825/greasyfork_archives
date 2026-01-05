// ==UserScript==
// @name         Fast W-1m/s by PutinWarp
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Alis.io hack by PutinWarp
// @author       (<SplinN>)
// @match        http://alis.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27034/Fast%20W-1ms%20by%20PutinWarp.user.js
// @updateURL https://update.greasyfork.org/scripts/27034/Fast%20W-1ms%20by%20PutinWarp.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 0.00000001; 

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { 
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { 
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); 
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}
alert("Check out my account for new script!");
//All copypastes will be punished.