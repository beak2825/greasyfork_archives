// ==UserScript==
// @name         [KPX] Hospital and Jail Status Check
// @namespace    https://cartelempire.online/
// @version      0.2
// @description  Redirect to Jobs page if in hospital or jail
// @author       KPCX
// @match        https://cartelempire.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498017/%5BKPX%5D%20Hospital%20and%20Jail%20Status%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/498017/%5BKPX%5D%20Hospital%20and%20Jail%20Status%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    waitForElements(".jobText", 200, 50, "Hospital or Jail Status")
        .then(elements => {
            for (let element of elements) {
                const textContent = element.textContent;
                if (textContent.includes("You're currently in hospital.") || textContent.includes("You're currently in jail.")) {
                    setTimeout(() => {
                        window.location.href = "https://cartelempire.online/Jobs";
                    }, 60000); // 3 minutes in milliseconds - 180000
                    break;
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
})();
