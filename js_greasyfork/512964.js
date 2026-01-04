// ==UserScript==
// @name         Bilibili wide screen
// @namespace    http://tampermonkey.net/
// @version      2024-12-17
// @description  full screen to wide monitor, Alt+v
// @author       subZJ
// @match         https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512964/Bilibili%20wide%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/512964/Bilibili%20wide%20screen.meta.js
// ==/UserScript==


(function () {
    'use strict';

    document.addEventListener('keydown', (event) => {

        if (event.altKey) {
            if (event.key == 'v')
            {
                zoom();
            }
        }
    });

    function zoom() {
        //创建视频位置数组
        var videoBoxSite = new Array("bpx-player-video-wrap","bilibili-player-video-wrap");
        var videoBox;

        //匹配正确位置
        for (var i = 0; i < videoBoxSite.length; i++) {
            if (document.getElementsByClassName(videoBoxSite[i]).length >0) {
                videoBox = document.getElementsByClassName(videoBoxSite[i])[0];
            }
        }
        //wide
        videoBox.setAttribute("style","transform: scale(1.34);");
        //full screen
        document.querySelector('.bpx-player-ctrl-full').click();

    }
})();
