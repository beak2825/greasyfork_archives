// ==UserScript==
// @name         BTSCHOOL
// @namespace    digiprospector
// @version      0.1
// @description  只显示7天内的帖子,而且根据置顶分颜色高亮
// @author       digiprospector
// @match        https://pt.btschool.club/torrents.php*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411081/BTSCHOOL.user.js
// @updateURL https://update.greasyfork.org/scripts/411081/BTSCHOOL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //隐藏7天以上的帖子
    $("td.rowfollow.nowrap > span[title]").each(function(index, value){
        if (Date.now() - new Date($(this).attr("title")).getTime() > 7 * 24 * 60 * 60 * 1000)
        {
            $(this).parent().parent().hide();
        }
    });

    //修改置顶贴的颜色
    var top_color = "#9acd32";
    var sticky_color = "#ffa500";
    $("img.top0").each(function(index,value){
        $(this).parents().eq(2).css("background-color",top_color);
        $(this).parents().eq(5).css("background-color",top_color);
    });
    $("img.sticky").each(function(index,value){
        $(this).parents().eq(2).css("background-color",sticky_color);
        $(this).parents().eq(5).css("background-color",sticky_color);
    });
})();