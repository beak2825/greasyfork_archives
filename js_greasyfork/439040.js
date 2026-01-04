// ==UserScript==
// @name         Remove Promote button from tweets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the big Promote button that Twitter puts on your own tweets, if you have a professional category set.
// @author       tgle
// @match        https://twitter.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439040/Remove%20Promote%20button%20from%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/439040/Remove%20Promote%20button%20from%20tweets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const body = document.getElementsByTagName("body")[0];

    function removePromote() {
        for (const a of document.getElementsByTagName("a")) {
            if (a.innerText === "Promote") {
                a.parentElement.removeChild(a);
            }
        }
    }

    const observer = new MutationObserver(removePromote);
    observer.observe(body, { childList: true, subtree: true });
})();