// ==UserScript==
// @name         让奈菲影视界面变的清爽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  想学习油猴脚本，可惜水平太差，问了大佬直接几行代码解决
// @author       aJian
// @match        *.nfmovies.com/*
// @icon         https://www.nfmovies.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/432578/%E8%AE%A9%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E7%95%8C%E9%9D%A2%E5%8F%98%E7%9A%84%E6%B8%85%E7%88%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/432578/%E8%AE%A9%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E7%95%8C%E9%9D%A2%E5%8F%98%E7%9A%84%E6%B8%85%E7%88%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //等待整个window加载完成后再执行下边内容
    window.onload=function(){
        //调用Jquery选择器隐藏
        if(window.document.domain.indexOf('nfmovies.com')!=-1)//只对nfmovies域名下的页面进行广告清理
        {
            $("div.myui-ra-container.container").hide();//隐藏中间靠上的提示信息
            $("*[onclick^='openurl(']").parent().hide();//隐藏两侧以及中间广告
            $(".btnclose").parent().hide();//隐藏右下角广告
            $(".myui-topbg").height(190);//紫色背景高度调整，使分类、主演等文字可以看的清楚

        }
    };
})();