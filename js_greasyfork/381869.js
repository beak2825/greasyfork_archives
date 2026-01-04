// ==UserScript==
// @name Olpair.com Automatizer
// @description Works only with ReCaptcha Automatizer! Pairs automatically as long as no suspicious traffic was registered. Leave the page open and you will allwas stay paired.
// @namespace Violentmonkey Scripts
// @match https://olpair.com/
// @grant none
// @version 0.0.1.20190418103333
// @downloadURL https://update.greasyfork.org/scripts/381869/Olpaircom%20Automatizer.user.js
// @updateURL https://update.greasyfork.org/scripts/381869/Olpaircom%20Automatizer.meta.js
// ==/UserScript==

function Sleep(milliseconds) {
     return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function Click() {
     await Sleep(6000); // Pausiert die Funktion für X Millisekunden
     parent.document.getElementById('submitPair').click();
     console.log("zweiter Klick");
     await Sleep(14400000); // Pausiert die Funktion für X Millisekunden
     history.go(0);
}

var oldOnload = window.onload;

window.onload = function () {

    if (typeof oldOnload == 'function') {
       oldOnload();
    }
       
    Click();
      
} 