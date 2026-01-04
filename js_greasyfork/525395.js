// ==UserScript==
// @name         Bilibili 根据是否存在置顶评论自动屏蔽评论区
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  检测 Bilibili 页面是否有置顶评论，并根据结果显示或隐藏评论区。
// @author       Cyke
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525395/Bilibili%20%E6%A0%B9%E6%8D%AE%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E7%BD%AE%E9%A1%B6%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525395/Bilibili%20%E6%A0%B9%E6%8D%AE%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8%E7%BD%AE%E9%A1%B6%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来检查是否有置顶评论
    function checkForPinnedComment() {
        let pinnedComment;
        try {
            // 查找置顶评论的元素
            pinnedComment = document.querySelector("#commentapp > bili-comments")
                .shadowRoot.querySelector("#feed > bili-comment-thread-renderer:nth-child(1)")
                .shadowRoot.querySelector("#comment")
                .shadowRoot.querySelector("#top");
        } catch (e) {
            //console.log('正常报错，不要慌', e);
            return;
        }

        // 获取评论区容器
        const commentSection = document.querySelector("#commentapp > bili-comments");
        if (pinnedComment) {
            // 如果有置顶评论，确保评论区是可见的
            if (commentSection) {
                commentSection.style.display = 'block';
                //console.log('置顶评论已找到，评论区已显示');
            }
        } else {
            // 如果没有置顶评论，隐藏评论区
            if (commentSection) {
                commentSection.style.display = 'none';
                //console.log('没有置顶评论，评论区已隐藏');
            }
        }
    }

    // 由于 Bilibili 页面可能会动态加载评论，设置一个定时器定期检查
    setInterval(checkForPinnedComment, 2000);

    // 初始化时立即执行一次检查
    checkForPinnedComment();
})();