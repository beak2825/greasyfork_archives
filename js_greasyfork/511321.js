// ==UserScript==
// @name         解除拼多多评论选中限制
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  解除拼多多网页评论中的选中和复制等限制
// @author       无言
// @match        https://mobile.yangkeduo.com/*
// @license MIT
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/511321/%E8%A7%A3%E9%99%A4%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AF%84%E8%AE%BA%E9%80%89%E4%B8%AD%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/511321/%E8%A7%A3%E9%99%A4%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AF%84%E8%AE%BA%E9%80%89%E4%B8%AD%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeSelectionRestrictions() {
        // 鼠标事件
        document.oncontextmenu = null;  // 解除鼠标右键
        document.onselectstart = null;  // 解除文字选择
        document.onmousedown = null;    // 解除鼠标按下事件
        document.onmouseup = null;      // 解除鼠标释放事件
        document.onclick = null;        // 解除鼠标点击事件
        document.ondblclick = null;     // 解除鼠标双击事件
        document.onmousemove = null;    // 解除鼠标移动事件
        document.onmouseover = null;    // 解除鼠标悬浮事件
        document.onmouseout = null;     // 解除鼠标移出事件
        document.onmouseenter = null;   // 解除鼠标进入事件
        document.onmouseleave = null;   // 解除鼠标离开事件

        // 键盘事件
        document.onkeydown = null;      // 解除按下键盘按键事件
        document.onkeyup = null;        // 解除键盘按键释放事件
        document.onkeypress = null;     // 解除键盘按键按下和释放事件

        // 触摸事件（移动端）
        document.ontouchstart = null;   // 解除手指按下事件
        document.ontouchmove = null;    // 解除手指滑动事件
        document.ontouchend = null;     // 解除手指释放事件
        document.ontouchcancel = null;  // 解除触摸取消事件

        // 滚动事件
        document.onscroll = null;       // 解除滚动事件

        // 拖放事件
        document.ondrag = null;         // 解除拖动事件
        document.ondragstart = null;    // 解除拖动开始事件
        document.ondragend = null;      // 解除拖动结束事件
        document.ondragenter = null;    // 解除拖动进入事件
        document.ondragleave = null;    // 解除拖动离开事件
        document.ondragover = null;     // 解除拖动悬浮事件
        document.ondrop = null;         // 解除拖放事件
        document.oncopy = null;         // 解除复制事件
        document.oncut = null;          // 解除剪切事件
        document.onpaste = null;        // 解除粘贴事件

        // 禁用用户选择样式（如禁用选中文字）
        document.body.style.userSelect = 'auto';

        document.title = '禁止鼠标右键已解除';

    }
    removeSelectionRestrictions();
})();