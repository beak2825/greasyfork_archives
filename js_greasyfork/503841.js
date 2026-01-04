// ==UserScript==
// @name        解除鹅圈子复制限制+去水印
// @namespace   http://tampermonkey.net/
// @match       https://quanzi.xiaoe-tech.com/*/feed_list*
// @grant       none
// @version     1.1
// @author      Ajax
// @description 如题
// @downloadURL https://update.greasyfork.org/scripts/503841/%E8%A7%A3%E9%99%A4%E9%B9%85%E5%9C%88%E5%AD%90%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%2B%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/503841/%E8%A7%A3%E9%99%A4%E9%B9%85%E5%9C%88%E5%AD%90%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%2B%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // https://github.com/CoeJoder/waitForKeyElements.js
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

    waitForKeyElements(".feed-item", (element) => {
        element.setAttribute("style", "");
        element.oncontextmenu = null;
        element.onselectstart = null;

        const observer = new MutationObserver(function(mutationsList, observer) {
            if (mutationsList[0].attributeName === "style" && element.getAttribute("style") !== "") {
                element.setAttribute("style", "");
                element.oncontextmenu = null;
                element.onselectstart = null;
            }
        });

        observer.observe(element, {attributes: true, attributeFilter: ["style"]});
    }, false, 1000, 86400);
})();
