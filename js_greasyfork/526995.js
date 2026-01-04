// ==UserScript==
// @name         Dynamic Page Code Scraper with Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  带有启动按钮的 JavaScript 动态页面代码爬取脚本
// @author       z2004y
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526995/Dynamic%20Page%20Code%20Scraper%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526995/Dynamic%20Page%20Code%20Scraper%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button');
    button.textContent = '开始爬取页面代码';
    button.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999;';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        // 移除按钮
        button.remove();

        try {
            // 克隆整个文档
            const clonedDocument = document.documentElement.cloneNode(true);

            // 移除所有用户脚本相关的元素
            const userScripts = clonedDocument.querySelectorAll('[data-tampermonkey-script]');
            userScripts.forEach(script => script.remove());

            // 获取清理后的页面 HTML 代码
            const pageHTML = clonedDocument.outerHTML;

            console.log("页面完整 HTML 代码：", pageHTML);

            // 获取页面标题作为文件名
            const pageTitle = clonedDocument.querySelector('head > title').textContent || 'page_code';
            const fileName = `${pageTitle}.html`;

            // 创建 Blob 对象
            const blob = new Blob([pageHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // 创建下载链接元素
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;

            // 模拟点击下载链接
            a.click();

            // 释放临时 URL
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('在获取或保存页面代码时出现错误:', error);
        }

        // 恢复按钮
        document.body.appendChild(button);
    });
})();