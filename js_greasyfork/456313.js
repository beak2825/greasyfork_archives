// ==UserScript==
// @name               简书文章阅读模式
// @namespace        https://tampermonkey.net/
// @version             0.1
// @description       使简书文章具有宽屏的阅读体验
// @author             Cyrus
// @homepage         https://github.com/cyrus-lin/jianshu-readmode
// @match              https://www.jianshu.com/p/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/456313/%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/456313/%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.hostname == "www.jianshu.com" && location.pathname.startsWith("/p/")) {
        document.querySelector("._2OwGUo").remove();                   // 移除右边栏目
        document.querySelector("._2xr8G8").parentNode.remove();    // 移除 footer
        document.querySelector("._3Pnjry").remove();                      // 移除左边的浮动按钮
        document.querySelector("._3VRLsv").setAttribute("style", "margin-left:0px;margin-right:0px;width:95%");  // 扩大正文区域
        document.querySelector("._gp-ck").setAttribute("style", "width:100%");
    }
})();