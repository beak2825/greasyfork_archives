// ==UserScript==
// @name         Remove_Live
// @name:zh-CN   去除B站直播间播放器
// @namespace    https://blog.chrxw.com
// @version      1.1
// @description  去除B站多余的直播播放器（滑稽）
// @description:zh-cn hai
// @author       Chr_
// @include      https://live.bilibili.com/*
// @license      AGPL-3.0
// @icon         https://blog.chrxw.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/453961/Remove_Live.user.js
// @updateURL https://update.greasyfork.org/scripts/453961/Remove_Live.meta.js
// ==/UserScript==

(() => {
    "use strict";
    //去除播放器的开关
    let VEnable = localStorage.getItem("VEnable") === "true";
    if (VEnable) {
        setTimeout(() => {
            document.getElementById("live-player").remove();
        }, 3000);
    }
    let btnArea = document.querySelector(".right-ctnr");
    let btn = document.createElement("button");
    btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
    btn.addEventListener("click", () => {
        VEnable = !VEnable;
        localStorage.setItem("VEnable", VEnable);
        btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
        if (VEnable) {
            document.getElementById("live-player").remove();
        } else {
            location.reload();
        }
    });
    btnArea.insertBefore(btn, btnArea.children[0]);
})();
