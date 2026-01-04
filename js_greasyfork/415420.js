// ==UserScript==
// @name        Instant Thingverse Download
// @namespace   Violentmonkey Scripts
// @match       https://www.thingiverse.com/thing:*
// @grant       none
// @version     1.0
// @author      -
// @description 11/3/2020, 08:00:00 PM
// @downloadURL https://update.greasyfork.org/scripts/415420/Instant%20Thingverse%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/415420/Instant%20Thingverse%20Download.meta.js
// ==/UserScript==

/**
 * From https://github.com/CoeJoder/waitForKeyElements.js
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


const thingMatch = window.location.pathname.match(/thing:(\d+)/);
const thingId = thingMatch[1];

waitForKeyElements("a[class*='SidebarMenu__download']", (downloadLink) => {
  const downloadButton = downloadLink.querySelector("div")
  downloadLink.href = `https://www.thingiverse.com/thing:${thingId}/zip`
  downloadButton.parentNode.replaceChild(downloadButton.cloneNode(true), downloadButton);
})