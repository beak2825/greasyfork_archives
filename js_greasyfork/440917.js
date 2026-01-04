// ==UserScript==
// @name         9GAG video control enabler
// @version      1.3
// @description  Enables the video controls on all video elements on 9GAG.
// @author       fischly
// @match        https://9gag.com/*
// @grant        none
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/662249
// @icon         https://9gag.com/favicon.ico
// @license      CC BY-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/440917/9GAG%20video%20control%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/440917/9GAG%20video%20control%20enabler.meta.js
// ==/UserScript==

// entry point
(function() {
    'use strict';

	// first, enable controls to all elements that are already loaded on the 9GAG site
	enableVideoControls();
	
	// next, add the observer that will enable controls on all video elements that are dynamically loaded on scrolling
	addObserver();
})();


/**
 * Enables all video controls of all elements that are already loaded.
 */
function enableVideoControls() {
    const videos = document.querySelectorAll('video');

    for (const video of videos) {
        video.controls = true;
	}
}

/**
 * Adds the observer to the site element, where all the postContainers are loaded to.
 */
function addObserver() {
	// the element that all new postContainers are loaded to is called 'list-view-2' for some reason
	const targetNode = document.getElementById('page');
	const config = { attributes: false, childList: true, subtree: true };

	const callback = function(mutationsList, observer) {
		for(const mutation of mutationsList) {
			// loop over all added elements
			for (const addedElement of mutation.addedNodes) {
                enableControlsOnPostContainer(addedElement);
			}
		}
	};

	// create the observer and observe the target
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}


/**
 * Enables controls on video elements of the given container.
 */
function enableControlsOnPostContainer(container) {
	if (!container) return;
    if (!container.querySelectorAll) return;

    const videos = container.querySelectorAll('video');

	for (const video of videos) {
		video.controls = true;
	}
}