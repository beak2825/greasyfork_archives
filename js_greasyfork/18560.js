// ==UserScript==
// @name         Relativize Fixed
// @namespace    http://github.com/kba
// @version      0.2
// @description  Turns fixed elements (navbars and such) into relative positioned elements. Good for small screens.
// @author       kba
// @match        http://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/18560/Relativize%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/18560/Relativize%20Fixed.meta.js
// ==/UserScript==

function relativizeFixed() {
	var elems = document.querySelectorAll('div,nav,header,footer');
	for (var i = 0; i < elems.length; i++) {
		var el = elems[i];
		var position = window.getComputedStyle(el).getPropertyValue('position');
		if (position === 'fixed') {
			el.style.position = 'relative';
		}
	}
}
GM_registerMenuCommand('Relativize Fixed', relativizeFixed);
