// ==UserScript==
// @name        自动打开b站字幕
// @namespace   http://tampermonkey.net/
// @version     1.0.4
// @description 自动开启B站视频字幕功能
// @author      NuperAki
// @match       https://www.bilibili.com/video/*
// @icon        https://www.bilibili.com/favicon.ico
// @grant       none
// @license     MIT License
// @supportURL  https://github.com/TheHeartFickle/OpenSubtitleOnBiliBili/issues
// @downloadURL https://update.greasyfork.org/scripts/544636/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80b%E7%AB%99%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/544636/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80b%E7%AB%99%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    let subtitleInterval = null;
    let currentHref = window.location.href;

    // 检查并设置字幕
    function trySetSubtitle() {
        const bilingualSwitch = document.querySelector('.bpx-player-ctrl-subtitle-bilingual-bottom input[type="checkbox"]');
        if (bilingualSwitch && bilingualSwitch.checked) {
            bilingualSwitch.click();
        }

        const chineseButton = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]');
        if (!chineseButton) {
            return false; // 中文按钮不存在
        }

        const isActive = chineseButton.classList.contains('bpx-state-active');
        if (!isActive) {
            chineseButton.click();
            return true;
        }
        return false;
    }

    function openSubtitle() {
        if (subtitleInterval) {
            clearInterval(subtitleInterval);
            subtitleInterval = null;
        }

        if (trySetSubtitle()) return;

        subtitleInterval = setInterval(() => {
            if (trySetSubtitle()) {
                clearInterval(subtitleInterval);
                subtitleInterval = null;
            }
        }, 500);

        setTimeout(() => {
            if (subtitleInterval) {
                clearInterval(subtitleInterval);
                subtitleInterval = null;
            }
        }, 10000);
    }

    // 优化观察者回调函数
    function optimizedObserverCallback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查新增的节点中是否包含字幕相关元素
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        if (node.querySelector && (
                            node.querySelector('.bpx-player-ctrl-subtitle-language-item') ||
                            node.classList && node.classList.contains('bpx-player-ctrl-subtitle-language-item')
                        )) {
                            openSubtitle();
                            return;
                        }
                    }
                }
            }
        }
    }

    // 初始检测
    openSubtitle();

    // 监听URL变化（SPA路由切换）
    setInterval(() => {
        if (window.location.href !== currentHref) {
            currentHref = window.location.href;
            openSubtitle();
        }
    }, 500);

    // 页面完全加载后重新检测
    window.addEventListener('load', openSubtitle);

    // 监听播放器状态变化
    const playerContainer = document.querySelector('.bpx-player-container, #bilibiliPlayer, #bilibili-player');
    if (playerContainer) {
        const observer = new MutationObserver(optimizedObserverCallback);
        observer.observe(playerContainer, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // 添加一个备用检测机制：监听DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', openSubtitle);
    }
})();