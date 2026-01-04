// ==UserScript==
// @name         Open Youtube PC and Mobile video links in new tab
// @description  A Helper Script to open Youtube PC and Mobile video links in new tab
// @include      https://www.youtube.com/*
// @include      https://m.youtube.com/*
// @exclude      https://www.youtube.com/watch*
// @exclude      https://m.youtube.com/watch*
// @namespace    Open Youtube PC and Mobile video links in new tab
// @author       -
// @version      2.0.4
// @license      MIT License
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/477616/Open%20Youtube%20PC%20and%20Mobile%20video%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/477616/Open%20Youtube%20PC%20and%20Mobile%20video%20links%20in%20new%20tab.meta.js
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