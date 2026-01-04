// ==UserScript==
// @name         BiliBili一键开关弹幕/一键网页宽屏/全屏快捷键/速度控制快捷键
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  这个脚本是作者自己嫌在全屏播放时老是要鼠标点击开关弹幕太麻烦，于是就写了一个b站播放器的按键快捷控制
// @author       R君
// @match        *://*.bilibili.com/*
// @grant        none
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430497/BiliBili%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%E4%B8%80%E9%94%AE%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/430497/BiliBili%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%E4%B8%80%E9%94%AE%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

var 开关弹幕 = 76;// L，可以自己更改
var 控制全屏 = 105;//小键盘数字键9，可以自己更改
var 打开宽屏 = 84; // T，可以自己更改
var 控制速度 = 107;//小键盘“+”键，可以自己更改  播放速度设置在一个键上，按一下为1.25倍，按两下1.5呗，三下2倍，第四下回归正常速度
var 网页全屏 = 109;//小键盘“-”键，可以自己更改
var 暂停播放 = 101;//小键盘数字键5，可以自己更改

//以上每一个按键都可以自定义，可以按照自己的喜好自行对照键盘键位对应编码来修改，下面是提供参考的键盘编码表链接

//笔记本电脑或者是没有小键盘的同学，请参考下面的键盘编码表更改键位

// 对照修改的键盘编码表链接，复制右边的链接到地址栏打开  https://jingyan.baidu.com/article/fedf073780e16335ac8977a4.html

function click_wide_screen() {

    $("button[data-text='宽屏模式'] svg").click();      //button[data-text='宽屏模式'] svg  这句意思是选择data-text属性值为'宽屏模式' 的button标签下的svg标签

}

function click_Barrage() {

    //$(".bilibili-player-video-sendbar .bui-checkbox").click();
    $("div[class='bpx-player-dm-switch bui bui-switch'] div[class='bui-area']").children().click();
    $("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").children().click();


}

$(document).ready(function() {
		$(document).keydown(function(event) {     //调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
            switch(event.keyCode) {
                case 开关弹幕:
                    click_Barrage();
                    break;
                case 打开宽屏:
                    click_wide_screen();
                    break;
                   }
		});
});