// ==UserScript==
// @name         小说超精简
// @namespace    http://tampermonkey.net/
// @icon         http://www.ywggzy.com/favicon.ico
// @version      1.0
// @description  小说超精简-给与自己纯粹的小说观看体验-给作者留言适配你想要精简的小说网站域名,下一个可能就是你哦
// @author       BigHum
// @match        *://*www.ywggzy.com/*
// @match        *://*read.qidian.com/*
// @match        *://*.5atxt.com/*
// @match        *://*.biququ.com/*
// @grant        none
// @license      GPL-3.0-only
// @require    http://code.jquery.com/jquery-3.1.1.min.js
// @require    https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/446885/%E5%B0%8F%E8%AF%B4%E8%B6%85%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/446885/%E5%B0%8F%E8%AF%B4%E8%B6%85%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $(function(){

        var htmls = '<div id="Index" style="background: #1dd1a1; position: fixed; left: 80px; top: 30px; color:white; padding:10px 20px; cursor: pointer;">首页</div>'
        $("body").prepend(htmls);
        var https = window.location.protocol
        var hrefs = window.location.host
        $("#Index").click(function(){
            window.location.href = https + "//" + hrefs;
        });

        if (window.location.href.indexOf("ywggzy")>0) {
            $(".header").remove();
            $(".topbar").remove();
            $(".appguide-wrap").remove();
            $("#container").innerWidth("70%")
            $(".nav").remove();
            $(".xs-hidden").remove();
            $("#bdnovel").remove();
            $(".hotcmd-box").remove();
            $(".posterror").remove();
            $("body").css("background","rgb(204, 232, 207)");//页面背景色改变

            var item = $("#content").find("br");
            for (var i = 0; i < item.length; i++) {
                if (i % 2 != 0) {
                    item[i].remove();
                }
            }
            $("#content").next("a").remove();
            $("#content").css("font-size", "16px");
            $(".hotcmd-wp").remove();
            console.log('笔下文学已精简')
        }
        if (window.location.href.indexOf("qidian")>0) {


            setInterval(function () {
                $("#j_bodyRecWrap").remove();//移除背景广告
            },10)
            $("#j-mainReadContainer").css("width","1440px");//内容宽度更改
            $("#j_readMainWrap").css("width","1280px");//内容宽度更改
            $(".crumbs-nav").css("display","none");//移除导航
            $(".book-mark").remove();//移除书签
            $(".admire-wrap").remove();//移除赞赏
            $("#j_rightBarList dl dd").not("#j_goTop").remove();//移除打赏,投票,评论
            $(".text-wrap").css("background","rgb(204, 232, 207)")//内容背景色改变
                .css("border","none")//移除内容边框
                .css("font-size","16px");//移除内容边框
            $(".dib-wrap").css("background","rgb(204, 232, 207)")//翻篇背景色改变
            $("body").css("background","rgb(204, 232, 207)");//页面背景色改变
            $(".weekly-hot-rec").remove();//移除底部推荐
            $(".guide-btn-wrap").remove();//移除"指南"
            $(".admire-wrap").remove();//移除"举报"
            $("#j_leftBarList").css("margin-left","0")//移除"举报"
                .css("left","60px")

        }

        if (window.location.href.indexOf("5atxt")>0) {
            $(".m_f_a").remove();
            $(".zw1ljPz").remove();
            $(".callApp_fl_btn").remove();
            $(".searchForm").remove();
            $("footer").remove();
            $(".Readpages").remove();
            $("#chaptercontent span").remove();
            $("#chaptercontent p").remove();
            $("#chaptercontent div").remove();
            $("#chaptercontent").innerWidth("70%");
            $("#chaptercontent").css("margin","0 auto");
            $("#chaptercontent").css("font-size", "16px");
            $("body").css("background","rgb(204, 232, 207)");//页面背景色改变

            var item = $("#chaptercontent").find("br");
            for (var i = 0; i < item.length; i++) {
                if (i % 2 != 0) {
                    item[i].remove();
                }
            }
        }

        if (window.location.href.indexOf("biququ.com/html")>0) {
            $(".ywtop").remove();
            $(".header").remove();
            $(".RMss1").remove();
            $(".read_tj").remove();
            $("#content").css("width","85%");
            $("#content a").parent().remove();
            $("#content p").css("padding","0")
                .css("font-family","null")
                .css("letter-spacing","0")
            $("#content_read").innerWidth("auto")
            $(".con_top").remove();
            $(".nav").remove();
            $("#tbox").remove();
            $("#footer").remove();
            $(".box_con").css("width","70%");
            $(".bottem1").css("width","auto");
            $(".bottem2").css("width","auto");
            $("#tbox a").css("border-radius","5px");
            $("body").css("background","rgb(204, 232, 207)");//页面背景色改变
            $("#content").css("font-size", "16px");
        }
    })
})();