// ==UserScript==
// @name               自研 - 哔哩哔哩、AcFun - 快捷 8 倍速播放
// @name:en_US         Self-made - BiliBili, AcFun - Fast 8x speed playback
// @description        当按住`.`键时，视频会以 8 倍速播放。可用于跳过片头或片尾、中插广告或无聊片段等。
// @description:en_US  When holding down the period key `.`, the video will play at an 8 times faster speed. This feature can be used to skip over opening and closing credits, mid-roll advertisements, or dull segments, etc.
// @version            1.0.5
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.bilibili.com/bangumi/play/*
// @match              https://www.bilibili.com/cheese/play/*
// @match              https://www.bilibili.com/festival/*
// @match              https://www.bilibili.com/video/*
// @match              https://www.bilibili.com/list/*
// @match              https://www.acfun.cn/v/*
// @match              https://www.acfun.cn/bangumi/*
// @icon               https://static.hdslb.com/images/favicon.ico
// @run-at             document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484987/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81AcFun%20-%20%E5%BF%AB%E6%8D%B7%208%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/484987/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81AcFun%20-%20%E5%BF%AB%E6%8D%B7%208%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「重复」变量；「元素选择器」函数。
    var repeat = false;
    function $(elm) {
        return document.querySelector(elm);
    }

    // 当按键按下、未重复执行且按下的是`.`键，就 8 倍速播放视频且重复执行设置为真。
    addEventListener("keydown", (data) => {
        if(!repeat && data.key === ".") {
            $('video').playbackRate = 8;
            repeat = true;
        }
    });
    // 当按键按下、重复执行且按下的是`.`键，就原速播放视频且重复执行设置为假。
    addEventListener("keyup", (data) => {
        if(repeat && data.key === ".") {
            $('video').playbackRate = 1;
            repeat = false;
        }
    });

})()