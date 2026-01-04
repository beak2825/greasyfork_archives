// ==UserScript==
// @name         3cx auto-join
// @namespace    cwrau.info
// @license      unlicense
// @version      1.0.3
// @description  3cx auto-join.
// @author       https://github.com/cwrau
// @match        https://3cx.*.*/meet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teuto.net
// @downloadURL https://update.greasyfork.org/scripts/505423/3cx%20auto-join.user.js
// @updateURL https://update.greasyfork.org/scripts/505423/3cx%20auto-join.meta.js
// ==/UserScript==
'use strict';

const observers = [];

function waitForElement(selector, element = document.body) {
    return new Promise(resolve => {
        const found = element.querySelector(selector);
        if (found) {
            return resolve(found);
        }

        const observer = new MutationObserver(mutations => {
            const found = element.querySelector(selector);
            if (found) {
                observers.forEach(o => o.disconnect());
                resolve(found);
            }
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.shadowRoot) {
                        waitForElement(selector, node.shadowRoot).then(e => {
                            observers.forEach(o => o.disconnect());
                            resolve(e);
                        });
                    }
                });
            });
        });
        observer.observe(element, {childList: true, subtree: true});
        observers.push(observer);

        element.querySelectorAll('*').forEach(e => {
            if (e.shadowRoot) {
                waitForElement(selector, e.shadowRoot).then(e => {
                    observers.forEach(o => o.disconnect());
                    resolve(e);
                });
            }
        });
    });
}

waitForElement('.join-button').then((elm) => {
    setTimeout(() => {
        elm.click();
    }, 1000);
});