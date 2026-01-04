// ==UserScript==
// @name         自动删除说说.js
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  自动删除所有说说
// @author       Bi Zhen
// @match       http*://user.qzone.qq.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31701/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%AF%B4%E8%AF%B4js.user.js
// @updateURL https://update.greasyfork.org/scripts/31701/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%AF%B4%E8%AF%B4js.meta.js
// ==/UserScript==
'use strict';
setInterval(function(){
    var childIframeArr =document.getElementsByTagName('iframe'); 
    //alert(childIframeArr[0].contentWindow.document.getElementsByTagName("html")[0].className);//获取成功！
    var newDocument = childIframeArr[0].contentWindow.document;//获取iframe框架里的document

    var del1 = newDocument.getElementsByClassName("del del_btn author_display");
    var del2 = newDocument.getElementsByClassName("del del_btn author_display bg2");//有时候会出现这个,这里不做判断
    if(del1.length>0){
        del1[0].click();//获取删除界面
        var del_yes = document.getElementsByClassName("qz_dialog_layer_btn qz_dialog_layer_sub");
        if(del_yes.length>0){
            del_yes[0].click();
        }
    }else{
        var pages = newDocument.getElementsByClassName("mod_pagenav_main")[0];//获取页导航
        var nextId = pages.lastChild.id;//获取下一页id
        newDocument.getElementById(nextId).click();
    }


}, 800);
