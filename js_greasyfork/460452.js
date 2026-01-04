// ==UserScript==
// @name         RemoveLive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭bilibili直播间播放器
// @author       Goose
// @match        https://live.bilibili.com/*
// @license      AGPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460452/RemoveLive.user.js
// @updateURL https://update.greasyfork.org/scripts/460452/RemoveLive.meta.js
// ==/UserScript==

(() => {
    'use strict';

    //去除播放器开关
    let VEnable = localStorage.getItem("VEnable") === "true";//bool，恢复或移除
    if(VEnable){
        setTimeout(()=>{//创建定时器
            document.getElementById("live-player").remove();
        },3000);
    }
    let btnArea = document.querySelector(".right-ctnr");//按钮位置，querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素
    let btn = document.createElement("button");
    //btn.id = "removeLive";
    btn.textContent = VEnable ? "恢复播放器" : "移除播放器";//改变按钮名称
    btn.addEventListener("click",()=>{//创建事件监听器
        VEnable = !VEnable;
        localStorage.setItem("VEnable",VEnable);//将VEnable新值写入
        btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
        if(VEnable){
            document.getElementById("live-player").remove();//移除屏幕
        }else{
            location.reload();
        }
    });
    btnArea.insertBefore(btn,btnArea.children[0]);//插入
})();