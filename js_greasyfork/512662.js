// ==UserScript==
// @name         刷课不暂停脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  刷课不暂停脚本v0.1
// @author       random
// @match        https://ilearn.gientech.com/**
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512662/%E5%88%B7%E8%AF%BE%E4%B8%8D%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512662/%E5%88%B7%E8%AF%BE%E4%B8%8D%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.info("刷课不暂停脚本启动");
    console.info("删除消耗性能的打印功能");
    window.console.log = function() {};
    window.timer = setInterval(() => { try{
        var videos = document.getElementsByTagName("video");
        if (videos) {
            for(let i = 0; i < videos.length; i++) {
                let video = videos[i];
                video.play();
            }
        }
    } finally {} }, 1 * 500);
    console.info("刷课不暂停脚本完毕 清除定时器请用 clearInterval(window.timer)");
})();
