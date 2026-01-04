// ==UserScript==
// @name         Hide red dot from Slack icon
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  Hides the notification dot from Slack at all times.  Rotates the Slack icon 90 degrees to confirm that it is working when you install it.
// @author       Yann Kaiser
// @match        https://app.slack.com/client/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513923/Hide%20red%20dot%20from%20Slack%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/513923/Hide%20red%20dot%20from%20Slack%20icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iconUrl = "data:image/png;base64,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";

    function replaceLink(linkNode) {
        if (linkNode.href !== iconUrl) {
            linkNode.href = iconUrl;
        }
    }


    new MutationObserver((mutationList, observer) => {
        for(const mutationRecord of mutationList) {
            console.log("mutationList", mutationRecord);
            switch (mutationRecord.type) {
                case "childList":
                    for(const addedNode of mutationRecord.addedNodes) {
                        console.log("addedNode", addedNode);
                        if (addedNode.tagName === "LINK" && addedNode.rel.includes("icon")) {
                            observer.observe(addedNode, {attributes: true, childList: false, characterData: false});
                            replaceLink(addedNode);
                        }
                    }
                    break;
                case "attributes":
                    if (mutationRecord.attributeName === "href") {
                        replaceLink(mutationRecord.target);
                    }
                    break;
                default:
            }
        }
    }).observe(document.head, {childList: true, attributes: false, characterData: false})

})();