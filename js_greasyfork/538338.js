// ==UserScript==
// @name         GollyJer's Auto-Press "Show All" in Google AI Links Sidebar
// @namespace    gollyjer.com
// @license      MIT
// @version      1.0
// @match        https://www.google.com/search*udm=50*
// @description  Automatically clicks the "Show all" button for Google AI overview web links.
// @downloadURL https://update.greasyfork.org/scripts/538338/GollyJer%27s%20Auto-Press%20%22Show%20All%22%20in%20Google%20AI%20Links%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/538338/GollyJer%27s%20Auto-Press%20%22Show%20All%22%20in%20Google%20AI%20Links%20Sidebar.meta.js
// ==/UserScript==

/* globals waitForKeyElements */ // This comment is for linters.

const buttonSelector = 'div.BjvG9b[jsname="OR68we"][aria-label="Show all related links"]';
waitForKeyElements(buttonSelector, clickElementWhenReady, true, 500, 30); // Check every 500ms, for up to 30*500ms = 15 seconds

/**
 * Callback function for waitForKeyElements.
 * Attempts to click the element once it's deemed visible and ready.
 * @param {HTMLElement} element - The DOM element found by waitForKeyElements.
 */
function clickElementWhenReady(element) {
    console.log('[Greasemonkey] Element found with selector:', buttonSelector, element);
    let attempts = 0;
    const maxAttempts = 20; // Max attempts to check for visibility/clickability
    const intervalTime = 250; // Milliseconds between checks

    const poller = setInterval(() => {
        // Check if element is still part of the document
        if (!document.body.contains(element)) {
            console.log('[Greasemonkey] Element was removed from DOM. Stopping attempts.');
            clearInterval(poller);
            return;
        }

        // More robust visibility check
        const style = window.getComputedStyle(element);
        const isDisplayNone = style.display === 'none';
        const isVisibilityHidden = style.visibility === 'hidden';
        const isOpacityZero = parseFloat(style.opacity) === 0;
        const hasNoClientRect = element.getClientRects().length === 0; // Element occupies no space

        const isTrulyVisible = !isDisplayNone && !isVisibilityHidden && !isOpacityZero && !hasNoClientRect;
        const isEnabled = !element.disabled && element.getAttribute('aria-disabled') !== 'true';

        if (isTrulyVisible && isEnabled) {
            console.log('[Greasemonkey] Element is visible and enabled. Clicking now.');
            element.click();
            clearInterval(poller);
            console.log('[Greasemonkey] Click action performed on:', element);
            // waitForKeyElements will mark this element as "alreadyFound"
            // because this callback doesn't return true.
        } else if (attempts < maxAttempts) {
            console.log(`[Greasemonkey] Element not ready (Visible: ${isTrulyVisible}, Enabled: ${isEnabled}). Attempt ${attempts + 1}/${maxAttempts}. Retrying...`);
            attempts++;
        } else {
            console.warn('[Greasemonkey] Gave up. Element did not become visible/enabled after ' + maxAttempts + ' attempts for selector:', buttonSelector, element);
            clearInterval(poller);
        }
    }, intervalTime);

    return false; // Tell waitForKeyElements not to re-process this specific element instance.
}


/*
    UNABLE TO INCLUDE SCRIPT WHEN USING GREASYFORK SO DIRECTLY INCLUDING HERE.
    Credit to https://github.com/CoeJoder/waitForKeyElements.js
    v1.3
*/

/**
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * @example
 * waitForKeyElements("div.comments", (element) => {
 * element.innerHTML = "This text inserted by waitForKeyElements().";
 * });
 *
 * waitForKeyElements(() => {
 * const iframe = document.querySelector('iframe');
 * if (iframe) {
 * const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
 * return iframeDoc.querySelectorAll("div.comments");
 * }
 * return null;
 * }, callbackFunc);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function}          callback           - The callback function; takes a single DOM element as parameter.
 * If returns true, element will be processed again on subsequent iterations.
 * @param {boolean}           [waitOnce=true]    - Whether to stop after the first elements are found.
 * @param {number}            [interval=300]     - The time (ms) to wait between iterations.
 * @param {number}            [maxIntervals=-1]  - The max number of intervals to run (negative number for unlimited).
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
    if (typeof waitForKeyElements.namespace === "undefined") {
        // Generate a unique namespace for this session if not already set
        waitForKeyElements.namespace = 'wfke-' + Math.random().toString(36).substring(2, 11);
    }

    var targetNodes = (typeof selectorOrFunction === "function")
                      ? selectorOrFunction()
                      : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = `data-userscript-${waitForKeyElements.namespace}-alreadyFound`;
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) { // If callback returns true, re-process this node later
                    // Do not mark as found if callback wants to re-process
                } else {
                    targetNode.setAttribute(attrAlreadyFound, 'true');
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