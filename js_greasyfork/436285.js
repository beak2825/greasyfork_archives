// ==UserScript==
// @name         在谷歌学术中搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在右键菜单中添加"在谷歌学术中搜索" Add "Search in Google Scholar" in right-click menu.
// @author       https://github.com/barryZZJ/
// @icon         https://scholar.google.com/favicon.ico
// @include      http*://*
// @grant        GM_openInTab
// @run-at       context-menu
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/436285/%E5%9C%A8%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E4%B8%AD%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/436285/%E5%9C%A8%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E4%B8%AD%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取选中部分
    var userSelection, text;
    if (window.getSelection) {
        //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) {
        //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (!(text = userSelection.text)) {
        text = userSelection.toString();
    }
    console.log(text);
    if (text)
        GM_openInTab("https://scholar.google.com/scholar?q="+text, {active:true});
})();