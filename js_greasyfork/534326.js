// ==UserScript==
// @name         Hacker News 评论折叠
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  折叠 Hacker News 上的嵌套评论，只显示直接回复，添加展开按钮查看子评论
// @author       Wab
// @match        https://news.ycombinator.com/item*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534326/Hacker%20News%20%E8%AF%84%E8%AE%BA%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/534326/Hacker%20News%20%E8%AF%84%E8%AE%BA%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 等待 DOM 完全加载
        setTimeout(initCommentFolding, 500);
    });

    function initCommentFolding() {
        const comments = document.querySelectorAll('.comment-tree tr.comtr');
        if (!comments.length) return;

        // 找出所有评论及其嵌套级别
        const commentMap = new Map();
        const topLevelComments = [];

        comments.forEach(comment => {
            // 获取评论缩进级别
            const indent = comment.querySelector('td.ind img');
            const indentLevel = indent ? parseInt(indent.getAttribute('width')) / 40 : 0;
            
            // 获取评论 ID
            const id = comment.id;
            if (!id) return;
            
            // 储存评论信息
            commentMap.set(id, {
                element: comment,
                level: indentLevel,
                replies: [],
                isHidden: false
            });
            
            // 如果是顶级评论，加入列表
            if (indentLevel === 0) {
                topLevelComments.push(id);
            }
        });
        
        // 建立评论层级关系
        let currentParent = null;
        let lastLevel = 0;
        const parentStack = [];

        comments.forEach(comment => {
            const id = comment.id;
            if (!id || !commentMap.has(id)) return;
            
            const commentInfo = commentMap.get(id);
            const currentLevel = commentInfo.level;
            
            if (currentLevel === 0) {
                // 顶级评论
                currentParent = id;
                lastLevel = 0;
                parentStack.length = 0;
                parentStack.push(id);
            } else {
                // 找到适当的父评论
                if (currentLevel > lastLevel) {
                    // 向下一级，当前父评论不变
                    parentStack.push(currentParent);
                } else if (currentLevel < lastLevel) {
                    // 回到上一级，弹出堆栈
                    for (let i = 0; i < (lastLevel - currentLevel); i++) {
                        parentStack.pop();
                    }
                    currentParent = parentStack[parentStack.length - 1];
                }
                // 当前级别相同，父评论在堆栈的最后一个
                else {
                    currentParent = parentStack[parentStack.length - 2];
                }
                
                // 将当前评论添加到父评论的回复列表中
                if (commentMap.has(currentParent)) {
                    commentMap.get(currentParent).replies.push(id);
                }
                
                // 隐藏非顶级评论
                if (currentLevel > 0) {
                    comment.style.display = 'none';
                    commentInfo.isHidden = true;
                }
                
                lastLevel = currentLevel;
                currentParent = id;
            }
        });
        
        // 为每个有回复的顶级评论添加展开/折叠按钮
        topLevelComments.forEach(commentId => {
            const comment = commentMap.get(commentId);
            if (comment && comment.replies.length > 0) {
                addToggleButton(comment, commentMap);
            }
        });
    }

    function addToggleButton(comment, commentMap) {
        const commentElement = comment.element;
        const commentHead = commentElement.querySelector('.comhead');
        
        if (!commentHead) return;
        
        // 创建展开/折叠按钮
        const toggleButton = document.createElement('span');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = `[展开 ${comment.replies.length} 条回复]`;
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.color = '#ff6600';
        toggleButton.style.marginLeft = '10px';
        
        // 添加点击事件
        toggleButton.addEventListener('click', function() {
            const isExpanded = toggleButton.textContent.includes('折叠');
            
            if (isExpanded) {
                // 折叠所有回复
                toggleReplies(comment.replies, commentMap, false);
                toggleButton.textContent = `[展开 ${comment.replies.length} 条回复]`;
            } else {
                // 展开所有回复
                toggleReplies(comment.replies, commentMap, true);
                toggleButton.textContent = `[折叠回复]`;
            }
        });
        
        commentHead.appendChild(toggleButton);
    }

    function toggleReplies(replyIds, commentMap, isVisible) {
        replyIds.forEach(replyId => {
            const reply = commentMap.get(replyId);
            if (!reply) return;
            
            // 设置当前回复的可见性
            reply.element.style.display = isVisible ? '' : 'none';
            reply.isHidden = !isVisible;
            
            // 如果是收起操作，则递归收起所有子回复
            if (!isVisible && reply.replies.length > 0) {
                toggleReplies(reply.replies, commentMap, false);
            }
        });
    }
})();