// ==UserScript==
// @name         网页一键模糊防窥屏
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  按Ctrl+B快捷键切换网页模糊，防止他人窥屏
// @author       AI助手
// @match        *://*/*
// @grant        none
// @license Apache-2.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542783/%E7%BD%91%E9%A1%B5%E4%B8%80%E9%94%AE%E6%A8%A1%E7%B3%8A%E9%98%B2%E7%AA%A5%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/542783/%E7%BD%91%E9%A1%B5%E4%B8%80%E9%94%AE%E6%A8%A1%E7%B3%8A%E9%98%B2%E7%AA%A5%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MASK_ID = '__tampermonkey_blur_mask__';
    const STYLE_ID = '__tampermonkey_blur_style__';

    function createBlurMask(root = document) {
        if (root.getElementById && root.getElementById(MASK_ID)) return;
        // 创建遮罩层
        const mask = root.createElement('div');
        mask.id = MASK_ID;
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100vw';
        mask.style.height = '100vh';
        mask.style.zIndex = '999999999';
        mask.style.pointerEvents = 'none';
        mask.style.backdropFilter = 'blur(12px)';
        mask.style.background = 'rgba(255,255,255,0.15)';
        mask.style.transition = 'backdrop-filter 0.2s';
        root.body.appendChild(mask);
        // 插入样式，兼容不支持backdrop-filter的浏览器
        if (root.getElementById && !root.getElementById(STYLE_ID)) {
            const style = root.createElement('style');
            style.id = STYLE_ID;
            style.innerHTML = `
                #${MASK_ID} {
                    -webkit-backdrop-filter: blur(12px);
                    backdrop-filter: blur(12px);
                }
            `;
            root.head.appendChild(style);
        }
    }

    function removeBlurMask(root = document) {
        const mask = root.getElementById && root.getElementById(MASK_ID);
        if (mask) mask.remove();
        const style = root.getElementById && root.getElementById(STYLE_ID);
        if (style) style.remove();
    }

    function applyBlur() {
        // 处理主文档
        createBlurMask(document);
        // 处理所有同源iframe
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (!doc) return;
                createBlurMask(doc);
            } catch (e) {
                // 跨域iframe忽略
            }
        });
        // 处理所有Shadow DOM
        function traverseShadow(rootNode) {
            if (!rootNode) return;
            if (rootNode.shadowRoot) {
                createBlurMask(rootNode.shadowRoot);
                Array.from(rootNode.shadowRoot.children).forEach(traverseShadow);
            } else if (rootNode.children) {
                Array.from(rootNode.children).forEach(traverseShadow);
            }
        }
        traverseShadow(document.body);
    }

    function removeBlur() {
        // 处理主文档
        removeBlurMask(document);
        // 处理所有同源iframe
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (!doc) return;
                removeBlurMask(doc);
            } catch (e) {
                // 跨域iframe忽略
            }
        });
        // 处理所有Shadow DOM
        function traverseShadow(rootNode) {
            if (!rootNode) return;
            if (rootNode.shadowRoot) {
                removeBlurMask(rootNode.shadowRoot);
                Array.from(rootNode.shadowRoot.children).forEach(traverseShadow);
            } else if (rootNode.children) {
                Array.from(rootNode.children).forEach(traverseShadow);
            }
        }
        traverseShadow(document.body);
    }

    function toggleBlur() {
        if (document.getElementById(MASK_ID)) {
            removeBlur();
            sessionStorage.setItem('isBlurred', 'false');
        } else {
            applyBlur();
            sessionStorage.setItem('isBlurred', 'true');
        }
    }

    document.addEventListener('keydown', function(e) {
        // Alt+Q
        if (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey && (e.key === 'q' || e.key === 'Q')) {
            e.preventDefault();
            toggleBlur();
        }
    });

    // 页面加载时检查并恢复模糊状态
    // 页面加载时检查并恢复模糊状态
    if (sessionStorage.getItem('isBlurred') === 'true') {
        applyBlur();
    }
})();