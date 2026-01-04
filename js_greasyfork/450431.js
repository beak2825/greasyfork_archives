// ==UserScript==
// @name             NT Disable Auto Reload
// @description      Removes auto-reload functionality from Nitro Type races
// @match            *://www.nitrotype.com/race
// @match            *://www.nitrotype.com/race/*
// @author           dangerbob
// @run-at           document-end
// @version          1.0
// @license MIT
// @namespace https://greasyfork.org/users/952272
// @downloadURL https://update.greasyfork.org/scripts/450431/NT%20Disable%20Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/450431/NT%20Disable%20Auto%20Reload.meta.js
// ==/UserScript==

const observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		mutation.addedNodes.forEach(function(addedNode) {
			if (addedNode.className.includes('race-results')) {
				observer.disconnect();
                document.querySelector('.race-results--countdown--cancel').click();
			}
		});
	});
});

observer.observe(document.getElementById('raceContainer'), { subtree: false, childList: true });