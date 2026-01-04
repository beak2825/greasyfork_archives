// ==UserScript==
// @name        Block Steam comment spam
// @namespace   https://github.com/moonyoulove
// @match       https://store.steampowered.com/app/*
// @match       https://steamcommunity.com/app/*/reviews/*
// @grant       GM_addStyle
// @version     1.0
// @author      moonyoulove
// @license     MIT
// @description Block spam in Steam comments
// @downloadURL https://update.greasyfork.org/scripts/500167/Block%20Steam%20comment%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/500167/Block%20Steam%20comment%20spam.meta.js
// ==/UserScript==

setInterval(() => {
    if (location.hostname === "store.steampowered.com") {
        block(".review_box", ".content");
    } else {
        block(".apphub_Card", ".apphub_CardTextContent");
    }
}, 200) // can custom

function block(reviewSelector, contentSelector) {
    const reviews = document.querySelectorAll(`${reviewSelector}:not(.not-spam,.spam)`);
    for (const review of reviews) {
        const content = review.querySelector(contentSelector);
        if (content.textContent.match("⣿")) {
            review.classList.add("spam");

        } else {
            review.classList.add("not-spam");
        }
    }
}

GM_addStyle(`
.spam {
    display: none;
}
`)