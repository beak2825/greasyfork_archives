// ==UserScript==
// @name         隐藏【Bangumi娘 Powered by AI✨】的AI回复
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  隐藏https://bgm.tv/dev/app/1624组件的AI回复
// @author       老悠
// @license      MIT
// @include      https://bgm.tv/*
// @include      https://bangumi.tv/*
// @match        https://chii.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539071/%E9%9A%90%E8%97%8F%E3%80%90Bangumi%E5%A8%98%20Powered%20by%20AI%E2%9C%A8%E3%80%91%E7%9A%84AI%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/539071/%E9%9A%90%E8%97%8F%E3%80%90Bangumi%E5%A8%98%20Powered%20by%20AI%E2%9C%A8%E3%80%91%E7%9A%84AI%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 找到包含特定链接的所有父元素（.message 或 .cmt_sub_content）
    const targetLinks = document.querySelectorAll('a[href="https://bgm.tv/dev/app/1624"]');
    targetLinks.forEach(targetLink => {
        const parentDiv = targetLink.closest('div.message, div.cmt_sub_content');
        if (parentDiv) {
            // 保存原始内容
            const originalContent = parentDiv.innerHTML;

            // 修改为简略显示
            parentDiv.innerHTML = 'AI回复，点击展示详细内容。';
            parentDiv.style.cssText = `
                    cursor: pointer;
                    color: lightgray;
                    font-style: italic;
                    padding: 8px;
                    border-left: 3px solid #ddd;
                `;
            // 添加点击事件
            parentDiv.addEventListener('click', function(e) {
                // 防止事件冒泡（如果不需要可以移除）
                e.stopPropagation();

                // 检查当前显示的是简略内容还是原始内容
                if (parentDiv.innerHTML === 'AI回复，点击展示详细内容。') {
                    // 恢复原始内容
                    parentDiv.innerHTML = originalContent;
                } else {
                    // 再次简略显示
                    parentDiv.innerHTML = 'AI回复，点击展示详细内容。';
                }
            });
        }
    });
})();