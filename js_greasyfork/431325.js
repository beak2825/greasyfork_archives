// ==UserScript==
// @name         ConfluenceAutoTools4Story
// @namespace    http://www.akuvox.com/
// @version      1.6
// @description  take on the world!
// @author       andy.wang
// @match        http://192.168.77.188:9069/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/431325/ConfluenceAutoTools4Story.user.js
// @updateURL https://update.greasyfork.org/scripts/431325/ConfluenceAutoTools4Story.meta.js
// ==/UserScript==


(function() {
    //主函数开始
    //创建button
    console.log("ConfluenceAutoTools4EMB")
    autoCloseNoticeBefore();

    //自己的方法
    function autoCloseNoticeBefore(){
        var obj = document.getElementById("aui-flag-container");
        //console.log(obj)
        obj.remove();
    }

    function autoCloseNotice(){
        var obj = document.getElementById("aui-flag-container");
       // console.log(obj)
        obj.remove();
    }

    if (navigator.userAgent.indexOf('Firefox') >= 0) {
        //firefox 不支持 window.onload 直接调用函数
        autoCloseNotice();
    } else {
           window.onload = autoCloseNotice;

    }
})();