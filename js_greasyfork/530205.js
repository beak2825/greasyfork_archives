// ==UserScript==
// @name         豆瓣剧集导航按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为豆瓣剧集页面添加上一集和下一集的导航按钮，支持拖动和透明度调节
// @author       ericdean
// @match        https://movie.douban.com/subject/*/episode/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530205/%E8%B1%86%E7%93%A3%E5%89%A7%E9%9B%86%E5%AF%BC%E8%88%AA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/530205/%E8%B1%86%E7%93%A3%E5%89%A7%E9%9B%86%E5%AF%BC%E8%88%AA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    const currentUrl = window.location.href;

    // 使用正则表达式提取剧集ID和当前集数
    const regex = /\/subject\/(\d+)\/episode\/(\d+)/;
    const match = currentUrl.match(regex);

    if (match) {
        const showId = match[1];
        const currentEpisode = parseInt(match[2]);

        // 创建导航容器
        const navContainer = document.createElement('div');
        navContainer.style.position = 'fixed';
        navContainer.style.top = '100px';
        navContainer.style.right = '20px';
        navContainer.style.zIndex = '9999';
        navContainer.style.display = 'flex';
        navContainer.style.flexDirection = 'column';
        navContainer.style.gap = '10px';
        navContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        navContainer.style.padding = '10px';
        navContainer.style.borderRadius = '6px';
        navContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        navContainer.style.cursor = 'move';
        navContainer.style.opacity = '0.7'; // 默认透明度70%

        // 创建"上一集"按钮
        if (currentEpisode > 1) {
            const prevButton = document.createElement('a');
            prevButton.href = `/subject/${showId}/episode/${currentEpisode - 1}`;
            prevButton.innerText = '上一集';
            prevButton.style.padding = '10px 15px';
            prevButton.style.backgroundColor = '#41ac52';
            prevButton.style.color = 'white';
            prevButton.style.borderRadius = '4px';
            prevButton.style.textDecoration = 'none';
            prevButton.style.fontWeight = 'bold';
            prevButton.style.textAlign = 'center';
            prevButton.style.cursor = 'pointer';
            navContainer.appendChild(prevButton);
        }

        // 创建"下一集"按钮
        const nextButton = document.createElement('a');
        nextButton.href = `/subject/${showId}/episode/${currentEpisode + 1}`;
        nextButton.innerText = '下一集';
        nextButton.style.padding = '10px 15px';
        nextButton.style.backgroundColor = '#41ac52';
        nextButton.style.color = 'white';
        nextButton.style.borderRadius = '4px';
        nextButton.style.textDecoration = 'none';
        nextButton.style.fontWeight = 'bold';
        nextButton.style.textAlign = 'center';
        nextButton.style.cursor = 'pointer';
        navContainer.appendChild(nextButton);

        // 将导航容器添加到页面
        document.body.appendChild(navContainer);

        // 实现拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        navContainer.addEventListener('mousedown', function(e) {
            // 如果点击的是按钮内部，不进行拖动
            if (e.target !== navContainer) {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - navContainer.getBoundingClientRect().left;
            offsetY = e.clientY - navContainer.getBoundingClientRect().top;

            // 阻止默认行为和冒泡
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const left = e.clientX - offsetX;
            const top = e.clientY - offsetY;

            // 确保不超出屏幕边界
            navContainer.style.left = Math.max(0, Math.min(window.innerWidth - navContainer.offsetWidth, left)) + 'px';
            navContainer.style.top = Math.max(0, Math.min(window.innerHeight - navContainer.offsetHeight, top)) + 'px';

            // 拖动时取消right定位，改为使用left
            navContainer.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        // 滚轮调节透明度
        navContainer.addEventListener('wheel', function(e) {
            e.preventDefault();

            let opacity = parseFloat(navContainer.style.opacity);

            // 向上滚动增加透明度，向下滚动减少透明度
            if (e.deltaY < 0) {
                opacity = Math.min(1, opacity + 0.05);
            } else {
                opacity = Math.max(0.1, opacity - 0.05);
            }

            navContainer.style.opacity = opacity.toFixed(2);
        });

        // 防止按钮点击触发拖动
        const allButtons = navContainer.querySelectorAll('a');
        allButtons.forEach(button => {
            button.addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
        });
    }
})();