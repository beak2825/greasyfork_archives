// ==UserScript==
// @name         Bilibili充电不鸣谢
// @description  Bilibili视频结束充电鸣谢不弹出，直接下一视频
// @match        https://www.bilibili.com/video/*
// @version      0.1
// @namespace https://greasyfork.org/users/439775
// @downloadURL https://update.greasyfork.org/scripts/442787/Bilibili%E5%85%85%E7%94%B5%E4%B8%8D%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/442787/Bilibili%E5%85%85%E7%94%B5%E4%B8%8D%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    document.querySelector('video').onended = () => document.querySelector('.bilibili-player-iconfont-next').click();
})();

