// ==UserScript==
// @name         nuke tweet view counts
// @namespace    http://elycien.com/
// @version      0.6
// @license      GNU GPLv3
// @description  remove view count numbers & tweet analytics links from Twitter timeline because fuck that
// @author       Elcie
// @match        http*://*twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457022/nuke%20tweet%20view%20counts.user.js
// @updateURL https://update.greasyfork.org/scripts/457022/nuke%20tweet%20view%20counts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = document.querySelector('body');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            let xpath = "//a[contains(@href, '/analytics')]//span[contains(text(), 'View')] | //*[contains(@aria-label, 'View Tweet analytics')]";
            let elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            let targetedElement = elements.iterateNext();
            while (targetedElement) {
                while (targetedElement && targetedElement.tagName != "A" && (!targetedElement.getAttribute("aria-label") || !targetedElement.getAttribute("aria-label").includes("View Tweet analytics"))) {
                    targetedElement = targetedElement.parentElement;
                }
                if (targetedElement) {
                    var testid = targetedElement.getAttribute("data-testid");
                    if (!testid || testid != "analyticsButton") {
                        let parent = targetedElement.parentElement;
                        if (parent) {
                            if (parent.style.display != 'none') {
                                parent.style.display = 'none';
                            }
                        }
                        else {
                            if (targetedElement.style.display != 'none') {
                                targetedElement.style.display = 'none';
                            }
                        }
                    }
                }
                targetedElement = elements.iterateNext();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();