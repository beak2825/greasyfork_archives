// ==UserScript==
// @name		淘宝自动勾选匿名购买
// @description	自动勾选匿名购买 
// @namespace    erwrwewrfsfs
// @include     https://buy.taobao.com/auction/*
// @author			lee2099
// @version     2016.12.19
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25769/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%8C%BF%E5%90%8D%E8%B4%AD%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/25769/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%8C%BF%E5%90%8D%E8%B4%AD%E4%B9%B0.meta.js
// ==/UserScript==




var thefunid=setInterval(function (){
    if (document.body.innerHTML.indexOf("匿名购买")) {
        if ( document.getElementById("anonymous_1").getElementsByClassName("toggle-checkbox")[0].checked === false ){
            document.getElementById("anonymous_1").getElementsByClassName("toggle-checkbox")[0].click();
        }
        clearInterval(thefunid);
    }
},1000);