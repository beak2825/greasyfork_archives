// ==UserScript==
// @name         Macro Feed [W] For Balz.io by Netro
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Macro feed [W]For Balz.io by Netro
// @author       Netro
// @match        https://balz.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387683/Macro%20Feed%20%5BW%5D%20For%20Balzio%20by%20Netro.user.js
// @updateURL https://update.greasyfork.org/scripts/387683/Macro%20Feed%20%5BW%5D%20For%20Balzio%20by%20Netro.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 100; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
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

//© 2019. NETRO. All Rights Reserved