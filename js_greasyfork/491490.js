// ==UserScript==
// @name         Center Google Search Page
// @name:zh-CN   居中谷歌搜索页面
// @name:zh-TW   居中谷歌搜索頁面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Centers the layout of Google search page.
// @description:zh-CN  居中谷歌搜索页面布局。
// @description:zh-TW  居中谷歌搜索頁面佈局。
// @author       ChatGPT 3.5
// @match        https://www.google.com/search?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491490/Center%20Google%20Search%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/491490/Center%20Google%20Search%20Page.meta.js
// ==/UserScript==

// 参考：https://salmon853.substack.com/p/32f，为了不影响在笔记本屏幕上的体验，可以自行更改 min-width 参数。

(function() {
    'use strict';

    // Function to add custom CSS styles  // 添加自定义 CSS 样式的函数
    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Custom CSS styles  // 自定义 CSS 样式
    const customStyles = `
        @media (min-width: 1537px) {
            /* AI 搜索 */
            .GcKpu {
                display: flex
                justify-content: center;
            }

            body {
                max-width: max-content;
                margin-left: auto;
                margin-right: auto;
            }
        }
    `;

    // Apply custom styles  // 应用自定义样式
    addStyle(customStyles);
})();
