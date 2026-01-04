// ==UserScript==
// @name         Auto Close Popup and Play Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击关闭弹窗并播放视频
// @author       YourName
// @match        https://zyjstest.lngbzx.gov.cn/pc/index.html#/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503808/Auto%20Close%20Popup%20and%20Play%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/503808/Auto%20Close%20Popup%20and%20Play%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 假设关闭弹窗的按钮具有类名 'close-popup'
    var closePopupSelector = '.close-popup';
    // 假设播放按钮具有类名 'play-button'
    var playButtonSelector = '.play-button';

    function clickElement(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.click();
        } else {
            console.error('没有找到元素:', selector);
        }
    }

    // 等待页面加载完毕
    window.addEventListener('load', function() {
        // 尝试关闭弹窗
        clickElement(closePopupSelector);

        // 设置一个延时，确保弹窗已经关闭
        setTimeout(function() {
            // 尝试播放视频
            clickElement(playButtonSelector);
        }, 1000); // 延时时间可以根据需要调整
    });
})();
