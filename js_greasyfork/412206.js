// ==UserScript==
// @name         豆瓣电影高分亮红 for PT
// @namespace    http://tampermonkey.net/
// @version      0.46
// @description  根据豆瓣、imdb分数高亮颜色
// @author       bimzcy
// @match        *://1ptba.com/*
// @match        *://audiences.me/*
// @match        *://carpt.net/*
// @match        *://cyanbug.net/*
// @match        *://dajiao.cyou/*
// @match        *://discfan.net/*
// @match        *://hdchina.org/*
// @match        *://hdfans.org/*
// @match        *://hdhome.org/*
// @match        *://hdmayi.com/*
// @match        *://hdsky.me/*
// @match        *://hdtime.org/*
// @match        *://hdvideo.one/*
// @match        *://kufei.org/*
// @match        *://leaves.red/*
// @match        *://piggo.me/*
// @match        *://pt.0ff.cc/*
// @match        *://ptchdbits.co/*
// @match        *://ptchina.org/*
// @match        *://pt.ecust.pp.ua/*
// @match        *://pterclub.com/*
// @match        *://pthome.net/*
// @match        *://pt.soulvoice.club/*
// @match        *://ptvicomo.net/*
// @match        *://rousi.zip/*
// @match        *://srvfi.top/*
// @match        *://totheglory.im/*
// @match        *://t.tosky.club/*
// @match        *://ubits.club/*
// @match        *://ultrahd.net/*
// @match        *://wintersakura.net/*
// @match        *://www.agsvpt.com/*
// @match        *://www.hdkyl.in/*
// @match        *://www.hddolby.com/*
// @match        *://www.hitpt.com/*
// @match        *://www.icc2022.com/*
// @match        *://www.okpt.net/*
// @match        *://www.qingwapt.com/*
// @match        *://www.tjupt.org/*
// @match        *://zmpt.cc/*
// @grant        GM_log
// @run-at document-end
// @supportURL https://greasyfork.org/zh-CN/scripts/412206-豆瓣电影高分亮红-for-pt
// @downloadURL https://update.greasyfork.org/scripts/412206/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%AB%98%E5%88%86%E4%BA%AE%E7%BA%A2%20for%20PT.user.js
// @updateURL https://update.greasyfork.org/scripts/412206/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%AB%98%E5%88%86%E4%BA%AE%E7%BA%A2%20for%20PT.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    try {
    console.log("start good movie");
    var douban_db = /douban\.com/
    var imdb_db = /imdb\.com/
    var douban = $(".embedded a").filter(function (link) { return douban_db.test($(this).attr("href")) });
    var imdb = $(".embedded a").filter(function (link) { return imdb_db.test($(this).attr("href")) });
    var chd = $("td[width='50'].embedded");
    var hdc = $("a.imdb");
    var hds = $("td[width='32'].embedded");
    var hdv = $("div[style='display: flex;align-content: center;justify-content: space-between;padding: 2px 0']");
    var pter = $("td[width='44px'].embedded a");
    var ttg = $("span.imdb_rate a");

    $(douban).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else if (score = "N/A");
        else if (score = 0);
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents("table.torrents tbody tr");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    $(imdb).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else if (score = "N/A");
        else if (score = 0);
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents("table.torrents tbody tr");
        p.find("b").css("color",color)
        p.css("color",color);
    });

    $(chd).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents(".torrentname");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    $(hdc).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents(".tbname");
        p.find("h3 a").css("color",color)
        p.find("h4").css("color",color)
        p.css("color",color);
    });
    $(hds).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else if (score = "N/A");
        else if (score = 0);
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents("td.rowfollow.progresstd");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    $(hdv).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else if (score = "N/A");
        else if (score = 0);
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents(".torrentname");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    $(pter).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else if (score = "N/A");
        else if (score = 0);
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents(".torrentname");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    $(ttg).each( function(){
        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=9) color = "red";
        else if (score >= 8) color = "brown";//"GoldenRod";
        else if (score >= 7) color = "purple";
        else if (score >= 6.5) color = "blue";
        else if (score >= 6) color ="black";
        else if (score >= 1) color ="gray";
        else color ="black";
        $el.css("font-size","10pt")
        $el.css("color", color);
        var p = $el.parents("td[align='left']");
        p.find("b").css("color",color)
        p.css("color",color);
    });


    } catch(e){
    GM_log(e)
    }
})(jQuery);