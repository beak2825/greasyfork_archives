// ==UserScript==
// @name         91porn视频广告跳过器-优化版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  完全屏蔽视频播放器广告，防止广告闪现
// @author       You
// @match        https://91porn.com/*
// @match        http://91porn.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547373/91porn%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87%E5%99%A8-%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/547373/91porn%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87%E5%99%A8-%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始registerPlugin方法
    const originalRegisterPlugin = window.videojs && window.videojs.registerPlugin;

    // 更早地重写registerPlugin方法
    if (window.videojs) {
        window.videojs.registerPlugin = function(name, plugin) {
            if (name === 'preroll') {
                console.log('广告插件已被完全屏蔽');
                // 返回一个完全空的函数，不执行任何操作
                return function() {
                    // 这个空函数确保不会创建任何广告元素
                };
            }
            // 对于其他插件，正常注册
            return originalRegisterPlugin.call(this, name, plugin);
        };
    } else {
        // 如果videojs尚未加载，设置一个拦截器
        Object.defineProperty(window, 'videojs', {
            set: function(value) {
                // 保存原始registerPlugin方法
                const originalRegisterPlugin = value.registerPlugin;

                // 重写registerPlugin方法
                value.registerPlugin = function(name, plugin) {
                    if (name === 'preroll') {
                        console.log('广告插件已被完全屏蔽');
                        return function() {
                            // 空函数，不执行任何操作
                        };
                    }
                    return originalRegisterPlugin.call(this, name, plugin);
                };

                // 设置实际的videojs对象
                Object.defineProperty(window, 'videojs', {
                    value: value,
                    writable: false
                });
            },
            configurable: true
        });
    }

    // 监听DOM变化，确保不会创建广告元素
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    // 如果检测到广告相关元素，立即移除
                    if (node.nodeType === 1) {
                        if (node.classList && (
                            node.classList.contains('vjs-preroll') ||
                            node.classList.contains('preroll-skip-button') ||
                            node.classList.contains('pre-countdown')
                        )) {
                            node.remove();
                            console.log('检测到并移除了广告元素');
                        }

                        // 检查子节点
                        const adElements = node.querySelectorAll ? node.querySelectorAll('.vjs-preroll, .preroll-skip-button, .pre-countdown') : [];
                        adElements.forEach(function(adElement) {
                            adElement.remove();
                            console.log('检测到并移除了子广告元素');
                        });
                    }
                });
            }
        });
    });

    // 开始观察DOM变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后，再次确保没有广告元素
    window.addEventListener('load', function() {
        // 移除所有可能的广告元素
        document.querySelectorAll('.vjs-preroll, .preroll-skip-button, .pre-countdown').forEach(function(element) {
            element.remove();
        });

        // 清除观察器
        observer.disconnect();
    });
})();