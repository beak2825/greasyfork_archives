// ==UserScript==
// @name         Clean Font Weights
// @namespace    cleanFonts_kk
// @description  Make website font-weights standard (400) if below 400
// @version      0.7
// @author       Kai Krause <kaikrause95@gmail.com>
// @include      *
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35338/Clean%20Font%20Weights.user.js
// @updateURL https://update.greasyfork.org/scripts/35338/Clean%20Font%20Weights.meta.js
// ==/UserScript==

var cachedElements = [];
var fontCheck = '';
function font() {
	if (fontCheck.length < 1) {
		var fontOverride_kk = document.createElement("style");
		fontOverride_kk.innerText = ".fontOverride_kk{font-weight: 400 !important;}";
		document.head.appendChild(fontOverride_kk);
		fontCheck = document.getElementsByClassName("fontOverride_kk");
	}

	var allElements = document.querySelectorAll('*');
	for (var i = 0; i < allElements.length; i++) {
		if (cachedElements.indexOf(allElements[i]) > -1) continue;
		cachedElements.push(allElements[i]);
		applyFont(allElements, i);
	}
}

function applyFont (allElements, i) {
	setTimeout(function(){
		var css = window.getComputedStyle(allElements[i], null);
		var fontWeight = css.getPropertyValue("font-weight");
		if (fontWeight && fontWeight < 400) {
			allElements[i].classList.add("fontOverride_kk");
		}
	}, Math.random(4,12));
}

// Page Load
font();

// Peformant Dynamic function wrapper
var oldScrollPos = 0;
function dynamicScroll (f) {
	window.addEventListener("scroll", (function(){
		var scrollDifference = Math.abs(oldScrollPos-window.scrollY);
		if (scrollDifference > 500) {
			window.requestAnimationFrame(f);
			oldScrollPos = window.scrollY;
		}
	}), false);
}
dynamicScroll(font);