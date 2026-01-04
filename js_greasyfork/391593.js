// ==UserScript==
// @name         mteam good movie
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  mteam 电影板块, 根据 imdb 分数高亮颜色
// @author       Sean
// @match        https://pt.m-team.cc/*
// @grant        GM_log
// @run-at document-end
// @supportURL https://greasyfork.org/en/scripts/391593-mteam-good-movie
// @downloadURL https://update.greasyfork.org/scripts/391593/mteam%20good%20movie.user.js
// @updateURL https://update.greasyfork.org/scripts/391593/mteam%20good%20movie.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    try {
    console.log("start good movie");
    var imdb_test = /imdb\.com/
    var links = $(".embedded a").filter(function (link) { return imdb_test.test($(this).attr("href")) });
    GM_log( "find "+links.length+" links");
    $(links).each( function(){

        var $el = $(this);
        var score = $el.text()
        var color;
        if(score>=8) color = "red";
        else if (score >= 7) color = "green";//"GoldenRod";
        else if (score >= 6) color ="black";
        else color ="gray";


        $el.css("font-size","12pt")
        $el.css("color", color);
        var p = $el.parents(".torrentname");
        p.find("b").css("color",color)
        p.css("color",color);
    });
    } catch(e){
    GM_log(e)
    }

})(jQuery);