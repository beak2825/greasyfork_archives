// ==UserScript==
// @name         DYH_bilibili_common
// @namespace    dreamcenter
// @version      0.0.0.5
// @description  修改b站个人主页的背景以及banner,全屏播放左上角显示当前时间
// @author       dyh
// @match        *://*.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/medialist/play/watchlater/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412288/DYH_bilibili_common.user.js
// @updateURL https://update.greasyfork.org/scripts/412288/DYH_bilibili_common.meta.js
// ==/UserScript==

//******************************用户编辑区域**************************************
var dyh_data={
    //主页背景和banner功能:开/关->1/0
    bk_banner_on:1,
    //全屏显示时间功能:开/关->1/0
    time_show_on:1,
    //设置时间文本透明度[0到1之间的小数，代表透明度,推荐0.7]
    opcity_set:0.7,
    //设置页面的延迟检测,网速越慢值需要设置的越大，1000代表1000ms = 1s
    time_out:1000,
    //个人主页背景图片[传入网址]
    app_bk : "//i0.hdslb.com/bfs/space/b5da6636cd0ef36dd0eab0440bd361d5b30742e1.png",
    //个人主页banner图片[传入网址]
    h_inner_bk : "//i0.hdslb.com/bfs/space/e7f98439ab7d081c9ab067d248e1780bd8a72ffc.jpg"
};
//*****************************************************************************************


//-----------------********以下内容不需更改********-------------------------------
//core starter
(function() {
    'use strict';
    window.onload=function(){
        var url = location.href
        var first = true
        if(location.hostname=="space.bilibili.com")
            bk_banner_on();
        setInterval(function(){
           if(((location.href != url)||first)&&((location.href.search(/video/ig)>=0)||(location.href.search(/medialist/ig)>=0))){
               url = location.href
               console.log("dyh : url changed")
               setTimeout(function(){
                   time_show_on();
               },dyh_data.time_out)
               first = false
           }
        },dyh_data.time_out)
    }
})();


//implements
function bk_banner_on(){
    var mydiv = document.getElementById("app");
    mydiv.style.backgroundImage="url("+dyh_data.app_bk+")";
    var h_inner = document.querySelector("#app .h-inner");
    h_inner.style.backgroundImage="url("+dyh_data.h_inner_bk+")";
}

function time_show_on(){
    var player_area = document.getElementsByClassName("bilibili-player-area")[0];
    //console.log(player_area)
    var target = document.createElement("div");
    target.style="width:100px;height:20px;background-color:color:rgba(0,0,0,.3);position:absolute;top:0;left:0;z-index:100;padding:2px";
    player_area.appendChild(target);

    var dyh_dt = new Date();

    var hour = toDouble(dyh_dt.getHours());
    var minute = toDouble(dyh_dt.getMinutes());

    var combineToString = hour+":"+minute;

    target.innerHTML="<b style='color:rgba(255,255,255,"+dyh_data.opcity_set+");font-size:16px;'>"+combineToString+"</b>";

    setInterval(function(){
        var dyh_dt = new Date();

        var hour = toDouble(dyh_dt.getHours());
        var minute = toDouble(dyh_dt.getMinutes());

        var combineToString = hour+":"+minute;

        target.innerHTML="<b style='color:rgba(255,255,255,"+dyh_data.opcity_set+");font-size:16px;'>"+combineToString+"</b>";
    },1000*60);
}


//tools
function toDouble(data){
    return data<10?"0"+data:data;
}

//-----------------------***************------------------------------------