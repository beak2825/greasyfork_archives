// ==UserScript==
// @name        Remove dislike/download buttons
// @icon        https://bit.ly/3PHKdEj
// @description Remove dislike/download buttons from youtube
// @namespace   com.youtube.com.remdislikedownload
// @license     GNU GPLv3
// @include     https://www.youtube.com/watch?v=*
// @version     1.1.1
// @downloadURL https://update.greasyfork.org/scripts/445305/Remove%20dislikedownload%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/445305/Remove%20dislikedownload%20buttons.meta.js
// ==/UserScript==
 
/**
 * waitForKeyElements.js (CoeJoder Fork) - https://github.com/CoeJoder/waitForKeyElements.js
 * 
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * Usage example:
 *
 *     function callback(domElement) {
 *         domElement.innerHTML = "This text inserted by waitForKeyElements().";
 *     }
 * 
 *     waitForKeyElements("div.comments", callback);
 *     // or
 *     waitForKeyElements(selectorFunction, callback);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function} callback - The callback function; takes a single DOM element as parameter.
 *                              If returns true, element will be processed again on subsequent iterations.
 * @param {boolean} [waitOnce=true] - Whether to stop after the first elements are found.
 * @param {number} [interval=300] - The time (ms) to wait between iterations.
 * @param {number} [maxIntervals=-1] - The max number of intervals to run (negative number for unlimited).
 */
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
	if (typeof waitOnce === "undefined") {
		waitOnce = true;
	}
	if (typeof interval === "undefined") {
		interval = 300;
	}
	if (typeof maxIntervals === "undefined") {
		maxIntervals = -1;
	}
	var targetNodes = (typeof selectorOrFunction === "function")
			? selectorOrFunction()
			: document.querySelectorAll(selectorOrFunction);
 
	var targetsFound = targetNodes && targetNodes.length > 0;
	if (targetsFound) {
		targetNodes.forEach(function(targetNode) {
			var attrAlreadyFound = "data-userscript-alreadyFound";
			var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
			if (!alreadyFound) {
				var cancelFound = callback(targetNode);
				if (cancelFound) {
					targetsFound = false;
				}
				else {
					targetNode.setAttribute(attrAlreadyFound, true);
				}
			}
		});
	}
 
	if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
		maxIntervals -= 1;
		setTimeout(function() {
			waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
		}, interval);
	}
}

//--- Page-specific function to do what we want when the node is found.
function removeButtons (jNode) {
    // Dislike button
    document.getElementsByTagName('ytd-toggle-button-renderer')[1].remove();
    // Download button
    document.getElementsByTagName('ytd-download-button-renderer')[0].remove();
}

waitForKeyElements ('ytd-download-button-renderer', removeButtons);