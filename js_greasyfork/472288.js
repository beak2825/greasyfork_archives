// ==UserScript==
// @name        Hacker News auto collapse replies.
// @description Automatically closes every child comment recursively, allowing for slowly opening them as you read comments and being able to overview top level comments with less noise.
// @namespace   https://github.com/luluco250
// @license     MIT
// @version     1.0.0
// @grant       none
// @match       https://news.ycombinator.com/item
// @downloadURL https://update.greasyfork.org/scripts/472288/Hacker%20News%20auto%20collapse%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/472288/Hacker%20News%20auto%20collapse%20replies.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
    "use strict";

    const indents = document.getElementsByClassName("ind");

    for (const indent of indents) {
        if (indent.getAttribute("indent") === "0") continue;

        const commentContainer = indent.nextSibling.nextSibling;
        const toggles = commentContainer.getElementsByClassName("togg");

        for (const toggle of toggles) {
            toggle.click();
        }
    }
});