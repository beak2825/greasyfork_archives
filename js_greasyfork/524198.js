// ==UserScript==
// @name         MissAV AdBlocker
// @namespace    hlaspoor.scripts
// @description  MissAV Popup Ads Blocker
// @version      0.3
// @author       hlaspoor
// @match        https://missav.ws/*
// @match        https://missav.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524198/MissAV%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/524198/MissAV%20AdBlocker.meta.js
// ==/UserScript==

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
    document.addEventListener('ready', () => {
        waitForKeyElements('div[\\@click="pop()"]', (element)=> {
            element.removeAttribute("@click");
            element.removeAttribute("@keyup.space.window");
        });
    });
})();