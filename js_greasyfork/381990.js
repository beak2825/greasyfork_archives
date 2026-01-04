// ==UserScript==
// @name         CSDN阅读优化+广告去除
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  CSDN页面太乱太杂，这个脚本去掉CSDN左右两栏广告，让页面自由展开，优化阅读体验。并且去掉所有的广告，清理剪切板。
// @author       Huangfu
// @include      https://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381990/CSDN%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96%2B%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/381990/CSDN%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96%2B%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

//去掉csdn广告的一个脚本
(function() {
    'use strict';
    function remove(add){
        try{
            add.parentNode.removeChild(add);
        }catch(e){
            console.log(e);
        }
    }
    //移除左栏
    var tag = document.getElementsByTagName("aside");
    remove(tag[0]);
    //移除右两栏
    var recommend_right = document.getElementsByClassName("recommend-right");
    remove(recommend_right[0]);
    //设置主窗口适应宽高
    var main = document.getElementsByTagName("main");
    main = main[0]; main.style = "width : 90vw !important; position: absolute;left: 5vw;";
    //去掉底下的广告
    var btn_add = document.getElementsByClassName("mediav_ad");
    while(btn_add.length!=0){
        remove(btn_add[0]);
    }
    //去掉工具栏
    var bottonbar = document.getElementsByClassName("tool-box");
    remove(bottonbar[0]);
    var floatbar = document.getElementsByClassName("meau-gotop-box");
    remove(floatbar[0]);
    //去掉底下能去的广告
    var adds = document.getElementsByClassName("recommend-ad-box");
    while (adds.length!=0){
        remove(adds[0]);
    }
    //没登陆的时候底下有登陆广告，去掉
    var btn_bar = document.getElementsByClassName("pulllog-box");
    remove(btn_bar[0]);
    //展开阅读更多
    var btn = document.getElementsByClassName("btn-readmore")[0];
    if(btn!=undefined) btn.click();
    //去掉粘贴时的推广信息
    csdn.copyright.init("","");
    //当有推荐栏时，去掉只有登陆才能展开
    

})();