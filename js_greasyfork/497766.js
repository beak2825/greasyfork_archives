// ==UserScript==
// @name         洛谷专栏评论用户名链接
// @namespace    http://your.domain.com
// @version      0.1.2
// @description  在洛谷专栏的评论中为用户名添加指向其个人主页的链接
// @author       Liuxizai
// @match        https://www.luogu.com/article/*
// @match        https://www.luogu.com.cn/article/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497766/%E6%B4%9B%E8%B0%B7%E4%B8%93%E6%A0%8F%E8%AF%84%E8%AE%BA%E7%94%A8%E6%88%B7%E5%90%8D%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/497766/%E6%B4%9B%E8%B0%B7%E4%B8%93%E6%A0%8F%E8%AF%84%E8%AE%BA%E7%94%A8%E6%88%B7%E5%90%8D%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完毕时执行初始处理
    document.addEventListener('DOMContentLoaded', function() {
        handleElements();
    });

    // 监控 DOM 变化
    const observer = new MutationObserver(handleElements);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 处理符合条件的元素
    function handleElements() {
        const elements = document.querySelectorAll('#app > div > main > div.article-comment.columba-content-wrap.wrapper > div:nth-child(n+4)');

        const numberOfElements = elements.length;
        console.log("Elements 数量:", numberOfElements);

        elements.forEach(element => {
            const usernameLink = element.querySelector('.luogu-username.username a');
            const avatarImg = element.querySelector('.avatar');

            if (usernameLink && avatarImg) {
                const avatarSrc = avatarImg.getAttribute('src');
                const userId = avatarSrc.match(/\d+/)[0];
                const newUsernameLink = `https://www.luogu.com.cn/user/${userId}`;
                usernameLink.setAttribute('href', newUsernameLink);
            }
        });
    }
})();