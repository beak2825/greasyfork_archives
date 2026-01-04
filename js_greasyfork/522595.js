// ==UserScript==
// @name         虎扑帖子列表显示优化
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  优化虎扑帖子列表页的显示效果，支持按回复数和时间排序
// @author       你的名字
// @match        https://bbs.hupu.com/*
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/522595/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522595/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取帖子列表容器
    const postContainer = document.querySelector('.bbs-sl-web-post');
    if (!postContainer) return;

    // 获取帖子列表
    const postList = postContainer.querySelector('ul');
    if (!postList) return;

    // 获取表头
    const header = postContainer.querySelector('.bbs-sl-web-post-header');
    if (!header) return;

    // 获取表头中的“回复/浏览”和“时间”元素
    const replyHeader = header.children[1];
    const timeHeader = header.children[3];

    // 默认按“回复/浏览”数排序
    sortByReplies();

    // 为“回复/浏览”和“时间”表头添加点击事件
    replyHeader.addEventListener('click', sortByReplies);
    timeHeader.addEventListener('click', sortByTime);

    // 按“回复/浏览”数排序
    function sortByReplies() {
        const posts = Array.from(postList.querySelectorAll('.bbs-sl-web-post-body'));
        posts.sort((a, b) => {
            const aReplies = parseInt(a.querySelector('.post-datum').textContent.split('/')[0].trim(), 10);
            const bReplies = parseInt(b.querySelector('.post-datum').textContent.split('/')[0].trim(), 10);
            return bReplies - aReplies;
        });
        updatePostList(posts);
    }

    // 按“时间”排序
    function sortByTime() {
        const posts = Array.from(postList.querySelectorAll('.bbs-sl-web-post-body'));
        posts.sort((a, b) => {
            const aTime = new Date(`2023-${a.querySelector('.post-time').textContent.trim()}`);
            const bTime = new Date(`2023-${b.querySelector('.post-time').textContent.trim()}`);
            return bTime - aTime;
        });
        updatePostList(posts);
    }

    // 更新帖子列表
    function updatePostList(posts) {
        postList.innerHTML = '';
        posts.forEach(post => postList.appendChild(post));
    }
})();