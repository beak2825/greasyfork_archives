// ==UserScript==
// @name         煎蛋不受欢迎内容强力清洁剂
// @namespace    https://sunsetware.org/
// @version      0.1
// @description  淡化显示所有XX比OO多的用户生成内容。鼠标悬停可暂时恢复。
// @author       tjysunset
// @match        *://www.jandan.net/*
// @match        *://jandan.net/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34439/%E7%85%8E%E8%9B%8B%E4%B8%8D%E5%8F%97%E6%AC%A2%E8%BF%8E%E5%86%85%E5%AE%B9%E5%BC%BA%E5%8A%9B%E6%B8%85%E6%B4%81%E5%89%82.user.js
// @updateURL https://update.greasyfork.org/scripts/34439/%E7%85%8E%E8%9B%8B%E4%B8%8D%E5%8F%97%E6%AC%A2%E8%BF%8E%E5%86%85%E5%AE%B9%E5%BC%BA%E5%8A%9B%E6%B8%85%E6%B4%81%E5%89%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("<style type='text/css'> .userscript-unpopular { opacity: .1; transition: opacity .4s ease; -webkit-transition: opacity .4s ease; } .userscript-unpopular:hover { opacity: 1; } </style>").appendTo("head");

    $(".commentlist > li").each(function() {
        var likes = Number($(this).find(".tucao-like-container > span:first").text());
        var dislikes = Number($(this).find(".tucao-unlike-container > span:first").text());
        if (likes >= dislikes) return;
        $(this).find("div.text").addClass("userscript-unpopular");
    });
})();