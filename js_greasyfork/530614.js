// ==UserScript==
// @name         国家开放大学.上海开放大学.云南开放大学.新疆一体化.广东开放大学.深圳开放大学.四川开放大学.成都开放大学..国家开放大学智能倍速助手 --客服V：wkwk796
// @namespace    http://tampermonkey.net/
// @version      3.6.2
// @description  国家开放大学自动刷课，按下F2可设置播放速度，并不适用所有网站，并不适用所有网站，自行尝试使用，专业视频加速解决方案，支持快捷键/记忆速度，登陆后进入学习空间“我的课程”自动开始学习  客服V：wkwk796
// @author       wkwk796
// @match        *://*.ouchn.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530614/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%BA%91%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%96%B0%E7%96%86%E4%B8%80%E4%BD%93%E5%8C%96%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%B7%B1%E5%9C%B3%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9B%9B%E5%B7%9D%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%88%90%E9%83%BD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%99%BA%E8%83%BD%E5%80%8D%E9%80%9F%E5%8A%A9%E6%89%8B%20--%E5%AE%A2%E6%9C%8DV%EF%BC%9Awkwk796.user.js
// @updateURL https://update.greasyfork.org/scripts/530614/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%BA%91%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%96%B0%E7%96%86%E4%B8%80%E4%BD%93%E5%8C%96%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%B7%B1%E5%9C%B3%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9B%9B%E5%B7%9D%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%88%90%E9%83%BD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E6%99%BA%E8%83%BD%E5%80%8D%E9%80%9F%E5%8A%A9%E6%89%8B%20--%E5%AE%A2%E6%9C%8DV%EF%BC%9Awkwk796.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let currentRate = GM_getValue('playbackRate', 1.0);

    function setPlaybackRate(rate) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.playbackRate = rate;
        });
        GM_setValue('playbackRate', rate);
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === 'F2') {
            const rate = prompt('设置加速倍速 (1-16)，脚本无效加微wkwk796 或在脚本页面获取万能加速链接:', currentRate);
            if (rate !== null && !isNaN(rate)) {
                const parsedRate = parseFloat(rate);
                if (parsedRate >= 1 && parsedRate <= 16) {
                    currentRate = parsedRate;
                    setPlaybackRate(currentRate);
                } else {
                    alert('Invalid rate! Please enter a value between 1 and 16.');
                }
            }
        }
    });

    setPlaybackRate(currentRate);
})();
