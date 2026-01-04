// ==UserScript==
// @name         ADblocker4DeepinBBSv1
// @namespace    http://tampermonkey.net/
// @version      2024-06-24
// @description  block AD-like Users in DeepinBBS
// @author       fallingstar10
// @match        https://bbs.deepin.org/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepin.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498942/ADblocker4DeepinBBSv1.user.js
// @updateURL https://update.greasyfork.org/scripts/498942/ADblocker4DeepinBBSv1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 要屏蔽的用户ID列表
    const blockedUserIds = ['','','','','','','','','']; // 根据需要添加用户ID

     // 定位到每个回帖的容器
    const postContainerSelector = 'div.post_pc';

    // 定位到用户ID的span
    const userNameSelector = 'span.post_name';
    // 定位到每个发帖的容器
    const postContainerSelector_inflow = 'div.post';

    // 检查并隐藏帖子内容
    function hidePosts() {
        const postContainers = document.querySelectorAll(postContainerSelector);
        postContainers.forEach(postContainer => {
            // 找到用户ID的span元素
            const userNameSpan = postContainer.querySelector(userNameSelector);
            if (userNameSpan) {
                const userId = userNameSpan.textContent.trim();
                if (blockedUserIds.includes(userId)) {
                    // 隐藏整个回帖容器
                    postContainer.style.display = 'none';
                }
            }
        });
    }
    function hidePosts_inflow() {
        const postContainers = document.querySelectorAll(postContainerSelector_inflow);
        postContainers.forEach(postContainer => {
            // 找到用户ID的span元素
            const userNameSpan = postContainer.querySelector(userNameSelector);
            if (userNameSpan) {
                const userId = userNameSpan.textContent.trim();
                if (blockedUserIds.includes(userId)) {
                    // 隐藏整个回帖容器
                    postContainer.style.display = 'none';
                }
            }
        });
    }

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                hidePosts();
                hidePosts_inflow();
            }
        });
    });

    // 配置observer，使其知道需要观察哪个节点，以及需要观察哪些变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后执行一次
    document.addEventListener('DOMContentLoaded', ()=>{
        hidePosts();
        hidePosts_inflow();
    });
})();
