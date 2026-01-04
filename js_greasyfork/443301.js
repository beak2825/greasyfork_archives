// ==UserScript==
// @name         法宣考试解除限制
// @namespace    http://www.faxuanyun.com/
// @version      0.1
// @description  解除法宣在线考试的复制拖放限制
// @author       You
// @match        http://*.faxuanyun.com/*
// @grant        none
// @license     xianzhi0520
// @downloadURL https://update.greasyfork.org/scripts/443301/%E6%B3%95%E5%AE%A3%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/443301/%E6%B3%95%E5%AE%A3%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onselectstart = document.onbeforecopy = document.oncontextmenu = document.onmousedown = document.onkeydown = function(){return true;};void(document.body.onmouseup=''); void(document.body.onselectstart=''); void(document.body.onmouseup=''); void(document.body.oncopy='');
    console.log('解除限制 start')
    // Your code here...
})();