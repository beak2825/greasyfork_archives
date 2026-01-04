// ==UserScript==
// @name        Instagram Fix Arrow Keys
// @namespace   GrayFace
// @description Fixes arrow keys function in stories reply box. Without the fix pressing any arrow key erases the whole reply.
// @include     https://www.instagram.com/*
// @include     http://www.instagram.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/430296/Instagram%20Fix%20Arrow%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/430296/Instagram%20Fix%20Arrow%20Keys.meta.js
// ==/UserScript==

var tags = ['TEXTAREA', 'INPUT'];
var keycodes = [37, 38, 39, 40];

let f = function(e) {
	if (keycodes.indexOf(e.keyCode) != -1 && tags.indexOf(document.activeElement.tagName) != -1) {
		e.stopImmediatePropagation();
	}
	return false;
};
document.addEventListener('keydown', f, true);
document.addEventListener('keyup', f, true);
