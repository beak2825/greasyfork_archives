// ==UserScript==
// @name         YouTube 一键画中画
// @namespace    PiP_Youtube_Button
// @version      1.1
// @description  在YouTube播放器控制栏添加一个画中画按钮
// @author       你
// @match        *://*.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546551/YouTube%20%E4%B8%80%E9%94%AE%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/546551/YouTube%20%E4%B8%80%E9%94%AE%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        const controls = document.querySelector(".ytp-right-controls");
        if (!controls) return;

        if (document.querySelector("#pip-button")) return;

        const btn = document.createElement("button");
        btn.id = "pip-button";
        btn.className = "ytp-button";
        btn.title = "画中画 (Picture-in-Picture)";
        btn.innerHTML = "📺";

        // 放大按钮
        btn.style.fontSize = "20px";  // 默认大约14px，这里放大一些
        btn.style.lineHeight = "24px";
        btn.style.cursor = "pointer";

        btn.onclick = async () => {
            const video = document.querySelector("video");
            if (!video) return;
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                try {
                    await video.requestPictureInPicture();
                } catch (err) {
                    console.error("无法进入画中画:", err);
                }
            }
        };

        controls.insertBefore(btn, controls.firstChild);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
