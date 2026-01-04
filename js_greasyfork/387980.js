// ==UserScript==
// @name         Macro feed [R] for balz.io by Gabi | [Updated] | Disc : Gabi#3340
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Macro feed [R] for balz.io by Gabi
// @author       Gabi
// @match        https://balz.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387980/Macro%20feed%20%5BR%5D%20for%20balzio%20by%20Gabi%20%7C%20%5BUpdated%5D%20%7C%20Disc%20%3A%20Gabi3340.user.js
// @updateURL https://update.greasyfork.org/scripts/387980/Macro%20feed%20%5BR%5D%20for%20balzio%20by%20Gabi%20%7C%20%5BUpdated%5D%20%7C%20Disc%20%3A%20Gabi3340.meta.js
// ==/UserScript==
//Macro W V1
document.onkeydown = function(evt) {
  if (evt.keyCode === 82) {
    return false;
  }
}

//Macro W V2
document.addEventListener("keydown", function(){
    if (event.keyCode == '82') {
    }
});

//Old Macro ( Beta )
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 0; //in ms

function keydown(event) {
    if (event.keyCode == 82&& EjectDown === false) { // key R
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 82) { // key R
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 82}); // key R
        window.onkeyup({keyCode: 82});
        setTimeout(eject, speed);
    }
}
//© 2019. Gabi. All Rights Reserved