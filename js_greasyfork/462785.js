// ==UserScript==
// @name         B站全屏时显示系统时间和进度条
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  自用脚本，B站全屏时显示系统时间和进度条
// @author       TAUGGE
// @include      https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js#sha512-pumBsjNRGGqkPzKHndZMaAG+bir374sORyzM3uulLV14lN5LyykqNk8eEeUlUkB3U0M4FApyaHraT65ihJhDpQ==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462785/B%E7%AB%99%E5%85%A8%E5%B1%8F%E6%97%B6%E6%98%BE%E7%A4%BA%E7%B3%BB%E7%BB%9F%E6%97%B6%E9%97%B4%E5%92%8C%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/462785/B%E7%AB%99%E5%85%A8%E5%B1%8F%E6%97%B6%E6%98%BE%E7%A4%BA%E7%B3%BB%E7%BB%9F%E6%97%B6%E9%97%B4%E5%92%8C%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 系统时间脚本
    const $systemTimeDiv = $('<div id="full-screen-system-time"></div>');
    $('video').first().parent().prepend($systemTimeDiv);

    let timeNow = new Date().toLocaleTimeString();
    $systemTimeDiv.innerHtml = timeNow;

    setInterval(() => {
        timeNow = new Date().toLocaleTimeString();
        $systemTimeDiv.text(timeNow);
    }, 1000);

    // 设置样式
    const $injectCSS = document.createElement('style');
    $('head').append($injectCSS);
    $injectCSS.sheet.insertRule(`/* 修改播放列表高度 */div.video-sections-content-list {max-height: 600px !important;height: unset !important;}`);
    $injectCSS.sheet.insertRule(`div#full-screen-system-time {position: absolute;top: 30px;right: 30px;font-size: 32px;color: #f00;text-shadow: 0 0 5px #fff;background: rgba(0,0,0,0.1);box-sizing: content-box;opacity: 0;}`);
    $injectCSS.sheet.insertRule(`/* 全屏播放时显示系统时间 */div.bpx-player-container[data-screen=full] div#full-screen-system-time {opacity: 0.8;}`);
    $injectCSS.sheet.insertRule(`/* 全屏播放时显示进度条 */div.bpx-player-container.bpx-state-no-cursor[data-screen=full] div.bpx-player-shadow-progress-area {opacity: 1 !important;visibility: visible;height: 5px;}`);
})();