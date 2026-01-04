// ==UserScript==
// @name         哔哩哔哩复制视频时间点、分p标题、视频标签
// @namespace    http://tampermonkey.net/
// @version      2025-03-24.1
// @description  复制时间点：Ctrl-C。复制分p标题、视频标签：单机右键。复制时间点为`分p#时间戳`，如7#09:35；(未实现)粘贴为跳转视频时间。用途：记笔记、跳转录播
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529483/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E7%82%B9%E3%80%81%E5%88%86p%E6%A0%87%E9%A2%98%E3%80%81%E8%A7%86%E9%A2%91%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/529483/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E7%82%B9%E3%80%81%E5%88%86p%E6%A0%87%E9%A2%98%E3%80%81%E8%A7%86%E9%A2%91%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 复制时间点：Ctrl-C
   document.addEventListener('keydown', function(event) {
       // 检查是否按下了 Ctrl 键和 C 键
       if (event.ctrlKey && event.key === 'c') {
           if (!window.getSelection().toString()) { // 如果没有选中文字，复制时间戳
               const params = new URLSearchParams(window.location.search);
               const video_p = params.get('p');
               navigator.clipboard.writeText(`${video_p? `${video_p}#`:'1#'}${document.querySelector('.bpx-player-ctrl-time-current').innerText}`);
           }
       }
   });

    function rightClickCopyText(textAreaSelector, callback = (text) => text) {
        document.addEventListener('contextmenu', function(event) {
            if (event.target.matches(textAreaSelector)) {
                try {
                    navigator.clipboard.writeText(callback(event.target.innerText));
                    console.log('文本已复制');
                } catch (err) {
                    console.error('复制失败:', err);
                }
            }
        });
    }

    rightClickCopyText('.title'); // 复制合集下的视频标题
    rightClickCopyText('.title-txt'); // 复制分p标题
    rightClickCopyText('.tag-link'); // 复制视频标签
    rightClickCopyText('.tag-txt', (text) => {
        const match = text.match(/《(.*?)》/);
        return match ? match[1] : null; // 如果匹配成功，返回第一个捕获组；否则返回 null
    }); // 复制歌名（从视频听歌识曲标签）
})();