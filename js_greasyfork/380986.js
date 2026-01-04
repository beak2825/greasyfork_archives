// ==UserScript==
// @name         驱动之家净化阅读 - 文章样式调整
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  驱动之家阅读文章样式调整
// @author       zengyufei
// @match        http://www.mydrivers.com/
// @match        https://www.mydrivers.com/
// @match        https://news.mydrivers.com/
// @match        http://news.mydrivers.com/
// @match        https://news.mydrivers.com/class/**
// @match        http://news.mydrivers.com/**.htm
// @match        https://news.mydrivers.com/**.htm
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/380986/%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%E5%87%80%E5%8C%96%E9%98%85%E8%AF%BB%20-%20%E6%96%87%E7%AB%A0%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/380986/%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%E5%87%80%E5%8C%96%E9%98%85%E8%AF%BB%20-%20%E6%96%87%E7%AB%A0%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

if ('loading' == document.readyState) {
    console.log("此脚本在文档启动时运行。");
} else {
    console.log("此脚本与document.readyState一起运行：" + document.readyState);
}
document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'loading') {
        console.log("此脚本在文档启动时运行1。");
    }
    if (event.target.readyState === 'interactive') {
        console.log("此脚本在文档启动时运行2。");
    } else if (event.target.readyState === 'complete') {
    }
});
(function () {
    console.log("此脚本开始运行。");
    'use strict';

    var isContentPage = /.*htm$/.test(location.href) &&  /^http(s)?:\/\/news\.mydrivers\.com\/.*$/.test(location.href)
    var isIndexPage = /^http(s)?:\/\/www\.mydrivers\.com\/$/.test(location.href)
    var isZhiBo = $(".zhibo_box").length > 0


    if(isZhiBo) {

    } else if (isContentPage) {

        $(".main_left").attr("style", "width:1250px !important;margin:0 auto;float:none;height: auto;");
        $(".news_info1").attr("style", "background: #fff;");
        $(".main_1").removeAttr("style");
        $(".main_1").attr("style", "height:1099px;");
        $("#vright_tab").attr("margin-right", "-47%");
        $("#vleft_tab").attr("margin-left", "-47%");
        $("#txtContent0").attr("style", "width:100%");
        $("#main_contents > div > div:nth-child(3) > a > img").remove()


        $(".news_info>div").remove();
        $("#i_lastnext").remove();
        $(".pathway").remove();
        $(".baidu").remove();

        $(".top").remove();
        $(".weixin").remove();
        $(".news_xg").remove();
        $(".main_right").remove();
        $("#right_tab").remove();
        //$("iframe").remove();
        $("body link").remove();
        $("body style").remove();


        $("#dummybodyid .news_box").attr("style", "width:1333px;");
        $("#dummybodyid .news_box .news_left").attr("style", "width:1333px;");

        $(".news_n").attr("style", "width:1230px;");
        $(".pinlun_input").attr("style", "width:1230px;");
        $(".plun_left_newplun").attr("style", "width:1230px;");
        //$("#commentsiframe").attr("style", "width:92%;");
        $(".share table").attr("style", "width:85%;");
        $("#a_showhotnews_list_dia").remove();

        $("#dangbei_down").parent().remove();
        $(".news_bt1").remove();
        $(".zcdf").remove();
        $(".share").remove();
        //$("#commentsiframe").remove();
        $("#footer").remove();
        $("div.news_box  div.news_right").remove();

        var newsLeft = $(".news_left");
        var commentsiframe = $("#commentsiframe");
        newsLeft.css("width", "1333px")



    } else {
        if (isIndexPage) {

            $(".main_left").attr("style", "width:1050px !important;margin:0 auto;float:none;height: auto;background:#fff0;");
            $(".news_info1").attr("style", "background: #fff;");
            $(".main_1").removeAttr("style");
            $(".main_1").attr("style", "height:1099px;");

            var shidianDom = $(".shidian")
            shidianDom.remove();

            $(".main_box").remove();
            var gcDom = $("#GC_box")
            gcDom.nextAll().remove();
            gcDom.remove();

            $("iframe").remove();
            $("body link").remove();
            $("body style").remove();

            $(".main_2").remove();

            $(".nav_box").remove();
            $(".main_right").remove();
            $(".main_right_title").remove();
            $(".main").attr("style", "width:1333px;");
            $("#news_content_1,#news_content_2,#news_content_3,#news_content_4,#news_content_5").after(
                '<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" width="80%" color=#987cb9 SIZE=1>'
            ).show()
            $("#news_content_page").remove();
        } else {
            $(".shidian").remove();
            $(".product_box").remove();
            $(".righttitle ").remove();
            $(".top_1_center ").remove();
            $(".pathway ").remove();
            $(".main_right div:not(:last-child)").remove();
            $(".link ").remove();
            $("#footer").remove();
        }
    }


    //$("iframe").not("#commentsiframe").each(function() {$(this).remove();});
    $(".footer_about").remove();


    $(".share table tbody tr td:lt(2)").remove();

    $(".yzm").css("margin-right", "30px");
})();