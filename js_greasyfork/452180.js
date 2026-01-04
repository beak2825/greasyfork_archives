// ==UserScript==
// @name         测试
// @namespace    skyskysky
// @version      0.1
// @description  根据教程创建https://www.bilibili.com/video/BV19W4y1h7KM
// @author       sky233666
// @include      https://live.bilibili.com/*
// @license      AGPL-3.0
// @icon         https://blog.chrxw.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452180/%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/452180/%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(() => {
    "use strict";
    //去除播放器的开关
    let VEnable = window.localStorage.getItem("VEnable") === "true";
    if (VEnable) {
        setTimeout(() => {
            document.getElementById("live-player").remove();
        }, 3000);
    }
    let btnArea = document.querySelector(".right-ctnr");
    let btn = document.createElement("button");
    btn.id = "removeLive";
    btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
    btn.addEventListener("click", () => {
        VEnable = !VEnable;
        window.localStorage.setItem("VEnable", VEnable);
        btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
        if (VEnable) {
            document.getElementById("live-player").remove();
        } else {
            window.location.reload();
        }
    });
    btnArea.insertBefore(btn, btnArea.children[0]);
})();