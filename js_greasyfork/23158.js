// ==UserScript==
// @name         cnBeta移动版跳转到电脑板
// @namespace    http://www.zhangminghao.com
// @version      0.7
// @description  从cnbeta的移动版网页跳转到电脑版网页
// @author       张明浩
// @match        http://m.cnbeta.com.tw/view/*
// @match        https://m.cnbeta.com.tw/view/*
// @homepage     https://greasyfork.org/scripts/23158
// @require      http://libs.baidu.com/jquery/2.1.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/23158/cnBeta%E7%A7%BB%E5%8A%A8%E7%89%88%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/23158/cnBeta%E7%A7%BB%E5%8A%A8%E7%89%88%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E6%9D%BF.meta.js
// ==/UserScript==

(function() {


    //修改底部链接
    $(".footer_version").empty();
    $(".footer_version").append("<a href='/wap'>文字版</a><a class='cur'>标准版</a>");
    var url = window.location.href;
    var txt1=url.split('/')
    var txt2 = "<a href='https://www.cnbeta.com.tw/articles/"+txt1[4]+"' >电脑端</a>";
    $(".footer_version").append(txt2);

    //修改浮动按钮
    $(".footer_top").empty();
    var txt3 = "<a class='j_backTop gotop' href='https://www.cnbeta.com.tw/articles/"+txt1[4]+"' >电脑端</a>";
    $(".footer_top").append(txt3);


})();