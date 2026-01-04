// ==UserScript==
// @name        GitHub Distractionless
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     0.1.1
// @author      turtlebasket
// @website     https://github.com/turtlebasket/userscripts/tree/master/github-distractionless
// @license     MIT
// @description Userscript that makes sure that GitHub stays a work tool and doesn't turn into a social media website
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/459797/GitHub%20Distractionless.user.js
// @updateURL https://update.greasyfork.org/scripts/459797/GitHub%20Distractionless.meta.js
// ==/UserScript==

let hideEls = [];
let focusing = false;

// title bar links - custom behavior for now
const titleBarExclude = ["Explore", "Marketplace", "Codespaces"];
let titleBarEls = document.getElementsByClassName("js-selected-navigation-item")
for (let i = 0; i < titleBarEls.length; i++) {
    let el = titleBarEls[i];
    if (titleBarExclude.includes(el.innerHTML.trim())) {
        hideEls.push(el);
    }
}

// general exclusion list

[
    ["mail-status unread", [0], /.*/],
    ["UnderlineNav-item", [1], /^\/$/],
]
.forEach(([className, hideIndices, pageRegex]) => {
    hideIndices.forEach(i => {
        let el = document.getElementsByClassName(className)[i];
        if (typeof el === 'undefined') {
            console.log(`focus mode: unable to find element ${className} [ ${i} ]`)
        }
        else {
            hideEls.push(el);
        }
    });
})

// hide all els in els
function toggleFocus() {
    focusing = !focusing;
    for (let el of hideEls) {
        el.setAttribute(
            "style", 
            focusing ? "display: none;" : "display: auto;");
    }
}

// initial state
toggleFocus();

// toggle switch coming later, currently bugged due to github content policy
