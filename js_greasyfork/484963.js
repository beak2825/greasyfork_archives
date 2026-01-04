// ==UserScript==
// @name         哔哩哔哩手动增加视频播放量
// @description  手动给自己的视频自己播放量
// @version      0.1
// @namespace    http://tampermonkey.net/
// @author       Any
// @license      MIT
// @match        *://*.bilibili.com/*
// @include	     *://www.bilibili.com/**
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484963/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%89%8B%E5%8A%A8%E5%A2%9E%E5%8A%A0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484963/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%89%8B%E5%8A%A8%E5%A2%9E%E5%8A%A0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F.meta.js
// ==/UserScript==

    var Test1 = ["https://www.bilibili.com/video/xxx"]; //视频链接

    window.setInterval(a,360000);//6分钟间隔

    function Sleep(d){
        for(var t = Date.now();Date.now() - t <= d;);
    }


    function a (){
        for (var i=0; i<Test1.length; i++) {
            var ww = window.open(Test1[i]);
                Sleep(2000);//页面打开后2秒再关闭
                ww.close();
            if (ww==null){
                window.open([i]);
            }
        }
    }

