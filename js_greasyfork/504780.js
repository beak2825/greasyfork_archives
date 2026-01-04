// ==UserScript==
// @name         哔哩哔哩稍后再看重定向到详情页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为哔哩哔哩稍后再看页面的每个视频缩略图添加一个更大的固定位置按钮,点击跳转到新标签页的视频链接
// @match        https://www.bilibili.com/watchlater/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504780/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/504780/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-button {
            position: absolute;
            bottom: 10px;
            right: 10px;
            padding: 6px 12px;
            background-color: rgba(0, 161, 214, 0.9);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            z-index: 10;
        }
        .custom-button:hover {
            background-color: rgba(0, 181, 229, 1);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transform: translateY(-2px);
        }
        .custom-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .av-pic {
            position: relative;
        }
    `;
    document.head.appendChild(style);

    function addButtonToItem(item) {
        const avPic = item.querySelector('.av-pic');
        if (avPic && !avPic.querySelector('.custom-button')) {
            const videoLink = avPic.href;
            const bvid = videoLink.split('/').pop();
            const newVideoLink = `https://www.bilibili.com/video/${bvid}`;

            const button = document.createElement('button');
            button.textContent = '打开视频';
            button.className = 'custom-button';

            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open(newVideoLink, '_blank');
            });

            avPic.appendChild(button);
        }
    }

    function addButtonsToAllItems() {
        const listItems = document.querySelectorAll('.av-item');
        listItems.forEach(addButtonToItem);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                addButtonsToAllItems();
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    addButtonsToAllItems();
})();