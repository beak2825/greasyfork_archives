// ==UserScript==
// @name         BiliBili一键开关弹幕/一键网页全屏/速度控制快捷键
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  由xujiahao27的脚本修改而来
// @author       antipaladin
// @match        *://*.bilibili.com/*
// @license MIT
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/455232/BiliBili%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%E4%B8%80%E9%94%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/455232/BiliBili%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%E4%B8%80%E9%94%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

var 开关弹幕 = 103;//小键盘数字键7，可以自己更改
var 控制全屏 = 105;//小键盘数字键9，可以自己更改
var 打开宽屏 = 106;//小键盘“*”键，可以自己更改
var 控制速度 = 107;//小键盘“+”键，可以自己更改  播放速度设置在一个键上，按一下为1.25倍，按两下1.5呗，三下2倍，第四下回归正常速度
var 网页全屏 = 109;//小键盘“-”键，可以自己更改
var 暂停播放 = 101;//小键盘数字键5，可以自己更改

//以上每一个按键都可以自定义，可以按照自己的喜好自行对照键盘键位对应编码来修改，下面是提供参考的键盘编码表链接

//笔记本电脑或者是没有小键盘的同学，请参考下面的键盘编码表更改键位

// 对照修改的键盘编码表链接，复制右边的链接到地址栏打开  https://jingyan.baidu.com/article/fedf073780e16335ac8977a4.html


var video_speed = [1,1.25,1.5,2];
var video_speed_num = 0;

function MUH_tips(str){
    var get_tips_div = $("#tips_div");
    if(get_tips_div.val() == undefined){
        var tips_div = '<div id="tips_div" style="border-radius: 20px;'+
            'background:#000;'+
            'width: 140px;'+
            'height: 40px;'+
            'position:fixed;'+
            'left:50%; top:95%;'+
            'margin-left:-60px;'+
            'margin-top:-20px;'+
            'text-align:center;'+
            'line-height:40px;'+
            'font-size:20px;'+
            'color:#FFF;'+
            'opacity:0.8;'+
            'z-index:2147483647;">' + str + '</div>';
        if($(".bpx-player-video-area").length>0){
            $(".bpx-player-video-area").append(tips_div);
        }else{
            $(".bilibili-player-video").append(tips_div);
        }
        $("#tips_div").animate({opacity:"0.8"},500).animate({opacity:"0"},250);
    }else{
        if(!get_tips_div.is(":animated")){
            get_tips_div.text(str);
            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},500).animate({opacity:"0"},250);
        }else{
            get_tips_div.stop(true, true);
            get_tips_div.text(str);
            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},500).animate({opacity:"0"},250);
        }
    }

}

function set_video_speed(){
    video_speed_num = ++video_speed_num%video_speed.length;
    if($("video").length>0){
       $("video")[0].playbackRate =  video_speed[video_speed_num]

    }else if ($("bwp-video").length>0){
        $("bwp-video")[0].playbackRate =  video_speed[video_speed_num];
    }
    MUH_tips("倍速：" + video_speed[video_speed_num].toString());
}
function click_wide_screen(){

    //$("button[data-text='宽屏模式'] svg").click();      //button[data-text='宽屏模式'] svg  这句意思是选择data-text属性值为'宽屏模式' 的button标签下的svg标签
    $(".bpx-player-ctrl-wide").click();
    $(".squirtle-video-widescreen").click();

}
function click_web_Full_screen(){

    if($(".bpx-player-ctrl-web").length>0){
        $(".bpx-player-ctrl-web").click();
    }else{
         //$("div.squirtle-video-pagefullscreen svg").click();
        $(".squirtle-video-pagefullscreen").click();
    }
}

function click_Full_screen(){

    //$("button[data-text='进入全屏']").click();
    $(".bpx-player-ctrl-full").click();


}
function click_Barrage(){
    if($(".bpx-player-dm-root input.bui-switch-input").prop('checked') || $(".bui-danmaku-switch-input").prop('checked')){ //.bpx-player-dm-root .bpx-player-dm-switch
        MUH_tips("关闭弹幕");
    }else{
        MUH_tips("显示弹幕");
    }
    $(".bpx-player-dm-root input.bui-switch-input").click();
     $(".bui-danmaku-switch-input").click();
//    if($(".bilibili-player-video-danmaku-switch.bui.bui-switch").length>0){
//       $(".bilibili-player-video-danmaku-switch.bui.bui-switch").children(".bui-switch-input").click();
//    }else{
//        $("input.bui-switch-input").click();
//    }
}

(function() {
    'use strict';
		$(document).keydown(function(event){     //调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
            switch(event.keyCode){
                case 开关弹幕:
               click_Barrage();
                    break;
                case 打开宽屏:
               click_wide_screen();
                    break;
                case 网页全屏:
                click_web_Full_screen();
                    break;
                case 控制全屏:
                click_Full_screen();
                    break;
                case 控制速度:
                set_video_speed();
                    break;
                   }
		});
})();