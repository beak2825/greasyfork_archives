// ==UserScript==
// @name         Freesmth User Blocker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 freesmth.net 上屏蔽指定用户的帖子
// @author
// @match        https://freesmth.net/*
// @match        https://freesmth.uk/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527340/Freesmth%20User%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/527340/Freesmth%20User%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从存储中加载屏蔽的用户列表
    let blockedUsers = GM_getValue('blockedUsers', []);

    // 处理并修改帖子
    function processPost(postElement) {
        // 避免重复处理同一帖子
        if (postElement.getAttribute('data-processed')) {
            return;
        }
        postElement.setAttribute('data-processed', 'true');

        // 查找用户名元素
        let usernameElement = postElement.querySelector('.PostUser-name .username');
        if (!usernameElement) return; // 如果找不到用户名，则跳过此帖子
        let username = usernameElement.textContent.trim();

        // 在用户名后添加或更新“隐藏/显示”按钮
        addToggleButton(usernameElement, username);

        // 检查用户是否被屏蔽
        if (blockedUsers.includes(username)) {
            // 隐藏帖子内容
            hidePostContent(postElement);
            // 将按钮文字设置为“显示”
            setToggleButtonCaption(usernameElement, '显示');
        } else {
            // 显示帖子内容
            showPostContent(postElement);
            // 将按钮文字设置为“隐藏”
            setToggleButtonCaption(usernameElement, '隐藏');
        }
    }

    // 隐藏帖子内容
    function hidePostContent(postElement) {
        // 隐藏帖子正文和操作
        let postBody = postElement.querySelector('.Post-body');
        if (postBody) postBody.style.display = 'none';
        let postActions = postElement.querySelector('.Post-actions');
        if (postActions) postActions.style.display = 'none';
    }

    // 显示帖子内容
    function showPostContent(postElement) {
        // 显示帖子正文和操作
        let postBody = postElement.querySelector('.Post-body');
        if (postBody) postBody.style.display = '';
        let postActions = postElement.querySelector('.Post-actions');
        if (postActions) postActions.style.display = '';
    }

    // 在用户名后添加或更新“隐藏/显示”按钮
    function addToggleButton(usernameElement, username) {
        // 检查按钮是否已存在
        let h3Element = usernameElement.closest('.PostUser-name');
        if (!h3Element) return;

        let existingButton = h3Element.querySelector('.toggleUserButton');
        if (existingButton) {
            // 更新事件处理器以确保使用正确的用户名
            existingButton.removeEventListener('click', existingButton.handlerReference);
            existingButton.handlerReference = function(e) {
                e.stopPropagation();
                e.preventDefault();
                toggleUser(username);
            };
            existingButton.addEventListener('click', existingButton.handlerReference);
        } else {
            // 创建按钮
            let toggleButton = document.createElement('button');
            toggleButton.className = 'toggleUserButton';
            toggleButton.style.marginLeft = '5px';

            toggleButton.handlerReference = function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                e.preventDefault(); // 阻止默认行为
                toggleUser(username);
            };
            toggleButton.addEventListener('click', toggleButton.handlerReference);

            // 在用户名后添加按钮
            h3Element.appendChild(toggleButton);
        }
    }

    // 设置按钮文字
    function setToggleButtonCaption(usernameElement, caption) {
        let h3Element = usernameElement.closest('.PostUser-name');
        if (!h3Element) return;
        let toggleButton = h3Element.querySelector('.toggleUserButton');
        if (toggleButton) {
            toggleButton.textContent = caption;
        }
    }

    // 切换用户的屏蔽状态
    function toggleUser(username) {
        if (blockedUsers.includes(username)) {
            // 用户当前被屏蔽，解除屏蔽
            blockedUsers = blockedUsers.filter(u => u !== username);
        } else {
            // 用户未被屏蔽，添加到屏蔽列表
            blockedUsers.push(username);
        }
        GM_setValue('blockedUsers', blockedUsers);
        // 重新处理所有帖子以更新显示
        processAllPosts();
    }

    // 处理页面上的所有帖子
    function processAllPosts() {
        let posts = document.querySelectorAll('.PostStream-item .Post');
        posts.forEach(function(postElement) {
            // 移除处理标记
            postElement.removeAttribute('data-processed');
        });
        // 处理每个帖子
        posts.forEach(function(postElement) {
            processPost(postElement);
        });
    }

    // 初始处理帖子
    processAllPosts();

    // 观察 DOM，处理动态加载的帖子（无限滚动）
    const observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                let posts = [];
                if (node.matches('.PostStream-item .Post')) {
                    posts.push(node);
                } else {
                    posts = node.querySelectorAll('.PostStream-item .Post');
                }
                posts.forEach(function(postElement) {
                    processPost(postElement);
                });
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();