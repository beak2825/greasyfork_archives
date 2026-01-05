// ==UserScript==
// @name        1Fichier-Accessibility
// @namespace   macroPL
// @description Automatise le téléchargement sur 1fichier.com
// @include     https://1fichier.com/*
// @version     1
// @grant       P-L
// @downloadURL https://update.greasyfork.org/scripts/23287/1Fichier-Accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/23287/1Fichier-Accessibility.meta.js
// ==/UserScript==
var k, val, aNodes = document.getElementsByTagName("input");
for(k =0; k < aNodes.length; k++) {
	val = aNodes[k].getAttribute("value");
	if(val)
	if(val.match("Acceder au "))
			aNodes[k].click();
		} // end for
	
aNodes = document.getElementsByClassName("ok btn-general btn-orange");
for(k =0; k < aNodes.length; k++) {
	val = aNodes[k].innerHTML;
	if(val)
	if(val.match("Cliquer ici pour téléchar"))
			aNodes[k].click();
		} // end for
		
		