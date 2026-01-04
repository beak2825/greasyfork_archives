// ==UserScript==
// @name         洛谷学术模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学术模式
// @author       LincW
// @match        https://www.luogu.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/467496/%E6%B4%9B%E8%B0%B7%E5%AD%A6%E6%9C%AF%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/467496/%E6%B4%9B%E8%B0%B7%E5%AD%A6%E6%9C%AF%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    //alert(document.getElementsByClassName("color-none")[4].innerHTML);
    if(document.getElementsByClassName("lg-right").length==5)
    {
        if(document.getElementsByClassName("lg-right")[1].firstChild.innerText=="灌水区")
        {
            document.getElementsByTagName("body")[0].innerHTML="<h1>???????<h1/>";
        }
        //document.getElementsByClassName("lg-right")[1].innerHTML='<a class="colored" href="https://www.baidu.com/s?ie=UTF-8&wd=%E8%AF%A5%E7%BD%91%E9%A1%B5%E5%B7%B2%E8%A2%AB%E9%98%BB%E6%AD%A2" target="_blank">已禁用</a>';
    }
    else if(document.getElementsByClassName("am-btn am-btn-primary am-btn-sm").length==5)
    {
        document.getElementsByClassName("am-btn am-btn-primary am-btn-sm")[3].innerHTML="已禁用";
        /*var usIDX=0;
        while(usIDX<5)
        {
            document.getElementsByClassName("am-btn am-btn-primary am-btn-sm")[usIDX].target="_blank";
            usIDX++;
        }*/
        if(document.getElementsByTagName("h1")[0].innerHTML=='讨论：灌水区' || document.getElementsByTagName("h1")[0].innerHTML=='灌水区')
        {
            document.getElementsByTagName("body")[0].innerHTML="<h1>???????<h1/>";
        }
    }
})();
