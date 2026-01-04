// ==UserScript==
// @name         B站夜间版
// @namespace    邪王真眼是最强
// @version      1.23
// @description  看b站也要护眼哦~
// @author       『邪王真眼』
// @match        https://www.bilibili.com/video/*
// @grant        none
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/426743/B%E7%AB%99%E5%A4%9C%E9%97%B4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/426743/B%E7%AB%99%E5%A4%9C%E9%97%B4%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("匹配成功");
    //背景
    var color0 = "rgb(15,15,17)";
    //亮1
    var color1 = "rgb(31,32,35)";
    //亮2
    var color2 = "rgb(47,49,53)";
    //亮3
    var color3 = "rgb(63,66,71)";
    //亮4
    var color4 = "rgb(79,83,89)";
    //亮5
    var color5 = "rgb(95,100,107)";
    //亮6
    var color6 = "rgb(111,117,125)";
    //亮7
    var color7 = "rgb(127,134,143)";
    //亮8
    var color8 = "rgb(143,151,161)";
    //按钮1
    var colorBtn1 = "rgb(153,153,153)";
    //文字默认颜色
    var colorWords = "rgb(200,200,200)";

    var colorWords2 = "rgb(175,175,175)";
    //橘红色
    var colorJuHong = "#ff5d23";
    //bilibili蓝色
    var colorBiliBlue = "#00a1d6";

     //改css
    var style = document.createElement("style");
    style.type = "text/css";
    //css数组
    var cssArr = new Array();

    //头顶导航栏
    cssArr[0] = ".international-header .mini-type{background:"+color1+"!important;}";
    //视频标题
    cssArr[1] = ".video-info .video-title .tit{color:"+colorWords+"!important;}";
    //播放器按钮栏
    cssArr[2] = ".bilibili-player-video-sendbar{background:"+color1+"!important;}";
    cssArr[3] = ".bilibili-player-video-info{color:"+colorWords+"!important;}";
    //视频介绍
    cssArr[4] = ".video-desc .desc-info{color:"+colorWords+"!important;}";
    //标签
    cssArr[5] = ".s_tag .tag-area>li{background:"+color1+"!important;}";
    cssArr[6] = ".s_tag .tag-area>li .tag-link{color:"+colorWords+"!important;}";
    //导航栏
    cssArr[7] = ".international-header .mini-type .nav-link .nav-link-ul .nav-link-item .link ,.mini-type .nav-user-center .user-con .item .name{color:"+colorWords+"!important;}";
    //弹幕列表
    cssArr[8] = ".bui-collapse .bui-collapse-header ,.player-auxiliary-area .player-auxiliary-filter ,.v-wrap .danmaku-wrap{background:"+color1+"!important;}";
    cssArr[9] = ".player-auxiliary-area .player-auxiliary-filter-title ,.bui-collapse .bui-collapse-header .bui-collapse-arrow{color:"+colorWords+"!important;}";
    //加载中的导航栏
    cssArr[10] = ".mini-header__content.mini-header--login{background:"+color1+"!important;}";

    //“视频选集”
    cssArr[11] = ".multi-page{background:"+color1+"!important;}";
    cssArr[12] = ".multi-page .head-con .head-left h3{color:"+colorWords+"!important;}";
    //----“视频选集”列表项
    cssArr[13] = ".multi-page .cur-list .list-box li a{color:"+colorWords+"!important;}";
    //----“视频选集”列表项-选中的
    cssArr[14] = ".multi-page .cur-list .list-box li.on ,.multi-page .cur-list .list-box li:hover{background:"+color0+"!important;}";
    cssArr[22] = ".multi-page .cur-list .list-box li.on>a{color:"+colorBiliBlue+"!important;}";

    //播放器的发光外圈
    cssArr[15] = ".bilibili-player{box-shadow:0 0 8px "+colorBiliBlue+"!important;}";

    //评论区普通文字颜色
    cssArr[16] = ".bb-comment .comment-list .list-item .text{color:"+colorWords+"}";
    //评论区视频连接的颜色
    //cssArr[15] = ".bb-comment .comment-list .list-item .text .comment-jump-url.comment-jump-url{color:pink}";
    cssArr[17] = "";
    //评论区背景
    cssArr[18] = ".bb-comment{background:"+color0+"!important;}";
    //评论的评论的字体颜色
    cssArr[19] = ".bb-comment .comment-list .list-item .user .text-con{color:"+colorWords+"!important;}";

    //底部浮动的发送评论区
    cssArr[20] = ".bb-comment .comment-send-lite.comment-send-lite{background:"+color2+"!important;}";
    //----输入框
    cssArr[21] = ".bb-comment .comment-send-lite.comment-send-lite .textarea-container .ipt-txt ,.bb-comment .comment-send .textarea-container .ipt-txt{background:"+color1+"!important;}";
    //相关视频标题
    cssArr[23] = ".video-page-card .card-box .info .title{color:"+colorWords+"}";
    //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■=
    //整合所有css文本
    var cssAll = "";
    for(var i=0;i<cssArr.length;i++){
        cssAll = cssAll+cssArr[i];
    }

    var text = document.createTextNode(cssAll);
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    //单独设置body颜色
    document.getElementsByTagName("body")[0].style.backgroundColor = color0;
})();