// ==UserScript==
// @name         TG Shortcuts
// @namespace    http://tampermonkey.net/
// @version      2024-06-21
// @description  Add kb shortcut to Telegram
// @author       Jatin Sharma
// @match        https://web.telegram.org/k/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514596/TG%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/514596/TG%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitForElem(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    document.addEventListener('keydown', async function(event) {
        // Define the key combination for the shortcut
        const isShortcut = event.ctrlKey && event.key === '/' && !event.repeat;
        if(isShortcut) {
            if (document.querySelector('button.sidebar-close-button')?.offsetParent) {
                document.querySelector('button.sidebar-close-button').click();
            }
            else {
                document.querySelector('div.sidebar-header__btn-container > button').click();
                (await waitForElem('span.archived-count'));//.parentElement.click();
                setTimeout(() => document.querySelector('span.archived-count').parentElement.click(), 40);
            }
        }

    });
    // Your code here...
})();