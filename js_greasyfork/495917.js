// ==UserScript==
// @name         诺依阁-方正自动点击(湖北科技职业学院-教务管理系统评价)
// @namespace    http://tampermonkey.net/
// @version      2024-01-04
// @description  一个能自动评价的插件
// @author       nuoyis
// @match        *://*.210.42.171.165/*
// @icon         https://q.qlogo.cn/headimg_dl?dst_uin=914205978&spec=640&img_type=jpg
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @include      @
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495917/%E8%AF%BA%E4%BE%9D%E9%98%81-%E6%96%B9%E6%AD%A3%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%28%E6%B9%96%E5%8C%97%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2-%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BB%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495917/%E8%AF%BA%E4%BE%9D%E9%98%81-%E6%96%B9%E6%AD%A3%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%28%E6%B9%96%E5%8C%97%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2-%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BB%B7%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
    var len= parseInt((document.getElementsByClassName("alt").length))*2
    var i = 0
    for(i=2;i<=len+1;i++)
    {
        if(document.getElementById("DataGrid1__ctl"+i+"_JS2")){
         document.getElementById("DataGrid1__ctl"+i+"_JS2").selectedIndex = "1";
        }
        document.getElementById("DataGrid1__ctl"+i+"_JS1").selectedIndex = "1";
    }
    },6000);
})();