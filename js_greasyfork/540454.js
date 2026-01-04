// ==UserScript==
// @name         高性能磨砂透明亚克力（优化版）
// @namespace    http://
// @version      0.2-optimized
// @description  用磨砂透明亚克力替换页面中较大色块
// @match        *://*/*
// @icon        https://images.icon-icons.com/4241/PNG/96/cardano_ada_crypto_icon_264359.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540454/%E9%AB%98%E6%80%A7%E8%83%BD%E7%A3%A8%E7%A0%82%E9%80%8F%E6%98%8E%E4%BA%9A%E5%85%8B%E5%8A%9B%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540454/%E9%AB%98%E6%80%A7%E8%83%BD%E7%A3%A8%E7%A0%82%E9%80%8F%E6%98%8E%E4%BA%9A%E5%85%8B%E5%8A%9B%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 可调参数 ----------
    const BLUR_PIXELS   = 8;            // 模糊半径 (px)
    const BG_OPACITY    = 0.15;         // 背景透明度
    const BORDER_COLOR  = 'rgba(255,255,255,0.3)'; // 边框颜色
    const AREA_RATIO    = 0.02;         // 元素面积占视口比例阈值（2%）
    const MIN_SIZE      = 5;            // 忽略 5x5px 以内的元素
    const SCAN_DELAY    = 500;          // 窗口调整后延迟扫描 (ms)
    // --------------------------------

    const processedElements = new Map(); // 缓存已处理的元素

    // 判断元素是否有非透明背景
    function hasBackground(el) {
        const cs = getComputedStyle(el);
        return cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    }

    // 判断是否满足“较大色块” 或者 “按钮”
    function shouldFrost(el) {
        const rect = el.getBoundingClientRect();
        if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) return false; // ✅ 忽略小元素
        const area = rect.width * rect.height;
        const vpArea = window.innerWidth * window.innerHeight;
        if (area / vpArea >= AREA_RATIO) return true;
        return el.tagName.toLowerCase() === 'button';
    }

    // 应用磨砂透明亚克力样式
    function applyFrost(el) {
        if (processedElements.has(el)) return; // 避免重复处理
        processedElements.set(el, true);

        el.style.setProperty('background',       `rgba(255,255,255, ${BG_OPACITY})`, 'important');
        el.style.setProperty('backdrop-filter',  `blur(${BLUR_PIXELS}px)`, 'important');
        el.style.setProperty('-webkit-backdrop-filter', `blur(${BLUR_PIXELS}px)`, 'important');
        el.style.setProperty('border',           `1px solid ${BORDER_COLOR}`, 'important');
        el.style.setProperty('border-radius',    '4px', 'important');

        // ✅ 开启硬件加速
        el.style.setProperty('transform',        'translateZ(0)', 'important');
        el.style.setProperty('will-change',      'transform, opacity', 'important');
    }

    // 扫描并处理（可传入根节点）
    function scan(root = document) {
        requestIdleCallback(() => {
            root.querySelectorAll('*').forEach(el => {
                if (hasBackground(el) && shouldFrost(el)) {
                    applyFrost(el);
                }
            });
        });
    }

    // 首次加载与窗口大小变化时全量扫描
    window.addEventListener('load',  () => scan());
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => scan(), SCAN_DELAY);
    });

    // 监控 DOM 变动，局部扫描新节点
    new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) scan(node);
            });
        });
    }).observe(document.body, { childList: true, subtree: true });

})();
