// ==UserScript==
// @name  新华三学习平台
// @namespace  http://tampermonkey.net/
// @version  22.08.15
// @description  解决鼠标移出学习暂停问题
// @author  hanzhi
// @license  hanzhi
// @match  https://learning.h3c.com/volbeacon/study/activity/*
// @include  https://learning.h3c.com/volbeacon/study/activity/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/449598/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/449598/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
    Func1(function pausePrompt() {
       });
    Func2(function stopInterval() {
        	isClearInterval = false;
        	clearInterval(vLooper);
        	clearInterval(vChange);
        	pausePrompt();
        });
}
    stopPlayer=null
    setInterval(document.getElementById("Button__Tabs-notes__Tab_notes__my").click(),2000)
})(1000);