// ==UserScript==
// @name         GitHub 切换项目与源码
// @namespace    https://greasyfork.org/users/1171320
// @version      1.6
// @description  在 GitHub 文件页面和 raw 页面之间添加按钮实现跳转。https://github.com/用户/项目 <==> https://raw.githubusercontent.com/用户/项目/ 。GitHub and Raw Page Toggle.
// @author       yzcjd
// @author2     Lama AI 辅助
// @match        *://github.com/*/*/blob/*
// @match        *://raw.githubusercontent.com/*/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528064/GitHub%20%E5%88%87%E6%8D%A2%E9%A1%B9%E7%9B%AE%E4%B8%8E%E6%BA%90%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/528064/GitHub%20%E5%88%87%E6%8D%A2%E9%A1%B9%E7%9B%AE%E4%B8%8E%E6%BA%90%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加切换按钮的函数
    function addToggleButton() {
        // 删除已有按钮以防止重复
        const existingButton = document.getElementById('toggle-raw-button');
        if (existingButton) {
            existingButton.remove();
        }

        const currentUrl = window.location.href;

        // 在 GitHub 文件页面添加按钮以跳转到 raw 页面
        if (currentUrl.includes('github.com') && currentUrl.includes('/blob/')) {
            const toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-raw-button';
            toggleButton.textContent = 'View Raw';
            toggleButton.style.position = 'fixed';
            toggleButton.style.top = '60px';
            toggleButton.style.right = '10px';
            toggleButton.style.zIndex = '1000';
            toggleButton.style.padding = '5px 10px';
            toggleButton.style.backgroundColor = '#2ea44f';
            toggleButton.style.color = '#fff';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '5px';
            toggleButton.style.cursor = 'pointer';

            toggleButton.addEventListener('click', function() {
                const rawUrl = currentUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                window.location.href = rawUrl; // 在当前页面打开 raw 页面
            });

            document.body.appendChild(toggleButton);
        }

        // 在 raw 页面添加按钮以跳转回 GitHub 文件页面
        if (currentUrl.includes('raw.githubusercontent.com')) {
            const githubUrl = currentUrl.replace('raw.githubusercontent.com', 'github.com').replace(/^(https:\/\/[^\/]+\/[^\/]+\/[^\/]+\/)/, '$1blob/');
            
            const toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-raw-button';
            toggleButton.textContent = 'View on GitHub';
            toggleButton.style.position = 'fixed';
            toggleButton.style.top = '60px';
            toggleButton.style.right = '10px';
            toggleButton.style.zIndex = '1000';
            toggleButton.style.padding = '5px 10px';
            toggleButton.style.backgroundColor = '#0366d6';
            toggleButton.style.color = '#fff';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '5px';
            toggleButton.style.cursor = 'pointer';

            toggleButton.addEventListener('click', function() {
                window.location.href = githubUrl; // 在当前页面打开 GitHub 页面
            });

            document.body.appendChild(toggleButton);
        }
    }

    // 初次加载时添加按钮
    addToggleButton();

    observer.observe(document.body, { childList: true, subtree: true }); // 监听整个文档的变化
})();
