// ==UserScript==
// @name        Quizlet - Hotkeys to Search Flash Cards by Accuracy
// @namespace   QZLT_flashcardSelectKBMode
// @description Press the 1-2-3-4 number keys to navigate large decks easily
// @author      Kai Krause <kaikrause95@gmail.com>
// @match       http://*.quizlet.com/*
// @match       https://*.quizlet.com/*
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13124/Quizlet%20-%20Hotkeys%20to%20Search%20Flash%20Cards%20by%20Accuracy.user.js
// @updateURL https://update.greasyfork.org/scripts/13124/Quizlet%20-%20Hotkeys%20to%20Search%20Flash%20Cards%20by%20Accuracy.meta.js
// ==/UserScript==

if (!location.pathname.endsWith("-flash-cards/")) return

// Helper function to inject JS code into the page, for page-level access to JS functions and variables
var injectCode = function(f) {
	var script = document.createElement("script");
	script.textContent = "(" + f.toString() + "());";
	document.head.appendChild(script);
};

var theCode = function(){
	var titlesCache = [];

	function titleSelect(charE) {
		if (!titlesCache || titlesCache.length === 0) {
			var titles = document.getElementsByClassName("SetPageTermChunk-title");
			for (var i = 0; i < titles.length; i++){
				titles[i].innerHTML += "<a style='visibility:hidden' name='" +  titles[i].textContent + "'></a>";
				titlesCache.push(titles[i].textContent);
			}
		}

		var el = document.activeElement;
		if (el.tagName.toLowerCase() != 'textarea') {
			if (charE.keyCode == "49") {
				window.location.hash = titlesCache[0];
			} else if (charE.keyCode == "50") {
				window.location.hash = titlesCache[1];
			} else if (charE.keyCode == "51") {
				window.location.hash = titlesCache[2];
			} else if (charE.keyCode == "52") {
				window.location.hash = titlesCache[3];
			}
		}
	}
	window.addEventListener("keydown", titleSelect, true);
}

injectCode(theCode);
