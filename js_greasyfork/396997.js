// ==UserScript==
// @name         奥鹏网络学习课程自动点击程序
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       张绍渔
// @match        http://media4.open.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396997/%E5%A5%A5%E9%B9%8F%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/396997/%E5%A5%A5%E9%B9%8F%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setTimeout(function(){
        var as=window.frames["left"].document.getElementsByTagName("a");
        var a_len=as.length;
        setInterval(function(){
            as[Math.floor(Math.random() * ( a_len- 0+1)) + 0].click()
        },"150000")
    },"2000");

})();