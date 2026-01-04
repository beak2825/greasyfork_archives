// ==UserScript==
// @name         [KPX] Bank tax calculation
// @namespace    https://cartelempire.online/
// @version      0.2
// @description  Displays tax cost on deposit
// @author       KPCX
// @match        https://cartelempire.online/Bank
// @match        https://cartelempire.online/bank
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498015/%5BKPX%5D%20Bank%20tax%20calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/498015/%5BKPX%5D%20Bank%20tax%20calculation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElements(selector, duration = 200, maxTries = 50, identifier) {
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

    const formatNumber = (num) => num.toString();

    waitForElements('#cashInBank').then((elements) => {
        const element = elements[0];
        const balance = parseInt(element.innerText.trim().replace(/[,.\s]/g, ""));
        const taxOnDeposit = document.createElement('p');
        taxOnDeposit.className = "card-text fw-bold text-muted";
        taxOnDeposit.innerHTML = 'Deposit tax - £<span id="taxOnDeposit">0</span>';
        element.parentNode.parentNode.insertBefore(taxOnDeposit, element.parentNode.nextSibling);
    });

    waitForElements('#depositInput').then((elements) => {
        const element = elements[0];
        ["autoNumeric:rawValueModified", "change"].forEach((eventType) => {
            element.addEventListener(eventType, (event) => {
                const amount = parseInt(event.target.value.replace(/,/g, "").replace(/\£/g, "").replace(/\s/g, ""));
                if (!isNaN(amount)) {
                    const taxOnBank = Math.round(amount*0.02);
                    document.querySelector("#taxOnDeposit").innerText = formatNumber(taxOnBank);
                }
            });
        });
        const event = new Event('change');
        element.dispatchEvent(event);
    });
})();