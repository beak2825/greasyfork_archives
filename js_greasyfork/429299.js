// ==UserScript==
// @name         Gitee宽屏展示
// @namespace    http://www.5jianzhan.com/
// @version      0.2
// @description  为了可以展示更多的代码,不浪费页面空间,几行代码实现了页面宽屏效果
// @author       ITLDG
// @match        https://gitee.com/*
// @namespace    https://greasyfork.org/scripts/429299
// @icon         https://assets.gitee.com/assets/favicon-9007bd527d8a7851c8330e783151df58.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429299/Gitee%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429299/Gitee%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".ui.container").css("width","unset");
    let width=$(".ui.container").width();
    //console.log('width',width)
    if(width>1400)
    {

       if($(".ui.container").width()>1600)
       {
           $(".dashboard-content__show").css("cssText","width:1280px!important;")
       }else
       {
           $(".dashboard-content__show").css("cssText","width:880px!important;")
       }
    }
})();