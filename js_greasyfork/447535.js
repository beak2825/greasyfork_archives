// ==UserScript==
// @name         HioVideo Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  help you better to pass the video
// @author       yaochuan
// @match        https://hio.oppo.com/app/module/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oppo.com
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447535/HioVideo%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447535/HioVideo%20Helper.meta.js
// ==/UserScript==

// History
// 0.1 - 自动播放，自动下一集
// 0.2 - 播放按钮判断是否显示，10集后停止脚本
(function() {
    'use strict';
    console.log('########## start');

    // 定时检查视频是否可以播放，是否已经播放完成
    var playing = false;
    var ctrlNum = 0;
    var interval = setInterval(function(){
        var nextVideoBtn = document.querySelector('#my_video_1 > div.nextVideoBtn');
        var playVideoBtn = document.querySelector('#my_video_1 > button');
        var rate = document.querySelector('#my_video_1 > div.vjs-control-bar > div.vjs-playback-rate.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button > div.vjs-playback-rate-value');
        console.log('########## check by interval');

        if (playVideoBtn && playVideoBtn.offsetParent !== null) {
            // 有播放按钮且按钮显示出来了，表示可以播放，自动点击
            console.log('########## playVideoBtn found');
            playVideoBtn.click();
        }

        if (rate) {
            var strRate = rate.innerText.trim();
            if (strRate != "2x") {
                var rate2x = document.querySelector('#my_video_1 > div.vjs-control-bar > div.vjs-playback-rate.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button > div.vjs-menu > ul > li:nth-child(1)');
                rate2x.click();
                console.log('rate2x.click');
            }
        }

        if (nextVideoBtn) {
            // 播放完成，自动跳转下一集
            console.log('########## nextVideoBtn found, %d', ctrlNum);
            ctrlNum++;
            nextVideoBtn.click();
            // 超过10次点击“下一集”就退出，一般不会超过10集
            if (ctrlNum >= 10) {
                clearInterval(interval);
                console.log('########## stop interval');
            }
        }
    }, 3000);

    console.log('########## end');
})();
