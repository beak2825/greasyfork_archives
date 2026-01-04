// ==UserScript==
// @name         Remove adblock blocker Hobby Consolas
// @name:ES-es   Elimina el bloqueador de adblock de Hobby Consolas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the AdBlock modal from Hobby Consolas.
// @description:ES-es  Elimina el modal de Adblock de Hobby Consolas.
// @author       github.com/tryn0
// @match        *.hobbyconsolas.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hobbyconsolas.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456326/Remove%20adblock%20blocker%20Hobby%20Consolas.user.js
// @updateURL https://update.greasyfork.org/scripts/456326/Remove%20adblock%20blocker%20Hobby%20Consolas.meta.js
// ==/UserScript==

var allBlockerDeleted = 0;

var intervalId = window.setInterval(function(){
    var ms = document.getElementsByClassName('tp-modal');
    if (ms.length > 0) {
        ms[0].remove();
        allBlockerDeleted++;
    }

    var background = document.getElementsByClassName('tp-backdrop tp-active');
    if (background.length > 0) {
        background[0].remove();
        allBlockerDeleted++;
    }
    if (document.body.classList.remove("tp-modal-open")) {
        allBlockerDeleted++;
    }
}, 700);

if (allBlockerDeleted === 3) {
    clearInterval(intervalId);
}