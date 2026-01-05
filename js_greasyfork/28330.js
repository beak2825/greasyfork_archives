// ==UserScript==
// @name         虎扑论坛新标签
// @namespace    weiainijiujiu@126.com
// @version      0.4
// @description  虎扑论坛打开新标签页
// @author       wangjojo
// @match        https://bbs.hupu.com/*
// @grant        none
// @note         修改失效bug
// @downloadURL https://update.greasyfork.org/scripts/28330/%E8%99%8E%E6%89%91%E8%AE%BA%E5%9D%9B%E6%96%B0%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/28330/%E8%99%8E%E6%89%91%E8%AE%BA%E5%9D%9B%E6%96%B0%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    (document.querySelectorAll(".titlelink > a")||[]).forEach(function(item){
        item.setAttribute("target","_blank");
    });
})();