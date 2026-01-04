// ==UserScript==
// @name         贴吧手机页面跳转正常页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  瞎写的一个代码，主要是遇到了网页搜东西的时候贴吧有时候显示的手机页面挺烦的
// @author       Qyii
// @match        https://tieba.baidu.com/mo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425722/%E8%B4%B4%E5%90%A7%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E6%AD%A3%E5%B8%B8%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/425722/%E8%B4%B4%E5%90%A7%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E6%AD%A3%E5%B8%B8%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

    location.href = "https://tieba.baidu.com/p/"+ getQueryVariable("tid")
})();