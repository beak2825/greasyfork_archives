// ==UserScript==
// @name         保护精力-豆瓣小组评论隐藏
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为豆瓣评论添加管理功能并高亮/隐藏用户的评论
// @author       不愿透露姓名的妈宝男
// @match        *://*.douban.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494548/%E4%BF%9D%E6%8A%A4%E7%B2%BE%E5%8A%9B-%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%AF%84%E8%AE%BA%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494548/%E4%BF%9D%E6%8A%A4%E7%B2%BE%E5%8A%9B-%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%AF%84%E8%AE%BA%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var highlightedUserIds = GM_getValue('highlightedUserIds', []);

    function addButtons() {
        document.querySelectorAll('li.comment-item').forEach(comment => {
            if (!comment.dataset.hasButtons) {
                var authorId = comment.getAttribute('data-author-id');

                var blockButton = document.createElement('button');
                blockButton.textContent = '不看他';
                blockButton.addEventListener('click', function() {
                    addToBlockList(authorId);
                refreshCommentsVisibility(); // 刷新页面上所有评论的可见性
                });

                var unblockButton = document.createElement('button');
                unblockButton.textContent = '解除不看';
                unblockButton.addEventListener('click', function() {
                    removeFromBlockList(authorId);
                refreshCommentsVisibility(); // 刷新页面上所有评论的可见性
                });


            comment.prepend(unblockButton);
            comment.prepend(blockButton); // 注意顺序，这确保blockButton最终位于unblockButton前面

                comment.dataset.hasButtons = true;

                // 检查是否需要立即应用高亮/隐藏样式
                if (highlightedUserIds.includes(authorId)) {
                    updateCommentStyle(comment, 'block');
                }
            }
        });
    }

    function addToBlockList(authorId) {
        if (!highlightedUserIds.includes(authorId)) {
            highlightedUserIds.push(authorId);
            GM_setValue('highlightedUserIds', highlightedUserIds);
        }
    }

    function removeFromBlockList(authorId) {
        highlightedUserIds = highlightedUserIds.filter(id => id !== authorId);
        GM_setValue('highlightedUserIds', highlightedUserIds);
    }
    function refreshCommentsVisibility() {
        document.querySelectorAll('li.comment-item').forEach(comment => {
            var authorId = comment.getAttribute('data-author-id');
            if (highlightedUserIds.includes(authorId)) {
                updateCommentStyle(comment, 'block');
            } else {
                updateCommentStyle(comment, 'unblock');
            }
        });
    }

    function updateCommentStyle(comment, action) {
        if (action === 'block') {
            Array.from(comment.children).forEach(child => {
                if (child.tagName !== 'BUTTON' && !child.classList.contains('user-face')) {
                    child.style.visibility = 'hidden';
                }
            });
            comment.style.backgroundColor = 'white';
            comment.style.border = '1px dashed black'; // 添加红色虚线边框

        } else {
            Array.from(comment.children).forEach(child => {
                child.style.visibility = '';
            });
            comment.style.backgroundColor = '';
        }
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.matches('li.comment-item')) {
                    addButtons();
                }
            });
        });
    });

    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    addButtons(); // 初始调用以添加按钮到现有评论
   GM_addStyle(`
        button {
            background: none;
            color:  #f0f0f0;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            display: inline;
            margin-right: 4px;     // 在按钮之间添加右边距
        }
        button:hover {
            text-decoration: none;
        }
    `);
})();
