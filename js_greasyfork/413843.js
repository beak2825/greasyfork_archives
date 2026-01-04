// ==UserScript==
// @name        缓慢看大家的帖子 v2ex.com 
// @namespace   Violentmonkey Scripts
// @match       https://www.v2ex.com/t/*
// @grant       none
// @version     1.0
// @author      -
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @description 2020/10/20 上午11:17:34 1,看ID过去发的主题（隐藏的看不到）2,看是否在线
// @downloadURL https://update.greasyfork.org/scripts/413843/%E7%BC%93%E6%85%A2%E7%9C%8B%E5%A4%A7%E5%AE%B6%E7%9A%84%E5%B8%96%E5%AD%90%20v2excom.user.js
// @updateURL https://update.greasyfork.org/scripts/413843/%E7%BC%93%E6%85%A2%E7%9C%8B%E5%A4%A7%E5%AE%B6%E7%9A%84%E5%B8%96%E5%AD%90%20v2excom.meta.js
// ==/UserScript==
(function() {
    'use strict';
      jQuery.noConflict();
    (function ($) {
    //你的代码
})(jQuery);
    // Your code here...
        var temptbodys = $("<tbody><td><\/td><td><\/td><td name='td1' style='position:relative;left:50px;'><\/td><\/tbody>");
        var tables = $("div.cell[id] > table[cellpadding][cellspacing][border]");
        tables.append(temptbodys);
        var tempindex = 0;
        var onetable;
        var seti = setInterval(function () {
            if (tempindex > tables.length - 1) {
                console.log("循环完毕");
                clearInterval(seti);
            };
            onetable = tables[tempindex]
            var zhutiurllie = $(onetable).find("tbody > tr > td:nth-child(3) > strong > a:first");
            var zhutiurl = $(zhutiurllie).text();
            var zhutis;
            var td1 = $(onetable).find("td[name='td1']:first");
            var statu;
            var tdtouxiang = $(onetable).find("tbody:nth-child(1) > tr > td:nth-child(1)");
            $.ajax({
                type: 'get',
                url: 'https://www.v2ex.com/member/' + zhutiurl,
                dataType: 'html',
                async: false,
                cache: true,
                success: function (data) {
                    zhutis = $(data).find("div.cell.item[style] > table > tbody > tr > td:nth-child(1) > span.item_title > a.topic-link[href]");
                    statu = $(data).find("#Main > div:nth-child(2) > div.cell > table > tbody > tr > td:nth-child(1) > strong:first");
                    tdtouxiang.append(statu);
                },
                error: function (data) {}
            }); //根据每个人的主题url获取他最近20条主题合集zhutis，本ajax要放在tables循环里面使用
            $.each(zhutis, function (i, valu) {
                $(td1).append("<tr class='plc pbn dfsj_tz'></tr>").append(valu);
            });
            tempindex = tempindex + 1;
        }, 5000);//查看下一人主题间隔时间，1000毫秒=1秒
})();