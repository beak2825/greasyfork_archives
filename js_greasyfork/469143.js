// ==UserScript==
// @name         自动播放下一个视频脚本
// @namespace    http://tampermonkey/net/
// @version      1
// @description  自动播放下一个视频脚本，适用于某些需要自动播放的视频网站，如http://xyjxjy.ylxue.net/等。
// @author       Your Name
// @match        http://xyjxjy.ylxue.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469143/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469143/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果当前网页需要自动播放，则播放下一个视频
    if (window.location.href.indexOf('http://xyjxjy.ylxue.net') !== -1) {
        var next_video_elements = document.querySelector('.nextchapter'); // 查找下一个视频的按钮
        if (next_video_elements) {
            next_video_elements.click(); // 点击按钮，播放下一个视频
        }
    }
})();
