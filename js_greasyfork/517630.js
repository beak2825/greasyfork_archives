// ==UserScript==
// @name         洛谷侧边栏经典样式恢复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  恢复洛谷网站文章和讨论区侧边栏为经典样式
// @author       yan_wang
// @match        https://www.luogu.com.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517630/%E6%B4%9B%E8%B0%B7%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%BB%8F%E5%85%B8%E6%A0%B7%E5%BC%8F%E6%81%A2%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/517630/%E6%B4%9B%E8%B0%B7%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%BB%8F%E5%85%B8%E6%A0%B7%E5%BC%8F%E6%81%A2%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式来恢复经典样式
    GM_addStyle(`
        /* 恢复经典文章页面侧边栏 */
        .side-bar {
            width: 200px; /* 设定经典侧边栏的宽度 */
            background-color: #f4f4f4; /* 背景颜色 */
            border-right: 1px solid #ddd; /* 边框 */
        }

        /* 恢复经典讨论区样式 */
        .discussion-bar {
            width: 200px;
            background-color: #f4f4f4;
            border-right: 1px solid #ddd;
            padding: 10px;
        }

        /* 调整主内容区以适应经典样式 */
        .main-content {
            margin-left: 220px; /* 让主内容有空间显示侧边栏 */
        }

        /* 恢复经典风格的字体和间距 */
        .side-bar ul, .discussion-bar ul {
            list-style-type: none;
            padding: 0;
        }

        .side-bar li, .discussion-bar li {
            padding: 8px 10px;
            border-bottom: 1px solid #ddd;
        }

        .side-bar li:hover, .discussion-bar li:hover {
            background-color: #f0f0f0;
        }
    `);

    // 如果页面有新的内容加载，继续应用经典样式
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 确保新加载的内容也使用经典样式
                document.querySelectorAll('.side-bar, .discussion-bar').forEach(function(sideBar) {
                    sideBar.style.width = '200px';
                    sideBar.style.backgroundColor = '#f4f4f4';
                });
            }
        });
    });

    // 观察DOM变化
    observer.observe(document.body, { childList: true, subtree: true });
})();
