// ==UserScript==
// @name		ModsToolsCC
// @namespace	HPrivakosScripts
// @description	Mods tools for ChopCoin
// @author		HPrivakos
// @include		http://chopcoin.io/*
// @version		1.1
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/18939/ModsToolsCC.user.js
// @updateURL https://update.greasyfork.org/scripts/18939/ModsToolsCC.meta.js
// ==/UserScript==

window.addEventListener("keydown", dealWithKeyboard, "false");

function dealWithKeyboard(e) {
	if (e.keyCode == "96") {switchPlayer();}
	else if (e.keyCode == "38") {switchPlayer();}
	//else if (e.keyCode == "*") { }
}

function switchPlayer() {
    chopcoin.event.interface.spectate();
}
