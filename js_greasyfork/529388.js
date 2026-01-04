// ==UserScript==
// @name         简洁WebP图片加载优化
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  极简版：自动将 data-src 图片转为 WebP（支持降级），懒加载，不干扰已加载图片
// @author       KiwiFruit
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529388/%E7%AE%80%E6%B4%81WebP%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529388/%E7%AE%80%E6%B4%81WebP%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 工具函数 ====================
    const utils = {
        // 检测是否支持 WebP
        supportsWebP: (() => {
            try {
                const canvas = document.createElement('canvas');
                return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
            } catch (e) {
                return false;
            }
        })(),

        // 验证 URL 是否有效
        isValidUrl(str) {
            if (!str || typeof str !== 'string') return false;
            try {
                new URL(str, window.location.href);
                return true;
            } catch {
                return false;
            }
        },

        // 日志输出
        log(level, msg) {
            console[level](`[WebP优化] ${msg}`);
        },
    };

    // ==================== 核心功能 ====================
    function init() {
        // 只处理带有 data-src 的图片
        const images = document.querySelectorAll('img[data-src]');
        utils.log('info', `发现 ${images.length} 个待优化图片`);

        for (const img of images) {
            // 跳过已加载成功的图片
            if (img.complete && img.naturalHeight > 0) {
                img.dataset.processed = 'true';
                continue;
            }

            // 如果已有 src 且非空，保留它（防止覆盖）
            if (img.src && img.src !== '' && !img.src.startsWith('data:')) {
                img.dataset.processed = 'true';
                continue;
            }

            // 获取原始源和 WebP 源
            const originalSrc = img.dataset.src;
            const webpSrc = img.dataset.webpSrc;

            // 如果没有原始源，跳过
            if (!originalSrc || !utils.isValidUrl(originalSrc)) {
                utils.log('warn', `图片无有效 data-src，跳过:`, img);
                img.dataset.processed = 'true';
                continue;
            }

            // 设置懒加载
            img.loading = 'lazy';

            // 尝试 WebP
            let targetSrc = originalSrc;
            if (utils.supportsWebP && webpSrc && utils.isValidUrl(webpSrc)) {
                targetSrc = webpSrc;
            }

            // 设置 src，并添加 error 事件处理
            img.src = targetSrc;
            img.onerror = () => {
                utils.log('warn', `WebP加载失败，降级到原图: ${originalSrc}`, img);
                img.src = originalSrc;
                img.onerror = null; // 防止无限循环
            };

            // 标记为已处理
            img.dataset.processed = 'true';
        }

        utils.log('info', '图片优化完成');
    }

    // ==================== 启动 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }
})();