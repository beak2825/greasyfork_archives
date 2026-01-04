// ==UserScript==
// @name         知识星球复制限制解除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ctrl+C
// @author       jiangJHZ
// @match        *://*.zsxq.com/*
// @icon         https://www.google.com/s2/favicons?domain=zsxq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466575/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/466575/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
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

    waitForKeyElements(".disabled-copy", (element) => {
        element.classList.remove("disabled-copy");
    }, false, 1000, 86400);
    waitForKeyElements("[watermark]", (element) => {
        element.setAttribute("style", "padding: 10px;");
    }, false, 1000, 86400);
    waitForKeyElements(".js-disable-copy", (element) => {
        element.setAttribute("class", "");
    }, false, 1000, 86400);
})();