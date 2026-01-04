// ==UserScript==
// @name         Netflix intro skip
// @namespace    https://giuseppe.eletto.org
// @description  This script automatically skips intro on Netflix. And it's jQuery free!
// @author       Giuseppe Eletto
// @version      1.1.5
// @license      MIT
// @run-at       document-end
// @include      https://www.netflix.com/*
// @downloadURL https://update.greasyfork.org/scripts/440718/Netflix%20intro%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/440718/Netflix%20intro%20skip.meta.js
// ==/UserScript==
(function () {
    "use strict";

    // Declare observer callback
    const observerCallback = mutations => mutations
        .filter(m => "childList" === m.type)
        .flatMap(m => Array.from(m.addedNodes))
        .filter(n => Node.ELEMENT_NODE === n.nodeType)
        .map(e => e.querySelector("button[data-uia='player-skip-intro']"))
        .forEach(e => e?.click());

    // Start MutationObserver
    new MutationObserver(observerCallback)
        .observe(document.body, {
            childList: true,
            subtree: true
        });
})();