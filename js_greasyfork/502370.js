// ==UserScript==
// @name         Count Thumbtack costs
// @namespace    http://tampermonkey.net/
// @version      2024-08-01
// @description  Count total costs on Thumbtack on the payments screen
// @author       You
// @match        https://www.thumbtack.com/profile/payments/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thumbtack.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502370/Count%20Thumbtack%20costs.user.js
// @updateURL https://update.greasyfork.org/scripts/502370/Count%20Thumbtack%20costs.meta.js
// ==/UserScript==

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (getElementByXpath(selector)) {
            return resolve(getElementByXpath(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (getElementByXpath(selector)) {
                resolve(getElementByXpath(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(async function() {
    'use strict';


    window.onkeypress = async function(event) {
        if (event.keyCode == 96) { // Keycode 96 is ` (back quote)
            console.log("Keypress");
            var amounts = 0.0;
            var amount;
            while (getElementByXpath("//div[contains(@class, \"b black\")]")) {
                amount = getElementByXpath("//div[contains(@class, \"b black\")]");
                amount.remove();
                amounts = amounts + parseFloat(amount.textContent.replace("$", ""));
            }
            console.log(amounts);
            console.log("Ended loop");
        }
    }
})();