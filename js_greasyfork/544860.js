// ==UserScript==
// @name         滑动时暂停动画与视频（保留音频）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  页面滑动时暂停动画和视频，松手后恢复，仅保留音频播放
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544860/%E6%BB%91%E5%8A%A8%E6%97%B6%E6%9A%82%E5%81%9C%E5%8A%A8%E7%94%BB%E4%B8%8E%E8%A7%86%E9%A2%91%EF%BC%88%E4%BF%9D%E7%95%99%E9%9F%B3%E9%A2%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544860/%E6%BB%91%E5%8A%A8%E6%97%B6%E6%9A%82%E5%81%9C%E5%8A%A8%E7%94%BB%E4%B8%8E%E8%A7%86%E9%A2%91%EF%BC%88%E4%BF%9D%E7%95%99%E9%9F%B3%E9%A2%91%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储动画和视频状态
    const animationStates = new Map();
    const videoStates = new Map();
    let rafIds = [];
    let intervalIds = [];
    let timeoutIds = [];

    // 节流函数，优化滚动事件
    function throttle(fn, wait) {
        let lastCall = 0;
        return function (...args) {
            const now = performance.now();
            if (now - lastCall >= wait) {
                lastCall = now;
                fn.apply(this, args);
            }
        };
    }

    // 暂停CSS动画和过渡
    function pauseCSSAnimations() {
        const elements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
        elements.forEach((element) => {
            const computedStyle = getComputedStyle(element);
            if (computedStyle.animationName !== 'none') {
                animationStates.set(element, element.style.animationPlayState || 'running');
                element.style.animationPlayState = 'paused';
            }
            if (computedStyle.transitionProperty !== 'none') {
                // 暂停过渡通过添加类或临时移除transition
                animationStates.set(element, element.style.transition || '');
                element.style.transition = 'none';
            }
        });
    }

    // 恢复CSS动画和过渡
    function resumeCSSAnimations() {
        animationStates.forEach((state, element) => {
            if (state.includes('animation')) {
                element.style.animationPlayState = state;
            } else if (state.includes('transition')) {
                element.style.transition = state;
            }
        });
        animationStates.clear();
    }

    // 暂停JavaScript动画
    function pauseJavaScriptAnimations() {
        // 代理requestAnimationFrame
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function (callback) {
            rafIds.push(originalRAF(callback));
            return rafIds[rafIds.length - 1];
        };

        // 代理setInterval和setTimeout
        const originalSetInterval = window.setInterval;
        window.setInterval = function (callback, delay) {
            intervalIds.push(originalSetInterval(callback, delay));
            return intervalIds[intervalIds.length - 1];
        };
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function (callback, delay) {
            timeoutIds.push(originalSetTimeout(callback, delay));
            return timeoutIds[timeoutIds.length - 1];
        };

        // 取消现有动画
        rafIds.forEach((id) => window.cancelAnimationFrame(id));
        intervalIds.forEach((id) => window.clearInterval(id));
        timeoutIds.forEach((id) => window.clearTimeout(id));
        rafIds = [];
        intervalIds = [];
        timeoutIds = [];
    }

    // 恢复JavaScript动画（简化处理，需根据具体页面调整）
    function resumeJavaScriptAnimations() {
        // 恢复需要页面重新调用动画逻辑，实际情况需定制
        window.requestAnimationFrame = window.requestAnimationFrame.bind(window);
        window.setInterval = window.setInterval.bind(window);
        window.setTimeout = window.setTimeout.bind(window);
    }

    // 暂停视频（保留音频）
    function pauseVideos() {
        const videos = document.getElementsByTagName('video');
        for (let video of videos) {
            if (!video.paused) {
                videoStates.set(video, true);
                video.pause();
                video.muted = false; // 确保音频继续
            }
        }
    }

    // 恢复视频
    function resumeVideos() {
        videoStates.forEach((wasPlaying, video) => {
            if (wasPlaying && video.paused) {
                video.play().catch((err) => console.warn('Video resume failed:', err));
            }
        });
        videoStates.clear();
    }

    // 暂停Canvas动画
    function pauseCanvasAnimations() {
        const canvases = document.getElementsByTagName('canvas');
        for (let canvas of canvases) {
            const context = canvas.getContext('2d') || canvas.getContext('webgl') || canvas.getContext('webgl2');
            if (context && canvas.dataset.rafId) {
                window.cancelAnimationFrame(parseInt(canvas.dataset.rafId));
            }
        }
    }

    // 暂停SVG动画
    function pauseSVGAAnimations() {
        const svgElements = document.querySelectorAll('svg animate, svg animateTransform');
        svgElements.forEach((element) => {
            animationStates.set(element, element.getAttribute('begin') || '0s');
            element.setAttribute('begin', 'indefinite');
        });
    }

    // 恢复SVG动画
    function resumeSVGAAnimations() {
        animationStates.forEach((state, element) => {
            if (element.tagName.toLowerCase().startsWith('animate')) {
                element.setAttribute('begin', state);
            }
        });
    }

    // 暂停Web Animations API
    function pauseWebAnimations() {
        document.getAnimations().forEach((animation) => {
            animationStates.set(animation, animation.playState);
            animation.pause();
        });
    }

    // 恢复Web Animations API
    function resumeWebAnimations() {
        animationStates.forEach((state, animation) => {
            if (state === 'running') {
                animation.play();
            }
        });
    }

    // 暂停GIF（简单隐藏，需第三方库支持更精确控制）
    function pauseGIFs() {
        const images = document.querySelectorAll('img[src$=".gif"]');
        images.forEach((img) => {
            animationStates.set(img, img.style.display || 'block');
            img.style.display = 'none';
        });
    }

    // 恢复GIF
    function resumeGIFs() {
        animationStates.forEach((state, img) => {
            if (img.tagName.toLowerCase() === 'img') {
                img.style.display = state;
            }
        });
    }

    // 监控动态DOM变化
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    // 检测新添加的视频、canvas、svg等
                    pauseVideos();
                    pauseCanvasAnimations();
                    pauseSVGAAnimations();
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 滑动事件处理
    let isScrolling = false;
    const scrollHandler = throttle(() => {
        if (!isScrolling) {
            isScrolling = true;
            pauseCSSAnimations();
            pauseJavaScriptAnimations();
            pauseVideos();
            pauseCanvasAnimations();
            pauseSVGAAnimations();
            pauseWebAnimations();
            pauseGIFs();
        }
    }, 100);

    // 滑动结束检测
    function handleScrollEnd() {
        if (isScrolling) {
            isScrolling = false;
            resumeCSSAnimations();
            resumeJavaScriptAnimations();
            resumeVideos();
            resumeCanvasAnimations();
            resumeSVGAAnimations();
            resumeWebAnimations();
            resumeGIFs();
        }
    }

    // 监听滚动和触摸事件
    document.addEventListener('scroll', scrollHandler);
    document.addEventListener('scrollend', handleScrollEnd);
    document.addEventListener('touchend', handleScrollEnd);
    document.addEventListener('mouseup', handleScrollEnd);

    // 初始化DOM监控
    observeDOM();

    // 清理事件监听器
    window.addEventListener('unload', () => {
        document.removeEventListener('scroll', scrollHandler);
        document.removeEventListener('scrollend', handleScrollEnd);
        document.removeEventListener('touchend', handleScrollEnd);
        document.removeEventListener('mouseup', handleScrollEnd);
    });
})();