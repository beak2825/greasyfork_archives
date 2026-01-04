// ==UserScript==
// @name         空中课堂辅助包
// @namespace    http://tampermonkey.net/
// @description  空中课堂修改包！无产阶级必将走向胜利！
// @version      4.2.5
// @author       Joker
// @match        https://www.ucans.net/*
// @match        https://ucans.net/*
// @icon         https://www.ucans.net/favicon.ico
// @grant    GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448924/%E7%A9%BA%E4%B8%AD%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/448924/%E7%A9%BA%E4%B8%AD%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9%E5%8C%85.meta.js
// ==/UserScript==

//关闭视频区域
GM_registerMenuCommand ("进入 仅互动 模式", disvideo, "");
GM_registerMenuCommand ("开启播放器护眼翻转", filter, "");
GM_registerMenuCommand ("安装播放器控制脚本", h5control, "");
GM_registerMenuCommand ("𝓢𝓴𝔂.的哔哩哔哩主页", bilibili, "");
GM_registerMenuCommand ("在Greasy Fork上好评", comment, "");


function filter (){
    var styleSheets = document.styleSheets[4];//获取样式表引用
    var index = styleSheets.length; //获取样式表样式个数
    if(styleSheets.insertRule){
        styleSheets.insertRule(".vjs-tech{webkit-filter: invert(100%); filter: invert(100%);}",index);
    }else{
        styleSheets.addRule(".vjs-tech","webkit-filter: invert(100%); filter: invert(100%);",index);
    }
}

function disvideo () {
    var rw = document.getElementsByClassName("video_main_box")
    var rv = document.getElementsByClassName("tcplayer-box")
    rw[0].removeChild(rv[0]);
}
function h5control () {
    location.replace("https://greasyfork.org/zh-CN/scripts/381682-html5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC")
}
function bilibili () {
    window.open("https://space.bilibili.com/496865942?spm_id_from=333.1007.0.0")
}
function comment () {
    window.open("https://greasyfork.org/zh-CN/scripts/448924-%E7%A9%BA%E4%B8%AD%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9%E5%8C%85")
}


//匹配Ucans直播间
if(window.location.href.indexOf("https://www.ucans.net/chatRoom/")>-1){
    //修改UA为Xvast
    (function() {
        'use strict';
        var customUserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4501.0 Xvast/1.3.0.8 Safari/537.36';

        //修改后的userAgent
        Object.defineProperty(navigator, 'userAgent', {
            value: customUserAgent,
            writable: false
        });

        //打印

        console.log(navigator.userAgent);
    })();

    //改变标题位置，标题滚动
    (function (){
        var t = document.getElementById("commodity_title");
        var keyWords = t.innerHTML+" ";
        function titleChange() {
            /*滚动再见
            var keyList = keyWords.split("");
            var firstChar = keyList.shift();
            keyList.push(firstChar);
            keyWords = keyList.join("");
            */
            document.title = keyWords;
        }
        setInterval(titleChange, 500);


    })();

    window.onload = function(){
        var styleSheets = document.styleSheets[4];//获取样式表引用
        var index = styleSheets.length; //获取样式表样式个数
        //发言
        if(styleSheets.insertRule){ //判断浏览器是否支持insertRule方法
            styleSheets.insertRule(".video-sms-text>span{border-radius:30px;background-color:rgb(206,26,28);margin-top:5px;padding:5px!important;color:#fff!important;font-family:PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif!important;line-height:35px!important;}",index);
        }else{
            styleSheets.addRule(".video-sms-text>span","background-color:rgb(206,26,28);border-radius:30px;padding:5px!important;color:#fff!important;font-family:PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif!important;line-height:35px!important;",index);
        }
        //用户
        if(styleSheets.insertRule){
            styleSheets.insertRule(".user-name-org{background-image:linear-gradient(to bottom right,rgb(238,192,147),rgb(234,136,65))!important;color:#18191C!important;}",index);
        }else{
            styleSheets.addRule("p","background-image:linear-gradient(to bottom right,rgb(238,192,147),rgb(234,136,65))!important;color:rgb(238,192,147)!important;",index);
        }
        //评论间距video_sms_list
        if(styleSheets.insertRule){
            styleSheets.insertRule("#video_sms_list>li{margin:0px!important;}",index);
        }else{
            styleSheets.addRule("#video_sms_list>li","margin:0px!important;",index);
        }

        //间距2
        if(styleSheets.insertRule){
            styleSheets.insertRule(".video-sms-list>li>.video-sms-pane>.video-sms-text>.user-name-org{margin-right:5px!important;}",index);
        }else{
            styleSheets.addRule(".video-sms-list>li>.video-sms-pane>.video-sms-text>.user-name-org","margin-right:5px!important;",index);
        }
        //handbox
        if(styleSheets.insertRule){
            styleSheets.insertRule(".handbox{top:30px!important;}",index);
        }else{
            styleSheets.addRule(".handbox{top:30px!important;}",index);
        }
        //去除直播间无用元素
        var r = document.getElementById("chat_box");
        var rt = document.getElementById("video-discuss-tool");
        var rl = document.getElementById("likeBtn");
        var r1 = document.getElementsByClassName("clearfix st_video_top");
        var r2 = document.getElementsByClassName("st_video_topZ");
        var r3 = document.getElementsByClassName("video-discuss-face");
        var r4 = rl.getElementsByTagName("img");
        r.removeChild(r1[0]);
        r.removeChild(r2[0]);
        rt.removeChild(r3[0]);
        rl.removeChild(r4[0]);
        document.getElementById("send_msg_text").removeAttribute("placeholder");
    }
}






//直播间结束