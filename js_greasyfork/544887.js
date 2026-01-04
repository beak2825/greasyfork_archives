// ==UserScript==
// @name         123.tv 手机端视频预览
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为123.tv手机端添加视频预览功能
// @author       You
// @match        https://jable.tv/*
// @match        https://*.jable.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544887/123tv%20%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544887/123tv%20%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 检测是否为手机模式
     * @returns {boolean} 如果是手机模式返回true
     */
    function isMobileMode() {
        // 检测屏幕宽度，小于等于768px认为是手机
        if (window.innerWidth <= 768) return true;

        // 检测用户代理字符串，匹配移动设备
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    }

    // 如果不是手机模式，直接退出脚本
    if (!isMobileMode()) {
        console.log('非手机模式，脚本不会运行');
        return;
    }

    console.log('检测到手机模式，初始化视频预览脚本');

    // 存储当前播放的视频元素，使用Map确保每个元素互不干扰
    const activeVideos = new Map();

    /**
     * 创建视频预览元素
     * @param {Element} imgElement 图片元素
     * @param {string} previewUrl 预览视频的URL
     * @returns {HTMLVideoElement} 创建的video元素
     */
    function createVideoPreview(imgElement, previewUrl) {
        const video = document.createElement('VIDEO');

        // 设置视频样式，覆盖在图片上方
        video.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 10;
            border-radius: inherit;
        `;

        // 设置视频属性
        video.controls = false;    // 不显示控制栏
        video.autoplay = true;     // 自动播放
        video.muted = true;        // 静音播放
        video.loop = true;         // 循环播放
        video.playsInline = true;  // 重要：防止iOS设备全屏播放
        video.src = previewUrl;    // 设置视频源

        // 视频加载失败时的错误处理
        video.onerror = function() {
            console.log('视频预览加载失败:', previewUrl);
            removeVideoPreview(imgElement);
        };

        return video;
    }

    /**
     * 添加视频预览到页面
     * @param {Element} imgElement 图片元素
     * @param {string} previewUrl 预览视频URL
     * @param {string} originalHref 原始链接地址
     * @param {Function} originalClick 原始点击事件处理函数
     */
    function addVideoPreview(imgElement, previewUrl, originalHref, originalClick) {
        // 如果该图片已经有预览视频，先移除
        removeVideoPreview(imgElement);

        // 找到图片的容器元素
        const imgBox = imgElement.closest('.img-box');
        if (!imgBox) return;

        // 设置容器为相对定位，以便视频元素绝对定位
        imgBox.style.position = 'relative';
        imgBox.style.overflow = 'hidden';

        // 创建视频预览元素
        const video = createVideoPreview(imgElement, previewUrl);

        // 将原始点击事件绑定到视频元素上
        // 用户点击预览视频时会执行原本的跳转逻辑
        video.addEventListener('click', function(e) {
            e.preventDefault();       // 阻止默认行为
            e.stopPropagation();     // 阻止事件冒泡

            // 如果有原始点击事件，执行它
            if (originalClick) {
                originalClick.call(this, e);
            } else {
                // 否则直接跳转到原始链接
                window.location.href = originalHref;
            }
        });

        // 将视频元素添加到页面
        imgBox.appendChild(video);

        // 在Map中存储视频引用，用于后续管理
        activeVideos.set(imgElement, video);

        console.log('视频预览已添加:', previewUrl);
    }

    /**
     * 移除指定图片元素的视频预览
     * @param {Element} imgElement 图片元素
     */
    function removeVideoPreview(imgElement) {
        // 从Map中获取对应的视频元素
        const video = activeVideos.get(imgElement);
        if (video) {
            video.remove();                    // 从DOM中移除视频元素
            activeVideos.delete(imgElement);   // 从Map中删除引用
            console.log('视频预览已移除');
        }
    }

    /**
     * 处理单个图片元素，修改其点击行为
     * @param {Element} imgElement 图片元素
     */
    function processImageElement(imgElement) {
        // 获取预览视频的URL
        const previewUrl = imgElement.getAttribute('data-preview');
        if (!previewUrl) return;  // 如果没有预览URL，跳过处理

        // 找到包含图片的链接元素
        const linkElement = imgElement.closest('a');
        if (!linkElement) return;  // 如果没有找到链接，跳过处理

        // 保存原始的链接地址和点击事件
        const originalHref = linkElement.href;
        const originalClick = linkElement.onclick;

        // 禁用原始的链接跳转行为
        linkElement.href = 'javascript:void(0)';
        linkElement.onclick = null;

        // 添加新的点击事件处理逻辑
        linkElement.addEventListener('click', function(e) {
            e.preventDefault();      // 阻止默认行为
            e.stopPropagation();    // 阻止事件冒泡

            // 点击图片时显示预览视频，并将原始点击事件转移到视频上
            addVideoPreview(imgElement, previewUrl, originalHref, originalClick);
        });

        console.log('图片元素处理完成:', imgElement);
    }

    /**
     * 初始化视频预览功能
     * 遍历页面中所有的视频缩略图并处理它们
     */
    function initVideoPreview() {
        // 查找所有视频缩略图容器
        const videoBoxes = document.querySelectorAll('.video-img-box');

        // 遍历每个容器，找到其中带有data-preview属性的图片
        videoBoxes.forEach(box => {
            const imgElement = box.querySelector('img[data-preview]');
            if (imgElement) {
                processImageElement(imgElement);
            }
        });

        console.log(`已处理 ${videoBoxes.length} 个视频缩略图`);
    }

    /**
     * 设置变动观察器，监听页面动态加载的内容
     * 当页面通过AJAX等方式加载新内容时，自动处理新的视频元素
     */
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // 遍历所有新增的节点
                mutation.addedNodes.forEach(function(node) {
                    // 只处理元素节点（非文本节点等）
                    if (node.nodeType === 1) {
                        // 查找新增节点中的视频缩略图容器
                        const newBoxes = node.querySelectorAll ?
                            node.querySelectorAll('.video-img-box') : [];

                        // 如果新增节点本身就是视频缩略图容器
                        if (node.classList && node.classList.contains('video-img-box')) {
                            const imgElement = node.querySelector('img[data-preview]');
                            if (imgElement) {
                                processImageElement(imgElement);
                            }
                        }

                        // 处理新增节点内部的所有视频缩略图容器
                        newBoxes.forEach(box => {
                            const imgElement = box.querySelector('img[data-preview]');
                            if (imgElement) {
                                processImageElement(imgElement);
                            }
                        });
                    }
                });
            });
        });

        // 开始观察整个document.body的变化
        observer.observe(document.body, {
            childList: true,    // 观察子节点的添加和删除
            subtree: true       // 观察所有后代节点
        });

        console.log('变动观察器已设置，将监听动态加载的内容');
    }

    /**
     * 清理函数 - 在页面卸载时清理所有活动的视频元素
     * 防止内存泄漏
     */
    function cleanup() {
        activeVideos.forEach((video, imgElement) => {
            removeVideoPreview(imgElement);
        });
    }

    // 页面卸载前执行清理
    window.addEventListener('beforeunload', cleanup);

    // 等待页面加载完成后初始化脚本
    if (document.readyState === 'loading') {
        // 如果页面还在加载中，等待DOM加载完成
        document.addEventListener('DOMContentLoaded', function() {
            // 延迟1秒执行，确保页面完全加载
            setTimeout(() => {
                initVideoPreview();
                setupMutationObserver();
            }, 1000);
        });
    } else {
        // 如果页面已经加载完成，直接执行
        setTimeout(() => {
            initVideoPreview();
            setupMutationObserver();
        }, 1000);
    }

    console.log('123.tv 手机端视频预览脚本已加载');
})();