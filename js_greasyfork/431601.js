// ==UserScript==
// @name         知乎上班摸鱼隐藏标题和图片
// @namespace    http://zhihu.com
// @version      1.3
// @description  隐藏图片和标题
// @author       youchao
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/431601/%E7%9F%A5%E4%B9%8E%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/431601/%E7%9F%A5%E4%B9%8E%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==



(function () {
    var imgHiden = function() {
        $(".RichContent-cover-inner").each(function(){
            $(this).hide();
        });
        $(".ZVideoRecommendationItem-thumbnailImage").each(function(){
            $(this).hide();
        });
        $(".QuestionHeader-title").each(function(){
            $(this).hide();
        });
        $("iframee").each(function(){
            $(this).hide();
        });
        $("img").each(function(){
            $(this).hide();
        });
        $("svg").each(function(){
            $(this).hide();
        });
    };
    imgHiden();
    var id = setInterval(function(){
        imgHiden();
    }, 300)
    })()