// ==UserScript==
// @name Cookie Clicker Helper
// @description Automatically loads the Cookie Monster helper tool from GitHub + some CSS tweaks
// @version 0.3a
// @namespace http://nickmorozov.com/
// @author Nikolay Morozov
// @homepage http://nickmorozov.com/
// @license CC-BY (TODO - URL)
// @grant GM_addStyle
// @include http://orteil.dashnet.org/cookieclicker/
// @icon http://orteil.dashnet.org/cookieclicker/img/perfectCookie.png
// @downloadURL https://update.greasyfork.org/scripts/24465/Cookie%20Clicker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/24465/Cookie%20Clicker%20Helper.meta.js
// ==/UserScript==

(function() {

	var timerReady, css, style, head;

	// Load the Cookie Monster.
	timerReady = setInterval(function() {
		if (Game && Game.ready) {
			Game.LoadMod('http://aktanusa.github.io/CookieMonster/CookieMonster.js');
			clearInterval(timerReady);
		}
	}, 500);

	css = '.storeSection { height: auto; min-height: 60px; }';

	// Inject CSS one way or another ('@grant GM_addStyle' should allow to pass the first check).
	if (typeof GM_addStyle !== 'undefined') {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle !== 'undefined') {
		PRO_addStyle(css);
	} else if (typeof addStyle !== 'undefined') {
		addStyle(css);
	} else {
		// Create a <style> tag with custom CSS.
		head = document.getElementsByTagName('head');
		style = document.createElement('style');
		style.type = 'text/css';
		style.appendChild(document.createTextNode(css));

		// Put the styles in the <head> if available.
		if (head.length > 0) {
			head[0].appendChild(style);
		} else {
			document.documentElement.appendChild(style);
		}
	}

})();
