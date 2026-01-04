// ==UserScript==
// @name         YouTube - CardRemover
// @version      1.35
// @description  Remove YouTube end video cards overlay on top of videos
// @author       pengc99
// @license      GNU GPL v3.0
// @namespace    https://github.com/pengc99/tampermonkey_youtube_cardremover
// @homepage     https://github.com/pengc99/tampermonkey_youtube_cardremover
// @include      http://www.youtube.com/*
// @include      https://www.youtube.com/*
// @include      http://youtube.com/*
// @include      https://youtube.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABJElEQVRIie2WTYrCQBBGn4MTVypkMTDOicSNXkMzXtIZf0BFcKFr9QSJ+7joirRJRzTpRkE/KEi+dOqliuok8NarqQMcgNhy7IH2NfDeATSJnQ6qpMDxDV0pozPvwzEoV9UcP92Jssp08mEV3wuuAb/AFDhKTIAA8Mo8SDKBJv0AK/Kndgm0CuS9uqCWgg4AH6gDXWAj/gJz5YXBQy6rWwNf2vWmBh/YBM+0pOsceE/8iU1wJL4vMBO8IV5oExyKX5dzE9x3AZ6K39W8NDyQ47FNcJJ0gxokEzyJvk2wh9qnMbBFDVID1d5Au28OfNoEg3o5LLmsTo858F0g700LPNSWGqMmPQL+Ue01VWoNXFSZvE/3PXb9J5Kp+M8ha+Qw91tPqBNQe7BEabp3fAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/428566/YouTube%20-%20CardRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/428566/YouTube%20-%20CardRemover.meta.js
// ==/UserScript==

var cardElement = "ytp-ce-element";

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

function removeCards () {
    console.log("## Entered removeCards()");
    while (document.getElementsByClassName(cardElement).length != 0) {
        console.log("## Removing " + cardElement);
        document.getElementsByClassName(cardElement)[0].remove();
    }
}

waitForKeyElements ("div." + cardElement, removeCards);
