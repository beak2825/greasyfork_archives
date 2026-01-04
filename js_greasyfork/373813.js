// ==UserScript==
// @name         智慧树网取消禁用复制-无广告精简版

// @description         智慧树网取消禁用右键禁用菜单与复制功能
// @description:zh-TW   智慧樹網取消禁用右鍵禁用菜單與複製功能
// @description:zh-CN   智慧树网取消禁用右键禁用菜单与复制功能

// @namespace    http://tampermonkey.net/
// @author       Nyaasu
// @include      *://exam.zhihuishu.com/*
// @version      0.3
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373813/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E5%8F%96%E6%B6%88%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6-%E6%97%A0%E5%B9%BF%E5%91%8A%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/373813/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E5%8F%96%E6%B6%88%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6-%E6%97%A0%E5%B9%BF%E5%91%8A%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 取消禁用右键菜单
    document.oncontextmenu = function(){
        event.returnValue = true;
    };
    // 取消禁用选中功能
    document.onselectstart = function(){
        event.returnValue = true;
    };
})();