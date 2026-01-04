// ==UserScript==
// @name         图片预览滚轮缩放（国家岩矿化石标本资源共享平台）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  岩石标本页面，用鼠标点击放大缩小不方便，添加鼠标中间滚轮缩放
// @author       brucmao@gmail.com
// @license MIT
// @match        http://www.nimrf.net.cn/yk/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531831/%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%BB%9A%E8%BD%AE%E7%BC%A9%E6%94%BE%EF%BC%88%E5%9B%BD%E5%AE%B6%E5%B2%A9%E7%9F%BF%E5%8C%96%E7%9F%B3%E6%A0%87%E6%9C%AC%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%AB%E5%B9%B3%E5%8F%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531831/%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%BB%9A%E8%BD%AE%E7%BC%A9%E6%94%BE%EF%BC%88%E5%9B%BD%E5%AE%B6%E5%B2%A9%E7%9F%BF%E5%8C%96%E7%9F%B3%E6%A0%87%E6%9C%AC%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%AB%E5%B9%B3%E5%8F%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const SCALE_STEP = 0.2;
    const MIN_SCALE = 0.1;
    const MAX_SCALE = 5.0;

    // 工具函数：提取当前旋转角度
    function getRotation(transformStr) {
        let match = transformStr.match(/rotate\(([^)]+)\)/);
        return match ? match[1] : '0deg';
    }

    // 滚轮事件处理函数
    function onWheelZoom(e) {
        // 判断是否在预览界面内（el-image-viewer__canvas）
        let previewContainer = e.target.closest('.el-image-viewer__canvas');
        if (!previewContainer) return;

        // 获取图片元素
        let img = previewContainer.querySelector('.el-image-viewer__img');
        if (!img) return;

        // 阻止默认行为及冒泡
        e.preventDefault();
        e.stopPropagation();

        // 获取当前缩放值，默认 1
        let currentScale = parseFloat(img.dataset.scale) || 1;

        // 更新缩放值（滚轮向上放大，向下缩小）
        if (e.deltaY < 0) {
            currentScale = Math.min(currentScale + SCALE_STEP, MAX_SCALE);
        } else {
            currentScale = Math.max(currentScale - SCALE_STEP, MIN_SCALE);
        }
        // 保存新的缩放值
        img.dataset.scale = currentScale;

        // 获取当前旋转角度，保持不变
        let rotation = getRotation(img.style.transform);

        // 应用 transform 样式
        img.style.transformOrigin = "center center";
        img.style.transform = `scale(${currentScale}) rotate(${rotation})`;
    }

    // 全局监听 wheel 事件，设置 passive: false 以允许调用 preventDefault
    document.addEventListener('wheel', onWheelZoom, { passive: false });
})();