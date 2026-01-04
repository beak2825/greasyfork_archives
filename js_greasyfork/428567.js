// ==UserScript==
// @name        TrueNAS / FreeNAS Autologin
// @namespace   TrueNAS / FreeNAS Autologin
// @description A userscript that automatically logs you into the TrueNAS or FreeNAS webinterface
// @include     *192.168.1.67/ui*
// @include     *freenas.local/ui*
// @version     1
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/428567/TrueNAS%20%20FreeNAS%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/428567/TrueNAS%20%20FreeNAS%20Autologin.meta.js
// ==/UserScript==

/**
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * @example
 * waitForKeyElements("div.comments", (element) => {
 *   element.innerHTML = "This text inserted by waitForKeyElements().";
 * });
 *
 * waitForKeyElements(() => {
 *   const iframe = document.querySelector('iframe');
 *   if (iframe) {
 *     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
 *     return iframeDoc.querySelectorAll("div.comments");
 *   }
 *   return null;
 * }, callbackFunc);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function}          callback           - The callback function; takes a single DOM element as parameter.
 *                                                 If returns true, element will be processed again on subsequent iterations.
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

    var isElement = document.getElementById(selectorOrFunction);

    var targetNodes = (typeof selectorOrFunction === "function")
            ? selectorOrFunction()
            : (isElement || document.querySelectorAll(selectorOrFunction));

    var targetsFound = targetNodes && (targetNodes.length > 0 || isElement);
    if (targetsFound) {
        if(isElement) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = isElement.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(isElement);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    isElement.setAttribute(attrAlreadyFound, true);
                }
            }
        }
        else {
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
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function() {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}

function setAngularInputValue(targetInput, newValue) {
    targetInput.value = newValue;
    const event = new Event('input', { bubbles: true });

    targetInput.dispatchEvent(event);
}

function doMagic()
{
    if (document.getElementById('mat-error-1')){ //error on page, prevent endless retries to avoid ban
        console.log("Error on page detected! Aborting");
        return;
    }
    if (document.getElementById('signin_button')){ //check if login page
        setAngularInputValue(document.querySelector('input[name="username"]'), "root")
        setAngularInputValue(document.querySelector('input[name="password"]'), "PASSWORD")

        document.getElementById("signin_button").click();
    }
}

(function() {
    'use strict';

    window.addEventListener('load', function() {
        waitForKeyElements("#signin_button", doMagic);
    }, false);
})();