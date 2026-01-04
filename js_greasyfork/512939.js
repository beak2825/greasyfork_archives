// ==UserScript==
// @name         自定义YouTube首页单行视频数量
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  修改部分内容
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512939/%E8%87%AA%E5%AE%9A%E4%B9%89YouTube%E9%A6%96%E9%A1%B5%E5%8D%95%E8%A1%8C%E8%A7%86%E9%A2%91%E6%95%B0%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/512939/%E8%87%AA%E5%AE%9A%E4%B9%89YouTube%E9%A6%96%E9%A1%B5%E5%8D%95%E8%A1%8C%E8%A7%86%E9%A2%91%E6%95%B0%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改视频网格布局和视频元素的尺寸
    function changeYouTubeGrid() {
        // 选择视频网格的容器
        const videoGrid = document.querySelectorAll('#contents.ytd-rich-grid-renderer');
        if (videoGrid.length > 0) {
            videoGrid.forEach(container => {
                container.style.display = 'grid';
                container.style.gridTemplateColumns = 'repeat(5, 1fr)'; // 每行5个视频
                container.style.gap = '12px'; // 缩小间距以增加封面大小
            });
        }

        // 调整每个视频块的宽高比例，使封面看起来更大
        const videoItems = document.querySelectorAll('ytd-rich-item-renderer');
        videoItems.forEach(item => {
            item.style.width = 'auto'; // 自动适应列宽
            item.style.height = 'auto'; // 高度也自适应
        });

        // 通过CSS调整视频封面的大小
        const thumbnails = document.querySelectorAll('ytd-thumbnail img');
        thumbnails.forEach(thumb => {
            thumb.style.width = '100%';  // 封面占满整个视频块的宽度
            thumb.style.height = 'auto'; // 高度根据宽度自适应
        });
    }

    // 初次加载时调用一次
    changeYouTubeGrid();

    // 监听DOM变化，在页面加载新内容时重新应用修改
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            changeYouTubeGrid();
        });
    });

    // 开始监听变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
