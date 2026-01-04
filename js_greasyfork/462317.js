// ==UserScript==
// @name         知乎网站样式优化（增加摸鱼友好性）
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  修改样式，个人偏好内容栏靠右，隐藏所有图片，适合不适宜目光总是左撇到电脑最左边且不想看到图片的打工人
// @author       fxalll
// @match        https://www.zhihu.com/*
// @match        https://www2.zhihu.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://www.zhihu.com/search*
// @match        https://www.zhihu.com/collection/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      GPL-3.0 License
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/462317/%E7%9F%A5%E4%B9%8E%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%8A%A0%E6%91%B8%E9%B1%BC%E5%8F%8B%E5%A5%BD%E6%80%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/462317/%E7%9F%A5%E4%B9%8E%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%8A%A0%E6%91%B8%E9%B1%BC%E5%8F%8B%E5%A5%BD%E6%80%A7%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("body").style.color = "#848e9e"
    setInterval(()=>{
        document.querySelectorAll(".ContentItem-title").forEach((e)=>{e.style.color = "#848e9e"})
    },1000)
    document.querySelector('.Topstory-container').style.flexDirection="row-reverse"
    document.querySelector('.Topstory-content').style.marginLeft='50px'
    document.querySelector('.Topstory-content').style.marginRight='30px'
    document.querySelector('.css-1qyytj7').style.marginLeft='50px'

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




})();