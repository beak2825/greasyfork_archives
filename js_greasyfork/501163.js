// ==UserScript==
// @name         一键打开稍后播放的前十二个视频
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用按钮在新标签页中分批打开稍后播放列表中的视频，每次12个
// @author       Your Name
// @match        *://www.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501163/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E7%A8%8D%E5%90%8E%E6%92%AD%E6%94%BE%E7%9A%84%E5%89%8D%E5%8D%81%E4%BA%8C%E4%B8%AA%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/501163/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E7%A8%8D%E5%90%8E%E6%92%AD%E6%94%BE%E7%9A%84%E5%89%8D%E5%8D%81%E4%BA%8C%E4%B8%AA%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let startIndex = 0; // 用于跟踪当前打开视频的起始索引

    // 函数：在新标签页中打开当前批次的十二个视频
    function openVideos() {
        let items = document.querySelectorAll('.watch-later-list .list-box .av-item');

        // 每次打开 12 个视频
        for (let i = startIndex; i < Math.min(startIndex + 12, items.length); i++) {
            let item = items[i];
            let link = item.querySelector('a');
            if (link) {
                window.open(link.href, '_blank');
            }
        }

        // 更新起始索引
        startIndex += 12;
    }

    // 函数：创建并添加按钮到页面
    function addButton() {
        let button = document.createElement('button');
        button.innerHTML = '打开12个';
        button.style.padding = '10px';
        button.style.backgroundColor = '#00A1D6';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginRight = '10px'; // 添加右边距，使按钮与下一个元素分开

        button.addEventListener('click', openVideos);

        // 找到目标按钮并将新按钮插入到其之前
        let targetButton = document.querySelector('a.s-btn[href="//www.bilibili.com/medialist/play/watchlater"]');
        if (targetButton) {
            targetButton.parentNode.insertBefore(button, targetButton);
        }
    }

    // 确保脚本在页面完全加载后运行
    window.addEventListener('load', function() {
        addButton();
    }, false);
})();
