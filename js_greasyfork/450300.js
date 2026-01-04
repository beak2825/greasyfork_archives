// ==UserScript==
// @name         YNAB auto dark mode
// @description You need a budget auto dark mode
// @version      0.1
// @author       You
// @match        https://app.youneedabudget.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youneedabudget.com
// @grant        none
// @namespace https://greasyfork.org/users/724543
// @downloadURL https://update.greasyfork.org/scripts/450300/YNAB%20auto%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/450300/YNAB%20auto%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

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


    async function update(matches) {
        (await waitForElm('.sidebar-nav-menu')).click();
        (await waitForElm('.modal-select-theme-switcher')).click();

        const elem = matches ? '.ynab-new-theme-switcher-dark' : '.ynab-new-theme-switcher-grid > button';

        (await waitForElm(elem)).click();

        (await waitForElm('.modal-actions > button')).click();
    }

    const match = window.matchMedia('(prefers-color-scheme: dark)')
    update(match.matches)
    match.addEventListener('change', event => {
        update(event.matches)
    });
})();