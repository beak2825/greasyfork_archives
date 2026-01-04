// ==UserScript==
// @name         Reddit
// @namespace    https://greasyfork.org/en/users/864921-greasyshark
// @version      0.1.1
// @description  Removes annoying "View in Reddit App" popup
// @author       Martin Larsen
// @match        https://www.reddit.com/r/s*

// @downloadURL https://update.greasyfork.org/scripts/518681/Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/518681/Reddit.meta.js
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
        }, interval, 300, 10);
    }
}

/* globals $ waitForKeyElements*/
(function () {
    'use strict';

    //await delay(1000);
    //queryDeep("button.continue")[0].click();

    waitForKeyElements(() => {
        const el = document.querySelector("shreddit-async-loader[bundlename=app_selector]")?.shadowRoot?.children[0]?.shadowRoot?.children[0]?.querySelector("button.continue");
        return el?[el]:null;
    }, function () {
        document.querySelector("shreddit-async-loader[bundlename=app_selector]").shadowRoot.children[0].shadowRoot.children[0].querySelector("button.continue").click()
    }, true, 300, 15);

})();