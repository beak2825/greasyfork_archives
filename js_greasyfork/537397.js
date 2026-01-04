// ==UserScript==
// @name             禁用电商平台图片缩放效果 (全平台终极版)
// @name:en          Disable E-commerce Image Zoom Effect (Ultimate All-Platform)
// @namespace        https://greasyfork.org/users/3001-hanjian-wu
// @version          1.7.0
// @description      精准禁用淘宝、天猫、1688、京东等平台的图片放大镜效果，包括主图和动态弹出的图集。方便右键保存。
// @description:en   Precisely disable image magnifier on Taobao, Tmall, 1688, JD, including main image and dynamic popup galleries. For easy right-clicking.
// @author           hanjian wu (Enhanced by AI)
// @homepage         https://greasyfork.org/users/3001-hanjian-wu
// @license          MIT
// @match            *://*.taobao.com/item.htm*
// @match            *://*.tmall.com/item.htm*
// @match            *://*.1688.com/offer/*.html*
// @match            *://item.taobao.com/*
// @match            *://detail.tmall.com/*
// @match            *://detail.1688.com/*
// @match            *://item.jd.com/*
// @match            *://*.jd.com/product/*
// @grant            none
// @run-at           document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/537397/%E7%A6%81%E7%94%A8%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%E5%9B%BE%E7%89%87%E7%BC%A9%E6%94%BE%E6%95%88%E6%9E%9C%20%28%E5%85%A8%E5%B9%B3%E5%8F%B0%E7%BB%88%E6%9E%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537397/%E7%A6%81%E7%94%A8%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%E5%9B%BE%E7%89%87%E7%BC%A9%E6%94%BE%E6%95%88%E6%9E%9C%20%28%E5%85%A8%E5%B9%B3%E5%8F%B0%E7%BB%88%E6%9E%81%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'usestric t';
    console.log('电商图片缩放禁用脚本 v1.7.0 (全平台终极版)');

    const platform = {
        isTaobaoTmall: window.location.hostname.includes('taobao.com') || window.location.hostname.includes('tmall.com'),
        isJD: window.location.hostname.includes('jd.com'),
        is1688: window.location.hostname.includes('1688.com')
    };

    // --- 核心防御：注入CSS样式 ---
    // 这是最快、最高效的第一道防线。
    function addGlobalStyles() {
        const styleId = 'disable-zoom-styles-ultimate';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        let cssText = '';

        if (platform.isTaobaoTmall) {
            console.log('[防御1] 应用淘宝/天猫禁用规则');
            cssText = `
                /* 禁用js-image-zoom的放大镜和放大图层 (包括主图和弹出图集) */
                .js-image-zoom__zoomed-area,
                .js-image-zoom__zoomed-image,
                #lensDiv {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }

                /* 对付CSS Modules: 使用属性选择器匹配动态类名 */
                /* 让主图容器事件穿透，以便能点击到下面的图片 */
                [class*="--mainPicWrap--"] {
                    pointer-events: none !important;
                }

                /* 让主图本身恢复交互，可以右键 */
                [class*="--mainPic--"] {
                    pointer-events: auto !important;
                    cursor: default !important;
                    /* 解决层级问题 */
                    position: relative !important;
                    z-index: auto !important;
                }

                /* 恢复缩略图、视频等其他元素的交互 */
                [class*="--thumbnail--"], [class*="--switchTabsItem--"], .videox-container, .videox-container * {
                    pointer-events: auto !important;
                }
            `;
        } else if (platform.isJD) {
            console.log('[防御1] 应用京东禁用规则');
            cssText = `
                /* 精准隐藏jqzoom的动态元素 */
                .jqZoomPup, .zoomdiv, .jqzoom-window, .jqzoom-lens {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
                /* 确保主图本身可交互 */
                #spec-n1, #spec-img {
                    cursor: default !important;
                }
            `;
        } else if (platform.is1688) {
            // 1688的规则相对简单
            cssText = `
                .scale-img, .scaled-img {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
            `;
        }

        style.textContent = cssText;
        (document.head || document.documentElement).appendChild(style);
    }

    // --- JS防御：仅针对需要的平台 ---
    function applyJsDefenses() {
        if (platform.isJD) {
            // --- 京东第二道防线：重写 jQuery 插件 ---
            function neutralizeJqzoomPlugin() {
                if (typeof window.jQuery !== 'undefined' && typeof window.jQuery.fn.jqzoom !== 'undefined') {
                    window.jQuery.fn.jqzoom = function() { return this; };
                    if (jqzoomCheckInterval) clearInterval(jqzoomCheckInterval);
                    console.log('[防御2/JD] 成功禁用jqzoom插件。');
                }
            }
            const jqzoomCheckInterval = setInterval(neutralizeJqzoomPlugin, 100);
            window.addEventListener('load', () => setTimeout(() => clearInterval(jqzoomCheckInterval), 5000));

            // --- 京东第三道防线：阻止事件传播 ---
            function blockJdHoverEvents(container) {
                if (!container || container.dataset.eventsBlocked) return;
                ['mouseenter', 'mouseover', 'mousemove'].forEach(eventType => {
                    container.addEventListener(eventType, e => e.stopImmediatePropagation(), { capture: true });
                });
                container.dataset.eventsBlocked = 'true';
                console.log(`[防御3/JD] 已在元素 #${container.id || container.className} 上阻止鼠标悬停事件。`);
            }

            // 监控京东DOM变化
             new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            const zoomContainer = node.matches('#spec-n1, .jqzoom') ? node : node.querySelector('#spec-n1, .jqzoom');
                            if (zoomContainer) blockJdHoverEvents(zoomContainer);
                        }
                    }
                }
            }).observe(document.body || document.documentElement, { childList: true, subtree: true });
        }
        // 对于淘宝/天猫，纯CSS的解决方案已经足够健壮，通常不需要额外的JS防御。
    }

    // --- 初始化 ---
    addGlobalStyles();
    document.addEventListener('DOMContentLoaded', applyJsDefenses);

})();