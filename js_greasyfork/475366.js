// ==UserScript==
// @name         自由复制
// @namespace    http://jiangzhipeng.cn/
// @version      0.1.1
// @description  大部分网站可以自由复制文本,并去除网站附加的来源文本;
// @author       Jiang
// @match        *://*/*
// @icon         https://foruda.gitee.com/avatar/1676959947996164615/1275123_jzp979654682_1578947912.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475366/%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/475366/%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        //for Chrome Firefox Opera Safari
        style.appendChild(document.createTextNode(css));
        //for IE
        //style.styleSheet.cssText = code;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
    // 设置所有标签的内容可以选中
    loadStyle('* {user-select: auto !important;}');

    document.addEventListener('copy', e => {
        e.stopPropagation();
        e.preventDefault();
        let clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;
        let text = window.getSelection().toString();
        text && clipboardData.setData('text/plain', text);
    }, true)


})();