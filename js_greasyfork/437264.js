// ==UserScript==
// @name         Notion 移除所有滚动条
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Notion 移除表格、列表等滚动条;Removes the scroll bar for all elements on Notion
// @author       NellPoi
// @connect      notion.so
// @include      *://*.notion.*/*
// @icon         https://toppng.com/uploads/preview/notion-logo-11609370405b4cvyz4wit.png
// @grant        none
// @note         21-12-19 1.0.2 适配Chrome、Safari、IE浏览器、Firefox浏览器
// @note         21-12-19 1.0.1 修改描述信息
// @note         21-12-19 1.0.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/437264/Notion%20%E7%A7%BB%E9%99%A4%E6%89%80%E6%9C%89%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/437264/Notion%20%E7%A7%BB%E9%99%A4%E6%89%80%E6%9C%89%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    // 默认移除所有元素的滚动条，如果你需要需要更好的性能或者自定义可以对其修改
    // The scroll bar is removed for all elements by default, and can be modified if you need better performance or customization
    let style = document.createElement('style');
    style.innerHTML = "*::-webkit-scrollbar{display:none} /* Chrome and Safari */" +
        "  scrollbar-width: none; /* firefox */\n" +
        "  -ms-overflow-style: none; /* IE 10+ */\n" +
        "  overflow-x: hidden;\n" +
        "  overflow-y: auto;";
    document.head.appendChild(style);
})();