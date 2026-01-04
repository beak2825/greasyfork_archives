// ==UserScript==
// @name                Socialmediagirl reload posts liked
// @namespace           https://greasyfork.org/users/821661
// @match               https://forums.socialmediagirls.com/*
// @grant               none
// @version             1.0
// @run-at              document-start
// @author              hdyzen
// @description         reload post content when like if post require like or medal
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/532852/Socialmediagirl%20reload%20posts%20liked.user.js
// @updateURL https://update.greasyfork.org/scripts/532852/Socialmediagirl%20reload%20posts%20liked.meta.js
// ==/UserScript==

const hideText = 'You must React with a "Like" or "Medal" to view this content then Refresh the page';

function onClickLike(post, oldContent) {
    oldContent.innerHTML = `
        <span style="width: 100%; text-align: center; font-size: 3rem; color: bisque; padding-block: 2rem;">Loading...</span>
    `;

    setTimeout(async () => {
        const res = await fetch(window.location.href);
        const resInText = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(resInText, "text/html");

        const newContent = doc.querySelector(`[data-content="${post.getAttribute("data-content")}"] .message-body .bbWrapper`);

        oldContent.replaceWith(newContent);
    }, 1);
}

function onLoaded() {
    const posts = document.querySelectorAll(".message[data-content]");

    for (const post of posts) {
        const isHide = post.querySelector(".hidethanks")?.innerText === hideText;

        if (!isHide) continue;

        const likeButton = post.querySelector(".message-actionBar .reaction");

        const oldContent = post.querySelector(".bbWrapper");

        likeButton.addEventListener("click", () => onClickLike(post, oldContent));
    }
}

document.addEventListener("DOMContentLoaded", onLoaded);
