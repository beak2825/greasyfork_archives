// ==UserScript==
// @name         禁止鼠标中键在chrome或edge中按下时出现平滑滚动功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  鼠标中键按下即滚动这种功能严重影响为鼠标中建分配快捷键的软件正常使用..也容易出现误操作...脚本为自用需求写的,所以各位按需自取吧
// @author       关公说爱情
// @match   *
// @include         *
// @connect   *
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441014/%E7%A6%81%E6%AD%A2%E9%BC%A0%E6%A0%87%E4%B8%AD%E9%94%AE%E5%9C%A8chrome%E6%88%96edge%E4%B8%AD%E6%8C%89%E4%B8%8B%E6%97%B6%E5%87%BA%E7%8E%B0%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/441014/%E7%A6%81%E6%AD%A2%E9%BC%A0%E6%A0%87%E4%B8%AD%E9%94%AE%E5%9C%A8chrome%E6%88%96edge%E4%B8%AD%E6%8C%89%E4%B8%8B%E6%97%B6%E5%87%BA%E7%8E%B0%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("mousedown", function(mouseEvent) {
        // Middle mouse button only.
        if (mouseEvent.button != 1) {
            return;
        }
        // No smooth scroll because fuck you.
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
    });

})();