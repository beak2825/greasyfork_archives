// ==UserScript==
// @name         V3 Repair
// @namespace    https://fang.blog.miri.site/
// @version      0.1
// @description  修复 MCBBS V3 模板的一些小 bug
// @author       Mr_Fang
// @match        https://www.mcbbs.net/*
// @icon         https://s2.ax1x.com/2020/02/25/3twNzq.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429071/V3%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/429071/V3%20Repair.meta.js
// ==/UserScript==

(function() {
    var filename = window.location.href.split("/").slice(window.location.href.split("/").length - 1,window.location.href.split("/").length).toString(String).split(".")[0];
    var filetype = window.location.href.split("/").slice(window.location.href.split("/").length - 1,window.location.href.split("/").length).toString(String).split(".")[1].split("?")[0];
    var parameter = window.location.href.split("/").slice(window.location.href.split("/").length - 1,window.location.href.split("/").length).toString(String).split(".")[1].split("?")[1];
    function GetQueryValue(queryName) {
        var query = decodeURI(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == queryName) { return pair[1]; }
        }
        return null;
    }
    var p = filename.split("-");

    // 修复翻页
    if(p[0] == 'forum' && filetype == 'html'){
        // p0是forum，p1是版块名，p2是当前页码
        jq('a[class="page-switch-btn"]').attr('onclick',"window.location.href='"+p[0]+"-"+p[1]+"-"+"'+jq(this).attr('data-page')+'.html'");
    }else if(p[0] == 'thread' && filetype == 'html'){
        // p0是thread，p1是tid，p2是当前页码
        jq('a[class="page-switch-btn"]').attr('onclick',"window.location.href='"+p[0]+"-"+p[1]+"-"+"'+jq(this).attr('data-page')+'-1.html'");
    }

    // 在菜单里加上签到页的按钮
    jq('ul#usertools_menu').prepend('<li><a href="plugin.php?id=dc_signin">签到</a></li>');

    // new=no 时记住当前页
    if(parameter == undefined){
        jq('a[href="/?new=no"]').attr("href",window.location.href.split("#lastpost")[0] + "?new=no");
    }else if(parameter != undefined){
        jq('a[href="/?new=no"]').attr("href",window.location.href.split("#lastpost")[0] + "&new=no");
    }
})();