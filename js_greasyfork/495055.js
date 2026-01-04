// ==UserScript==
// @name         自动点赞脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  你的随意点赞可能会给其他人照成困扰，请谨慎使用！！
// @author       嘉心糖
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495055/%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495055/%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后获取 CSRF Token 和 Cookies
    window.addEventListener('load', function() {
        let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // 从本地存储获取当前的帖子ID，如果没有则从1开始
        let currentPostId = parseInt(localStorage.getItem('currentPostId'), 10) || 1;

        // 用于发送点赞请求的函数
        function sendHeartReaction(postId) {
            fetch(`/discourse-reactions/posts/${postId}/custom-reactions/heart/toggle.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'X-Csrf-Token': csrfToken,  // 使用页面中获取的CSRF Token
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'  // 确保 Cookie 自动随请求发送
            }).then(response => {
                if (response.status === 429) {
                    console.error('点赞已经达到上限，脚本停止');
                    return;
                }
                return response.json().then(data => {
                    if (data.error_type) {
                        console.error('点赞失败，帖子ID:', postId, data.errors.join('; '));
                        localStorage.setItem('currentPostId', postId + 1);
                        setTimeout(() => sendHeartReaction(postId + 1), 1500);
                    }
                    else {
                        const postNumber = data.post_number;
                        const topicId = data.topic_id;
                        const url = `https://linux.do/t/topic/${topicId}/${postNumber}`;
                        console.log('点赞成功,帖子ID:', postId, 'url:', url, data);
                        localStorage.setItem('currentPostId', postId + 1);
                        setTimeout(() => sendHeartReaction(postId + 1), 1500);
                    }
                });
            })
            .catch(error => {
                console.error('点赞失败，帖子ID:', postId, error);
            });
        }

        // 开始点赞流程
        sendHeartReaction(currentPostId);
    });
})();
