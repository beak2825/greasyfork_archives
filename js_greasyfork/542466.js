// ==UserScript==
// @name         Bilibili 关闭自动连播
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自动检测Bilibili视频页面的“自动连播”功能，如果开启则自动关闭。
// @author       vnry
// @match        *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542466/Bilibili%20%E5%85%B3%E9%97%AD%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/542466/Bilibili%20%E5%85%B3%E9%97%AD%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Bilibili 自动连播关闭脚本已启动。');

    let isProcessingClick = false;
    const MAX_ATTEMPTS = 5;
    let currentAttempts = 0;

    function displayToast(message, duration = 1500) {
        let toastElement = document.getElementById('bilibili-autoplay-toast');

        if (toastElement) {
            clearTimeout(toastElement.hideTimer);
            toastElement.remove();
        }

        toastElement = document.createElement('div');
        toastElement.id = 'bilibili-autoplay-toast';
        toastElement.textContent = message;
        Object.assign(toastElement.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#f05b72',
            padding: '10px 15px',
            borderRadius: '5px',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: 'none',
            fontSize: '30px',
            whiteSpace: 'nowrap'
        });

        document.body.appendChild(toastElement);

        void toastElement.offsetWidth;
        toastElement.style.opacity = '1';

        toastElement.hideTimer = setTimeout(() => {
            toastElement.style.opacity = '0';
            setTimeout(() => {
                if (toastElement.parentNode) {
                    toastElement.remove();
                }
            }, 500);
        }, duration);
    }

    function disableAutoPlay() {
        if (isProcessingClick || currentAttempts >= MAX_ATTEMPTS) {
            return false;
        }

        const recommendList = document.querySelector('.recommend-list-v1');

        if (recommendList) {
            const switchBtn = recommendList.querySelector('.continuous-btn .switch-btn');

            if (switchBtn) {
                if (switchBtn.classList.contains('on')) {
                    isProcessingClick = true;
                    currentAttempts++;

                    console.log(`检测到自动连播已开启，正在尝试关闭... (第 ${currentAttempts} 次尝试)`);

                    setTimeout(() => {
                        const eventOptions = { bubbles: true, cancelable: true };
                        switchBtn.dispatchEvent(new MouseEvent('mouseover', eventOptions));
                        switchBtn.dispatchEvent(new MouseEvent('mousemove', eventOptions));
                        switchBtn.dispatchEvent(new MouseEvent('mousedown', eventOptions));
                        switchBtn.dispatchEvent(new MouseEvent('mouseup', eventOptions));
                        switchBtn.click();

                        console.log('已发送点击事件给自动连播按钮。');

                        setTimeout(() => {
                            if (!switchBtn.classList.contains('on')) {
                                console.log('自动连播已成功关闭！');
                                displayToast('自动连播已关闭');
                                isProcessingClick = false;
                                currentAttempts = 0;
                                return true;
                            } else {
                                console.warn('自动连播点击后仍处于开启状态。');
                                isProcessingClick = false;
                            }
                        }, 200);
                    }, 100);

                    return false;
                } else {
                    console.log('自动连播已处于关闭状态。');
                    isProcessingClick = false;
                    currentAttempts = 0;
                    return true;
                }
            }
        }
        return false;
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (disableAutoPlay()) {
            obs.disconnect();
            console.log('已停止 DOM 观察器，自动连播已处理。');
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (disableAutoPlay()) {
        observer.disconnect();
        console.log('自动连播在初始加载时已处理，已停止观察器。');
    }

})();
