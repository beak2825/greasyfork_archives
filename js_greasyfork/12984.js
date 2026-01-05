// ==UserScript==
// @name         Youtube: strip https from share url
// @description  Strip https from share url: youtu.be/xxxxyyyy
// @include      https://www.youtube.com/*
// @version      1.0
// @author       wOxxOm
// @namespace    https://greasyfork.org/users/2159-woxxom
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/12984/Youtube%3A%20strip%20https%20from%20share%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/12984/Youtube%3A%20strip%20https%20from%20share%20url.meta.js
// ==/UserScript==

window.addEventListener('load', waitForShare);
window.addEventListener('spfdone', waitForShare);
						
function waitForShare() {
	var panel = document.getElementById('watch-actions-share-panel');
	if (!panel)
		return;
	
	new MutationObserver(function(mutations) {
		this.disconnect();
		
		var input = panel.querySelector('[value*="//youtu.be"]');
		if (!input)
			return;
		
		stripProtocol();
		input.addEventListener('focus', stripProtocol);

		function stripProtocol() {
			input.value = input.value.replace(/https?:\/\//, '');
			input.select();
		}
	}).observe(panel, {subtree: true, childList: true});
}
