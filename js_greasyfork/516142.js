// ==UserScript==
// @name        B站时间戳复制markdown
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  通过快捷键Alt+⬇️快捷获取B站时间戳并转换为markdown格式复制到剪贴板
// @author       瀚海阑干
// @match        *://www.bilibili.com/video/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516142/B%E7%AB%99%E6%97%B6%E9%97%B4%E6%88%B3%E5%A4%8D%E5%88%B6markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/516142/B%E7%AB%99%E6%97%B6%E9%97%B4%E6%88%B3%E5%A4%8D%E5%88%B6markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // 检查是否按下 Alt + 下键
        if (event.altKey && event.key === 'ArrowDown') {
            const video = document.querySelector('video');
            if (video) {
                const currentTime = video.currentTime; // 获取当前时间戳
                const formattedTime = formatTime(currentTime); // 格式化时间
                const videoUrl = window.location.href.split('?')[0]; // 获取当前视频的链接并去掉查询参数
                const markdownText = `[${formattedTime}](${videoUrl}?t=${currentTime.toFixed(1)}#t=${formattedTime})`; // 创建Markdown格式文本

                // 复制到剪贴板
                GM_setClipboard(markdownText);

                // 提示复制成功
                GM_notification({
                    title: '复制成功',
                    text: '时间戳已复制到剪贴板！',
                    timeout: 2000
                });
            }
        }
    });

    // 格式化时间为 hh:mm:ss
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
})();