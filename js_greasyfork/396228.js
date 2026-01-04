// ==UserScript==
// @name         百度夜间模式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Baidu night mode
// @author       Mattew
// @match        https://*.baidu.com/*
// @match        https://baidu.com/*
// @match        http://*.baidu.com/*
// @match        http://baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/396228/%E7%99%BE%E5%BA%A6%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/396228/%E7%99%BE%E5%BA%A6%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(

    function() {
    'use strict';
    var evening = 19; //此设置为晚上开始时间默认19点
    var morning = 7;//此设置早上结束时间默认7点
    function black(){
    var lg = $("#result_logo");
    if(lg.length==1){
        $(lg).html('<img src="//www.baidu.com/img/baidu_resultlogo@2.png" width="101" height="33" border="0" alt="到百度首页" title="到百度首页">')
    }
    $("#4001").remove();
    $(".pic-info-sticker").remove();
    $("#head_wrapper.s-ps-islite .s-p-top").css("width","80%");
    $("#head_wrapper").css("width","800px");
    $(".s_form").css("width","800px");
    $("#search").css("background-color","#222");
    $("#header").css("background-color","#222");
    $("#main").css("background-color","#222");
    $("#toolbar").css("background-color","#222");
    $(".toolbar .bar-btn").css("background-color","#222");
    $(".album-container").css("background-color","#222");
    $("#main > #container").css("background-color","#222");
    $("#wrapper").css("background-color","#222");
    $("#sider").css("background-color","#222");
    $("body").css({"background-color":"#222","color":"rgba(200,200,200,1)"});
    $("#search .s_search").css({"background-color":"#222","color":"rgba(200,200,200,1)"});
    $("#rs").css("background-color","#222");
    $("#head").css("background","#333");
    $(".s_tab").css("background","#333");
    $("#topInfoBar").css({"background":"#222","color":"#fff"});
    $("#s_tab").css("background","#333");
    $("#s_tab b").css({"background":"#333","border-bottom":"2px solid rgba(2,156,129,1)"});
    $(".mod-navbar .lavalamp-object").css({"background":"rgba(2,156,129,1)"});
    $(".mod-headline-tab ul li.active").css({"border-bottom":"2px solid rgba(2,156,129,1)"});
    $("#content_right").css({"background":"#333","border-left":"1px solid #333","border-radius":"10px","padding-top":"20px"});
    $(".card-box .card-title").css({"background":"#333","border-left":"1px solid #333","border-radius":"10px","padding-top":"20px"});
    $("a").css({"color":"rgba(200,200,200,.9)","background":"rgba(0,0,0,0)"});
    $("strong").css("background","rgba(0,0,0,0)");
    $("b").css("color","rgba(2,156,129,1)");
    $("em").css("color","rgba(245,245,249,1)");
    $("input").css("color","rgba(230,230,230,1)");
    $("#c-tip-con").css("background-color","#333");
    $("strong > .pc").css("background","#555");
    $("#foot").css({"background":"#333","border-top":"1px solid #333"});
    $("#help").css("background","#333");
    $(".s_btn").css({"background":"#555","border-bottom":"1px solid #555","border-radius":"20px"});
    $(".s_ipt_wr").css({"background":"rgba(26,26,26,1)","border-radius":"20px","padding-left":"10px","border":"1px solid rgba(26,26,26,1)","margin-right":"10px"});//百度首页搜索栏
    $("#sugIn").css({"background":"rgba(26,26,26,1)","border-radius":"20px","padding-left":"10px","border":"1px solid rgba(26,26,26,1)","margin-right":"10px"});//百度图片详情搜索栏
    $("table.sbox input.word").css({"background":"rgba(50,50,50,1)","border-radius":"20px","padding-left":"10px","border":"1px solid rgba(26,26,26,1)","margin-right":"10px","color":"#fff"});
    $("#sugOut .sb").css({"background":"#555","border-bottom":"1px solid #555","border-radius":"20px"});
    $(".card-box .card-content").css({"background":"rgba(50,50,50,1)","border-radius":"20px","padding-left":"10px","border":"1px solid rgba(26,26,26,1)","margin-right":"10px","color":"#fff"});
    $(".pic-info-box .pic-info-content").css({"background":"rgba(50,50,50,1)","border-radius":"20px","padding-left":"10px","border":"1px solid rgba(26,26,26,1)","margin-right":"10px","color":"#fff"});
    $(".card-title > span").css("color","#fff");
    $(".c-summary").css("color","rgba(200,200,200,1)");
    $(".EC_newppim").remove();
    $(".layout").remove();
    $(".c-table").css("background-color","rgba(0,0,0,0)");
    $("th").css("background-color","rgba(0,0,0,0)");
    $(".soutu-btn").css("background","#333url(https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/soutu/img/camera_new_5606e8f.png) no-repeat");
    $(".s_ipt").css("background-color","rgba(0,0,0,.2)");
    $(".bdsug").css({"background-color":"rgba(26,26,26,1)","color":"#fff","border":"none","box-shadow":"none","padding-top":"3px","margin-left":"6px","border-radius":"10px"});
    $(".bdsug-feedback-wrap").css({"background-color":"rgba(26,26,26,1)","color":"#fff","border-radius":"10px"});
    $(".bdsug li").css({"background-color":"rgba(26,26,26,1)","color":"#fff","padding-left":"30px","width":"auto"});
    $("#bottom_layer").css("background-color","rgba(0,0,0,0)");
    $("#u_sp .s_bdbri").css({"background":"rgba(26,26,26,1)"});
    $(".s-user-set-menu div").css({"border":"none","box-shadow":"none","-webkit-box-shadow":"none"});
    $("#s_btn_wr").css({"background":"#555","border-bottom":"1px solid #555","border-radius":"20px"});
    $("table.sbox .s_btn_wr").css("background","none");
    $(".mod-navbar").css("background","#555");
    $(".lavalamp-item > a").css("color","#fff")
    $(".mod .hd h3").css({"color":"rgba(2,156,129,1)","background":"none"});
    $(".mod-baijia .column-title-home .column-title-border .column-title").css("color","rgba(2,156,129,1)");
    $(".hotwords .li_color_0, .hotwords .li_color_2, .hotwords .li_color_3, .hotwords .li_color_5, .hotwords .li_color_7, .hotwords .li_color_8").css({"background":"rgba(2,156,129,.7)"});
    $(".hotwords .li_0, .hotwords .li_1").css({"background":"rgba(2,156,129,.4)"});
    $(".hotwords .li_color_1, .hotwords .li_color_4, .hotwords .li_color_6, .hotwords .li_color_9").css({"background":"rgba(2,156,129,.9)"});
    $(".column-title-home .column-title-border h2, .column-title-home .column-title-border h2 a, .column-title-home .column-title-border h2 a:link, .column-title-home .column-title-border h2 a:active, .column-title-home .column-title-border h2 a:visited, .column-title-home .column-title-border h2 a:hover").css("color","#fff");
    $("#footerwrapper").css("background","rgba(2,156,129,.2)");
    $("#goTop > li").remove();
    $("#imgContainer").css("background","#222");
    }
    setInterval(function(){
    let timeNow = new Date()
    let hourNow = timeNow.getHours()
    if (hourNow > evening) {
        black();
    }
    if (hourNow < morning) {
        black();
    }},300);

    // Your code here...
})();