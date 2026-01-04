// ==UserScript==
// @name         NT动漫 当前播放页 焦点
// @namespace    http://tampermonkey.net/
// @version      2025-07-28
// @description  NT动漫 当前播放页 焦点 例如 https://www.ntdm9.com/play/120-1-431.html 没安装插件前切换下一集需要滚动到当前高亮的集数后选择下一个
// @author       You
// @match        https://www.ntdm9.com/play/*
// @match        https://www.ntdm8.com/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ntdm9.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528254/NT%E5%8A%A8%E6%BC%AB%20%E5%BD%93%E5%89%8D%E6%92%AD%E6%94%BE%E9%A1%B5%20%E7%84%A6%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/528254/NT%E5%8A%A8%E6%BC%AB%20%E5%BD%93%E5%89%8D%E6%92%AD%E6%94%BE%E9%A1%B5%20%E7%84%A6%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    const activePlayElement = document.querySelector('.active-play');

    // 检查是否找到了元素
    if (activePlayElement) {
        // 如果找到了元素，则调用 focus() 方法使其获得焦点
        activePlayElement.focus();
        console.log('.active-play 元素已找到，并已尝试设置焦点');
    } else {
        // 如果没有找到元素，可以在控制台输出提示信息（可选）
        console.log('没有找到类名为 .active-play 的元素');
    }
})();