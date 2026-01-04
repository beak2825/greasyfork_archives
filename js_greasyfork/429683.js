// ==UserScript==
// @name         Soap2Day Ad Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bypasses dumb S2D ads
// @author       Oxygen6#3552
// @match        *://soap2day.to/*
// @match        *://soap2day.ac/*
// @match        *://soap2day.sh/*
// @match        *://s2dfree.to/*
// @match        *://s2dfree.is/*
// @match        *://s2dfree.in/*
// @match        *://s2dfree.nl/*
// @match        *://s2dfree.cc/*
// @match        *://s2dfree.de/*
// @downloadURL https://update.greasyfork.org/scripts/429683/Soap2Day%20Ad%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/429683/Soap2Day%20Ad%20Bypass.meta.js
// ==/UserScript==
if (location.href.match(/https:\/\/[a-z]+2[a-z]*\.[a-z]*\/[a-zA-Z0-9]*\.html/g) != null) {
	alert('Opening video in new URL...');
	setInterval(function() {
		if (document.querySelector('video')) location.href = document.querySelector('video').src;
	});
}