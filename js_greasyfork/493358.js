// ==UserScript==
// @name         三三影院优化-自动播放下一集
// @namespace    chulong.script
// @version      0.1
// @date         2024-04-23
// @description  三三影院优化，自动播放下一集，再也不用频繁手动点击了，尤其是看短剧
// @author       chulong
// @match        https://www.qiju.cc/vod/play/id/*
// @match        https://www.qiju.cc/addons/dp/player/dp.php?key=*
// @icon         https://www.qiju.cc/static/Streamlab/img/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/493358/%E4%B8%89%E4%B8%89%E5%BD%B1%E9%99%A2%E4%BC%98%E5%8C%96-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/493358/%E4%B8%89%E4%B8%89%E5%BD%B1%E9%99%A2%E4%BC%98%E5%8C%96-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    if (window.top === window.self) return; // 因为 播放器在iframe中，一下对播放器的操作主要在 iframe中 ，所以当他是整个主页面的时候直接跳过
    let video = document.querySelector("video");
    if (!video) {
        return;
    }
    video.addEventListener("ended", (event) => {
        let 当前播放集 = window.top.document.querySelector('.play-on').parentElement
        if (当前播放集.parentElement.nextElementSibling) {
            window.top.location.href = 当前播放集.parentElement.nextElementSibling.firstElementChild.href
        }

    })
})();