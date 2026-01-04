// ==UserScript==
// @name        Youtube hide specific comment button
// @namespace   https://greasyfork.org/en/users/938672-alban-thouvignon
// @description Adds a hide button on the right of every comments
// @match       *://youtube.com/*
// @match       *://www.youtube.com/*
// @version     1.1
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459032/Youtube%20hide%20specific%20comment%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/459032/Youtube%20hide%20specific%20comment%20button.meta.js
// ==/UserScript==

const intervalID = setInterval(myCallback, 500);

function myCallback() {
    if(!document.getElementById('comments').children.sections.children.contents) {
        return;
    }

    const comments = Array.from(document.getElementById('comments').children.sections.children.contents.children);

    comments.forEach((e, i) => {
        const comment = e.children.comment.children.body.children.main.children.header.children["header-author"];
        if (!!comment.children.hideButton) {
            return;
        }
        const hideButton = document.createElement("span");
        hideButton.id = 'hideButton';
        hideButton.className = 'published-time-text ytd-comment-renderer yt-simple-endpoint style-scope yt-formatted-string';
        hideButton.textContent = '  Hide  ';
        hideButton.style.cssText = 'white-space:pre-wrap';
        hideButton.style.marginLeft = 'auto';
        hideButton.style.marginRight = '0';
        hideButton.onclick = function() {
            comments[i].style.display = 'none';
        };
        comment.appendChild(hideButton);
    });
}
