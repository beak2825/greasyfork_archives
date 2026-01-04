// ==UserScript==
// @name        小暑组件库文档网站导航栏优化
// @namespace   Violentmonkey Scripts
// @match       https://24jieqi.github.io/react-native-xiaoshu/components*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 2025/4/15 17:50:48
// @downloadURL https://update.greasyfork.org/scripts/532913/%E5%B0%8F%E6%9A%91%E7%BB%84%E4%BB%B6%E5%BA%93%E6%96%87%E6%A1%A3%E7%BD%91%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532913/%E5%B0%8F%E6%9A%91%E7%BB%84%E4%BB%B6%E5%BA%93%E6%96%87%E6%A1%A3%E7%BD%91%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
        main .dumi-default-sidebar {
            width: 280px;
        }
    `;
    document.head.appendChild(style);
})();