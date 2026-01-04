// ==UserScript==
// @name         网页字体替换
// @author       Cairl
// @version      1.3
// @description  更改网页显示字体
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/241490
// @downloadURL https://update.greasyfork.org/scripts/517333/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/517333/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义字体名称
    const customFont = '';

    // 添加 CSS 样式以覆盖页面字体
    const style = document.createElement('style');
    style.innerHTML = `
        html, body, p, h1, h2, h3, h4, h5, h6, div, li, input, textarea {
            font-family: '${customFont}' !important;
            font-weight: bold !important;  /* 加粗字体 */
        }
    `;
    document.head.appendChild(style);
})();
