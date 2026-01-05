// ==UserScript==
// @name        zonfon
// @namespace   petzworld.com
// @include     https://zon.portal.fon.com/*
// @version     1.0
// @grant       none
// @description Faz login automático na NosFon
// @downloadURL https://update.greasyfork.org/scripts/2835/zonfon.user.js
// @updateURL https://update.greasyfork.org/scripts/2835/zonfon.meta.js
// ==/UserScript==

//document.getElementById("dogs_main_container").click();
//document.getElementById("dogs_button").style.display = "none";

//setInterval(function () {document.getElementById("dogs_button").click();}, 5000);
//setTimeout(function () {document.getElementById("dogs_button").click();}, 4000);

window.addEventListener ("load", FireTimer, false);
if (document.readyState == "complete") {
    FireTimer ();
}
//--- Catch new pages loaded by WELL BEHAVED ajax.
window.addEventListener ("hashchange", FireTimer,  false);

function FireTimer () {
    setTimeout(function () {document.getElementById("login").click();}, 3000);
}