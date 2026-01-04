// ==UserScript==
// @name        AutoScroll2(自动滚动)
// @description 双击向下滚动,单击停止，滚动过程中滚轮上下调速,右键开关调速.
// @include     *
// @version     1.6
// @author      OuO
// @license      MIT
// @grant       none
// @namespace  https://greasyfork.org/zh-CN/scripts/530401
// @supportURL https://github.com/EilenC/Tampermonkey-Scripts/blob/master/AutoScroll2/AutoScroll2.js

// @downloadURL https://update.greasyfork.org/scripts/530401/AutoScroll2%28%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530401/AutoScroll2%28%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%29.meta.js
// ==/UserScript==

(function (document) {
    'use strict';

    function roundToTwoDecimalPlaces(number) {
        return Number(number.toFixed(2));
    }

    let notificationTimer = null;
    let notification = document.createElement('div');
    let tipsTime = 300;

    function showNotification(message, duration) {
        clearTimeout(notificationTimer);
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.background = 'black';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.fontSize = '40px';
        notification.style.padding = '20px';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);
        notificationTimer = setTimeout(function () {
            document.body.removeChild(notification);
            notificationTimer = null;
        }, duration);
    }

    let scrollY = 0;
    let scrollSpeed = 0.18; // 默认滚动速度
    let isScrolling = false;
    let isWheelControlEnabled = true; // 滚轮控制开关状态，用于控制速度调整

    let lastScrollTime = performance.now();
    const targetFrameDelay = 1000 / 360; // 目标帧率为每秒 60 帧
    let animationFrameId = null;

    function scrollAnimation(currentTime) {
        if (isScrolling) {
            const elapsedTime = currentTime - lastScrollTime;
            if (elapsedTime >= targetFrameDelay) {
                const deltaScroll = scrollSpeed * (elapsedTime / targetFrameDelay);
                scrollY += deltaScroll;
                window.scrollTo(0, scrollY);
                lastScrollTime = currentTime;
            }
            animationFrameId = requestAnimationFrame(scrollAnimation);
        } else {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // 开始滚动
    function startScroll() {
        isScrolling = true;
        scrollY = window.scrollY || document.documentElement.scrollTop;
        lastScrollTime = performance.now();
        animationFrameId = requestAnimationFrame(scrollAnimation);
        isWheelControlEnabled = true; // 开始滚动时默认启用滚轮速度控制
    }

    // 停止滚动
    function stopScroll() {
        isScrolling = false;
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        scrollY = 0; // 清空滚动位置
        lastScrollTime = 0; // 重置上次滚动时间
    }

    let lastClickTime = 0;
    let clickCount = 0;

    // 鼠标点击事件处理
    document.addEventListener('mousedown', (event) => {
        if (event.button === 0) { // 左键
            let currentTime = new Date().getTime();
            
            if (isScrolling) {
                // 单次点击停止
                stopScroll();
                showNotification('AutoScroll:Off', tipsTime);
            } else {
                // 检查双击
                if (currentTime - lastClickTime < 300) {
                    clickCount++;
                } else {
                    clickCount = 1;
                }

                lastClickTime = currentTime;

                if (clickCount === 2) {
                    startScroll();
                    showNotification('AutoScroll:On', tipsTime);
                    clickCount = 0;
                }
            }
        } else if (event.button === 2 && isScrolling) { // 右键且正在滚动时
            isWheelControlEnabled = !isWheelControlEnabled;
            showNotification('Wheel Speed Control: ' + (isWheelControlEnabled ? 'On' : 'Off'), tipsTime);
        }
    });

    // 防止右键默认菜单（只在滚动时生效）
    document.addEventListener('contextmenu', (event) => {
        if (isScrolling) {
            event.preventDefault();
        }
    });

    // 鼠标滚轮事件处理
    document.addEventListener('wheel', (event) => {
        if (isScrolling && isWheelControlEnabled) {
            event.preventDefault(); // 当滚轮控制开启时，阻止默认行为以调整速度
            if (event.deltaY < 0) { // 滚轮向上 - 减速
                let step = 0.01;
                if (scrollSpeed > 2) {
                    step = 0.1;
                }
                scrollSpeed = Math.max(scrollSpeed - step, 0.01);
                showNotification('AutoScroll:Speed: ' + roundToTwoDecimalPlaces(scrollSpeed), tipsTime);
            } 
            else if (event.deltaY > 0) { // 滚轮向下 - 加速
                scrollSpeed = Math.min(scrollSpeed + 0.1, 99);
                showNotification('AutoScroll:Speed: ' + roundToTwoDecimalPlaces(scrollSpeed), tipsTime);
            }
        }
        // 当 isWheelControlEnabled 为 false 时，不阻止默认行为，允许浏览器默认滚动
        if (isScrolling) {
            // 更新 scrollY 以匹配当前实际滚动位置
            scrollY = window.scrollY || document.documentElement.scrollTop;
        }
    }, { passive: false });
})(document);
