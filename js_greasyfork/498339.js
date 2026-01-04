// ==UserScript==
// @name         Let Me Scroll
// @namespace    http://tampermonkey.net/
// @version      20240619-02
// @description  Block website from disabling to scroll
// @author       polyarkk
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498339/Let%20Me%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/498339/Let%20Me%20Scroll.meta.js
// ==/UserScript==

function createAntiAntiScrollingObserver(element) {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "attributes") {
                if (mutation.attributeName === "style") {
                    if (element.style.overflow === "hidden") {
                        console.log("website is attempting to disable scrolling...");
                        element.style.overflow = "auto";
                    }
                }
            }
        }
    });

    observer.observe(element, { attributes: true });
    element.style.overflow = "auto";

    return {
        element,
        observer
    }
}

(() => {
    'use strict';
    createAntiAntiScrollingObserver(document.body);
    createAntiAntiScrollingObserver(document.documentElement);
})();