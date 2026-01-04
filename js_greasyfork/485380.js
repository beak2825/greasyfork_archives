// ==UserScript==
// @name         Bilibili关闭连播
// @namespace    https://github.com/Owwkmidream
// @version      1.0.2
// @description  关闭连播
// @author       Owwkmidream
// @run-at       document-start
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485380/Bilibili%E5%85%B3%E9%97%AD%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/485380/Bilibili%E5%85%B3%E9%97%AD%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let loadReady = false;
    let loadReadyEtime = 0;
    let Inteval = 5000;
    let OutTime = true;

    function loadReadyVideoCheck() {
        if (document.getElementsByClassName('nav-search-input')[0] && document.getElementsByClassName('nav-search-input')[0].title != '' && document.getElementsByClassName('bpx-player-video-info')[0]) {
            console.log('[' + '页面加载完毕');
            loadReady = true;
        }
        else if (loadReadyEtime < 30000 || OutTime) {
            loadReadyEtime += Inteval;
            setTimeout(loadReadyVideoCheck, Inteval);
        }
        else {
            console.log('[' + '页面加载计时器超时');
            loadReady = true;
        }
    }

    loadReadyVideoCheck();
    smartNextPlayVideoCheck();

    function smartNextPlayVideoCheck() {
        if (document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0] && loadReady) {
            document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[1].children[0].click();
            console.log('[' + '智能连播 - 检测到当前为单集视频已关闭自动连播');
        }
        // else if (!loadReady)
            setTimeout(smartNextPlayVideoCheck, Inteval);
    }
})();