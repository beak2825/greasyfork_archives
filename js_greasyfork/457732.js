// ==UserScript==
// @name         禁用原始人OJ编程平台动态背景
// @namespace    http://codezhangborui.eu.org
// @version      0.2
// @description  禁用原始人OJ编程平台动态背景 | Disable ZhaGoodWell Dynamic Background
// @author       CodeZhangBorui
// @match        http://class.zhagoodwell.com/*
// @icon         http://class.zhagoodwell.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457732/%E7%A6%81%E7%94%A8%E5%8E%9F%E5%A7%8B%E4%BA%BAOJ%E7%BC%96%E7%A8%8B%E5%B9%B3%E5%8F%B0%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/457732/%E7%A6%81%E7%94%A8%E5%8E%9F%E5%A7%8B%E4%BA%BAOJ%E7%BC%96%E7%A8%8B%E5%B9%B3%E5%8F%B0%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dbobj = document.getElementsByTagName('canvas')
    for(let i = 0; i < dbobj.length; i++) {
        if(dbobj[i].id.indexOf('c_n') != -1) dbobj[i].remove();
    }
})();