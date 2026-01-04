// ==UserScript==
// @name         拼多多商家后台弹窗通知移除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拼多多商家后台，弹窗通知移除。
// @author       You
// @match        https://mms.pinduoduo.com/*
// @grant        none
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/394806/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%BC%B9%E7%AA%97%E9%80%9A%E7%9F%A5%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/394806/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%BC%B9%E7%AA%97%E9%80%9A%E7%9F%A5%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        let a = document.querySelector("#umd_kits_message_box");
        //let b = document.querySelector("#umd_kits_PDD_chick");
        let c = document.querySelector("#umd_kits_feedback_icon");
        if(a)a.hidden = true;
        //if(b)b.hidden = true;
        if(c)c.hidden = true;
    },2000)
    // Your code here...
})();