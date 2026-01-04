// ==UserScript==
// @name         GitHub no more
// @namespace    http://tampermonkey.net/
// @version      2025-08-28
// @description  Annoyed that ^F does not work in long github discussions? Tired from clicking "Load more" over and over again? This extension is for you! Automatically loads all comments and diffs on github.com
// @author       wffl
// @match        https://github.com/*/*/issues*
// @match        https://github.com/*/*/pulls*
// @match        https://github.com/*/*/pull/*
// @match        https://github.com/issues*
// @match        https://github.com/pulls*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      https://github.com/WaffleLapkin/github-no-more/blob/meow/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/547544/GitHub%20no%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/547544/GitHub%20no%20more.meta.js
// ==/UserScript==

(function() {
    'use strict';

const find_buttons =
    (f) => Array.from(document.getElementsByTagName("button")).filter((e) =>
        // HACK: "new" github UI doesn't remove the button once clicked.
        // `.ariaDisabled` is the only way I found to check if the button was already clicked.
        // (otherwise clicking would cause updates, which would cause clicking... -> infinite loop)
        e.ariaDisabled !== "true"
        && f(e.textContent)
    );

async function expandAllLoads(mutations) {
    // If a text or button node was added
    if (!mutations.some((m) => Array.from(m.addedNodes).some((n) => n.nodeName === "#button" || n.nodeName === "#text"))) {
        return
    }

    // Click on all the "Load more…" and its variations buttons
    let loads = find_buttons((text) =>
        text.includes("Load more…")
        || text.includes("Load diff")
        || text.includes("Load all")
        || (text.includes("Load ") && text.includes(" more")) // "Load 150 more"
    );
    loads.forEach((b) => b.click());
}

let observer = new MutationObserver(expandAllLoads);
observer.observe(document.body, { childList: true, subtree: true });
})();