// ==UserScript==
// @name         Hackernews Scroll to Next/Previous Top-Level Comment
// @namespace    https://news.ycombinator.com/
// @version      0.2
// @description  Adds a button and keyboard shortcuts (down and up arrows) that scroll to quickly and smoothly navigate to the next/previous top-level comment. This scroller saves time by allowing you to skip comment threads you're not interested in. An alternative to collapsing the thread.
// @author       Jonathan Woolf
// @match        https://news.ycombinator.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458060/Hackernews%20Scroll%20to%20NextPrevious%20Top-Level%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/458060/Hackernews%20Scroll%20to%20NextPrevious%20Top-Level%20Comment.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button = document.createElement('button');
    button.textContent = '⬇️';
    button.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        z-index: 999;
        background-color: rgb(255, 198, 156);
        color: #fff;
        border: 6px solid rgb(255, 102, 0);
        background-color: rgb(255, 198, 156);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 24px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 91%;
    `;
    document.body.appendChild(button);

    const comments = [...document.querySelectorAll('td.ind[indent="0"]')];
    let currentCommentIndex = 0;

    button.addEventListener('click', scrollToNextComment);
    document.addEventListener("keydown", handleKeyPress);

    function handleKeyPress(event) {
        if (event.code === "ArrowDown") {
            event.preventDefault();
            scrollToNextComment();
        } else if (event.code === "ArrowUp") {
            event.preventDefault();
            scrollToPreviousComment();
        }
    }

    function scrollToNextComment() {
        if (currentCommentIndex === comments.length - 1) {
            currentCommentIndex = 0;
        } else {
            currentCommentIndex++;
        }
        comments[currentCommentIndex].closest('tr').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function scrollToPreviousComment() {
        if (currentCommentIndex === 0) {
            currentCommentIndex = comments.length - 1;
        } else {
            currentCommentIndex--;
        }
        comments[currentCommentIndex].closest('tr').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
})();
