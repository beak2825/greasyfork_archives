// ==UserScript==
// @name         PT站新标签页打开链接
// @namespace    https://greasyfork.org/zh-CN/scripts/381686
// @version      0.42
// @description  在TTG、HDSky等PT网站强制用新标签页打开部分链接
// @author       AngryEagle
// @match        *://totheglory.im/browse.php*
// @match        *://totheglory.im/t/*
// @match        *://hdsky.me/torrents.php*
// @match        *://hdsky.me/details.php*
// @match        *://hdhome.org/torrents.php*
// @match        *://hdhome.org/details.php*
// @match        *://pt.btschool.club/torrents.php*
// @match        *://pt.btschool.club/details.php*
// @match        *://pt.soulvoice.club/torrents.php*
// @match        *://pt.soulvoice.club/details.php*
// @match        *://www.pttime.org/torrents.php*
// @match        *://www.pttime.org/details.php*

// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381686/PT%E7%AB%99%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/381686/PT%E7%AB%99%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function(){
    switch(window.location.hostname){
        case "totheglory.im":
            $(".hover_hr  a").attr("target","_blank");
            $("#kt_d a").attr("target","_blank");
            break;
        case "hdsky.me":
            $(".progresstr a").attr("target","_blank");
            $("#kdescr a").attr("target","_blank");
            break;
        case "hdhome.org":
            $(".sticky_top a,.torrentname a").attr("target","_blank");
            $("#kdescr,#kothercopy a").attr("target","_blank");
            break;
        case "pt.btschool.club":
            $(".torrentname a").attr("target","_blank");
            $("#kdescr,#kothercopy a").attr("target","_blank");
            break;
        case "pt.soulvoice.club":
            $(".torrentname a").attr("target","_blank");
            $("#kdescr,#kothercopy a").attr("target","_blank");
            break;
        case "www.pttime.org":
            $(".torrentname a").attr("target","_blank");
            $("#kdescr,#kothercopy a").attr("target","_blank");
            break;
    }

})();