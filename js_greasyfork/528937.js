// ==UserScript==
// @name        bilibili 自动网页全屏
// @author      Linda6
// @license     Apache-2.0
// @namespace   Polar
// @description 自动网页全屏
// @version     1.0.4
// @include     *://www.bilibili.com/video/*
// @include     *://www.bilibili.com/bangumi/play/*
// @run-at      document-start
// @icon        https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/528937/bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/528937/bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    // 可能的全屏按钮类名或 ID
    const FULLSCREEN_BUTTON_NAMES = [
        "bpx-player-ctrl-web-enter",
        "bilibili-player-iconfont-web-fullscreen-off",
        "player_pagefullscreen_player",
        "squirtle-pagefullscreen-inactive"
    ];
    // 不同浏览器的全屏状态变化事件
    const FULLSCREEN_EVENTS = [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
    ];
    // 查找元素的最大尝试次数
    const MAX_ATTEMPTS = 20;
    // 查找元素的检查间隔时间（毫秒）
    const CHECK_INTERVAL = 1000;
    // 用于保存找到的全屏按钮
    let foundFullscreenButton = null;

    // 页面加载完成后执行的操作
    window.addEventListener('load', function () {
        attemptFullscreen();
        setupFullscreenListeners();
    });

    // 尝试进入全屏模式
    function attemptFullscreen() {
        // 如果已经保存了全屏按钮，直接点击
        if (foundFullscreenButton) {
            try {
                foundFullscreenButton.click();
            } catch (error) {}
            return;
        }
        // 遍历可能的全屏按钮名称，查找并点击按钮
        for (let i = 0; i < FULLSCREEN_BUTTON_NAMES.length; i++) {
            const elementName = FULLSCREEN_BUTTON_NAMES[i];
            const element = waitElement(elementName);
            if (element) {
                foundFullscreenButton = element;
                break;
            }
        }
    }

    // 设置全屏状态变化的监听器
    function setupFullscreenListeners() {
        FULLSCREEN_EVENTS.forEach((eventName) => {
            document.addEventListener(eventName, function () {
                if (!isFullscreen()) {
                    attemptFullscreen();
                }
            });
        });
    }

    // 检查页面是否处于全屏状态
    function isFullscreen() {
        return document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement;
    }

    // 查找并点击指定名称的元素
    function waitElement(elementName) {
        let attempts = MAX_ATTEMPTS;
        let intervalId;
        const findAndClick = () => {
            if (attempts <= 0) {
                clearInterval(intervalId);
                return null;
            }
            attempts--;
            let element = document.getElementsByClassName(elementName)[0];
            if (!element) {
                element = document.getElementById(elementName);
            }
            if (element) {
                try {
                    element.click();
                } catch (error) {}
                clearInterval(intervalId);
                return element;
            }
        };
        const initialElement = document.getElementsByClassName(elementName)[0] || document.getElementById(elementName);
        if (initialElement) {
            return findAndClick();
        } else {
            intervalId = setInterval(findAndClick, CHECK_INTERVAL);
        }
        return null;
    }
})();