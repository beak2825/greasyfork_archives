// ==UserScript==
// @name         FinamTrade — Blure Balance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bluring a balance on FinamTrade page.
// @author       N0xFF
// @license      MIT
// @match        *://trading.finam.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/450627/FinamTrade%20%E2%80%94%20Blure%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/450627/FinamTrade%20%E2%80%94%20Blure%20Balance.meta.js
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

const bluredElements = ['[data-testid=balance]', '[data-testid=freeFunds]', '#coverage-indicator > svg > text', '[data-testid=pl]'];

for (let element of bluredElements) {
    waitForElm(element).then((loadedElement) => {
        console.log(`"${loadedElement.title}" blured`);

        loadedElement.style.filter = 'blur(5px)'

        loadedElement.addEventListener('mouseenter', (event) => {
            event.target.style.filter = 'blur(0px)'
        });

        loadedElement.addEventListener('mouseleave', (event) => {
            event.target.style.filter = 'blur(5px)'
        });
    });
}
