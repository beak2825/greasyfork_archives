// ==UserScript==
// @name         Anyway 主题切换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Anyway 主题免费切换
// @author       frank-xjh
// @match        https://anyway.fm/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381818/Anyway%20%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/381818/Anyway%20%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        var themeCss="<link rel=\"stylesheet\" href=\"https:\/\/s.anw.red\/anyway.fm\/theme.min.css\">"
        $("head").append(themeCss);
        var theme = getCookie("theme");
        if (theme != "")
        {
            $("body").removeClass("theme-default");
            $("body").addClass("theme-"+theme);
        }

        var btn="<li class=\"nav-label\"><span>主题切换（点击后请刷新）<\/span><\/li><span class=\"theme-preview-dark\"><a onclick=\"setCookie('theme','dark');\">有一点点黑<\/a><\/span><span class=\"theme-preview-eightbit\"><a onclick=\"setCookie('theme','eightbit');\">八比特复古<\/a><\/span><span class=\"theme-preview-hub\"><a onclick=\"setCookie('theme','hub');\">破嗯哈勃黄<\/a><\/span><span class=\"theme-preview-paper\"><a onclick=\"setCookie('theme','paper');\">一张旧报纸<\/a><\/span><span class=\"theme-preview-graphite\"><a onclick=\"setCookie('theme','graphite');\">平淡无奇素<\/a><\/span><span class=\"theme-preview-default\"><a onclick=\"setCookie('theme','default');\">默认红配金<\/a><\/span>";
        $("div.nav").children("ul").children().eq(12).after(btn);
    });
    function setCookie(cname,cvalue){
        document.cookie = cname+"="+cvalue+";";
    }
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    }
})();