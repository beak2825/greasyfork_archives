// ==UserScript==
// @name         RemoveLive
// @namespace    http://meng.cpm/
// @version      0.1
// @description  模仿chr_写的B站直播间移除插件
// @author       meng
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/449877/RemoveLive.user.js
// @updateURL https://update.greasyfork.org/scripts/449877/RemoveLive.meta.js
// ==/UserScript==

(function() {
    debugger;
    'use strict';
    // 给浏览器放入一个键值对，永久保存在浏览器中
    let VEnable = window.localStorage.getItem("VEnable") === "true";
    if(VEnable){
        setTimeout(() => {
            document.getElementById("live-player").remove();
        }, 3000);
    }
    let btnArea = document.querySelector(".right-ctnr");
    let btn = document.createElement("botton");
    btn.id = "removelive";
    btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
    btn.addEventListener("click",function(){
        VEnable = !VEnable;
        window.localStorage.setItem("VEnable",VEnable);
        btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
        if(VEnable){
            document.getElementById("live-player").remove();
        }else{
            window.location.reload();
        }
    });
    btnArea.insertBefore(btn,btnArea.children[0]);
   
})();