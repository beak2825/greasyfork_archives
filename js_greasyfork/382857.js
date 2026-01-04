// ==UserScript==
// @name         Macro feed [W] for balz.io by Gabi | [Updated] |
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Macro feed [W]for balz.io by Gabi
// @author       Gabi
// @match        https://balz.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382857/Macro%20feed%20%5BW%5D%20for%20balzio%20by%20Gabi%20%7C%20%5BUpdated%5D%20%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/382857/Macro%20feed%20%5BW%5D%20for%20balzio%20by%20Gabi%20%7C%20%5BUpdated%5D%20%7C.meta.js
// ==/UserScript==
//Macro W V1
document.onkeydown = function(evt) {
  if (evt.keyCode === 87) {
    return false;
  }
}

//Macro W V2
document.addEventListener("keydown", function(){
    if (event.keyCode == '87') {
    }
});

//Old Macro ( Beta )
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
//© 2019. Gabi. All Rights Reserved
