// ==UserScript==
// @name         Disable Job Perks
// @namespace    microbes.torn.jobdisabler
// @version      0.1
// @description  disable last perks in candle shop.
// @author       You
// @match        https://www.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487469/Disable%20Job%20Perks.user.js
// @updateURL https://update.greasyfork.org/scripts/487469/Disable%20Job%20Perks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForElementToExist('.last').then(() => {
        $('.last').remove();
    });
})();

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}