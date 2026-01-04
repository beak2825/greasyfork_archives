// ==UserScript==
// @name        哔哩哔哩（bilibili.com）合集循环
// @namespace   Violentmonkey Scripts
// @match       *://*.bilibili.com/*
// @grant       none
// @version     1.0
// @author      CyrilSLi
// @description 播放完合集最后一集视频自动跳转至第一集
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542766/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E5%90%88%E9%9B%86%E5%BE%AA%E7%8E%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/542766/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E5%90%88%E9%9B%86%E5%BE%AA%E7%8E%AF.meta.js
// ==/UserScript==
window.addEventListener("load", () => {
    const player = document.querySelector("#bilibili-player video");
    if (player) {
        player.addEventListener("ended", () => {
            if (location.pathname.includes(document.querySelector(".video-pod__list.section > div:last-child").getAttribute("data-key")) && // 最后一集
                document.querySelector('.bpx-player-ctrl-setting-handoff-content input[type="radio"][value="0"]').checked === true && // 自动切集 on
                document.querySelector('.bpx-player-ctrl-setting-loop input').checked === false) { // 单集循环 off
                function redirect() {
                    window.location.href = "https://www.bilibili.com/video/" + document.querySelector(".video-pod__list.section > div:first-child").getAttribute("data-key"); // 第一集
                }
                const slide = document.querySelector(".pod-slide.video-pod__slide > div");
                if (slide == null) { // 无小节
                    redirect();
                } else if (slide.lastChild.classList.contains("active")) {
                    slide.firstChild.click(); // 切换到第一小节
                    setTimeout(redirect, 1000);
                }
            }
        });
    }
});