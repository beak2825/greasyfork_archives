// ==UserScript==
// @name         Remove Sidebar
// @namespace    https://voice.google.com/
// @version      1.0
// @description  Removes annoying sidebar from the left side of the screen
// @author       LikeToAccess
// @match        https://voice.google.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458758/Remove%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/458758/Remove%20Sidebar.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // //*[@id="gvPageRoot"]/div[2]/gv-side-panel/mat-sidenav-container/mat-sidenav-content/div/div[2]/gv-call-sidebar
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
    var elm = getElementByXpath("//*[@id=\"gvPageRoot\"]/div[2]/gv-side-panel/mat-sidenav-container/mat-sidenav-content/div/div[2]/gv-call-sidebar");
    elm.remove();
    window.onkeypress = async function(event) {
        if (event.keyCode == 96) {
            console.log("Keypress");
            while (await waitForElm("//div[contains(@aria-label, 'Unread')]")) {
                console.log("Started loop");
                var unread = await waitForElm("//div[contains(@aria-label, 'Unread')]");
                unread.click();
            }
        }
    }
})();