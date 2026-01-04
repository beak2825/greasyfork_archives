// ==UserScript==
// @name          Auto-expand older comments in JIRA issue
// @description   Automatically expands the older comments accordion in JIRA so you see all comments by default. Workaround to jira.comment.collapsing.minimum.hidden. Aids in searching page. Forked from https://greasyfork.org/en/scripts/29233-atlassian-jira-auto-expand-older-comments and fixed (no external dependencies).
// @include       https://jira.*
// @include       http://jira.*
// @match         https://jira.*
// @match         http://jira.*
// @license MIT
// @version       1.2
// @namespace https://greasyfork.org/en/users/709170
// @downloadURL https://update.greasyfork.org/scripts/432731/Auto-expand%20older%20comments%20in%20JIRA%20issue.user.js
// @updateURL https://update.greasyfork.org/scripts/432731/Auto-expand%20older%20comments%20in%20JIRA%20issue.meta.js
// ==/UserScript==

/**
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * Author: https://github.com/CoeJoder/waitForKeyElements.js
 * Downloaded from: https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
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

function clickWhenItAppears (jNode) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode.dispatchEvent (clickEvent);
}

//bWaitOnce = true;
// <a class="collapsed-comments" href="(redacted)"><span class="collapsed-comments-line"></span><span class="collapsed-comments-line"></span><span class="show-more-comments" data-collapsed-count="12">12 older comments</span></a>
waitForKeyElements (
    "a[class*='collapsed-comments']",
    clickWhenItAppears
);

// <button class="aui-button btn-load-more" resolved=""><span>Load more older comments</span></button>
waitForKeyElements (
    "button[class*='btn-load-more']",
    clickWhenItAppears
);
