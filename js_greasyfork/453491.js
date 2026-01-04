// ==UserScript==
// @name         Bilibili自动点赞
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Bilibili自动点赞 B站自动点赞
// @author       pulse456
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/453491/Bilibili%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/453491/Bilibili%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动点赞
    var x=document.querySelector("#arc_toolbar_report > div.toolbar-left > span.like");
    setInterval(function () { //每50毫秒判定一次
         //点赞代码
        if(x.className=='like') x.click();
            else if(x.className=='like on');
                else console.log("没有找到点赞键脚本失效");

        //只执行上面代码的话会出现已经登陆还要继续登陆的问题  而且登录界面需要叉叉两次才能叉掉 所以用下面的代码关掉登录界面
        if(document.querySelector("body > div:nth-child(23) > div > div.bili-mini-close")!=null)
        {document.querySelector("body > div:nth-child(23) > div > div.bili-mini-close").click();}
        if(document.querySelector("body > div.bili-mini-mask > div > div.bili-mini-close")!=null)
        {document.querySelector("body > div.bili-mini-mask > div > div.bili-mini-close").click();}
    }, 50);
})();