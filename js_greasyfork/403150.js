// ==UserScript==
// @name BiliBili快捷键【视频倍速播放：加速(+号)和降速(-号)】/一键开关弹幕(小键盘数字0)/一键全屏(Alt)
// @namespace http://tampermonkey.net/
// @version 0.7
// @description 这个脚本是修改的R君的
// @author gagayuan
// @match *://*.bilibili.com/*
// @grant none
// @license MIT
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/403150/BiliBili%E5%BF%AB%E6%8D%B7%E9%94%AE%E3%80%90%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%9A%E5%8A%A0%E9%80%9F%28%2B%E5%8F%B7%29%E5%92%8C%E9%99%8D%E9%80%9F%28-%E5%8F%B7%29%E3%80%91%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%28%E5%B0%8F%E9%94%AE%E7%9B%98%E6%95%B0%E5%AD%970%29%E4%B8%80%E9%94%AE%E5%85%A8%E5%B1%8F%28Alt%29.user.js
// @updateURL https://update.greasyfork.org/scripts/403150/BiliBili%E5%BF%AB%E6%8D%B7%E9%94%AE%E3%80%90%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%9A%E5%8A%A0%E9%80%9F%28%2B%E5%8F%B7%29%E5%92%8C%E9%99%8D%E9%80%9F%28-%E5%8F%B7%29%E3%80%91%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%28%E5%B0%8F%E9%94%AE%E7%9B%98%E6%95%B0%E5%AD%970%29%E4%B8%80%E9%94%AE%E5%85%A8%E5%B1%8F%28Alt%29.meta.js
// ==/UserScript==

var 开关弹幕= 96;//小键盘数字键0，可以自己更改
var 增加速度= 107;//小键盘“+”键，可以自己更改播放速度设置在一个键上，按一下为1.25倍，按两下1.5呗，三下2倍，第四下回归正常速度
var 降低速度= 109;//小键盘“-”键
var 控制全屏 = 18//键盘“Alt”键，可以自己更改

//以上每一个按键都可以自定义，可以按照自己的喜好自行对照键盘键位对应编码来修改，下面是提供参考的键盘编码表链接

//笔记本电脑或者是没有小键盘的同学，请参考下面的键盘编码表更改键位

// 对照修改的键盘编码表链接，复制右边的链接到地址栏打开https://jingyan.baidu.com/article/fedf073780e16335ac8977a4.html


var video_speed_up = [0.5,0.75,1,1.25,1.5,1.75,2];
var video_speed_down = [2,1.75,1.5,1.25,1,0.75,0.5];
// var video_speed_num_up = 2;
// var video_speed_num_down = 2;

function tips_video_speed(speed){

    var get_tips_div = $("#tips_div");
    if(get_tips_div.val() == undefined){
    var tips_div = '<div id="tips_div" style="border-radius: 20px;'+
            'background:#000;'+
            'width: 120px;'+
            'height: 40px;'+
            'position:fixed;'+
            'left:50%; top:50%;'+
            'margin-left:-60px;'+
            'margin-top:-20px;'+
            'text-align:center;'+
            'line-height:40px;'+
            'font-size:20px;'+
            'color:#FFF;'+
            'opacity:0.8;'+
            'z-index:9999999999;">倍数:'+speed+'</div>';
        $(".bilibili-player-video").append(tips_div);
        $("#tips_div").animate({opacity:"0.8"},1000).animate({opacity:"0"},500);
    }else{
        if(!get_tips_div.is(":animated")){
            get_tips_div.text("倍数:"+speed);
            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},1000).animate({opacity:"0"},500);
        }else{
            get_tips_div.stop(true, true);
            get_tips_div.text("倍数:"+speed);
            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},1000).animate({opacity:"0"},500);
        }
    }

}
function set_video_speed_up(){


    var video = $(".bilibili-player-video video")[0];  //得到播放器
    var currentSpeed = video_speed_up.indexOf(video.playbackRate)
    if(currentSpeed<video_speed_up.length){
     currentSpeed++;                             //速度索引加一
    }
    if(currentSpeed >= video_speed_up.length){   //速度索引超过速度范围
     currentSpeed = video_speed_up.length;                           //速度索引恢复为0
    }
     video.playbackRate = video_speed_up[currentSpeed];  //速度增加列表 调用 被加一的索引
     tips_video_speed(video_speed_up[currentSpeed]);     //使前端的速度值与实际一致
}

function set_video_speed_down(){

    var video = $(".bilibili-player-video video")[0];
    var currentSpeed = video_speed_down.indexOf(video.playbackRate)
    if(currentSpeed<video_speed_down.length){
     currentSpeed++;
    }
    if(currentSpeed >= video_speed_down.length){
     currentSpeed = video_speed_down.length;
    }
     video.playbackRate = video_speed_down[currentSpeed];
     tips_video_speed(video_speed_down[currentSpeed]);
}

function click_Barrage(){
    $(".bilibili-player-video-sendbar .bui-checkbox").click();
    $("i[data-text='关闭弹幕']").click();
}
function click_Full_screen(){
    $("button[data-text='进入全屏']").click();

}

$(document).ready(function() {
        $(document).keydown(function(event){ //调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
            switch(event.keyCode){
                case 开关弹幕:
               click_Barrage();
                    break;
                case 增加速度:
                set_video_speed_up();
                    break;
                case 降低速度:
                set_video_speed_down();
                    break;
               case 控制全屏:
               click_Full_screen();
                    break;
                   }
        });
});