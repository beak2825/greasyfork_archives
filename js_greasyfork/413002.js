// ==UserScript==
// @name         Google Keep Colour Bar
// @version      0.1
// @description  Add custom pens and markers to Google Keep's drawing toolbar
// @author       yallinthehall
// @match        https://keep.google.com/
// @grant        none
// @namespace https://greasyfork.org/users/312448
// @downloadURL https://update.greasyfork.org/scripts/413002/Google%20Keep%20Colour%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/413002/Google%20Keep%20Colour%20Bar.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';

const markerPlace = document.querySelector("#canvas-parent > div.above-ink-canvas > div > div > div.ink-toolbar-begin > div:nth-child(5)");
const resetBlackPen = document.querySelector("#canvas-parent > div.below-ink-canvas > div:nth-child(1) > div.ink-color-rows-container > div:nth-child(1) > button:nth-child(1)");
const resetBrownPen = document.querySelector("#canvas-parent > div.below-ink-canvas > div:nth-child(1) > div.ink-color-rows-container > div:nth-child(1) > button:nth-child(7)");

const highlighterPlace = document.querySelector("#canvas-parent > div.above-ink-canvas > div > div > div.ink-toolbar-begin > div:nth-child(6)")
const resetBlackMarker = document.querySelector("#canvas-parent > div.below-ink-canvas > div:nth-child(2) > div.ink-color-rows-container > div:nth-child(1) > button:nth-child(1)");
const resetBrownMarker = document.querySelector("#canvas-parent > div.below-ink-canvas > div:nth-child(2) > div.ink-color-rows-container > div:nth-child(1) > button:nth-child(7)");

Element.prototype.appendBefore = function(element) {
  element.parentNode.insertBefore(this, element);
}, false;

var allPens = [];
var allMarkers = [];
allPens.push("#000000"); //BLACK
allPens.push("#000F55"); //BLUE INK
allPens.push("#d500f9"); //PURPLE
allPens.push("#00c853"); //GREEN
allPens.push("#ff0000"); //RED

allMarkers.push("#000000"); //BLACK
allMarkers.push("#ffbc00"); //PURPLE
allMarkers.push("#00c853"); //GREEN
allMarkers.push("#ff0000"); //RED

var newPen;
for (const colour of allPens){
	newPen = document.createElement("button");
	newPen.setAttribute("class", "ink-color");
	newPen.setAttribute("tabindex", "0");
	newPen.setAttribute("style", "background:" + colour +";");
	newPen.addEventListener("click", function() {
		resetBlackPen.click();
		resetBrownPen.setAttribute("color-data", colour);
		resetBrownPen.click();
	});
	newPen.appendBefore(markerPlace);
}

for (const colour of allMarkers){
	newPen = document.createElement("button");
	newPen.setAttribute("class", "ink-color");
	newPen.setAttribute("tabindex", "0");
	newPen.setAttribute("style", "background:" + colour +";");
	newPen.addEventListener("click", function() {
		resetBlackMarker.click();
		resetBrownMarker.setAttribute("color-data", colour);
		resetBrownMarker.click();
	});
	newPen.appendBefore(highlighterPlace);
}
},false);