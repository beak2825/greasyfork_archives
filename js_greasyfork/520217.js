// ==UserScript==
// @name         乐魂_抖音直播自动暂停
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  进入抖音直播间后自动点击暂停按钮
// @author       yuehun
// @match        *://live.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520217/%E4%B9%90%E9%AD%82_%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/520217/%E4%B9%90%E9%AD%82_%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAndClickPauseButton() {
        const pauseButton = document.querySelector('xg-icon.xgplayer-play[data-state="play"]');

        if (pauseButton) {
            try {
                pauseButton.click();
                console.log('已点击暂停按钮');
                return true;
            } catch (e) {
                console.log('点击按钮时出错:', e);
            }
        }
        console.log('未找到暂停按钮，继续尝试...');
        return false;
    }

    // 由于播放器可能需要一些时间加载，我们设置一个延迟
    setTimeout(() => {
        const checkInterval = setInterval(() => {
            if (findAndClickPauseButton()) {
                clearInterval(checkInterval);
                console.log('成功暂停播放');
            }
        }, 500);

        // 30秒后停止尝试
        setTimeout(() => {
            clearInterval(checkInterval);
            console.log('停止查找暂停按钮');
        }, 30000);
    }, 2000);

    // 页面加载完成后尝试暂停
    window.addEventListener('load', () => {
        findAndClickPauseButton();
        console.log('自动暂停功能已启动');
    });
})();