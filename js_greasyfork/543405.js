// ==UserScript==
// @name         隐藏不太灵下载遮挡
// @version      1.1
// @namespace    http://tampermonkey.net/
// @description  隐藏不太灵VIP弹窗和模糊遮挡层
// @author       You
// @match        https://www.0bt0.com/*
// @match        https://www.butailing.com/*
// @match        https://shop.tvnomi.shop/*
// @match        https://www.0bt0.com/*
// @match        https://www.1bt0.com/*
// @match        https://www.2bt0.com/*
// @match        https://www.3bt0.com/*
// @match        https://www.4bt0.com/*
// @match        https://www.5bt0.com/*
// @match        https://www.6bt0.com/*
// @match        https://www.7bt0.com/*
// @match        https://www.8bt0.com/*
// @match        https://www.9bt0.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543405/%E9%9A%90%E8%97%8F%E4%B8%8D%E5%A4%AA%E7%81%B5%E4%B8%8B%E8%BD%BD%E9%81%AE%E6%8C%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/543405/%E9%9A%90%E8%97%8F%E4%B8%8D%E5%A4%AA%E7%81%B5%E4%B8%8B%E8%BD%BD%E9%81%AE%E6%8C%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetClass = 'vip-gate-overlay';
    const observedElements = new WeakSet();

    function hideOverlayElements() {
        document.querySelectorAll(`.${targetClass}`).forEach(overlay => {
            if (!observedElements.has(overlay)) {
                overlay.style.setProperty('display', 'none', 'important');
                observedElements.add(overlay);
                console.log(`[隐藏成功] 已隐藏 .${targetClass} 元素`);
            }
        });
    }

    function removeBlurredStyles() {
        document.querySelectorAll('div').forEach(div => {
            const style = div.getAttribute('style');
            if (style) {
                const regexes = [
                    /filter\s*:/i,
                    /pointer-events\s*:\s*none\s*(?:;|$)/gi,
                    /user-select\s*:\s*none\s*(?:;|$)/gi
                ];

                let newStyle = style;
                let modified = false;

                regexes.forEach(regex => {
                    if (regex.test(newStyle)) {
                        modified = true;
                        newStyle = newStyle.replace(regex, '').trim();
                    }
                });

                if (modified) {
                    newStyle = newStyle.replace(/\s*;\s*/g, ';').replace(/;+$/, '');
                    div.setAttribute('style', newStyle);
                    console.log('[样式清理] 已清除模糊样式');
                }
            }
        });
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                hideOverlayElements();
                removeBlurredStyles();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    // 每隔 3 秒也检查一次，防止漏掉
    setInterval(() => {
        hideOverlayElements();
        removeBlurredStyles();
    }, 3000);

    // 增加一个延迟执行的兜底
    setTimeout(() => {
        console.log('[延迟执行] 开始首次样式清理（延迟执行）');
        hideOverlayElements();
        removeBlurredStyles();
    }, 5000);

    let lastClickTime = 0;
    document.addEventListener('click', (event) => {
        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime;

        // 防止频繁触发（比如 500ms 内重复点击）
        if (timeSinceLastClick > 500) {
            console.log('[点击触发] 用户点击了页面，正在清理模糊层...');
            hideOverlayElements();
            removeBlurredStyles();
            lastClickTime = now;
        }
    });

    console.log(`[监听启动] 正在监听 .${targetClass} 元素的出现以及模糊样式...`);
    window.addEventListener('load', () => {
        console.log('[页面加载完成] 开始首次样式清理');
        hideOverlayElements();
        removeBlurredStyles();
    });
})();