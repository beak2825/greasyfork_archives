// ==UserScript==
// @name         左手单手调视频进度
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  模拟方向键原生行为（支持长按），左手即可完成进度调整
// @author       Vz
// @license MIT
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @match        *://*.pan.baidu.com/pfile/video?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525763/%E5%B7%A6%E6%89%8B%E5%8D%95%E6%89%8B%E8%B0%83%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/525763/%E5%B7%A6%E6%89%8B%E5%8D%95%E6%89%8B%E8%B0%83%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== 配置区域 =====================
    const CONFIG = {
        keyMap: {
            'x': 'ArrowLeft',  // X键模拟左方向键
            'c': 'ArrowRight'  // C键模拟右方向键
        },
        pressConfig: {
            repeatDelay: 500,   // 长按首次触发延迟（毫秒）
            repeatInterval: 100 // 长按重复间隔（毫秒）
        }
    };

    // ==================== 核心逻辑 =====================
    const activeKeys = new Map();
    let isModifierPressed = false;

    function createKeyboardEvent(type, key) {
        const isLeft = key === 'ArrowLeft';
        return new KeyboardEvent(type, {
            key: key,
            code: key,
            keyCode: isLeft ? 37 : 39,
            bubbles: true,
            cancelable: true,
            composed: true
        });
    }

    function dispatchToVideo(event) {
        // 优先发送给焦点元素
        const target = document.activeElement.tagName === 'VIDEO'
            ? document.activeElement
            : document.querySelector('video, .bpx-player-video-wrap video');

        if (target) {
            target.dispatchEvent(event);
            return true;
        }
        return false;
    }

    function startKeyRepeat(key) {
        const nativeKey = CONFIG.keyMap[key];
        if (!nativeKey) return;

        // 发送初始keydown
        const downEvent = createKeyboardEvent('keydown', nativeKey);
        if (!dispatchToVideo(downEvent)) return;

        // 设置重复定时器
        const timer = setInterval(() => {
            const repeatEvent = createKeyboardEvent('keydown', nativeKey);
            dispatchToVideo(repeatEvent);
        }, CONFIG.pressConfig.repeatInterval);

        activeKeys.set(key, {
            timer: timer,
            isPressed: true
        });
    }

    function stopKeyRepeat(key) {
        const record = activeKeys.get(key);
        if (record) {
            clearInterval(record.timer);
            const upEvent = createKeyboardEvent('keyup', CONFIG.keyMap[key]);
            dispatchToVideo(upEvent);
            activeKeys.delete(key);
        }
    }

    // ================== 事件监听器 ====================
    function handleKeyDown(e) {
        // 忽略组合键
        if (e.ctrlKey || e.altKey || e.metaKey) {
            isModifierPressed = true;
            return;
        }

        const key = e.key.toLowerCase();
        if (!CONFIG.keyMap[key] || isModifierPressed) return;

        // 排除输入元素
        const activeEl = document.activeElement;
        if (['INPUT','TEXTAREA','SELECT'].includes(activeEl.tagName) || activeEl.isContentEditable) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (!activeKeys.has(key)) {
            // 立即触发首次按下
            const downEvent = createKeyboardEvent('keydown', CONFIG.keyMap[key]);
            if (dispatchToVideo(downEvent)) {
                // 设置长按定时器
                const timer = setTimeout(() => {
                    startKeyRepeat(key);
                }, CONFIG.pressConfig.repeatDelay);

                activeKeys.set(key, {
                    timer: timer,
                    isPressed: true
                });
            }
        }
    }

    function handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (activeKeys.has(key)) {
            clearTimeout(activeKeys.get(key).timer);
            stopKeyRepeat(key);
        }
        isModifierPressed = false;
    }

    // ================== 初始化 ====================
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    // 保护系统快捷键
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            // 清理所有激活状态
            activeKeys.forEach((_, key) => stopKeyRepeat(key));
            activeKeys.clear();
        }
    }, true);
})();