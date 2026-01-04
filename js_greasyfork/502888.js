// ==UserScript==
// @name         Eleven Warriors Comment Highlighter
// @namespace    https://www.elevenwarriors.com/
// @version      2024-08-09
// @description  Highlight comments on Eleven Warriors Forum
// @author       vietdom
// @match        https://www.elevenwarriors.com/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elevenwarriors.com
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502888/Eleven%20Warriors%20Comment%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/502888/Eleven%20Warriors%20Comment%20Highlighter.meta.js
// ==/UserScript==

console.log('[Eleven Warriors Comment Highlighter] Script Loaded');

waitForElm('.comment').then((elm) => {
    console.log('[Eleven Warriors Comment Highlighter] Comments Found');
    document
        .querySelectorAll('[href="/users/brohio"]')
        .forEach(
        (el) => {
            if (el && el.closest(".comment")) {
                el.closest(".comment").style.backgroundColor = "rgba(187,0,0,0.1)"
            }
        }
    );
    document
        .querySelectorAll('[href="/users/premierdrum"]')
        .forEach(
        (el) => {
            if (el && el.closest(".comment")) {
                el.closest(".comment").style.backgroundColor = "rgba(187,0,0,0.1)"
            }
        }
    );
    console.log(elm.textContent);
});

function waitForElm(selector) {
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
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}