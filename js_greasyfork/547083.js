// ==UserScript==
// @name         四川大学智慧教育平台增强脚本 (稳定播放版)
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  采用全新的稳定播放策略：当前视频播放完毕后，自动点击“下一个”按钮。支持后台挂机播放。
// @author       Gemini AI (根据用户建议重构)
// @match        https://ecourse.scu.edu.cn/learn/course/mooc/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547083/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%20%28%E7%A8%B3%E5%AE%9A%E6%92%AD%E6%94%BE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547083/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%20%28%E7%A8%B3%E5%AE%9A%E6%92%AD%E6%94%BE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[增强脚本 V4.0] 稳定播放版已加载。');

    // --- 全局状态 ---
    let isAutoPlayEnabled = GM_getValue('autoPlayEnabled', false); // 默认关闭

    // --- 功能1：后台播放 ---
    // 这个功能让浏览器切换到其他标签页时，视频不会暂停。
    function enableBackgroundPlay() {
        try {
            Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
            Object.defineProperty(document, 'hidden', { value: false, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));
            console.log('[增强脚本] 后台播放功能已激活。');
        } catch (e) {
            console.error('[增强脚本] 后台播放功能注入失败:', e);
        }
    }

    // --- 功能2：核心播放逻辑 ---

    /**
     * 查找并点击“下一个学习内容”按钮
     */
    function clickNextVideoButton() {
        // 使用您提供的按钮特征来定位
        const nextButton = document.querySelector('.video_btn.next_video_btn');
        if (nextButton) {
            console.log('[增强脚本] 视频播放完毕，正在点击“下一个学习内容”...');
            nextButton.click();
        } else {
            console.log('[增强脚本] 未找到“下一个”按钮，可能是最后一个视频或页面结构已更新。');
        }
    }

    /**
     * 处理视频播放：自动播放、静音，并监听结束事件
     */
    function handleVideoPlayback() {
        if (!isAutoPlayEnabled) {
            console.log('[增强脚本] 自动连播未开启，脚本将不执行任何操作。');
            return;
        }

        const video = document.querySelector('video');
        if (!video) {
            console.log('[增强脚本] 页面中未找到视频播放器。');
            return;
        }

        console.log('[增强脚本] 已找到视频播放器，正在配置...');

        // 1. 自动静音（后台播放的最佳实践）
        video.muted = true;

        // 2. 尝试播放（有些浏览器需要用户交互才能播放，但静音后成功率更高）
        video.play().catch(e => console.warn('[增强脚本] 自动播放失败，可能需要您手动点击一次播放按钮。', e));

        // 3. 移除旧的监听器，防止重复绑定
        video.removeEventListener('ended', clickNextVideoButton);

        // 4. 监听视频播放结束事件
        video.addEventListener('ended', clickNextVideoButton);

        console.log('[增强脚本] 视频播放器配置完毕，已进入监听状态。');
    }


    // --- 功能3：UI界面 ---

    /**
     * 创建一个悬浮按钮来控制脚本的启停
     */
    function createControlUI() {
        const styles = `
            #scu-autoplay-btn {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                padding: 10px 18px; font-size: 14px; color: white;
                border: none; border-radius: 8px; cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: background-color 0.3s, transform 0.2s;
            }
            #scu-autoplay-btn.enabled { background-color: #27ae60; /* 绿色 */ }
            #scu-autoplay-btn.disabled { background-color: #c0392b; /* 红色 */ }
            #scu-autoplay-btn:hover { transform: scale(1.05); }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const button = document.createElement('button');
        button.id = 'scu-autoplay-btn';
        document.body.appendChild(button);

        function updateButtonState() {
            if (isAutoPlayEnabled) {
                button.textContent = '自动连播已开启';
                button.className = 'enabled';
            } else {
                button.textContent = '自动连播已关闭';
                button.className = 'disabled';
            }
        }

        button.addEventListener('click', () => {
            isAutoPlayEnabled = !isAutoPlayEnabled;
            GM_setValue('autoPlayEnabled', isAutoPlayEnabled);
            updateButtonState();
            console.log(`[增强脚本] 自动连播已${isAutoPlayEnabled ? '开启' : '关闭'}`);
            // 如果是刚刚开启，立即执行一次视频处理
            if (isAutoPlayEnabled) {
                handleVideoPlayback();
            }
        });

        // 初始化按钮状态
        updateButtonState();
    }


    // --- 主函数入口 ---

    function main() {
        // 步骤1：创建控制UI
        createControlUI();

        // 步骤2：始终启用后台播放，无论是否开启自动连播
        enableBackgroundPlay();

        // 步骤3：首次加载时，延迟一会再执行，确保页面元素完全加载
        setTimeout(handleVideoPlayback, 3000);

        // 步骤4：设置一个观察者来监听页面内容的变化
        // 因为点击“下一个”后，页面是动态加载新视频的，而不是整个刷新
        const observer = new MutationObserver((mutationsList, observer) => {
            // 简单地假设任何大的变动都可能意味着新视频被加载了
            // 为了避免性能问题和重复执行，这里使用一个延时
            setTimeout(handleVideoPlayback, 1500);
        });

        // 观察整个文档的子元素变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 等待页面完全加载后再执行脚本
    window.addEventListener('load', main);

})();