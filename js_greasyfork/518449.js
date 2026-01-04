// ==UserScript==
// @name         删除知乎视频回答和盐选/电子书节选回答
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  删除知乎中包含视频回答和盐选/电子书节选的内容块
// @author       walterscott123
// @match        *://www.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518449/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E5%9B%9E%E7%AD%94%E5%92%8C%E7%9B%90%E9%80%89%E7%94%B5%E5%AD%90%E4%B9%A6%E8%8A%82%E9%80%89%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/518449/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E5%9B%9E%E7%AD%94%E5%92%8C%E7%9B%90%E9%80%89%E7%94%B5%E5%AD%90%E4%B9%A6%E8%8A%82%E9%80%89%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Function to remove nodes
    function removeVideoAnswers() {
        // Select all elements with class "VideoAnswerPlayer"
        const videoPlayers = document.querySelectorAll('.VideoAnswerPlayer');

        videoPlayers.forEach(player => {
            // Find the closest parent with class "feed"
            const feedDiv = player.closest('.Feed');
            if (feedDiv) {
                // Remove the parent node from the DOM
                feedDiv.remove();
            }
        });

        const another = document.querySelectorAll('.ZVideoItem-video');
        another.forEach(player => {
            // Find the closest parent with class "feed"
            const feedDiv = player.closest('.Feed');
            if (feedDiv) {
                // Remove the parent node from the DOM
                feedDiv.remove();
            }
        });
        const anwser_from_some_book = document.querySelectorAll('.KfeCollection-OrdinaryLabel-content');

        anwser_from_some_book.forEach(player => {
            // Find the closest parent with class "feed"
            const feedDiv = player.closest('.AnswerItem');
            if (feedDiv) {
                // Remove the parent node from the DOM
                feedDiv.remove();
            }
        });
    }

    // Run the function initially
    removeVideoAnswers();

    // Observe for dynamic changes on the page (useful for infinite scrolling)
    const observer = new MutationObserver(() => {
        removeVideoAnswers();
    });

    // Observe changes to the body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();