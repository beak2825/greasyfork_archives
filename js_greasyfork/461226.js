// ==UserScript==
// @name         格式化36kr网站，非常清爽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to make 36kr to simple,2023年3月12日09:44:02
// @author       oixqiu oixq@qq.com
// @match        https://www.36kr.com/*
// @icon         https://www.google.com/s2/favicons?domain=36kr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461226/%E6%A0%BC%E5%BC%8F%E5%8C%9636kr%E7%BD%91%E7%AB%99%EF%BC%8C%E9%9D%9E%E5%B8%B8%E6%B8%85%E7%88%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/461226/%E6%A0%BC%E5%BC%8F%E5%8C%9636kr%E7%BD%91%E7%AB%99%EF%BC%8C%E9%9D%9E%E5%B8%B8%E6%B8%85%E7%88%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    //oixqiu edit 2023年3月5日19:32:27
    //oixq@qq.com
    //引入jquery
    let script = document.createElement('script');
    script.setAttribute('src',"https://code.jquery.com/jquery-3.6.3.slim.js");
    document.body.appendChild(script);
    //十秒钟执行一次格式定型
    window.setInterval(function(){

        $(".article-item-pic-wrapper").remove();
        $(".article-item-description").remove();
        $(".kr-flow-bar").remove();
        $(".article-item-info").css("width","100%");
        $(".information-flow-item").css("height","30px");
        $(".article-item-info").css("height","30px");
        $(".information-flow-item").css("margin-bottom","0");
        $(".kr-shadow-content").css("height","30px");
        $(".kr-shadow-wrapper-card").css("height","30px");
        $(".kr-shadow-wrapper").css("height","30px");
        $(".kr-flow-article-item").css("height","30px");


        //2023年3月12日09:44:30删除右侧，左边宽度扩展到100%
        $(".kr-information-right").remove();
        $(".kr-information-left").css("width","100%");

    },10000);


})();