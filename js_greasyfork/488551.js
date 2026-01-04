// ==UserScript==
// @name         RnR Disallow Cross User Booking
// @namespace    http://tampermonkey.net/
// @version      2024-02-27
// @description  Disallow cross user booking for RnR admin users
// @author       Nischal Tonthanahal
// @match        https://le-rnr-01.usc.edu/RandR/Search.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usc.edu
// @grant        GM_addStyle
// @run-at       document-end
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/488551/RnR%20Disallow%20Cross%20User%20Booking.user.js
// @updateURL https://update.greasyfork.org/scripts/488551/RnR%20Disallow%20Cross%20User%20Booking.meta.js
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
    if (typeof waitForKeyElements.namespace === "undefined") {
        waitForKeyElements.namespace = Date.now().toString();
    }
    var targetNodes = (typeof selectorOrFunction === "function") ? selectorOrFunction() : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = `data-userscript-${waitForKeyElements.namespace}-alreadyFound`;
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

(function() {
    'use strict';

    window.addEventListener ("load", function () {
        waitForKeyElements (
            "#userInfoContainer > span:nth-child(3)", setNetID
        );
    }, false);

    function setNetID (node) {
        window.netid = node.textContent;
        console.log(window.netid);
        waitForKeyElements (
            'input[type="text"]#bookedForName', disableInput, false
        );

        var adminLink = document.querySelector("#nav a[href='Admin.htm']");
        if (adminLink) {
            var autoIssueButton = document.createElement("a");
            autoIssueButton.href = "https://le-rnr-01.usc.edu/RandR/BookingSearch.htm?autoissue=true";
            autoIssueButton.target = "_blank";
            autoIssueButton.textContent = "Auto Issue";

            var navBar = adminLink.parentNode.parentNode;
            navBar.appendChild(autoIssueButton);
        }
    }

    function disableInput (input) {
        input.setAttribute("disabled", "disabled");
        if (input.value=='') {
            input.setAttribute("value", window.netid);
        }
    }

})();