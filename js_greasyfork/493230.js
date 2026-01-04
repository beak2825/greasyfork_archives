// ==UserScript==
// @name         百度夜间模式-latest
// @namespace    http://tampermonkey.net/
// @icon         https://www.baidu.com/favicon.ico
// @version      1.6
// @description  Baidu night mode:latest
// @author       Mattew, GavinGoo
// @match        https://*.baidu.com/*
// @match        https://baidu.com/*
// @match        http://*.baidu.com/*
// @match        http://baidu.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493230/%E7%99%BE%E5%BA%A6%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F-latest.user.js
// @updateURL https://update.greasyfork.org/scripts/493230/%E7%99%BE%E5%BA%A6%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F-latest.meta.js
// ==/UserScript==

// Based on https://greasyfork.org/zh-CN/scripts/396228-%E7%99%BE%E5%BA%A6%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F

var evening = 21; //此设置为晚上开始时间默认21点
var morning = 8;//此设置早上结束时间默认8点

function black(){
    var lg = $("#result_logo");
    if(lg.length==1){
        $(lg).html('<img src="//www.baidu.com/img/baidu_resultlogo@2.png" width="101" height="33" border="0" alt="到百度首页" title="到百度首页">')
    }
    $("#4001").remove();
    $(".pic-info-sticker").remove();
    $("#head_wrapper.s-ps-islite .s-p-top").css("width","80%");
    $("#head_wrapper").css("width","800px");
    //$(".s_form").css("width","800px");  //这个会把搜索框下移，对搜索tag可能造成bug
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
    $("#content_right").css({"background":"#333","border-left":"10px solid #333","border-right":"10px solid #333","border-radius":"10px","padding-top":"20px"});
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
    //$(".s_ipt_wr").css({"background":"#222","border-radius":"20px"});//百度首页搜索栏
    //$(".s_ipt_wr").css({"background":"#222","border-radius":"20px","padding-left":"10px","border":"1px solid rgba(26,26,26,1)","margin-right":"10px"});//百度首页搜索栏
    $(".s_ipt_wr").css({"background":"#222","background-color":"#222 !important","border-radius":"20px","border":"initial","height":"auto"});//百度首页搜索栏
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
    $(".s_ipt").css("background-color","#222");
    $(".bdsug").css({"background-color":"rgba(26,26,26,1)","color":"#fff","border":"none","box-shadow":"none","padding-top":"3px","margin-left":"6px","border-radius":"10px","background":"#222"});
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
    //
    //修复
    //
    $(".new-pmd.c-container").css({"width":"560px","color":"#999"});//链接内容
    $(".render-item_GS8wb .group-content_3jCZd .group-sub-abs_N-I8P").css("color","#999");
    $(".new-pmd .c-color-text").css("color","#999");
    $("#page").css("background-color","#333");//底部页数区域
    $(".c-span8.c-gap-left-large > .c-font-special.c-color-t.c-font-special.title-text_1p9lW > div").css("color","#999");//百家号名字
    $("div.c-border > div.op_dict_content > div.op_dict3_readline.c-clearfix.c-gap-top-xsmall.c-gap-bottom-xsmall > div > table > tbody > tr > td.op_dict3_englishtxt.c-color-t > span").css("color","rgb(245, 245, 249)");//百度搜索单词翻译结果
    //$(".mask_AW7gR").remove();//移除弹幕上方的白色阴影  //此方法可能导致弹幕无法滚动并且报错
    $(".mask_AW7gR").css("background","transparent");//移除弹幕上方的白色阴影
    $(".right-wz_2XAs6").remove();//移除百度健康在右侧上方广告
    $("#searchTag").css("background-color","#333");//搜索tag
    $("#sidebar-btn").css({"background":"#333","border":"3px solid #333","border-radius":"10px","color":"rgb(200,200,200)"});//基于"百度系网站去广告"油猴插件的热搜显示/隐藏按钮
    $(".right-wrapper_SHpB_").css("background","");//搜索tag下一页
    $(".daq-content_wahwa").css({"color":"#fff"});//AI结果
    $("span").css({"color":"#999"});//AI结果
    $("b").css({"color":"#38f","border-bottom":"#38f"});//搜索详情页tag
    $("._vertical-gradient_zc167_197").remove();//移除翻译白色渐变遮罩
    $("._bg-header_zc167_46").remove();//移除翻译透蓝色
    $(".s-center-box").css({"background-color":"#222"});//搜索首页标签tag
    $(".s-top-more").css({"background-color":"#222"});//搜索首页标签tag-"更多"
    $(".s-top-more-title").css({"color":"#fff"});//搜索首页标签tag-"更多"中各元素title
    $("#kw").css({"border-radius":"20px","background-color":"initial","border":"initial","height":"auto"});//去除搜索首页输入框描边, 完善样式
    // 搜索关键词索引背景(Failed)
    $(".bdsug").css({"background":"#222 !important"});//搜索关键词索引背景
    $(".bdsugbg").css({"background":"#222 !important"});//搜索关键词索引背景
    $("#form > div").css({"background":"#222 !important"});//搜索关键词索引背景
    $(".bdsug-new").css({"color":"#fff", "background":"#222 !important"});//搜索关键词索引文字
    //
    $(".title-text").css({"color":"#999"});//"百度热搜"文字
    $(".c-text-hot").css({"color":"#fff"});//热搜榜tag
    $(".soutu-btn").css({"background-color":"#fff0"});//搜图按钮
    $(".see-more-content_2Bljh").css({"border-radius":"20px"})//百家号"查看更多"按钮
    $(".cos-row").css({"background-color":"#222"});//视频标签背景
    $(".sc-link").css({"color":"#999"});//视频标签背景
    $(".cos-color-bg-page").css({"all":"initial"});//视频标签背景
    $("strong").css("color","#fff");//搜索总结回答

};

function main() {
    let timeNow = new Date()
    let hourNow = timeNow.getHours()
    if (hourNow >= evening) {
        black();
    }
    if (hourNow <= morning) {
        black();
    }
};

document.addEventListener('readystatechange', () => {
    main();
    setInterval(() => {
    main();
    }, 60);
});





