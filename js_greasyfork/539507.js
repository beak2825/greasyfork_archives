// ==UserScript==
// @name         一键获取github开源项目文档
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键获取github开源项目文档，让你快速熟悉开源项目。
// @author       You
// @match        https://github.com/*/*
// @exclude      https://github.com/*/*/issues*
// @exclude      https://github.com/*/*/pull*
// @exclude      https://github.com/*/*/settings*
// @exclude      https://github.com/*/*/actions*
// @exclude      https://github.com/*/*/projects*
// @exclude      https://github.com/*/*/security*
// @exclude      https://github.com/*/*/pulse*
// @exclude      https://github.com/*/*/graphs*
// @exclude      https://github.com/*/*/wiki*
// @exclude      https://github.com/*/*/discussions*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539507/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96github%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/539507/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96github%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保我们在项目主页上
    const pathParts = window.location.pathname.split('/').filter(part => part);
    if (pathParts.length !== 2) {
        return; // 不是项目主页，退出
    }

    // 查找匹配选择器的链接
    const repoLinks = document.querySelectorAll('#repo-title-component a');

    repoLinks.forEach(link => {
        // 移除color-fg-default属性
        link.classList.remove('color-fg-default');

        // 修改链接颜色为暖色调
        link.style.color = '#FF6B35'; // 橙色暖色调
        link.style.fontWeight = 'bold'; // 加粗显示

        // 获取原始href值
        const originalHref = link.getAttribute('href');

        // 添加前缀URL
        if (originalHref && !originalHref.includes('readmex.com')) {
            // 移除开头的斜杠（如果有）
            const cleanHref = originalHref.startsWith('/') ? originalHref.substring(1) : originalHref;
            // 设置新的href
            link.setAttribute('href', 'https://readmex.com/' + cleanHref);

            // 设置在新标签页中打开
            link.setAttribute('target', '_blank');

            // 添加提示信息
            link.setAttribute('title', '点击在ReadmeX中查看项目详细设计文档和功能文档');
        }
    });

    // 添加悬停效果
    const style = document.createElement('style');
    style.textContent = `
        #repo-title-component a:hover {
            text-decoration: underline;
            color: #FF8C61 !important;
            cursor: pointer;
        }

        #repo-title-component a::after {
            content: " 📄";
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
})();