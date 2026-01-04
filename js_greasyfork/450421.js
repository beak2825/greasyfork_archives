// ==UserScript==
// @name         FinamTrade — Hide Balance
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hiding a balance on FinamTrade page.
// @author       N0xFF
// @license      MIT
// @match        *://trading.finam.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/450421/FinamTrade%20%E2%80%94%20Hide%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/450421/FinamTrade%20%E2%80%94%20Hide%20Balance.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function waitForElm(selector) {
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

const hiddenElements = ['[data-testid=balance]', '[data-testid=freeFunds]'];

for (let element of hiddenElements) {
    waitForElm(element).then((loadedElement) => {
        console.log(`"${loadedElement.title}" hidded`);

        loadedElement.style.display = 'none';
    });
}

const hardToSeeElements = ['#coverage-indicator > svg > text', '[data-testid=pl]']

for (let element of hardToSeeElements) {
    waitForElm(element).then((loadedElement) => {
        loadedElement.style.filter = 'opacity(5%)';
    });
}
