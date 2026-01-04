// ==UserScript==
// @name         Auto-expand YouTube comments
// @version      0.1
// @description  Automatically clicks "Show more" on YouTube comments.
// @author       Charles Bob-Omb (Discord)
// @match        http*://*.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @namespace    charlesbobomb
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/467911/Auto-expand%20YouTube%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/467911/Auto-expand%20YouTube%20comments.meta.js
// ==/UserScript==

function waitForElement(guaranteedParent, selector, mode) {
    /**
        A workaround for mobile YouTube's comment list being added/deleted.
        @param {Element} guaranteedParent - A parent that will always exist (to be watched)
        @param {string} selector - A CSS selector for the element to wait for
        @param {('add'|'remove')} mode - Whether to wait for the element to exist or to be removed.
    **/
    return new Promise(resolve => {
        const o = new MutationObserver(() => { // watch for descendants being added/removed
            let el = document.querySelector(selector)
            if ((mode === "remove" && !el) || (mode === "add" && el)){
                resolve(el || null);
                o.disconnect() // stop watching
            }
        });
        o.observe(guaranteedParent, {
            childList: true,
            subtree: true
        });
    });
}
const YTM_PARENT = document.querySelector("panel-container");
const YTM_SELECTOR = "ytm-item-section-renderer[section-identifier='comment-item-section']"; // mobile YouTube comment list selector
function mobileListener() { // mobile YouTube listener
    waitForElement(YTM_PARENT, YTM_SELECTOR, "add").then(cview => {
        cview.addEventListener("touchmove", () => {
            let m = document.querySelector("ytm-comment-renderer:not([expanded='true']) .comment-expand button"); // "Read more" button
            if (m) m.click();
        });
        waitForElement(YTM_PARENT, YTM_SELECTOR, "remove").then(mobileListener);
    });
}

(function() {
    'use strict';
    if (location.host.split(".")[0] == "m") mobileListener(); // mobile listener (m.youtube.com)
    else {
        document.addEventListener("scroll", () => {
            let m = document.querySelector("ytd-comments #more:not([hidden])"); // "Read more" button
            if (m) m.click();
        });
    }
})();