// ==UserScript==
// @name         Open Youtube video links in same tab
// @description  Opens Youtube video links in same tab
// @match        https://*.youtube.com/*
// @include      https://www.youtube.com/
// @exclude      https://www.youtube.com/watch*
// @author       Reggie
// @version      1.0
// @license      Unlicense
// @grant        window.open
// @run-at       document-start
// @namespace https://greasyfork.org/users/852452
// @downloadURL https://update.greasyfork.org/scripts/436969/Open%20Youtube%20video%20links%20in%20same%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/436969/Open%20Youtube%20video%20links%20in%20same%20tab.meta.js
// ==/UserScript==
var suppressing;
window.addEventListener('mouseup', function(e) {
	if (e.button > 1 || e.altKey)
		return;
	var link = e.target.closest('[href^="/watch"]');
	if (!link ||
		(link.getAttribute('href') || '').match(/^(javascript|#|$)/) ||
		link.href.replace(/#.*/, '') == location.href.replace(/#.*/, '')
	)
		return;

	window.open(link.href, "_self", e.button || e.ctrlKey);
	suppressing = true;
	prevent(e);
}, true);

window.addEventListener('click', prevent, true);
window.addEventListener('auxclick', prevent, true);

function prevent(e) {
	if (!suppressing)
		return;
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
	setTimeout(function() {
		suppressing = false;
	}, 100);
}