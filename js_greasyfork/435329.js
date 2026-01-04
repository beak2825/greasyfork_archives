// ==UserScript==
// @name         BiliBili 一键开关 弹幕 danmu
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  默认通过快捷键“/” 键来显示或隐藏弹幕。也可通过更改代码中的”danmu“ 变量值来修改快捷键。 <br> 默认初始关闭弹幕，可通过更改”defaultClosing“变量为0，来默认初始开启弹幕.
// @author       Ben
// @match        *://*.bilibili.com/*
// @grant        none
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435329/BiliBili%20%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%20%E5%BC%B9%E5%B9%95%20danmu.user.js
// @updateURL https://update.greasyfork.org/scripts/435329/BiliBili%20%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%20%E5%BC%B9%E5%B9%95%20danmu.meta.js
// ==/UserScript==

// code reference : https://github.com/akiirui/userscript/blob/bilibili-danmaku-disabler/userscript.js

var danMu = 191; //"/"，可以自己更改
var defaultClosing = 1;// 是否默认开启弹幕. 1：默认关闭，0：默认开启

const button = ".bui-danmaku-switch-input"; // ".bui-switch-input";
const danmuLabel = ".choose_danmaku";
const danmuHover = ".bilibili-player-video-danmaku-switch.bui.bui-switch"

$(document).ready(function() {
        //Close the danmu by default?
        function defaultClosing(){
            if($(danmuHover).length>0 && $(button).length>0 ){
                              clearInterval(id);
                              //$(danmuHover).dispatchEvent( new MouseEvent('mouseover', {'view': window, 'bubbles': true, 'cancelable': true }) );
                              $(danmuHover).mouseover(); // danmuLabel-class only appear after this excution.
                              //console.log('aa');
                              console.log($(danmuHover).attr("aria-label") + " ben");
                              console.log($(danmuLabel).text() + " ben");
                              if( $(danmuLabel).text() == "关闭弹幕" && defaultClosing){
                                // Run disabler
                                $(button).click();
                              }
            }
        }
        var id = setInterval(defaultClosing, 500);

        //在页面内跳转到其它视频
        $(document).on('click','.video-page-card',function(){
            id = setInterval(defaultClosing, 500);
		});

		$(document).keydown(function(event){//listener，调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
            switch(event.keyCode){
                case danMu:
                    $(button).click();
                break;
            }
		});
});