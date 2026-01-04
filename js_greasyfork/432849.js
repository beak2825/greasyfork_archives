// ==UserScript==
// @name         百度百科去广告,秒懂百科禁止自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  百度百科优化
// @author       1332019995@qq.com
// @match        https://baike.baidu.com/item/*
// @run-at       document-start
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432849/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/432849/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

function buildStyle(arr) {
    var ret = '<style>';
    arr.forEach(a => { ret += a + ' { display: none!important; }' });
    return ret + '</style>';
}

const adsList = [".navbar-bg-top .appdownload", ".unionAd .union-content", ".after-content", ".header .topA", "#side-share", "#J-declare-wrap"];
const baikeVideoId = "sl-player-el-video";
const styleInsert = buildStyle(adsList);

(function() {
    'use strict';
    (document.head || document.documentElement).insertAdjacentHTML('beforeend', styleInsert);
    function tryPausingVideo(videoEle) {
        videoEle.pause();
        !videoEle.paused && setTimeout(tryPausingVideo, 10, videoEle);
    }
    window.onload = function() {
        tryPausingVideo(document.getElementById(baikeVideoId));
    }
})();