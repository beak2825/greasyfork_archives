// ==UserScript==
// @name         ADblocker4DeepinBBS
// @namespace    http://tampermonkey.net/
// @version      2024-06-26
// @description  block AD-like Users in DeepinBBS
// @author       fallingstar10
// @match        https://bbs.deepin.org/post/*
// @match        https://bbs.deepin.org/zh/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepin.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498936/ADblocker4DeepinBBS.user.js
// @updateURL https://update.greasyfork.org/scripts/498936/ADblocker4DeepinBBS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userIds = [312791,312017,286301,312105,19468,312784,19468,260299]; // 根据需要添加用户ID
    let blockedPostIds = [];

    function fetchUserPosts(userid) {
        const ngState = JSON.parse(document.querySelector('#ng-state').innerText);
        const userPosts = ngState['post-detail'].posts.data.filter((ele) => ele.post_user_id === userid);
        const postIds = userPosts.map(post => post.id);
        const formattedPostIds = postIds.map(id => `post_${id}`);
        blockedPostIds.push(...new Set([...blockedPostIds, ...formattedPostIds]));
        formattedPostIds.forEach(hidePosts); // 隐藏当前用户的所有帖子
        return formattedPostIds;
    }

    function hidePosts() {
        blockedPostIds.forEach(postId => {
            let postContainer = document.getElementById(postId);
            if (postContainer) {
                postContainer.style.display = 'none';
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('div.post_pc')) {
                        hidePosts(); // 重新检查所有帖子
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始屏蔽执行
    window.addEventListener('load', () => {
        userIds.forEach(fetchUserPosts); // 预先获取所有应被屏蔽的帖子ID
        hidePosts(); // 首次隐藏帖子
    });
})();
