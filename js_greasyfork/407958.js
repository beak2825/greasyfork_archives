// ==UserScript==
// @name         跳过哔哩哔哩新加载界面
// @namespace    ckylin-prevent-new-loading-screen
// @version      0.1
// @description  隐藏新版哔哩哔哩的加载界面，直接显示视频内容。
// @author       CKylinMC
// @run-at       document-start
// @match        *.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407958/%E8%B7%B3%E8%BF%87%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E5%8A%A0%E8%BD%BD%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/407958/%E8%B7%B3%E8%BF%87%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E5%8A%A0%E8%BD%BD%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement("style");
    style.innerHTML = ".bilibili-player-video-wrap .bilibili-player-video-panel {display: none!important;}";
    document.head.appendChild(style);
})();