// ==UserScript==
// @name         有谱么-去除网页播放时间限制

// @version      0.1
// @description  去除有谱么网页播放时间限制!
// @author       Liwei
// @match        https://yopu.co/view/*
// @icon         https://cdn.yopu.co/img/logo.bd260b19.svg
// @grant        none
// @license      GPL
// @namespace http://dongliwei.cn/
// @downloadURL https://update.greasyfork.org/scripts/466418/%E6%9C%89%E8%B0%B1%E4%B9%88-%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/466418/%E6%9C%89%E8%B0%B1%E4%B9%88-%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalSetTimeout = window.setTimeout;

    window.setTimeout = function(callback, delay) {
        var timeoutId = 0;

        if(callback.toString().includes("六线谱播放试用结束")){
            console.log("fake 六线谱播放试用结束");
        }else{
            timeoutId = originalSetTimeout(callback, delay);
        }

        return timeoutId;
    };

})();