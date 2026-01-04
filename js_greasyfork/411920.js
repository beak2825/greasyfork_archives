// ==UserScript==
// @name         imdb电影高分亮红 for PT
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  根据 imdb 分数高亮颜色
// @author       piekei
// @match        *://pt.m-team.cc/*
// @match        *://www.hddolby.com/*
// @match        *://hdsky.me/*
// @match        *://springsunday.net/*
// @match        *://leaguehd.com/*
// @match        *://pthome.net/*
// @match        *://pterclub.com/*
// @match        *://hdhome.org/*
// @match        *://www.tjupt.org/*
// @grant        GM_log
// @run-at document-end
// @supportURL https://greasyfork.org/zh-CN/scripts/411920-imdb电影评分高亮-for-PT
// @downloadURL https://update.greasyfork.org/scripts/411920/imdb%E7%94%B5%E5%BD%B1%E9%AB%98%E5%88%86%E4%BA%AE%E7%BA%A2%20for%20PT.user.js
// @updateURL https://update.greasyfork.org/scripts/411920/imdb%E7%94%B5%E5%BD%B1%E9%AB%98%E5%88%86%E4%BA%AE%E7%BA%A2%20for%20PT.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    try {
    console.log("start good movie");
    var douban_db = /douban\.com/
    var imdb_db = /imdb\.com/
    var anidb_db = /anidb\.net/
    var links = $(".embedded a").filter(function (link) { return douban_db.test($(this).attr("href")) });
    GM_log( "find "+links.length+" links");
    $(links).each( function(){

        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "purple";//"GoldenRod";
//        else if (score >= 8.7) color = "GoldenRod";
//        else if (score >= 7.5) color = "blue";
//        else if (score >= 7) color ="green";
        else if (score >= 5) color ="black";
        else if (score >=1)color ="gray";
//        else if (score >=1)color ="silver";
        else color ="black";

        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents(".torrentname");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    var links2 = $(".embedded a").filter(function (link) { return imdb_db.test($(this).attr("href")) });
    GM_log( "find "+links.length+" links");
    $(links2).each( function(){

        var $el = $(this);
        var score = $el.text()
        var color;
        var font_size;
        if(score>=9) color = "red";
        else if (score >= 8.0) color = "purple";
//        else if (score >= 8.4) color = "GoldenRod";
//        else if (score >= 8) color = "blue";
//        else if (score >= 7.5) color ="green";
        else if (score >= 5) color ="black";
        else if (score >=1)color ="gray";
//        else if (score >=1)color ="silver";
        else color ="black";

        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents(".torrentname");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    var links3 = $(".embedded a").filter(function (link) { return anidb_db.test($(this).attr("href")) });
    GM_log( "find "+links.length+" links");
    $(links3).each( function(){

        var $el = $(this);
        var score = $el.text()
        var color;
        var font_size;
        if(score>=9) color = "red";
        else if (score >= 8.0) color = "purple";
//        else if (score >= 8.4) color = "GoldenRod";
//        else if (score >= 8) color = "blue";
//        else if (score >= 7.5) color ="green";
        else if (score >= 5) color ="black";
        else if (score >=1)color ="gray";
//        else if (score >=1)color ="silver";
        else color ="black";

        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents(".torrentname");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    } catch(e){
    GM_log(e)
    }
})(jQuery);