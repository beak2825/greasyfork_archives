// ==UserScript==
// @name        AutoScroll2
// @description AutoScroll - Automatically scroll down the page, supporting hotkey control switches and speed adjustment (自动向下滚动页面，支持热键控制开关和速度调节)
// @include     http*
// @version     1.0.2
// @author      Eilen https://github.com/EilenC
// @grant       none
// @namespace https://greasyfork.org/users/319354
// @supportURL https://github.com/EilenC/Tampermonkey-Scripts/blob/master/AutoScroll2/AutoScroll2.js
// @downloadURL https://update.greasyfork.org/scripts/401596/AutoScroll2.user.js
// @updateURL https://update.greasyfork.org/scripts/401596/AutoScroll2.meta.js
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
    let scrollSpeed = 0.5; // 默认滚动速度
    let isScrolling = false;

    let lastScrollTime = performance.now();
    const targetFrameDelay = 1000 / 60; // 目标帧率为每秒 60 帧
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

    let lastKeyDownTime = 0;
    let keyDownCount = 0;
    // 键盘事件处理
    document.addEventListener('keydown', (event) => {
        let currentTime = new Date().getTime();
        switch (event.key) {
            case 's':
            case 'ArrowLeft':
                if(isScrolling){
                    let step = 0.01
                    if (scrollSpeed > 2) {
                        step = 0.1
                    }
                    scrollSpeed = Math.max(scrollSpeed - step, 0.01);
                    showNotification('AutoScroll:Speed: ' + roundToTwoDecimalPlaces(scrollSpeed), tipsTime);
                }
                break;
            case 'a':
            case 'ArrowRight':
                if(isScrolling){
                    scrollSpeed = Math.min(scrollSpeed + 0.1, 99);
                    showNotification('AutoScroll:Speed: ' + roundToTwoDecimalPlaces(scrollSpeed), tipsTime);
                }
                break;
            case "`":
                if (currentTime - lastKeyDownTime < 300) {
                    keyDownCount++;
                } else {
                    keyDownCount = 1;
                }

                lastKeyDownTime = currentTime;

                if (keyDownCount === 2) {
                    if (isScrolling) {
                        stopScroll();
                        showNotification('AutoScroll:Off', tipsTime);
                    } else {
                        startScroll();
                        showNotification('AutoScroll:On', tipsTime);
                    }
                    keyDownCount = 0;
                }
                break;
        }
    });
})(document);