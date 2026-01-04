// ==UserScript==
// @name         Google Play Books Webreader Centering
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix the centering of Google Play Books webreader content on monitors > 1760px width.
// @author       Geoffrey Parker <grp@gparker.co>
// @match        *://books.googleusercontent.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383537/Google%20Play%20Books%20Webreader%20Centering.user.js
// @updateURL https://update.greasyfork.org/scripts/383537/Google%20Play%20Books%20Webreader%20Centering.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    async function getElem(selector, maxRetries, retryInterval=100) {
        var elem = document.querySelector(selector);
        var retries = 0;
        while (elem == null && !(retries >= maxRetries)) {
            await new Promise(r => setTimeout(r, retryInterval)); // sleep (default 100ms)
            elem = document.querySelector(selector); // try again
            retries++;
        }
        return elem != null ? Promise.resolve(elem) : Promise.reject(new Error("Timeout waiting for element"));
    }

    try {
        let elem = await getElem("body > div.gb-reader-container > div.gb-text-reader > div > table", 50);
        elem.removeAttribute("style");
        let elemObserver = new MutationObserver((mutationsList, observer) => elem.removeAttribute("style"));
        elemObserver.observe(elem, {attributes: true, attributeFilter: ["style"]});
    } catch (err) {
        console.error("Could not center:", err);
    }
})();