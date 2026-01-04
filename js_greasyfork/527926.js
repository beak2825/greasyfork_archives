// ==UserScript==
// @name         所有链接在当前页面打开
// @namespace    https://greasyfork.org/users/1171320
// @version      1.0
// @description  求求你不要开新窗口了。Force Links to Open in Current Tab.
// @author       yzcjd
// @author2      Lama AI 辅助
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        none

// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/527926/%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/527926/%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 遍历页面中的所有链接
    function updateLinks() {
        const links = document.querySelectorAll('a'); // 获取所有 <a> 标签
        links.forEach(link => {
            // 将 target 属性设置为 "_self"，强制在当前页面打开
            link.setAttribute('target', '_self');
        });
    }

    // 初始运行一次，处理当前页面的所有链接
    updateLinks();

    // 监听 DOM 的动态变化，处理异步加载的内容或单页应用
    const observer = new MutationObserver(() => {
        updateLinks(); // 每次检测到 DOM 变化时重新检查链接
    });

    observer.observe(document.body, { childList: true, subtree: true }); // 监听 DOM 变化
})();