// ==UserScript==
// @name         Auto Join google meet
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  click if page is loaded
// @author       hosoi
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-idle
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/466548/Auto%20Join%20google%20meet.user.js
// @updateURL https://update.greasyfork.org/scripts/466548/Auto%20Join%20google%20meet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button_selector = '.VfPpkd-LgbsSe-OWXEXe-k8QpJ';

    function waitForElement(selector, callback, intervalMs, timeoutMs) {
        const startTimeInMs = Date.now();
        findLoop();

        function findLoop() {
            let obj = document.querySelector(selector);
            if (obj != null) {
                callback(obj);
                return;
            } else {
                setTimeout(() => {
                    if (timeoutMs && Date.now() - startTimeInMs > timeoutMs) return;
                    findLoop();
                }, intervalMs);
            }
        }
    }
    function waitForElementDelete(selector, callback, intervalMs, timeoutMs) {
        const startTimeInMs = Date.now();
        findLoop();

        function findLoop() {
            let obj = document.querySelector(selector);
            if (obj == null) {
                callback(obj);
                return;
            } else {
                setTimeout(() => {
                    if (timeoutMs && Date.now() - startTimeInMs > timeoutMs) return;
                    findLoop();
                }, intervalMs);
            }
        }
    }
    waitForElement(button_selector,
                   (button) => {
        let interval_id = setInterval(() => {
            button.click();
            console.info("Clicking Button");
        }, 500);
        waitForElementDelete(button_selector, ()=>{clearInterval(interval_id); console.info("Clear Interval")}, 500, 20000);
    },
                   500,
                   20000);
    // setInterval(() => {if (location.href == 'https://meet.google.com/') open('about:blank', '_self').close();}, 60000);
})();