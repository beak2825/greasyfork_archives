// ==UserScript==
// @name           PCGamesHardware ohne interne Anzeigen
// @namespace      pcgameshardware
// @description    interne Anzeigen (PCGH-PCs, PCGH-Edition Hardware, Amazon Deals) werden entfernt
// @include        http://www.pcgameshardware.de/*
// @include        https://www.pcgameshardware.de/*
// @version 0.0.1.20180713122318
// @downloadURL https://update.greasyfork.org/scripts/370268/PCGamesHardware%20ohne%20interne%20Anzeigen.user.js
// @updateURL https://update.greasyfork.org/scripts/370268/PCGamesHardware%20ohne%20interne%20Anzeigen.meta.js
// ==/UserScript==

var headlines = document.getElementsByTagName("h3");
for (var j=0;j<headlines.length;j++) {
	if (headlines[j].innerHTML.lastIndexOf("Anzeige") != -1)
		{
			headlines[j].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
		}
}
