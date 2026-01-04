// ==UserScript==
// @name         Youtube视频字幕快捷切换（快捷键：F2）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Youtube视频播放页面，通过按下F2键来快速打开字幕并切换字幕
// @author       无关风月
// @match        http*://www.youtube.com/*
// @grant        none
// @supportURL   https://blog.csdn.net/changqing5818/article/details/50037607
// @downloadURL https://update.greasyfork.org/scripts/374066/Youtube%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%EF%BC%88%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%9AF2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/374066/Youtube%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%EF%BC%88%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%9AF2%EF%BC%89.meta.js
// ==/UserScript==
   'use strict';
// window.location.reload(); // 重新刷新网页 ，实际上脚本默认网页加载完再执行，因此加入该命令后会一直刷新
// setTimeout(myfun, 1000); //延时执行函数

 document.onkeydown=function(event){  //按下某个按键后开始执行命令
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==113){ // 按 F2
                //要做的事情
				myfun();
            }
/*             if(e && e.keyCode==13){ // enter 键
                //要做的事情
				alert("按 Enter");
            }
			if (e.keyCode == 86 && e.ctrlKey) {
                alert("你按下了ctrl+V");
            }
               if(e && e.keyCode==27){ // 按 Esc
                //要做的事情
				alert("按 esc");
            } */
         };

function myfun() { // 用于切换youtube的字幕的主程序
   var switch_zimu = document.getElementsByClassName("ytp-subtitles-button ytp-button")[0].getAttribute("aria-pressed") //存储现有字幕开始状态变量
   if(switch_zimu == 'false'){ //判断字幕现在是否处于开启状态
       document.getElementsByClassName("ytp-subtitles-button ytp-button")[0].click(); //点击字幕开关按钮
       document.getElementsByClassName("ytp-button ytp-settings-button")[0].click(); //点击设置按钮
       document.getElementsByClassName("ytp-menuitem")[3].click() //点击字幕选择按钮
   }
   else{
       document.getElementsByClassName("ytp-button ytp-settings-button")[0].click();
       document.getElementsByClassName("ytp-menuitem")[3].click();
   }
}
