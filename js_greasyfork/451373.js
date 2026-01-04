// ==UserScript==
// @name         金山文档定时更新
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  默认60
// @author       You
// @match        https://www.kdocs.cn/l/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kdocs.cn
// @grant        none
// @require    https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451373/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E5%AE%9A%E6%97%B6%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/451373/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E5%AE%9A%E6%97%B6%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    var time = 60;//秒数
    //msg
    console.error("加载自动更新引用程序成功！更新频率:",time,"秒");
    function active(fn,tm){
        if(!fn){
            return false;
        }
        var next = active;
        setTimeout(function(){
            fn();
            next();
        },tm||300);
        return next;
    }
    //定时执行
    var i = 0;
    function all(){
        active(()=>{
            //1.公式
            $("#FormulaTab").click();
        },300)(()=>{
            //2.跨表格引用
            $(".et-cmb-bar-wrap i.icons-16-func_books_data").parent().click();
        },300)(()=>{
            //3.更新引用
           $(".component-dropdown-popup .dropdown-panel-content div.update").click();
        },1000)(()=>{
            //4.重新计算
           //$(".cmb-tab-wrap:not(.hidden) i.icons-16-et_recalculate").click();
        },1000)(()=>{
            i++;
            console.error("已自动更新引用:",i,"次");
            all();
        },time*1000);
    }
    //active
    all();

})();