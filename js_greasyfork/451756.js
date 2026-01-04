// ==UserScript==
// @name         去除小战托福关注弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除小战托福在线TPO最新的几道题需要添加客服微信解锁的限制
// @author       xianfei
// @match        https://top.zhan.com/toefl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451756/%E5%8E%BB%E9%99%A4%E5%B0%8F%E6%88%98%E6%89%98%E7%A6%8F%E5%85%B3%E6%B3%A8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/451756/%E5%8E%BB%E9%99%A4%E5%B0%8F%E6%88%98%E6%89%98%E7%A6%8F%E5%85%B3%E6%B3%A8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{if(document.querySelector("body > div.model_mask"))document.querySelector("body > div.model_mask").remove()},100);
})();