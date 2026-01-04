// ==UserScript==
// @name         v2ex-open-new-page
// @namespace    http://tampermonkey.net/
// @version      2024-03-12
// @description  在 v2ex 里，所有的 a 标签自动打开新页面
// @author       @zhixiangyao
// @match        https://www.v2ex.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489612/v2ex-open-new-page.user.js
// @updateURL https://update.greasyfork.org/scripts/489612/v2ex-open-new-page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个 base 元素
    var baseElement = document.createElement('base');
    // 设置 target 属性为 "_blank"
    baseElement.setAttribute('target', '_blank');
    // 将 base 元素插入到页面的 head 元素中
    document.head.appendChild(baseElement);
})();