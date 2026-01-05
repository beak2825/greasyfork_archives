
// ==UserScript==
// @name         Macro W 동민 Alis.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macro de Alis.io / Control fácil para buena jugabilidad
// @author       DeraxesZ
// @match        http://alis.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26274/Macro%20W%20%EB%8F%99%EB%AF%BC%20Alisio.user.js
// @updateURL https://update.greasyfork.org/scripts/26274/Macro%20W%20%EB%8F%99%EB%AF%BC%20Alisio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

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

//© 2017. DeraxesZ. All Rights Reserved