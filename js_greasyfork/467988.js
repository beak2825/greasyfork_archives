// ==UserScript==
// @name         Youtube 默认宽屏(剧场模式)
// @namespace    Youtube Automatically load Theater mode
// @version      2023.08.29.01
// @description  Youtube 默认宽屏/剧场模式(自动点击宽屏按钮)
// @author       James Wood
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467988/Youtube%20%E9%BB%98%E8%AE%A4%E5%AE%BD%E5%B1%8F%28%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467988/Youtube%20%E9%BB%98%E8%AE%A4%E5%AE%BD%E5%B1%8F%28%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function switchToTheaterMode() {
        // 检查当前视频是否已经处于剧场模式
        var theaterModeButton = document.querySelector('.ytp-size-button.ytp-button');
        console.log('theaterModeButton:', theaterModeButton);
        if (theaterModeButton) {
            var titleNoTooltip = theaterModeButton.getAttribute('data-title-no-tooltip');
            console.log('titleNoTooltip:', titleNoTooltip);
            if (titleNoTooltip == '剧场模式') {
                // 点击剧场模式按钮切换到剧场模式
                theaterModeButton.click();
                console.log('切换到剧场模式');
            } else {
                console.log('已经处于剧场模式');
            }
        } else {
            console.log('未找到剧场模式按钮');
        }
    }

    function waitForLoad() {
        // 等待页面加载完成后执行脚本
        if (document.readyState === 'complete') {
            switchToTheaterMode();
        } else {
            setTimeout(waitForLoad, 1000);
        }
    }

    console.log('脚本开始执行');
    waitForLoad();

    // 页面刷新时输出日志信息
    window.addEventListener('beforeunload', function() {
        console.log('页面已刷新');
    });
})();