// ==UserScript==
// @name               自研 - 豆瓣 - 调整预告片音量
// @name:en_US         Self-made - douban - Modify trailer volume
// @description        当预告片播放时自动调整音量。
// @description:en_US  When trailers play, automatically adjust the volume.
// @version            2.0.1
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://movie.douban.com/trailer/*
// @icon               https://douban.com/favicon.ico
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/486971/%E8%87%AA%E7%A0%94%20-%20%E8%B1%86%E7%93%A3%20-%20%E8%B0%83%E6%95%B4%E9%A2%84%E5%91%8A%E7%89%87%E9%9F%B3%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/486971/%E8%87%AA%E7%A0%94%20-%20%E8%B1%86%E7%93%A3%20-%20%E8%B0%83%E6%95%B4%E9%A2%84%E5%91%8A%E7%89%87%E9%9F%B3%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「视频元素」变量和「保存音量值」函数。
    const video = document.querySelector('.video-js video');

    function saveVolume() {

        // 定义「音量值」变量。
        let volume = ""

        // 判断数值是否合规，如果合规就继续往下执行。
        do {

            volume = window.prompt("请输入您期望的音量。", GM_getValue("volume", 10));

        } while (typeof volume !== 'number' && !(volume > 0 && volume <= 100));

        // 写入「音量值」变量至数据。
        GM_setValue("volume", volume);

    }


    // 判断「音量值」数据是否被定义，如果没有就定义。
    if(!GM_getValue("volume")) {

        saveVolume();

    }


    // 修改视频音量
    video.volume = GM_getValue("volume") * 0.01;


    // 增加「修改音量」菜单命令。
    GM_registerMenuCommand("修改音量", () => {

        // 读取新「音量值」后修改视频音量。
        saveVolume();
        video.volume = GM_getValue("volume") * 0.01;

    })

})();