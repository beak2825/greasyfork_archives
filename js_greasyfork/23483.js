// ==UserScript==
// @name        Google-Accessibility
// @namespace   googlePL
// @description Résultats de Google  plus accessibles
// @include     https://www.google.*
// @version     1
// @grant       P-L
// @downloadURL https://update.greasyfork.org/scripts/23483/Google-Accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/23483/Google-Accessibility.meta.js
// ==/UserScript==
// Firefox
const AK_SEARCH = "=";
const AK_FRENCH ="f";

var gTimeout = null;

function delayedOps() {
	var k, inner, url = "", aNodes = document.getElementsByClassName("q qs");
for(k=0; k < aNodes.length; k++) {
	inner = aNodes[k].innerHTML;
				
		if(inner.indexOf("Pages en français") > -1) {
		window.clearTimeout(gTimeout);
		gTimeout = null;
		url = aNodes[k].getAttribute("href"); 
				break;
} // end if
} // end for

aNodes = document.getElementsByTagName("h3");
if(aNodes.length == 0)
	return;
var oH3 = aNodes[0]; 
aNodes = oH3.getElementsByTagName("a");
for(k=0; k < aNodes.length; k++) {
	if(aNodes[k].style.display != "none") {
		toFocus = aNodes[k];
		break;
	} // end if
} // end for
if(url != ""){
	var a1 = document.createElement("a");
	a1.setAttribute("accessKey", AK_FRENCH);
	a1.setAttribute("href", url);
	// link text
	var a1_text = document.createTextNode("Pages en français");
	a1.appendChild(a1_text);
	// Obtient une référence du nœud parent
	var parentDiv = oH3.parentNode;
	// insère le nouvel élément dans le DOM avant oH3
	parentDiv.insertBefore(a1, oH3);
} // end if
		
if(toFocus)
	toFocus.focus();
} // end func

function opers() {
var elt = document.getElementById("top_nav");
if(elt) {
	elt.role = "navigation";
	elt.setAttribute("aria-live", "off");
} // end if
elt = document.getElementById("lst-ib");
if(elt) {
	elt.setAttribute("accesskey", AK_SEARCH);
}

var aDivs = document.getElementsByClassName("srg");
if(aDivs.length > 0) {
	var oSrg = aDivs[0];
	oSrg.role = "main";
	oSrg.setAttribute("aria-live", "assertive");
	gTimeout = window.setTimeout(delayedOps, 3000);
} // end if
} // end func
opers();
