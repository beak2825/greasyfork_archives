// ==UserScript==
// @name         知乎去除登录窗，问题自动展开
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/question/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419092/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E7%AA%97%EF%BC%8C%E9%97%AE%E9%A2%98%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/419092/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E7%AA%97%EF%BC%8C%E9%97%AE%E9%A2%98%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    var i = 10;
    var timer = setInterval(function (){
       var btn = document.querySelector(".Zi--Close");
       if(btn){
           btn.dispatchEvent(e);
       }
        if(i--){
           clearInterval(timer);
       }

    },500);
    var timer1 = setInterval(function (){
       var btn1 = document.querySelector(".ContentItem-expandButton");
       if(btn1){
           btn1.dispatchEvent(e);
           //clearInterval(timer1);
       }

    },500);

    // Your code here...
})();