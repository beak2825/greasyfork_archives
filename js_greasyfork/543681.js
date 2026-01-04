// ==UserScript==
// @name         控制视频快进倍速及音量调节脚本（含拖动进度条）
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  1.滚轮向下/a键快退、滚轮向上/s键快进；2.Shift+滚轮向下/a键减小音量、Shift+滚轮向上/s键增大音量；3.按下x键临时2倍速；4.左键拖动调节进度条
// @author       lhr3572651322
// @license      MIT
// @match        *://*.bilibili.com/video/*
// @match        *://*.youtube.com/watch*
// @match        *://*.youku.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543681/%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%80%8D%E9%80%9F%E5%8F%8A%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82%E8%84%9A%E6%9C%AC%EF%BC%88%E5%90%AB%E6%8B%96%E5%8A%A8%E8%BF%9B%E5%BA%A6%E6%9D%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543681/%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%80%8D%E9%80%9F%E5%8F%8A%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82%E8%84%9A%E6%9C%AC%EF%BC%88%E5%90%AB%E6%8B%96%E5%8A%A8%E8%BF%9B%E5%BA%A6%E6%9D%A1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- 1. 样式常量（与之前相同，略） ---------- */
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
            display: flex;
            align-items: center;
            gap: 12px;
        `,
        neverBtn: `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
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
        volumeIndicator: `
            position: absolute;
            top: 60px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
        `,
        // 新增：拖动进度条提示
        dragBar: `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.6);
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            z-index: 2147483647;
        `
    };

    /* ---------- 2. 首次加载提示（略，同前） ---------- */
    if (!localStorage.getItem('skipShiftGuide')) {
        const tip = document.createElement('div');
        tip.style.cssText = styles.base + styles.tip;
        tip.innerHTML = `
            <span>按住 Shift 键可随时查看操作指引</span>
            <button id="neverShowAgain" style="${styles.neverBtn}">不再提示</button>
        `;
        document.body.appendChild(tip);
        setTimeout(() => tip.style.opacity = 1, 100);

        tip.querySelector('#neverShowAgain').addEventListener('click', () => {
            localStorage.setItem('skipShiftGuide', '1');
            tip.style.opacity = 0;
            setTimeout(() => tip.remove(), 300);
        });

        setTimeout(() => {
            tip.style.opacity = 0;
            setTimeout(() => tip.remove(), 300);
        }, 5000);
    }

    /* ---------- 3. 轮询找视频（略，同前） ---------- */
    const checkVideo = setInterval(() => {
        const hostname = window.location.hostname;
        const video =
              hostname.includes('missav.com')
                  ? document.querySelector('.plyr--video video')
              : hostname.includes('jable.tv')
                  ? document.querySelector('#player-container video, #player_3 video, .plyr--video video')
                  : document.querySelector('.html5-main-video, video, .youku-player video');

        if (video?.readyState >= 2) {
            clearInterval(checkVideo);
            initVideoControl(video);
        }
    }, 1000);

    /* ---------- 4. 初始化视频控制 ---------- */
    function initVideoControl(video) {
        if (video.dataset.controlInitialized) return;
        video.dataset.controlInitialized = 'true';

        const hostname = window.location.hostname;
        const isYouku   = hostname.includes('youku.com');
        const isMissav  = hostname.includes('missav.com');
        const isJable   = hostname.includes('jable.tv');

        const container =
              isMissav || isJable
                  ? video.closest('.plyr--video') || video.closest('#player-container') || video.parentElement
                  : isYouku
                      ? document.querySelector('.youku-player')
                      : video.closest('#movie_player') || video.parentElement;

        if (!container) return;

        let originalRate = video.playbackRate;

        /* ---------- 5. 滚轮事件（略，同前） ---------- */
        const wheelHandler = e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                video.volume = Math.min(1, Math.max(0,
                    video.volume + (e.deltaY < 0 ? 0.05 : -0.05)
                ));
                showVolumeIndicator(video, container);
            } else {
                const step = e.deltaY < 0 ? -2 : 2;
                video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + step));
            }
            return false;
        };
        const elements = (isMissav || isJable) ? [container, video] : [isYouku ? container : video];
        elements.forEach(el => {
            el.removeEventListener('wheel', wheelHandler, { passive: false, capture: true });
            el.addEventListener('wheel', wheelHandler, { passive: false, capture: true });
        });
  /* ---------- 6. a键 快推（略，同前） ---------- */
        document.addEventListener('keydown', e => {
            if (e.key === 'a'||e.key === 'A'&& !e.ctrlKey&& !e.repeat) {
                if (e.shiftKey) { video.volume = Math.min(1, Math.max(0,video.volume -0.05 ));}
                else{video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime - 2));}
            }
        });
  /* ---------- 6. s键 快进（略，同前） ---------- */
        document.addEventListener('keydown', e => {
            if (e.key === 's'||e.key === 'S'&& !e.ctrlKey&& !e.repeat) {
                 if (e.shiftKey) { video.volume = Math.min(1, Math.max(0,video.volume + 0.05 ));}
                else{video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + 2));}
            }
        });

        /* ---------- 6. x键 临时 2 倍速（略，同前） ---------- */
        document.addEventListener('keydown', e => {
            if (e.key === 'X'||e.key === 'x'&& !e.ctrlKey&& !e.repeat) {
                originalRate = video.playbackRate;
                if (video.paused) video.play();
                video.playbackRate = 2;
            }
        });
        document.addEventListener('keyup', e => {
            if (e.key === 'X'||e.key === 'x') video.playbackRate = originalRate;
        });

      
        /* ---------- 8. 指引框 & 音量提示（略，同前） ---------- */
        addGuideBox(video);
    }

    /* ---------- 9. 工具函数 ---------- */
    function createElement(className, style) {
        const element = document.createElement('div');
        element.className = className;
        element.style.cssText = styles.base + style;
        return element;
    }

    function showVolumeIndicator(video, container) {
        let indicator = container.querySelector('.volume-indicator');
        if (!indicator) {
            indicator = createElement('volume-indicator', styles.volumeIndicator);
            container.appendChild(indicator);
        }
        indicator.textContent = `音量: ${Math.round(video.volume * 100)}%`;
        indicator.style.opacity = '1';
        clearTimeout(indicator.fadeTimeout);
        indicator.fadeTimeout = setTimeout(() => indicator.style.opacity = '0', 2000);
    }

    function addGuideBox(video) {
        const container = video.closest('.plyr--video') || video.parentElement;
        const guideBox = createElement('video-control-guide', styles.guide);

        const updateGuide = () => {
            guideBox.innerHTML = `
                <div style="margin-bottom: 5px;">按住 Shift：显示此提示</div>
               <div style="margin-bottom: 5px;">滚轮向上/s键：快进（2s）</div>
               <div style="margin-bottom: 5px;">滚轮向下/a键：快退（2s）</div>
                <div style="margin-bottom: 5px;">Shift+滚轮向上/s键：增大音量（5%）</div>
               <div style="margin-bottom: 5px;">Shift+滚轮向下/a键：减小音量（5%）</div>
                <div style="margin-bottom: 5px;">按住 x：临时 2 倍速</div>
                <div style="margin-bottom: 5px;">左键拖动视频：调节进度</div>
                <div style="color: #2196F3;">音量: ${Math.round(video.volume * 100)}%</div>
            `;
        };

        container.appendChild(guideBox);
        video.addEventListener('volumechange', updateGuide);
        updateGuide();

        document.addEventListener('keydown', e => {
            if (e.key === 'Shift') {
                e.preventDefault();
                guideBox.style.opacity = '1';
                guideBox.style.transform = 'translateY(-50%)';
            }
        });
        document.addEventListener('keyup', e => {
            if (e.key === 'Shift') {
                guideBox.style.opacity = '0';
                guideBox.style.transform = 'translateY(-50%) translateX(-20px)';
            }
        });
/* ---------- 7. 左键拖动进度条（比例版） ---------- */
let isDragging = false;
let startX = 0;
let startTime = 0;
let videoWidth = 0;          // 缓存一次视频宽度，防止拖动中实时取抖动
const dragBar = createElement('drag-bar', styles.dragBar);
container.appendChild(dragBar);

// 倍率：1倍
const DRAG_SENSITIVITY = 1;
let ismoved=false;
container.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    ismoved=false;
    isDragging = true;
    startX = e.clientX;
    startTime = video.currentTime;
    // 实时拿一下视频宽度（拖动过程中不变）
    const rect = video.getBoundingClientRect();
    videoWidth = rect.width || 1;   // 防止 0
    dragBar.style.opacity = '1';
    e.preventDefault();
});

document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;

    // 拖动比例：[-∞, +∞]
    const ratio = deltaX / videoWidth;
    const deltaTime = ratio * video.duration / DRAG_SENSITIVITY;

    video.currentTime = Math.min(video.duration, Math.max(0, startTime + deltaTime));
    if(ratio){ismoved=true;}
    // 实时显示百分比
    const percent = ((video.currentTime / video.duration) * 100).toFixed(1);
    dragBar.textContent = `${percent}%`;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    if(ismoved){
        if (video.paused) {video.play();}else{video.pause();}
    }
    isDragging = false;
    dragBar.style.opacity = '0';
});

    }
})();