// ==UserScript==
// @name         虫洞栈去除验证码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  虫洞栈(bugstack.cn)免微信关注公众号
// @author       li
// @match        https://bugstack.cn/*
// @run-at       document-start
// @grant        none
// @license Apache 2.0


// @downloadURL https://update.greasyfork.org/scripts/438101/%E8%99%AB%E6%B4%9E%E6%A0%88%E5%8E%BB%E9%99%A4%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/438101/%E8%99%AB%E6%B4%9E%E6%A0%88%E5%8E%BB%E9%99%A4%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.innerHTML+=`<style>
         #read-more-wrap
         {display: none !important}
         .theme-default-content
         { height:100% !important}
    </style>`

})();