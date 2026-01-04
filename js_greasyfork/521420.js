// ==UserScript==
// @name         控制视频快进快退及倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  使用鼠标滚轮控制视频播放进度
// @author       zwols
// @license      MIT
// @match        *://*/*
// @match        *://*.youtube.com/*
// @match        *://*.youku.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521420/%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80%E5%8F%8A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/521420/%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80%E5%8F%8A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = {
        base: `
            position: fixed;
            color: white;
            z-index: 2147483647;
            transition: all 0.3s ease;
        `,
        tip: `
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            background: rgba(33, 150, 243, 0.9);
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            text-align: center;
        `,
        guide: `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            border-left: 3px solid #2196F3;
            line-height: 1.8;
            pointer-events: none;
            text-align: left;
        `,
        speedIndicator: `
            position: absolute;
            top: 60px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
        `
    };

    const checkVideo = setInterval(() => {
        const hostname = window.location.hostname;
        const isMissav = hostname.includes('missav.com');
        const isJable = hostname.includes('jable.tv');
        
        const video = isMissav
            ? document.querySelector('.plyr--video video')
            : isJable
                ? document.querySelector('#player-container video, #player_3 video, .plyr--video video')
                : document.querySelector('.html5-main-video, video, .youku-player video');

        if (video?.readyState >= 2) {
            clearInterval(checkVideo);
            initVideoControl(video);
        }
    }, 1000);

    function initVideoControl(video) {
        if (video.dataset.controlInitialized) return;
        video.dataset.controlInitialized = 'true';

        const hostname = window.location.hostname;
        const isYouku = hostname.includes('youku.com');
        const isMissav = hostname.includes('missav.com');
        const isJable = hostname.includes('jable.tv');
        
        const container = isMissav || isJable
            ? video.closest('.plyr--video') || video.closest('#player-container') || video.parentElement
            : isYouku 
                ? document.querySelector('.youku-player')
                : video.closest('#movie_player') || video.parentElement;

        if (!container) return;

        const wheelHandler = e => {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.shiftKey) {
                video.playbackRate = Math.min(4, Math.max(0.25,
                    video.playbackRate + (e.deltaY < 0 ? 0.25 : -0.25)
                ));
                showSpeedIndicator(video, container);
            } else {
                video.currentTime = Math.min(video.duration, Math.max(0,
                    video.currentTime + (e.deltaY < 0 ? -5 : 5)
                ));
            }
            return false;
        };

        const elements = (isMissav || isJable) ? [container, video] : [isYouku ? container : video];
        elements.forEach(el => {
            el.removeEventListener('wheel', wheelHandler, { passive: false, capture: true });
            el.addEventListener('wheel', wheelHandler, { 
                passive: false,
                capture: true
            });
        });

        addGuideBox(video);
        showInitialTip();
    }

    function createElement(className, style) {
        const element = document.createElement('div');
        element.className = className;
        element.style.cssText = styles.base + style;
        return element;
    }

    function showSpeedIndicator(video, container) {
        let indicator = container.querySelector('.speed-indicator');
        if (!indicator) {
            indicator = createElement('speed-indicator', styles.speedIndicator);
            container.appendChild(indicator);
        }
        indicator.textContent = `${video.playbackRate.toFixed(2)}x`;
        indicator.style.opacity = '1';
        clearTimeout(indicator.fadeTimeout);
        indicator.fadeTimeout = setTimeout(() => indicator.style.opacity = '0', 2000);
    }

    function addGuideBox(video) {
        const container = video.closest('.plyr--video') || video.parentElement;
        const guideBox = createElement('video-control-guide', styles.guide);
        
        const updateGuide = () => {
            guideBox.innerHTML = `
                <div style="margin-bottom: 5px;">按住 Alt：显示此提示</div>
                <div style="margin-bottom: 5px;">🖱️滚轮：快进/快退5秒</div>
                <div style="margin-bottom: 5px;">⇧+滚轮：调整播放速度</div>
                <div style="color: #2196F3;">当前: ${video.playbackRate.toFixed(2)}x</div>
            `;
        };

        container.appendChild(guideBox);
        video.addEventListener('ratechange', updateGuide);
        updateGuide();

        document.addEventListener('keydown', e => {
            if (e.key === 'Alt') {
                e.preventDefault();
                guideBox.style.opacity = '1';
                guideBox.style.transform = 'translateY(-50%)';
            }
        });

        document.addEventListener('keyup', e => {
            if (e.key === 'Alt') {
                guideBox.style.opacity = '0';
                guideBox.style.transform = 'translateY(-50%) translateX(-20px)';
            }
        });
    }

    function showInitialTip() {
        const tip = createElement('initial-tip', styles.tip);
        tip.innerHTML = '按住 Alt 键显示视频操作指引';
        document.body.appendChild(tip);

        setTimeout(() => tip.style.opacity = '1', 100);
        setTimeout(() => {
            tip.style.opacity = '0';
            setTimeout(() => tip.remove(), 500);
        }, 5000);
    }
})();