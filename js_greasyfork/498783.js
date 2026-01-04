// ==UserScript==
// @name         Bangumi屏蔽未开播单集吐槽
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  屏蔽Bangumi网站单集吐槽箱中发布在该集播出当天之前的评论
// @author       国见佐彩
// @match        https://bgm.tv/ep/*
// @match        https://chii.in/ep/*
// @match        https://bangumi.tv/ep/*
// @icon         https://bgm.tv/img/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498783/Bangumi%E5%B1%8F%E8%94%BD%E6%9C%AA%E5%BC%80%E6%92%AD%E5%8D%95%E9%9B%86%E5%90%90%E6%A7%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498783/Bangumi%E5%B1%8F%E8%94%BD%E6%9C%AA%E5%BC%80%E6%92%AD%E5%8D%95%E9%9B%86%E5%90%90%E6%A7%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取首播时间
    const epDesc = document.querySelector('.epDesc .tip');
    const firstBroadcastMatch = epDesc && epDesc.textContent.match(/首播:(\d{4}-\d{2}-\d{2})/);
    if (!firstBroadcastMatch) {
        return;
    }
    const firstBroadcastDate = new Date(firstBroadcastMatch[1]);
    const firstBroadcastDateTime = firstBroadcastDate.getTime();

    // 获取评论列表
    const comments = document.querySelectorAll('#comment_list .row_reply');
    let lastPreBroadcastComment;
    let hasPreBroadcastComment = false;

    // 检查并屏蔽评论
    function checkAndToggleComments(hide) {
        comments.forEach(comment => {
            const timeElement = comment.querySelector('.post_actions .action small');
            const timeMatch = timeElement && timeElement.textContent.match(/(\d{4}-\d{1,2}-\d{1,2})/);
            if (timeMatch) {
                const commentDate = new Date(timeMatch[1]);
                const commentDateTime = commentDate.getTime();
                if (commentDateTime < firstBroadcastDateTime - (24 * 60 * 60 * 1000)) {
                    comment.style.display = hide ? 'none' : '';
                    hasPreBroadcastComment = true;
                    if (hide) {
                        lastPreBroadcastComment = comment;
                    }
                }
            }
        });
    }

    // 创建按钮
    function createButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = '';
        buttonContainer.className = 'row_state clearit';
        const button = document.createElement('div');
        button.className = 'filtered';
        button.textContent = '屏蔽/显示播出前评论';
        button.style.cursor = 'pointer';

        buttonContainer.appendChild(button);

        button.addEventListener('click', () => {
            hideComments = !hideComments;
            checkAndToggleComments(hideComments);

            // 显示或隐藏底部按钮
            if (hideComments) {
                if (bottomButton && bottomButton.parentNode) {
                    bottomButton.parentNode.removeChild(bottomButton);
                }
            } else {
                if (lastPreBroadcastComment && bottomButton) {
                    lastPreBroadcastComment.parentNode.insertBefore(bottomButton, lastPreBroadcastComment.nextSibling);
                }
            }
        });

        return buttonContainer;
    }

    let hideComments = true;

    const commentList = document.getElementById('comment_list');
    let bottomButton;

    if (commentList) {
        // 初始化时隐藏评论并检查是否有播出前评论
        checkAndToggleComments(hideComments);

        // 如果有播出前评论，添加按钮
        if (hasPreBroadcastComment) {
            // 在顶部添加按钮
            const topButton = createButton();
            commentList.insertBefore(topButton, commentList.firstChild);

            // 创建底部按钮，但不立即添加
            bottomButton = createButton();

            // 在最后一条播出前评论的底部（第一条播出后评论的上面）添加按钮
            if (!hideComments && lastPreBroadcastComment) {
                lastPreBroadcastComment.parentNode.insertBefore(bottomButton, lastPreBroadcastComment.nextSibling);
            }
        }
    }
})();