// ==UserScript==
// @name         CSDN辅助脚本
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  装好就行了不行就自己调参数
// @author       海绵宝宝
// @match        http*://blog.csdn.net/*
// @require      http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375215/CSDN%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/375215/CSDN%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        setTimeout(function(){
            fuck_csdn(); 
        }, 1500);
    });
    var evencall=[    
        {"t1":function(){document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0].remove();}},//左边广告上
        {"t1":function(){document.getElementsByClassName("pulllog-box")[0].remove();}},//登录干掉
        {"t1":function(){document.getElementById("btn-readmore").click();}},//我点我自己
        {"t1":function(){document.getElementById("asideFooter").remove();}},//我删我自己
        {"t1":function(){document.getElementById("dmp_ad_58").remove();}},//我删我自己
        {"t1":function(){$('div[class*="recommend-ad-box"]').map(function(a,b){b.remove();});}},//删除夹层广告
        {"t1":function(){$('div[class*="type_hot_word"]').map(function(a,b){b.remove();});}},//删除夹层热词推荐
        {"t1":function(){$('div[class*="recommend-download-box"]').map(function(a,b){b.remove();});}},//删除夹层推荐下载
        {"t1":function(){$('div[class*="blog-expert-recommend-box"]').map(function(a,b){b.remove();});}},//推荐关注这个也删了吧
        {"t1":function(){$("div[id^='_']").map(function(a,b){b.remove()});}}//删除iframeg广告
        //{"t1":function(){$("body").css("background-image",'url("https://cn.bing.com/az/hprichbg/rb/CurlingBonspiel_ZH-CN6638213482_1920x1080.jpg")');}}//设置我们的样式
    ];
    function addLink(e) {
        e.preventDefault();
        var pagelink = '\nRead more: ' + document.location.href,
            copytext = window.getSelection();
        var clipdata = e.clipboardData || window.clipboardData;
        if (clipdata) {
            clipdata.setData('Text', copytext);
        }
    }
    function fuck_csdn()
    {
        for(var i=0;i<evencall.length;i++)
        {
            try{
                evencall[i]["t1"]();
            }catch(err){}
        }
        document.addEventListener('copy', addLink);
        console.log("海绵出品");
    }
})();