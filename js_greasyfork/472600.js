// ==UserScript==
// @name         Omegle TOS Auto Confim
// @namespace    https://www.omegle.com/
// @version      0.1
// @description  Auto checks the TOS and age checkboxes when starting a new chat
// @author       You
// @match        https://www.omegle.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=omegle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472600/Omegle%20TOS%20Auto%20Confim.user.js
// @updateURL https://update.greasyfork.org/scripts/472600/Omegle%20TOS%20Auto%20Confim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForElement("body > div:nth-child(12)").then(function () {
        const agecheckbox = document.querySelector("body > div:nth-child(12) > div > p:nth-child(2) > label > input[type=checkbox]");
        const toscheckbox = document.querySelector("body > div:nth-child(12) > div > p:nth-child(3) > label > input[type=checkbox]");
        const confirmbutton = document.querySelector("body > div:nth-child(12) > div > p:nth-child(4) > input[type=button]");

        agecheckbox.click();
        toscheckbox.click();
        confirmbutton.click();
    });
})();
