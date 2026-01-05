// ==UserScript==
// @name        EtoEto Remove Auto Scroll
// @namespace   etoetoautoscrollremoverKK
// @author      Kai Krause <kaikrause95@gmail.com>
// @description Removes Auto Scrolling on the Japanese learning site 'EtoEto'
// @match	http://etoeto.com/*books/*episodes/*
// @match	https://etoeto.com/*books/*episodes/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19597/EtoEto%20Remove%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/19597/EtoEto%20Remove%20Auto%20Scroll.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	//Destroy the Default Auto Scroll
	$.speed = {};
	window.scroll = function(e) {
		$("html, body").stop(1,0);
	}
	//Re-implement FocusKey
	window.onkeydown = function(e) {
		e = e || window.event;
		if (e.keyCode == 70) {
			var focusPoint = document.getElementsByClassName("sentence-highlight")[0].offsetTop;
			window.scrollTo(0, focusPoint+100);
		}
	};
}, false);