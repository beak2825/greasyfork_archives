// ==UserScript==
// @name         广西继续教育自动点击播放
// @namespace    www.31ho.com
// @version      1.0
// @description  自动播放视频
// @author       keke31h
// @match        https://jxjy.gxcic.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471449/%E5%B9%BF%E8%A5%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/471449/%E5%B9%BF%E8%A5%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成后执行脚本
    window.addEventListener('DOMContentLoaded', function() {
        // 模拟点击播放按钮
        var playButton = document.getElementById('videoPlayerPlayBtn');
        if (playButton) {
            playButton.click();
        }
    });
})();