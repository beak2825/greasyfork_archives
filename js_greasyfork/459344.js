// ==UserScript==
// @name         Remove Sidebar
// @namespace    htt*://voice.google.*
// @version      2.0
// @description  Remove the suggested call sidebar from Google Voice
// @author       Ian
// @match        https://voice.google.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459344/Remove%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/459344/Remove%20Sidebar.meta.js
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

    var sidebar = getElementByXpath("//*[@id=\"gvPageRoot\"]/div[2]/gv-side-panel/mat-sidenav-container/mat-sidenav-content/div/div[2]/gv-call-sidebar");
    sidebar.remove(); // Remove the sidebar!

    window.onkeypress = async function(event) {
        if (event.keyCode == 96) { // Keycode 96 is ` (back quote)
            console.log("Keypress");
            while (getElementByXpath("//div[contains(@aria-label, 'Unread')]")) {
                console.log("Started loop");
                var unread = await waitForElm("//div[contains(@aria-label, 'Unread')]"); // Search for the newest unread message
                unread.click(); // Click on the message to mark it as read
            }
            console.log("Ended loop");
        }
    }
})();