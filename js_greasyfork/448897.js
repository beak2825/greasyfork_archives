// ==UserScript==
// @name        Replace Twemoji with Unicode
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @grant       none
// @run-at      document-end
// @version     1.0
// @author      -
// @license     MIT
// @description 2022/8/4 09:13:13
// @downloadURL https://update.greasyfork.org/scripts/448897/Replace%20Twemoji%20with%20Unicode.user.js
// @updateURL https://update.greasyfork.org/scripts/448897/Replace%20Twemoji%20with%20Unicode.meta.js
// ==/UserScript==

let rootmatch = document.evaluate("//div[@id='react-root']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
let rootnode = rootmatch.singleNodeValue;

if (rootnode) {
    let emoji;
    var callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.target.className.includes("css-1dbjc4n")) {
                emoji = mutation.target.querySelectorAll('img[src^="https://abs-0.twimg.com/emoji"]');
                let i;
                for (i = 0; i < emoji.length; i++) {
                    let alt = emoji[i].alt;
                    emoji[i].replaceWith(alt);
                }
            }
        }
    };
    const observeConfig = {
        attributes: true,
        childList: true,
        subtree: true
    };
    const observer = new MutationObserver(callback);

    observer.observe(document.body, observeConfig);
}

