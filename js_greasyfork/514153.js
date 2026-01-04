// ==UserScript==
// @name         testdy
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  moklgy
// @author       mok
// @match        https://www.douyin.com/user/*
// @grant        none
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/514153/testdy.user.js
// @updateURL https://update.greasyfork.org/scripts/514153/testdy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const minInterval = 4000; // 最小间隔
    const maxInterval = 6000; // 最大间隔
    const simulateUsers = 3; // 模拟的用户数量

    const currentUrl = window.location.href; // 存储当前页面链接

    const playVideo = () => {
        const video = document.querySelector('video');
        if (video) {
            video.play().catch(error => {
                console.error('无法播放视频:', error);
            });
        }
    };

    const refreshPage = () => {
        location.reload();
    };

    const randomInterval = () => {
        return Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;
    };

    const skipLoginPopup = () => {
        const loginPopup = document.querySelector('.login-popup-selector'); // 替换为实际的弹窗选择器
        const closeButton = loginPopup ? loginPopup.querySelector('.close-button-selector') : null; // 替换为实际的关闭按钮选择器

        if (closeButton) {
            closeButton.click();
        }
    };

    const preventRedirection = () => {
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault(); // 阻止页面卸载
            event.returnValue = ''; // Chrome 需要这个属性来显示确认框
        });

        const checkRedirection = () => {
            if (window.location.href !== currentUrl) {
                window.history.pushState(null, '', currentUrl); // 强制保持在当前链接
            }
        };
        setInterval(checkRedirection, 1000); // 每秒检查一次
    };

    const bypassDetection = () => {
        // 修改用户代理，防止检测
        Object.defineProperty(navigator, 'userAgent', {
            get: function() {
                return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36';
            }
        });
    };

    const simulateUserActions = () => {
        setInterval(() => {
            skipLoginPopup(); // 尝试跳过登录弹窗
            playVideo(); // 播放视频（如果可用）
            refreshPage(); // 刷新页面
            simulateHumanLikeBehavior(); // 模拟人类行为
        }, randomInterval());
    };

    const simulateHumanLikeBehavior = () => {
        // 随机滚动页面
        window.scrollBy(0, Math.random() * 100);
    };

    // 启动跳过检测
    bypassDetection();
    // 启动防止跳转
   preventRedirection();
    // 启动多个用户模拟
    for (let i = 0; i < simulateUsers; i++) {
        simulateUserActions();
    }
})();
