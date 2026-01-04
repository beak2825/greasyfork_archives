// ==UserScript==
// @name         选中即复制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  鼠标选中页面中的字符,自动复制进剪贴板
// @author       kakasearch
// @include      *://*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/410789/%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/410789/%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var text
    document.onclick = function() {
        if ( unsafeWindow.getSelection) {
            text = unsafeWindow.getSelection();
        } else if (document.selection) {
            text = document.selection.createRange();
        }
        // 放到粘贴板里，操作浏览器自身的API
        // console.log(text.toString());
        //document.execCommand('Copy'); // 执行浏览器的复制命令
        GM_setClipboard(text.toString()); //采用iamqiz提出的方案，主页地址：https://greasyfork.org/zh-CN/users/380079-iamqiz
    }

})();