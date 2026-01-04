// ==UserScript==
// @name         Remove PackageTrackr.com Ad-Block Modal
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  PackageTrackr recently added an ad-block detection popup.  Script removes it as soon as it's added.
// @author       Will Belden
// @license      MIT
// @include      https://www.packagetrackr.com/*
// @icon         https://rs.ptrss.com/a/images/256.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464862/Remove%20PackageTrackrcom%20Ad-Block%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/464862/Remove%20PackageTrackrcom%20Ad-Block%20Modal.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var aElementClassesToKill = ["fc-ab-root"];

	// Add observer to watch for new elements being added to the DOM
	// If the className of the element is in the aElementClassesToKill array, then .remove() that element immediately
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			mutation.addedNodes.forEach(function(addedNode) {
				if (aElementClassesToKill.indexOf(addedNode.className) >= 0) {
					// Attempt to use the close button to close the modal
					$("button.fc-close.fc-icon-button").click();
					// If that fails, just remove the modal
					console.log(`Removing [".${addedNode.className}"] via TamperMonkey script: "Remove PackageTrackr.com Ad-Block Modal".`);
					addedNode.remove();
				}
			});
		});
	});

	observer.observe(document.body, {childList: true, subtree: true});
})();
