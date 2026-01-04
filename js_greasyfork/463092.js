// ==UserScript==
// @name         百度网盘免转存播放视频
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  该脚本可以不转存百度网盘视频便观看完整视频，记得再安装一个HTML5播放器脚本，方便考研的同学看视频（转存可能存不下，还不带自动更新），初步仅在新版edge的Tampermonkey中进行测试，其他情况请自行测试。初步为自用。
// @author       Joyin.Lee
// @match        *://pan.baidu.com/*
// @icon         https://pan.baidu.com/m-static/base/static/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463092/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%8D%E8%BD%AC%E5%AD%98%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463092/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%8D%E8%BD%AC%E5%AD%98%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.onload = function() {
        document.querySelectorAll(".video-start-tip")[0].style.display = "none"
        let video = document.querySelectorAll("#html5player_html5_api")[0]
        video.controls = "true"
        video.pause = null
        document.querySelectorAll("#html5player > div.vjs-control-bar")[0].style.display = "none"
        document.querySelectorAll("#video-wrap-outer > div.video-overlay-iframe")[0].style.display = "none"
    }
})();