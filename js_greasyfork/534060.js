// ==UserScript==
// @name         旋转bilibili视频增加一个旋转按Rotate Bilibili player with a button
// @name:en      Rotate Bilibili player with a button, Optimized for the Edge browser
// @namespace    Alright Peaches Studio
// @version      0.3
// @description  bilibili视频增加一个旋转按钮，特别针对Edge浏览器优化 Rotate Bilibili player with a button, Optimized for the Edge browser.
// @description:en  Rotate Bilibili player with a button, Optimized for the Edge browser.
// @description[zh-CN] bilibili视频增加一个旋转按钮，特别针对Edge浏览器优化 Rotate Bilibili player with a button, Optimized for the Edge browser.
// @author       Alright Peaches Studio
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534060/%E6%97%8B%E8%BD%ACbilibili%E8%A7%86%E9%A2%91%E5%A2%9E%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%97%8B%E8%BD%AC%E6%8C%89Rotate%20Bilibili%20player%20with%20a%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/534060/%E6%97%8B%E8%BD%ACbilibili%E8%A7%86%E9%A2%91%E5%A2%9E%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%97%8B%E8%BD%AC%E6%8C%89Rotate%20Bilibili%20player%20with%20a%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 候选容器列表（按优先级排序）
    const CONTAINER_SELECTORS = [
        '.bpx-player-control-bottom-center', // 底部控制栏中间
        '.bpx-player-control-bottom-right', // 底部控制栏右侧
        '.bpx-player-top-right',            // 顶部右侧信息区
        '.bpx-player-top-left',              // 经典位置（原位置）
        '.bpx-player-video-area',            // 直接插入视频区域
        '.bpx-player-container'              // 最后兜底
    ];

    // 创建按钮元素
    const createRotateButton = () => {
        const btn = document.createElement("button");
        btn.innerHTML = "旋转Rotate";
        btn.id = "bili-rotate-btn";

        // 增强版样式
        Object.assign(btn.style, {
            width: "80px",
            height: "32px",
            backgroundColor: "#00aeec",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "16px",
            transition: "all 0.2s",
            cursor: "pointer",
            position: "relative",
            zIndex: "2147483647", // 最大z-index值
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            margin: "0 8px",
            flexShrink: "0"
        });

        // 悬停效果
        btn.addEventListener("mouseover", () => {
            btn.style.backgroundColor = "#0099cc";
            btn.style.boxShadow = "0 3px 6px rgba(0,0,0,0.3)";
        });

        btn.addEventListener("mouseout", () => {
            btn.style.backgroundColor = "#00aeec";
            btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        });

        return btn;
    };

    // 查找可用容器
    const findValidContainer = () => {
        for (const selector of CONTAINER_SELECTORS) {
            const container = document.querySelector(selector);
            if (container) {
                // 检查容器是否可见
                const style = window.getComputedStyle(container);
                if (style.display !== 'none' && style.visibility === 'visible') {
                    return container;
                }
            }
        }
        return null;
    };

    // 旋转逻辑
    const rotateVideo = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const currentRotate = parseInt(video.dataset.rotate) || 0;
        const newRotate = (currentRotate + 90) % 360;
        video.dataset.rotate = newRotate;

        // 应用变换
        video.style.transform = `rotate(${newRotate}deg)`;
        video.style.transformOrigin = 'center center';

        // 自动调整容器尺寸
        const container = video.closest('.bpx-player-video-wrap');
        if (container) {
            container.style.transform = newRotate % 180 === 0
                ? 'scale(1)'
                : 'scale(0.5626)';
        }
    };

    // 主执行逻辑
    const init = () => {
        // 防止重复注入
        if (document.getElementById('bili-rotate-btn')) return;

        const container = findValidContainer();
        if (!container) {
            console.warn('[旋转按钮] 未找到有效容器');
            return;
        }

        const btn = createRotateButton();
        btn.onclick = rotateVideo;

        // 智能插入策略
        if (container.classList.contains('bpx-player-control-bottom-center')) {
            // 插入到播放进度条前
            const progress = container.querySelector('.bpx-player-progress');
            if (progress) {
                container.insertBefore(btn, progress);
            } else {
                container.prepend(btn);
            }
        } else {
            // 其他容器直接追加
            container.append(btn);
        }

        // 强制显示按钮
        btn.style.display = 'block !important';
        btn.style.visibility = 'visible !important';
    };

    // 增强版监听方案
    const observer = new MutationObserver(mutations => {
        if (!document.getElementById('bili-rotate-btn')) {
            init();
        }
    });

    // 启动监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 初始执行
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        document.addEventListener('DOMContentLoaded', init);
    }
})();