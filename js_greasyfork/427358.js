// ==UserScript==
// @name         视频倍速
// @namespace    https://pinkpig-ink.github.io/NiceCode/
// @version      1.0
// @description  一个网页播放调速脚本
// @author       PinkPig_粉红猪
// @match        *://www.bilibili.com/*
// @match        *://v.qq.com/*
// @match        *://www.youtube.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427358/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/427358/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let item = '<input id="range" type="number" value="1.0" min="0.1" max="20" step="0.1" style="width: 100px; color: blueviolet; z-index:999; font-weight: 700; position: absolute; margin-top: 100px; ">';
    $('body').prepend(item);
    window.setInterval(() => {
        let rate = document.querySelector("#range").value || 1.0;

        let htmlvideo = $('video').length;
        if (htmlvideo > 0) {
            if(!$('video')[0].paused){
                document.querySelector('video').defaultPlaybackRate = rate;
                console.log('倍速播放中：' + rate + '倍速');
            }
            document.querySelector('video').playbackRate = rate;
        }else {
            console.log('这个网站不支持倍速播放哦');
        }
    }, 1000);
})();