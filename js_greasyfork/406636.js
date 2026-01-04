// ==UserScript==
// @name         洛谷广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽洛谷的广告
// @author       songhongyi
// @match        https://www.luogu.com.cn/problem/*
// @match        https://www.luogu.com.cn/contest/*
// @match        https://www.luogu.com.cn/training/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/406636/%E6%B4%9B%E8%B0%B7%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/406636/%E6%B4%9B%E8%B0%B7%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var document=unsafeWindow.document;
    window.onload=function(){setTimeout(function()
    {
        document.querySelector("div[data-v-0a593618]").remove();
        console.log("广告已经消除");
    },500)}
    // Your code here...
})();