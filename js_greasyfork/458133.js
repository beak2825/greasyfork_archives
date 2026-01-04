// ==UserScript==
// @name         Blaseball - Default to Max Bet
// @namespace    https://freshbreath.zone
// @version      0.2
// @description  when clicking a bet option on Blaseball.com, auto-select the MAX option
// @author       clockworkgadget
// @match        https://*.blaseball.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blaseball.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458133/Blaseball%20-%20Default%20to%20Max%20Bet.user.js
// @updateURL https://update.greasyfork.org/scripts/458133/Blaseball%20-%20Default%20to%20Max%20Bet.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const targetNode = document;
    const config = { subtree: true, childList: true };

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node?.classList?.contains("bet-widget__wager")) {
                        for (const childNode of node.childNodes) {
                            if (childNode.innerText === "MAX") { childNode.click(); }
                        }
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();
