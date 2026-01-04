// ==UserScript==
// @name         知乎屏蔽登录框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎屏蔽登录框.现在知乎登录框还不能关闭了，牛逼了！所以只好屏蔽！
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417151/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/417151/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    function del(){
        i++;
        if(i>10){
            console.log("超时退出");
            return;
        }
        if(document.getElementsByClassName('Modal-enter-done').length>0){
            document.getElementsByClassName('Modal-enter-done')[0].innerHTML="";
            document.getElementsByTagName("html")[0].style="";
            document.getElementsByClassName("Modal-enter-done")[0].className=""
            console.log("屏蔽成功退出");
            return;
        }
        setTimeout(del,800);

    }
    setTimeout(del,1000);
})();