// ==UserScript==
// @name        hubIC-Accessibility
// @namespace   hicAccess
// @description Rend la page de telechargement de hubIC plus accessible aux DV
// @include     https://hubic.com/home/pub/*
// @version     1
// @grant       Pierre-Louis
// @downloadURL https://update.greasyfork.org/scripts/22881/hubIC-Accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/22881/hubIC-Accessibility.meta.js
// ==/UserScript==
var gTimeout = null;
var oElem = null;
function delayedFocus() {
window.clearTimeout(gTimeout);
gTimeout = null;
oElem.focus();
} // end function.

oElem = document.getElementById("browser-action-download");
if(oElem){
	oElem.setAttribute("role","button");
oElem.setAttribute("accesskey","t");
	oElem.tabindex = "0";
}

oElem = document.getElementById("browser-action-select-all");
if(oElem){
oElem.setAttribute("role","button");
		oElem.setAttribute("aria-label", "Sélectionner tout.");
	oElem.setAttribute("accesskey","=");
	oElem.tabindex ="0";
}
gTimeout = window.setTimeout(delayedFocus, 3000);
