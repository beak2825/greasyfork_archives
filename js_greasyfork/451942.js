// ==UserScript==
// @name         Remove_Live
// @name:zh-CN   去除B站直播间播放器
// @namespace    https://github.com/Zhihui412
// @version      2.0
// @description  去除B站多余的直播播放器^^
// @author       hiuzh
// @include      https://live.bilibili.com/*
// @license      AGPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=git-scm.com
// @downloadURL https://update.greasyfork.org/scripts/451942/Remove_Live.user.js
// @updateURL https://update.greasyfork.org/scripts/451942/Remove_Live.meta.js
// ==/UserScript==

(() => {
    "use strict";
    let isRemove = false;

    // 定义创建按钮
    let btn = document.createElement("button");
    btn.id = "removeLive";
    btn.textContent = isRemove ? "恢复播放器" : "移除播放器";

    // 获取dom元素，插入按钮
    let btnArea = document.querySelector(".right-ctnr");
    btnArea.insertBefore(btn, btnArea.children[0]);

    // 给按钮添加点击事件
    btn.addEventListener("click", () => {
        // 取反
        isRemove = !isRemove;
        window.localStorage.setItem("isRemove", isRemove);
        btn.textContent = isRemove ? "恢复播放器" : "移除播放器";
        if (isRemove) {
            // 移除直播间播放器            
            document.getElementById("live-player").remove();
        } else {
            // 否则重新加载页面
            window.location.reload();
        }
    });
})();