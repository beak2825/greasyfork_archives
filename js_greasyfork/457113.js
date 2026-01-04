// ==UserScript==
// @name         SB爱学教云学院
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fuck You ！SB爱学教云学院
// @author       香辣肥肠大王
// @match        *://www.51ixuejiao.com/*
// @icon         http://xhz.html-5.me/view.php/b5838b965472bd5359dcd717f2a6530c.png
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/457113/SB%E7%88%B1%E5%AD%A6%E6%95%99%E4%BA%91%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/457113/SB%E7%88%B1%E5%AD%A6%E6%95%99%E4%BA%91%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(function(){
    'use strict';
    // Your code here...
    window.onload = function(){ document.querySelector("video").play(); }//页面加载完成自动播放
    setInterval(function(){
        if(document.querySelector("video").playbackRate !== 3.5){ document.querySelector("video").playbackRate = 3.5; }//自动3.5倍速
        if(document.querySelector("video").paused == true){ document.querySelector("video").play(); }//检测到暂停自动播放
        const buttonEle = document.getElementsByClassName("el-button el-button--default el-button--small el-button--primary")[0];//判断视频结束
        if(buttonEle){ buttonEle.click() };//自动进入下一章
    }, 1000);
})();