// ==UserScript==
// @name    Darkumbra anti-adblock patch
// @namespace    Darkumbra
// @author       4channel Pirate
// @description Patches Darkumbra.net to remove the need to disable your adblocker to view posted links.
// @version 0.1
// @grant    none
// @include  https://darkumbra.net/forums/topic/*
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/386993/Darkumbra%20anti-adblock%20patch.user.js
// @updateURL https://update.greasyfork.org/scripts/386993/Darkumbra%20anti-adblock%20patch.meta.js
// ==/UserScript==
var txtstr = /Adblock/i;

window.addEventListener('beforescriptexecute', function(e) {
    if(txtstr.test(e.target.text)){
        e.stopPropagation();
        e.preventDefault();
        revealContent();
    }
}, true);

function revealContent() {
    var elems = document.querySelectorAll(".bimHiddenBox");
    [].forEach.call(elems, function(el) {
        el.classList.remove("ipsHide");
    });
}