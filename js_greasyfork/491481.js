// ==UserScript==
// @name                Remove Translate Attribute For Temu
// @name:zh-CN          Temu去除翻译限制
// @namespace           https://github.com/KPI0/tampermonkey
// @version             0.4
// @description         Remove translate attribute from HTML tag
// @description:zh-cn   Temu购物平台限制了网页翻译，通过此脚本可去除限制
// @author              KPI0
// @match               https://www.temu.com/*
// @icon                https://www.temu.com/favicon.ico
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/491481/Remove%20Translate%20Attribute%20For%20Temu.user.js
// @updateURL https://update.greasyfork.org/scripts/491481/Remove%20Translate%20Attribute%20For%20Temu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 HTML 标签
    var htmlTag = document.querySelector('html');

    // 检查是否存在 translate 属性并且值为 "no"
    if (htmlTag && htmlTag.hasAttribute('translate') && htmlTag.getAttribute('translate') === 'no') {
        // 移除 translate 属性
        htmlTag.removeAttribute('translate');
    }
})();
