// ==UserScript==
// @name         移除“坟贴勿回” for Bangumi
// @version      1.1
// @description  自动隐藏包含特定关键词的垃圾回复（同时包含“坟”、“贴”、“勿”、“回”且总字数少于50）
// @author       shironegi
// @match        https://bgm.tv/*
// @match        https://chii.in/*
// @match        https://bangumi.tv/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1387362
// @downloadURL https://update.greasyfork.org/scripts/527126/%E7%A7%BB%E9%99%A4%E2%80%9C%E5%9D%9F%E8%B4%B4%E5%8B%BF%E5%9B%9E%E2%80%9D%20for%20Bangumi.user.js
// @updateURL https://update.greasyfork.org/scripts/527126/%E7%A7%BB%E9%99%A4%E2%80%9C%E5%9D%9F%E8%B4%B4%E5%8B%BF%E5%9B%9E%E2%80%9D%20for%20Bangumi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hideReplies() {
        let comments = document.querySelectorAll('#comment_list .row_reply');
        comments.forEach(comment => {
            let message = comment.querySelector('.message');
            if (message) {
                let text = message.textContent;
                if (text.length < 50 &&
                    text.includes('坟') &&
                    text.includes('贴') &&
                    text.includes('勿') &&
                    text.includes('回')) {
                    comment.style.display = 'none';
                }
            }
        });
    }
    hideReplies();
    let observer = new MutationObserver(hideReplies);
    observer.observe(document.body, { childList: true, subtree: true });
})();
