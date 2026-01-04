// ==UserScript==
// @name         Poe 添加删除所有记录按钮
// @namespace    https://github.com/xxnuo/
// @version      0.1
// @license      MIT
// @description  给 Poe 网页版添加一个选中所有历史记录的功能，需要先选择 Delete 一句话，然后点击油猴图标里全选历史记录按钮。
// @author       xxnuo
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/461357/Poe%20%E6%B7%BB%E5%8A%A0%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E8%AE%B0%E5%BD%95%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/461357/Poe%20%E6%B7%BB%E5%8A%A0%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E8%AE%B0%E5%BD%95%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand('全选历史记录', () => {
        let cb = document.getElementsByClassName('Checkbox_checkbox__zM_Lo');
        for(var i = 0;i<cb.length;i++) {
            if (cb[i].checked) continue;
            // 创建一个 MouseEvent 对象
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            // 触发 checkbox 的 click 事件
            cb[i].dispatchEvent(event);
        }
    });
})();