// ==UserScript==
// @name         GitHub to DeepWiki
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MIT
// @description  Add a hyperlink-style button to the About section of GitHub repository pages to jump to the corresponding DeepWiki page
// @author       Monkee
// @match        https://github.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534372/GitHub%20to%20DeepWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/534372/GitHub%20to%20DeepWiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否是 GitHub 仓库页面
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] !== '' && pathParts[2] !== '') {
        const owner = pathParts[1];
        const repo = pathParts[2];

        // 创建超链接
        const link = document.createElement('a');
        link.href = `https://deepwiki.com/${owner}/${repo}`;
        link.target = '_blank';
        link.style.display = 'block';
        link.style.marginTop = '10px';
        link.style.color = '#6a737d'; // 与About模块中其他链接的颜色一致
        link.style.textDecoration = 'none';

        // 创建图标
        const icon = document.createElement('span');
        icon.className = 'octicon octicon-link'; // 使用GitHub的octicon图标
        icon.style.marginRight = '5px';
        icon.style.color = '#6a737d'; // 与文本颜色一致

        // 设置超链接文本
        const text = document.createTextNode('View on DeepWiki');

        // 将图标和文本添加到超链接
        link.appendChild(icon);
        link.appendChild(text);

        // 鼠标悬停时显示下划线
        link.addEventListener('mouseenter', function() {
            link.style.textDecoration = 'underline';
        });
        link.addEventListener('mouseleave', function() {
            link.style.textDecoration = 'none';
        });

        // 寻找 "About" 模块
        const aboutSection = document.querySelector('.BorderGrid-cell');
        if (aboutSection) {
            // 插入超链接到 "About" 模块的底部
            aboutSection.appendChild(link);
        } else {
            // 如果上面的选择器无效，尝试其他选择器
            const sidebar = document.querySelector('.repository-content .BorderGrid');
            if (sidebar) {
                const aboutCell = Array.from(sidebar.querySelectorAll('.BorderGrid-cell')).find(cell => cell.querySelector('h2') && cell.querySelector('h2').textContent.trim() === 'About');
                if (aboutCell) {
                    aboutCell.appendChild(link);
                }
            }
        }
    }
})();