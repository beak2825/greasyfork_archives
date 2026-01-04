// ==UserScript==
// @name        小红书隐藏视频内容
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Hide sections containing videos
// @author       Your Name
// @match        https://www.xiaohongshu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480714/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/480714/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const playIcons = document.querySelectorAll('span.play-icon');

    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const newDivs = Array.from(document.querySelectorAll('span.play-icon')).map(span => span.closest('div'));
                newDivs.forEach(div => {
                    if (div) {
                        div.style.visibility = 'hidden';
                    }
                });
                layoutGrid();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    playIcons.forEach(span => {
        const parentDiv = span.closest('div');
        if (parentDiv) {
            parentDiv.style.visibility = 'hidden';
        }
    });

    function layoutGrid() {
        const container = document.querySelector('.container'); // 替换成你的容器元素的选择器
        const gridItems = Array.from(container.children);

        gridItems.forEach(item => {
            if (item.style.visibility === 'hidden') {
                container.removeChild(item);
            }
        });

        container.style.gridAutoFlow = 'dense';
    }
})();
