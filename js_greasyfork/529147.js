// ==UserScript==
// @name         漫画柜电脑转跳手机
// @namespace    https://viayoo.com/
// @version      1.1
// @description  识别到详情页，自动转跳手机版
// @author       丸子
// @run-at       document-end
// @match        *://www.manhuagui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529147/%E6%BC%AB%E7%94%BB%E6%9F%9C%E7%94%B5%E8%84%91%E8%BD%AC%E8%B7%B3%E6%89%8B%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/529147/%E6%BC%AB%E7%94%BB%E6%9F%9C%E7%94%B5%E8%84%91%E8%BD%AC%E8%B7%B3%E6%89%8B%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取所有 href 中包含 "/comic/" 的链接
    var anchors = document.querySelectorAll("a[href*='/comic/']");
    anchors.forEach(function(a) {
        if (a.href.includes("www.manhuagui.com")) {
            a.href = a.href.replace("www.manhuagui.com", "m.manhuagui.com");
        }
    });
})();