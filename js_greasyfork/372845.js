// ==UserScript==
// @name         百度Material Design美化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  百度搜索结果页面 Material Design 美化，并去除侧边栏及广告
// @author       千羽千鹤
// @match        https://www.baidu.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/372845/%E7%99%BE%E5%BA%A6Material%20Design%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/372845/%E7%99%BE%E5%BA%A6Material%20Design%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
function change() {      
    $("#content_left > div").not(".c-container").remove();
    $("#content_right").remove();
    $(".c-container").css("box-shadow","0 2px 2px 0 rgba(0,0,0,.14)");
    $(".c-container").css("padding","16px");
    $(".c-container").css("border-radius","2px"); 
    $("#page > a").css("border-radius","3px");
    $("#page > .n").css("color","#ffffff");
    $("#page > .n").css("background","#3385ff");
    $(".c-container .m:contains('广告')").parent().parent().remove();
}
change();
var ref = "";
ref = setInterval(function(){
    change();
},1000);