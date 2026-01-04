// ==UserScript==
// @name         键盘翻页 Keyboard flip
// @namespace    https://www.cnachen.com/
// @version      0.1
// @description  使用键盘方向键左右翻页
// @author       cnachen
// @license      MIT
// @match        https://yande.re/post*
// @match        https://konachan.com/post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531701/%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%20Keyboard%20flip.user.js
// @updateURL https://update.greasyfork.org/scripts/531701/%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%20Keyboard%20flip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keyup', function(e){
        // 获取当前焦点元素
        var activeElement = document.activeElement;
        // 判断是否在输入框或文本区域中
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) {
            return; // 如果聚焦在输入框或可编辑区域，则不执行跳转
        }
        if(e.keyCode == 37){
            // 后退
            document.querySelector('a.previous_page').click();
        } else if(e.keyCode == 39){
            // 前进
            document.querySelector('a.next_page').click();
        }
    });
})();