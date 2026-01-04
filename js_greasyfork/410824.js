// ==UserScript==
// @name         Color Brush
// @version      1.0
// @description  Press R to toggle quick color switching
// @author       Bell
// @namespace    https://greasyfork.org/users/281093
// @match        https://sketchful.io/
// @grant        none
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/410824/Color%20Brush.user.js
// @updateURL https://update.greasyfork.org/scripts/410824/Color%20Brush.meta.js
// ==/UserScript==

const click = new Event('pointerdown');
const brushTool = document.querySelector("#gameToolsDraw");
let rainbowBrush = false;
let colors = [];
let index = 0;
let sign = 1;

function cycleColors() {
	setTimeout(() => {
		if (!rainbowBrush) return;
		colors[index].dispatchEvent(click);
		index += sign;
		sign = index >= (colors.length - 1) ? -1 : index <= 0 ? 1 : sign;
		cycleColors();
	}, 20);
}

function toggleCycle(hue) {
	if (!(rainbowBrush = !rainbowBrush)) return;
	
	storeColors();
	cycleColors();
}

function storeColors() {
	resetGlobals();
	
	const colorsDiv = document.querySelector("#gameToolsColors");
	colorsDiv.childNodes.forEach(row => {
		row.childNodes.forEach(color => {
			if (color.style.background !== "rgb(255, 255, 255)")
				colors.push(color);
		});
	});
	
	return colors;
}

function resetGlobals() {
	colors = [];
	index = 0;
	sign = 1;
}

document.addEventListener('keydown', (e) => {
	if (!isDrawing()) return;
	
	switch (e.code) {
		case 'KeyR':
			brushTool.click();
			toggleCycle();
			break;
		case 'KeyF':
		case 'KeyE':
			rainbowBrush = false;
			break;
	}
});

function isDrawing() {
    return document.querySelector("#gameTools").style.display !== "none" &&
           document.querySelector("body > div.game").style.display !== "none" &&
           document.activeElement.tagName !== "INPUT";
}