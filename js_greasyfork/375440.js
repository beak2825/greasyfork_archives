// ==UserScript==
// @name         V2EX链接移除楼层标签锚
// @namespace    http://zhangbohun.github.io/
// @version      0.3
// @description  V2EX链接移除楼层标签锚（避免干扰判断是否已经加入收藏夹）
// @author       zhangbohun
// @match        *://*.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375440/V2EX%E9%93%BE%E6%8E%A5%E7%A7%BB%E9%99%A4%E6%A5%BC%E5%B1%82%E6%A0%87%E7%AD%BE%E9%94%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/375440/V2EX%E9%93%BE%E6%8E%A5%E7%A7%BB%E9%99%A4%E6%A5%BC%E5%B1%82%E6%A0%87%E7%AD%BE%E9%94%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.querySelectorAll('a').forEach(function (element) {
        if (element.href.indexOf('v2ex.com/t/') != -1) {
            element.href = element.href.split('#reply')[0]
        }
    });
})();