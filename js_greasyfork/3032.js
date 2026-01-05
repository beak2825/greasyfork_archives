// ==UserScript==
// @name        Add spellcheck toggle button etherpads, which is disabled by default (pad.piratenpartij.nl).
// @namespace   armeagle.nl
// @include     https://pad.piratenpartij.nl/p/*
// @version     1
// @grant       none
// @description Add spellcheck toggle button etherpads, which is disabled by default
// @downloadURL https://update.greasyfork.org/scripts/3032/Add%20spellcheck%20toggle%20button%20etherpads%2C%20which%20is%20disabled%20by%20default%20%28padpiratenpartijnl%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3032/Add%20spellcheck%20toggle%20button%20etherpads%2C%20which%20is%20disabled%20by%20default%20%28padpiratenpartijnl%29.meta.js
// ==/UserScript==


var barul = document.querySelector("#editbar ul.menu_left");
var li = document.createElement("li");
var a = document.createElement("a");
a.textContent = "Spellcheck";
a.setAttribute("style", "color: black");
li.appendChild(a);

barul.appendChild(li);

a.addEventListener("click", function(event) {

	event.stopPropagation();

	var body = document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('body');
	if ( body.hasAttribute('spellcheck') ) {
		body.removeAttribute('spellcheck');
		a.setAttribute("style", "color: black; background: linear-gradient(#F4F4F4, #E4E4E4) !important;");
	} else {
		body.setAttribute('spellcheck', false);
		a.setAttribute("style", "color: black");
	}

});