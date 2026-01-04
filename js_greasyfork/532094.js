// ==UserScript==
// @name             SkylineWebcams 全屏裁剪模式
// @namespace    http://tampermonkey.net/
// @version          2025-04-07
// @description    让SkylineWebcams的视频界面占满屏幕（多余的部分那会被裁剪），从二 创造出一个纯粹的观景窗
// @author           CWBeta
// @match            https://www.skylinewebcams.com/*
// @icon               https://www.google.com/s2/favicons?domain=skylinewebcams.com
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/532094/SkylineWebcams%20%E5%85%A8%E5%B1%8F%E8%A3%81%E5%89%AA%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/532094/SkylineWebcams%20%E5%85%A8%E5%B1%8F%E8%A3%81%E5%89%AA%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制按钮
    const btn = document.createElement('button');
    Object.assign(btn.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'opacity 0.3s'
    });
    btn.textContent = '全屏裁剪模式';
    document.body.appendChild(btn);

    // 状态管理
    let isFullscreen = false;
    let originalParent = null;
    let originalStyles = {};
    let hideTimeout;
    let canHideButton = true;

    // 核心裁剪算法
    function applyCoverMode() {
        const video = document.querySelector('video');
        if (!video) return;

        const screenRatio = window.innerWidth / window.innerHeight;
        const videoRatio = video.videoWidth / video.videoHeight;

        // 计算缩放比例
        let scale = screenRatio > videoRatio ?
            window.innerWidth / video.videoWidth :
            window.innerHeight / video.videoHeight;

        // 应用裁剪变换
        Object.assign(video.style, {
            position: 'fixed',
            width: `${video.videoWidth}px`,
            height: `${video.videoHeight}px`,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center',
            objectFit: 'none', // 禁用默认适应
            overflow: 'hidden'
        });
    }

    // 全屏切换
    function toggleFullscreen() {
        const video = document.querySelector('video');
        if (!video) return;

        if (!isFullscreen) {
            // 进入全屏
            originalParent = video.parentElement;
            originalStyles = {
                width: video.style.width,
                height: video.style.height,
                position: video.style.position,
                transform: video.style.transform
            };

            document.body.appendChild(video);
            document.body.style.overflow = 'hidden';
            btn.textContent = '退出裁剪模式';
            btn.style.opacity = '0';

            // 初始化并监听视频尺寸
            const checkReady = () => {
                if (video.videoWidth > 0) {
                    applyCoverMode();
                    video.removeEventListener('loadedmetadata', checkReady);
                }
            };
            video.addEventListener('loadedmetadata', checkReady);
            checkReady();
        } else {
            // 退出全屏
            originalParent.appendChild(video);
            video.style = null;
            Object.assign(video.style, originalStyles);
            document.body.style.overflow = '';
            btn.textContent = '全屏裁剪模式';
            btn.style.opacity = '1';
        }

        isFullscreen = !isFullscreen;
    }

    // 智能按钮显隐控制
    document.addEventListener('mousemove', () => {
        if (canHideButton){
            clearTimeout(hideTimeout);
            btn.style.opacity = '1';
            hideTimeout = setTimeout(() => {
                btn.style.opacity = '0';
            }, 2000);
        }
    });

    btn.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        btn.style.opacity = '1';
        canHideButton = false;
    });

    btn.addEventListener('mouseout', () => {
        canHideButton = true;
    });

    btn.addEventListener('click', toggleFullscreen);

    // 窗口变化时重新计算
    window.addEventListener('resize', () => {
        if (isFullscreen) {
            applyCoverMode();
            btn.style.opacity = '0'; // 重置显隐状态
        }
    });

    // 视频点击唤醒按钮
    document.addEventListener('click', (e) => {
        if (isFullscreen && e.target.tagName === 'VIDEO') {
            btn.style.opacity = '1';
            setTimeout(() => btn.style.opacity = '0', 2000);
        }
    });
})();