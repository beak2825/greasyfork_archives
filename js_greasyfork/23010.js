// ==UserScript==
// @name         Open Youtube video links in new tab
// @description  Opens Youtube video links in new tab
// @include      https://www.youtube.com/*
// @exclude      https://www.youtube.com/watch*
// @namespace    https://greasyfork.org/users/14346
// @author       wOxxOm
// @version      2.0.3
// @license      MIT License
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23010/Open%20Youtube%20video%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/23010/Open%20Youtube%20video%20links%20in%20new%20tab.meta.js
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

	GM_openInTab(link.href, e.button || e.ctrlKey);
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