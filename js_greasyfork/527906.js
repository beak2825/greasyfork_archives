// ==UserScript==
// @name         bilibili播放视频倍速快速选择 0.5x-4x 随意自定义，记忆功能（无滑块）
// @namespace    http://tampermonkey.net/
// @version      2.6.1
// @description  通过快速选择按钮修改哔哩哔哩的视频播放速度，并具有记忆功能。取消了滑块功能，增加了对 SPA 页面跳转的支持
// @author       AA
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/cheese/play/*
// @match        https://www.bilibili.com/festival/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/527906/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%2005x-4x%20%E9%9A%8F%E6%84%8F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E8%AE%B0%E5%BF%86%E5%8A%9F%E8%83%BD%EF%BC%88%E6%97%A0%E6%BB%91%E5%9D%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527906/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%2005x-4x%20%E9%9A%8F%E6%84%8F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E8%AE%B0%E5%BF%86%E5%8A%9F%E8%83%BD%EF%BC%88%E6%97%A0%E6%BB%91%E5%9D%97%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_SPEED = 1;
    const STORAGE_KEY = 'bilibiliPlaybackSpeed';
    const SELECTORS = {
        VIDEO: 'video',
        VIDEO_INFO_META: '.video-info-meta'
    };
    // 快速选择按钮预设的速度值
    const SPEEDS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

    // 添加样式（避免重复插入）
    const addStyles = () => {
        if (document.getElementById('bili-speed-style')) return;
        const style = document.createElement('style');
        style.id = 'bili-speed-style';
        style.textContent = `
            .speed-control-btn {
                margin-right: 6px;
                padding: 4px 8px;
                border: none;
                border-radius: 3px;
                background-color: #eee;
                cursor: pointer;
                font-size: 14px;
            }
            .speed-control-btn.active {
                background-color: #00AEEC !important;
                color: #fff !important;
            }
            #speed-control-container {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
            }
        `;
        document.head.appendChild(style);
    };

    // 存储与获取播放速度
    const saveSpeed = speed => localStorage.setItem(STORAGE_KEY, speed);
    const getSavedSpeed = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_SPEED;

    // 同步视频播放速度（仅在值有变动时更新）
    const syncVideoSpeed = () => {
        const video = document.querySelector(SELECTORS.VIDEO);
        if (video) {
            const speed = parseFloat(getSavedSpeed());
            if (video.playbackRate !== speed) {
                video.playbackRate = speed;
            }
        }
    };

    // 根据当前速度高亮对应按钮
    const highlightButton = currentSpeed => {
        document.querySelectorAll('.speed-control-btn').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.textContent) === parseFloat(currentSpeed));
        });
    };

    // 创建控件，仅包含快速选择按钮
    const createSpeedControl = () => {
        if (document.getElementById('speed-control-container')) return;

        const container = document.createElement('div');
        container.id = 'speed-control-container';

        // 创建快速选择按钮
        const buttons = SPEEDS.map(speed => {
            const btn = document.createElement('button');
            btn.className = 'speed-control-btn';
            btn.textContent = `${speed}x`;
            return btn;
        });

        // 事件委托：点击按钮时更新播放速度
        container.addEventListener('click', e => {
            if (e.target.classList.contains('speed-control-btn')) {
                const speed = parseFloat(e.target.textContent);
                saveSpeed(speed);
                syncVideoSpeed();
                highlightButton(speed);
            }
        });

        // 将按钮添加到容器中
        buttons.forEach(btn => container.appendChild(btn));

        const videoInfoMeta = document.querySelector(SELECTORS.VIDEO_INFO_META);
        if (videoInfoMeta && videoInfoMeta.parentNode) {
            videoInfoMeta.parentNode.style.height = 'auto';
            videoInfoMeta.parentNode.appendChild(container);
            highlightButton(getSavedSpeed());
        }
    };

    // 初始化流程
    const init = () => {
        addStyles();
        syncVideoSpeed();
        createSpeedControl();
        // 持续监测视频元素变化
        new MutationObserver(syncVideoSpeed)
            .observe(document.body, { childList: true, subtree: true });
    };

    // 等待目标节点加载
    const checkDomReady = () => {
        if (document.querySelector(SELECTORS.VIDEO_INFO_META)) {
            init();
        } else {
            const observer = new MutationObserver((_, obs) => {
                if (document.querySelector(SELECTORS.VIDEO_INFO_META)) {
                    obs.disconnect();
                    init();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    // 重写 history 方法以捕获 SPA 跳转
    const overrideHistoryMethods = () => {
        const _pushState = history.pushState;
        history.pushState = function () {
            _pushState.apply(history, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        const _replaceState = history.replaceState;
        history.replaceState = function () {
            _replaceState.apply(history, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        window.addEventListener('popstate', () =>
            window.dispatchEvent(new Event('locationchange'))
        );
    };
    overrideHistoryMethods();

    // 监听 URL 变化，重新初始化控件
    window.addEventListener('locationchange', () => {
        const existing = document.getElementById('speed-control-container');
        if (existing) existing.remove();
        // 使用较短延时以尽快检测新页面
        setTimeout(checkDomReady, 10);
    });

    // 页面首次加载
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        checkDomReady();
    } else {
        window.addEventListener('DOMContentLoaded', checkDomReady);
    }
})();
