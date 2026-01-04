// ==UserScript==
// @name         BiliBili一键全屏/播放暂停/开关弹幕/更改播放速度
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  这个脚本是作者自己为了偷懒而写的
// @author       沈闲
// @match        *://*.bilibili.com/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/433864/BiliBili%E4%B8%80%E9%94%AE%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E6%9A%82%E5%81%9C%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%E6%9B%B4%E6%94%B9%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/433864/BiliBili%E4%B8%80%E9%94%AE%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E6%9A%82%E5%81%9C%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%E6%9B%B4%E6%94%B9%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

var 开关弹幕 = 68;
//var 网页全屏 = 49; //数字1
var 网页全屏 = 70; //按F
var 暂停播放 = 66;//按B
//var 播放速度 = 107;//按+
var 播放速度 = 192;//按~
var 回到主页 = 90;//按


//以上每一个按键都可以自定义，可以按照自己的喜好自行对照键盘键位对应编码来修改，下面是提供参考的键盘编码表链接

//笔记本电脑或者是没有小键盘的同学，请参考下面的键盘编码表更改键位

// 对照修改的键盘编码表链接，复制右边的链接到地址栏打开  https://jingyan.baidu.com/article/fedf073780e16335ac8977a4.html

function click_web_Full_screen(){
    $(".squirtle-video-fullscreen").click();
}

function click_Barrage(){
    let url = window.location.href;
    if (url.indexOf('bangumi') != -1)
    {
    $("input.bui-switch-input").click();
    }
    else{
    $("label.bui-switch-label").click();
    }

}
function stop_video(){
    let url = window.location.href;
    if (url.indexOf('bangumi') != -1)
    {
   $('.bpx-player-video-wrap').click();
    }
    else{
   $('.bilibili-player-video-state').click();
    }

}

function video_speed(){
  let speed = $('.squirtle-select-item.active')
      let url = window.location.href;
    if (url.indexOf('bangumi') != -1)
    {
        change_speed('.squirtle-select-item.active','active')
    }
    else{
        change_speed('.bilibili-player-active','bilibili-player-active')
    }
}

function change_speed(class_name,active_name){
    let el = $(class_name)
    let new_el = ''
    el.removeClass(active_name)
    if (el.prev().length > 0)
    {
    new_el = el.prev()
    }
    else
    {
    new_el = el.siblings(":last")
    }
    new_el.addClass(active_name)
    let speed = Number(new_el.text().replace('x',''))
    document.querySelector('video').playbackRate = speed
}

function home_page(){
let url = document.domain
window.location.href = "http://" + url
}

$(document).ready(function() {
		$(document).keydown(function(event){     //调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
             //判断是否正在输入文本，如果是的话，就不触发
            if($(':focus').length!=0) {
                //alert("暂无获得焦点的元素");
                return
            }
            switch(event.keyCode){
                case 开关弹幕:
               click_Barrage();
                    break;
                case 网页全屏:
                click_web_Full_screen();
                    break;
                case 暂停播放:
                stop_video();
                    break;
                case 播放速度:
                video_speed();
                    break;
                case 回到主页:
                home_page();
                    break;
                   }
		});
});