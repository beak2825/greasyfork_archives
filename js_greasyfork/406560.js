// ==UserScript==
// @name         百度百科、百度经验、百度贴吧 禁止自动播放视频
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  百度百科、百度经验、百度贴吧 禁止自动播放视频，视频默认改为暂停。
// @license      BSD-3-Clause
// @author       别问我是谁请叫我雷锋
// @incompatible firefox Firefox出现无效的问题，原因还在调查中（开发者版有时候也是有效的）
// @match        https://baike.baidu.com/*
// @match        https://jingyan.baidu.com/*
// @match        https://tieba.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406560/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E3%80%81%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E3%80%81%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/406560/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E3%80%81%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E3%80%81%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function pauseVideo() {
        document.getElementsByTagName("video")[0].pause();
        document.getElementsByTagName("video")[0].removeEventListener("timeupdate", pauseVideo);
    }


    window.onload = function () {
        if (location.hostname == "baike.baidu.com") {
            document.getElementsByTagName("video")[0].addEventListener("timeupdate", pauseVideo);
        }
        if (location.hostname == "jingyan.baidu.com") {
            document.getElementsByTagName("video")[0].addEventListener("timeupdate", pauseVideo);
        }
        if (location.hostname == "tieba.baidu.com") {
            $(".threadlist_video").on("DOMSubtreeModified", function () {
                for (var x in document.getElementsByTagName("video")) {
                    document.getElementsByTagName("video")[x].addEventListener("timeupdate", pauseVideo);
                }
            });
            try {
                document.getElementsByTagName("video")[0].addEventListener("timeupdate", pauseVideo);
            } catch (err) {

            }
        }
    }
})();