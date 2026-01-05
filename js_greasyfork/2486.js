// ==UserScript==
// @name           BvS Full Village Messages
// @namespace      BvS-Razithel
// @version        1.2
// @history	   1.2 New domain - animecubedgaming.com - Channel28
// @history        1.1 Now https compatible (Updated by Channel28)
// @description    Displays all messages in village by default rather then having to click "Refresh Messages / Show All"
// @include        http*://*animecubed.com/billy/bvs/*
// @include        http*://*animecubedgaming.com/billy/bvs/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/2486/BvS%20Full%20Village%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/2486/BvS%20Full%20Village%20Messages.meta.js
// ==/UserScript==

// Finds all instances of the Village link in the mini-menu
var vLinks = document.getElementsByName("minim6");

// Counts how many instances there are of the Village link in the menu
var vLinksCount = vLinks.length;

// Creates a hidden input element containing showallmess=1
var showHidden = document.createElement("input");
showHidden.setAttribute("type", "hidden");
showHidden.setAttribute("name", "showallmess");
showHidden.setAttribute("value", 1);

// Adds the showallmess=1 input to each instance of the Village link
for (var i=0; i<vLinksCount; i++) {
	vLinks[i].appendChild(showHidden);
}