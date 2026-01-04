// ==UserScript==
// @name         哔哩哔哩视频存档助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  添加缓存数据按钮至视频页下方，查询失效视频以及下载视频
// @author       梅塔的长名字
// @match        https://*.bilibili.com/video/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAaVBMVEUziP8Lff/////P3/8cgf8vhv8Adf/M3f8Aef9pof/x9f/E1/+Brv8phP/6+/+Hsv9XmP89jP8Acf/m7v/e6f+/1P/4+v/X5P/k7P9Fj/+jw/+Mtf9xpv9Slf/t8/8Ae/+yzP+ZvP+nxf8MQ3ahAAAA6UlEQVR4AcWQVZbDMAwAZcUKm8pM9z/k6ilLVp38dtrwCGEGg1hZYD4jkGVqxKa1TOF7VzENYt/wdSgII/6jB5dBWvAQMmJyQIZZcQ+1YQAz1pvgKJ8CNeukBc2WCsJuz5Ntvu87EmH/XzgcjTXHEwojC+4cLvRPWF/5idKUIzgAkJH/C/Kwl9ElVFAZXLwhs0/wLhzS/W66vdx3lAuKfedgURii1Rk0zVU3qdnci00a08YHCk9XGBMYMpU8VVTcA+OeU41jMQNjT/MCyf4P0xxupsmxKTepOVhYFPpucVG+gaVVb18d5HwBYWMOHktEGAMAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495382/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%AD%98%E6%A1%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495382/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%AD%98%E6%A1%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查页面中是否包含失效视频的图片
    function checkForNoVideoImage() {
        const noVideoImgSelector = 'img[src="https://i0.hdslb.com/bfs/static/jinkela/video/asserts/no_video.png"]';
        return document.querySelector(noVideoImgSelector) !== null;
    }

    // 从当前URL中提取BV号
    function getBvidFromUrl() {
        const url = new URL(window.location.href);
        const match = url.pathname.match(/\/video\/(BV[\w]+)/);
        return match ? match[1] : '';
    }

    // 创建并添加按钮
    function addButton(label, onclickHandler, leftOffset) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = `calc(50% + ${leftOffset}px)`;
        button.style.transform = 'translateX(-50%)';
        button.style.zIndex = 9999;
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#ff7f00';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        button.onclick = onclickHandler;

        document.body.appendChild(button);
    }

    // 主执行逻辑
    function main() {
        if (checkForNoVideoImage()) {
            // 如果检测到失效图片，则跳转到BiliPlus进行搜索
            const bvid = getBvidFromUrl();
            redirectToBiliPlusForSearch(bvid);
        } else {
            // 页面正常，添加“缓存数据”和“下载视频”按钮
            function addButtons() {
                // 添加“缓存数据”按钮
                addButton('缓存数据', function() {
                    window.open(`https://biliplus.com/video/${getBvidFromUrl()}`, '_blank');
                }, -120);

                // 添加“下载视频”按钮
                addButton('下载视频', function() {
                    const bvid = getBvidFromUrl();
                    const currentVideoUrl = window.location.href;
                    const downloadUrl = `https://snapany.com/zh/bilibili?link=${encodeURIComponent(currentVideoUrl)}`;
                    window.open(downloadUrl, '_blank');
                }, 120);
            }

            window.addEventListener('load', function() {
                addButtons();
            });
        }
    }

    // 跳转到BiliPlus查询失效的视频
    function redirectToBiliPlusForSearch(bvid) {
        window.location.href = `https://biliplus.com/video/${bvid}`;
    }

    // 立即执行主函数
    main();
})();