// ==UserScript==
// @name         Print-knapp.
// @namespace    http://tampermonkey.net/
// @version      1.25
// @description  Legg tilbake print knappen i Nilex.
// @author       Birk Luisson Sæther
// @match        *://nilex.trondelagfylke.no/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377688/Print-knapp.user.js
// @updateURL https://update.greasyfork.org/scripts/377688/Print-knapp.meta.js
// ==/UserScript==



function addPrintButton() {
    var x = document.getElementById("actionButtonQuickstep");
    if(x!=null){
        var y = x.parentNode;
        y.style.display = '';
    }
}

setInterval(addPrintButton, 3000);