// ==UserScript==
// @name         微信读书 滑轮 翻页
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  鼠标滑轮翻页
// @author       You
// @match        https://weread.qq.com/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_16h.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505715/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20%E6%BB%91%E8%BD%AE%20%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/505715/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20%E6%BB%91%E8%BD%AE%20%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

// api           https://www.tampermonkey.net/documentation.php

(function () {
    "use strict";

    let scrollEnabled = true; // 控制滚轮监听的标志

    // 侦听滚轮事件
    window.addEventListener("wheel", (e) => {
        // 如果禁用了滚轮事件则不做任何处理
        if (!scrollEnabled) return;

        if (e.deltaY > 0) {
            document.querySelector(".renderTarget_pager_button_right").click();
        } else if (e.deltaY < 0) {
            document.querySelector(".renderTarget_pager_button").click();
        } else if (e.deltaX < 0) {
            // 向右滚动，尝试点击“上一页”按钮
            document.querySelector(".renderTarget_pager_button").click();
        } else if (e.deltaX > 0) {
            // 向左滚动，尝试点击“下一页”按钮
            document.querySelector(".renderTarget_pager_button_right").click();
        }
    });

    // 检查窗口是否已打开
    function isWindowOpen() {
        const panel = document.querySelector(".reviews_panel");
        // 判断该元素的display属性是否为none
        return window.getComputedStyle(panel).display !== "none";
    }

    // 定期检查窗口状态，启用或禁用滚轮事件
    setInterval(() => {
        if (isWindowOpen()) {
            scrollEnabled = false; // 窗口打开时禁用滚轮事件
        } else {
            scrollEnabled = true;  // 窗口关闭时启用滚轮事件
        }
    }, 100); // 每100毫秒检查一次窗口状态

    const style = document.createElement("style");
    style.innerText = ".reader_pdf_tool { display: none !important }";
    document.body.appendChild(style);
})();
