// ==UserScript==
// @name        The so scrolling pouët.net oneliner
// @namespace   raina
// @description 1in10: "I wish the oneliner scrolled"
// @include     /^https?:\/\/((m|www)\.)?pouet\.net($|\/|\/index\.php|\/oneliner\.php)/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19340/The%20so%20scrolling%20pou%C3%ABtnet%20oneliner.user.js
// @updateURL https://update.greasyfork.org/scripts/19340/The%20so%20scrolling%20pou%C3%ABtnet%20oneliner.meta.js
// ==/UserScript==
(function() {
	"use strict";
	var style = document.createElement("style");
	style.textContent = '' +
		'.scroll {' +
		'	position: relative;' +
		'	height: 1.5em;' +
		'}' +
		'.scroll p {' +
		'	position: absolute;' +
		'	white-space: nowrap;' +
		'	animation: linear infinite scroll;' +
		'}' +
		'.scroll p:hover {' +
		'	animation-play-state: paused;' +
		'}' +
		'.scroll .usera,' +
		'.scroll a + time {' +
		'	margin-left: 32px;' +
		'}' + 
		'.scroll time + .usera {' +
		'	margin-left: 0px;' +
		'}' + 
		'@keyframes scroll {' +
		'	0% {' +
		'		left: 100%;' +
		'		transform: translateX(0%);' +
		'	}' +
		'	100% {' +
		'		left: -100%;' +
		'		transform: translateX(-100%);' +
		'	}' +
		'}';
	var lines = [];
	var lis = document.querySelectorAll('[id*="oneliner"] ul li');
	var newLine = document.createElement("li");
	var p = document.createElement("p");
	document.head.appendChild(style);
	for (var i = 0; i < lis.length; i++) {
		if ("day" == lis[i].className) {
			if ("" != newLine.innerHTML) {
				newLine.className = "scroll";
				lines.push(newLine);
			}
			newLine = document.createElement("li");
			p = document.createElement("p");
		} else {
			p.innerHTML += lis[i].innerHTML;
			p.setAttribute("style", "animation-duration: " + (p.textContent.length / 10) + "s");
			newLine.appendChild(p);	
			lis[i].parentElement.removeChild(lis[i]);
		}
	}
	newLine.className = "scroll";
	lines.push(newLine);
	lis = document.querySelectorAll('[id*=oneliner] ul li.day');
	if (lis.length) {
		for (i = 0; i < lines.length; i++) {
			lis[i].parentElement.insertBefore(lines[i], lis[i].nextSibling);
		}
	} else {
		document.querySelector('[id*="oneliner"] ul').appendChild(lines[0]);
	}
})();