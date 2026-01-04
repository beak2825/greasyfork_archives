// ==UserScript==
// @name         Telegram Web - Robust Scroll Fix (v1.4 - Image/Load Handling)
// @name:zh-CN   电报网页版 - 健壮滚动修复 (v1.4 - 图片/加载处理)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Attempts to fix scroll issues more robustly, handling late-loading images and initial load scenarios.
// @description:zh-CN 更健壮地修复滚动问题，尝试处理延迟加载的图片和初始加载场景。
// @author       AI Assistant & You
// @match        *://web.telegram.org/k/*
// @grant        GM_addStyle
// @icon         https://web.telegram.org/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534410/Telegram%20Web%20-%20Robust%20Scroll%20Fix%20%28v14%20-%20ImageLoad%20Handling%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534410/Telegram%20Web%20-%20Robust%20Scroll%20Fix%20%28v14%20-%20ImageLoad%20Handling%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const SCROLL_THRESHOLD = 300;         // 判断“接近底部”的阈值 (像素)
    const POST_CORRECTION_CHECK_DELAY = 150; // rAF修正后再次检查的延迟(ms), 处理图片等慢加载
    const INITIAL_SCROLL_DELAY = 1800;    // 初始加载后检查滚动的延迟(ms), 增加时间
    const CHECK_INTERVAL = 1000;        // 查找容器间隔
    const SCROLL_CONTAINER_SELECTOR = '#column-center .scrollable.scrollable-y'; // K 版滚动容器
    // --- --- ---

    let targetNode = null; // 滚动容器
    let observer = null;
    let correctionFrameId = null; // 用于 requestAnimationFrame
    let postCorrectionTimeoutId = null; // 后置检查计时器
    let wasNearBottom = false; // 由滚动事件更新
    let isScrolling = false; // 标记用户是否正在滚动
    let scrollDebounceTimeout = null;
    let styleAdded = false; // 标记样式是否已添加

    console.log("[ScrollFixer v1.4] Script initializing...");

    // 注入 CSS 样式
    function applyStyles() {
        if (!styleAdded) {
            try {
                GM_addStyle(`
                    ${SCROLL_CONTAINER_SELECTOR} {
                        overflow-anchor: auto !important;
                    }
                    .scrollable-y.script-scrolling {
                         scroll-behavior: auto !important;
                    }
                `);
                styleAdded = true;
                console.log("[ScrollFixer v1.4] Applied CSS via GM_addStyle.");
            } catch (e) {
                console.error("[ScrollFixer v1.4] GM_addStyle failed.", e);
                const styleElement = document.createElement('style');
                 styleElement.textContent = `
                    ${SCROLL_CONTAINER_SELECTOR} { overflow-anchor: auto !important; }
                    .scrollable-y.script-scrolling { scroll-behavior: auto !important; }
                 `;
                 document.head.appendChild(styleElement);
                 console.warn("[ScrollFixer v1.4] Using fallback style injection.");
            }
        }
    }

    function isNearBottom(element) {
        if (!element) return false;
        const isScrollable = element.scrollHeight > element.clientHeight;
        return !isScrollable || (element.scrollHeight - element.scrollTop - element.clientHeight < SCROLL_THRESHOLD);
    }

     // 检查是否 *明确地* 远离底部
     function isFarFromBottom(element) {
        if (!element) return false; // 如果没有元素，不认为远离 (避免错误滚动)
        const isScrollable = element.scrollHeight > element.clientHeight;
        // 只有可滚动且距离底部大于阈值才算远离
        return isScrollable && (element.scrollHeight - element.scrollTop - element.clientHeight >= SCROLL_THRESHOLD);
    }

    function scrollToBottom(element, reason = "correction", behavior = 'auto') {
        if (!element || !document.contains(element)) return;
        const currentScroll = element.scrollTop;
        const maxScroll = element.scrollHeight - element.clientHeight;
        // 增加容错
        if (maxScroll - currentScroll < 1) {
             // console.log(`[ScrollFixer v1.4] Already at bottom (${reason}), scroll skipped.`);
            // 即使跳过滚动，也要确保状态正确
            if (!wasNearBottom) { // 如果之前认为不在底部，现在强制设为在底部
                wasNearBottom = true;
                // console.log("[ScrollFixer v1.4] State corrected to wasNearBottom=true after skip.");
            }
            return;
        }
        console.log(`[ScrollFixer v1.4] Forcing scroll to bottom (Reason: ${reason}, Behavior: ${behavior}).`);

        element.classList.add('script-scrolling');
        element.scrollTo({ top: element.scrollHeight, behavior: behavior });
        // 滚动后立即更新状态
        wasNearBottom = true;

        requestAnimationFrame(() => {
             requestAnimationFrame(() => {
                 if (element) element.classList.remove('script-scrolling');
             });
        });
    }

    // 处理滚动事件
    function handleScroll() {
        if (!targetNode) return;
        if (targetNode.classList.contains('script-scrolling')) {
             return; // 忽略脚本触发的滚动
        }
        isScrolling = true;
        clearTimeout(scrollDebounceTimeout);
        wasNearBottom = isNearBottom(targetNode);
        // console.log(`[ScrollFixer v1.4] Scroll event. Near bottom: ${wasNearBottom}`);
        scrollDebounceTimeout = setTimeout(() => {
            isScrolling = false;
            // console.log("[ScrollFixer v1.4] Scroll ended.");
        }, 150);
    }


    // 处理 DOM 变化的函数 - 即时 rAF + 后置检查
    function handleMutations(mutationsList, observer) {
        if (isScrolling) {
            return;
        }

        if (wasNearBottom && targetNode) {
            // console.log("[ScrollFixer v1.4] Mutation detected while near bottom. Scheduling immediate rAF correction.");

            // 取消上一个可能未执行的帧和后置检查
            if (correctionFrameId) cancelAnimationFrame(correctionFrameId);
            clearTimeout(postCorrectionTimeoutId); // 清除上一个后置检查

            // 立即请求下一帧执行修正
            correctionFrameId = requestAnimationFrame(() => {
                correctionFrameId = null; // 清除 ID
                if (targetNode && document.contains(targetNode)) {
                    // console.log("[ScrollFixer v1.4] Performing immediate rAF scroll correction.");
                    scrollToBottom(targetNode, "mutation_rAF", 'auto');

                    // --- 新增：rAF 修正后，安排一个后置检查 ---
                    postCorrectionTimeoutId = setTimeout(() => {
                        postCorrectionTimeoutId = null; // 清除 ID
                        if (targetNode && document.contains(targetNode) && !isScrolling) {
                             // console.log("[ScrollFixer v1.4] Performing post-correction check.");
                             if (!isNearBottom(targetNode)) { // 如果此时因为图片加载等原因又不在底部了
                                 console.warn("[ScrollFixer v1.4] Post-correction check failed. Scrolling again.");
                                 scrollToBottom(targetNode, "post_check", 'auto'); // 再次滚动
                             } else {
                                 // console.log("[ScrollFixer v1.4] Post-correction check passed.");
                                 // 确保状态正确
                                 wasNearBottom = true;
                             }
                        }
                    }, POST_CORRECTION_CHECK_DELAY);
                    // --- --- ---

                } else {
                    // console.warn("[ScrollFixer v1.4] Target node lost before immediate rAF execution.");
                }
            });
        }
    }

    // 查找并观察消息列表容器
    function findAndObserve() {
        const targetSelector = SCROLL_CONTAINER_SELECTOR;
        let potentialNode = document.querySelector(targetSelector);

        if (observer && targetNode === potentialNode && document.contains(targetNode)) {
            return;
        }

        // Cleanup
        if (observer) { /* ... 清理逻辑 ... */ }
        targetNode = potentialNode;

        if (targetNode) {
            console.log("[ScrollFixer v1.4] Chat scroll container found:", targetNode);
            applyStyles();

            // 初始滚动检查 - 更保守
            setTimeout(() => {
                if (targetNode && document.contains(targetNode)) {
                    console.log("[ScrollFixer v1.4] Performing initial check...");
                    // 只有当明确检测到远离底部时，才执行初始滚动
                    if (isFarFromBottom(targetNode)) {
                        console.log("[ScrollFixer v1.4] Far from bottom on initial check. Scrolling down.");
                        scrollToBottom(targetNode, "initial_load", 'auto');
                        wasNearBottom = true;
                    } else {
                        console.log("[ScrollFixer v1.4] Already near bottom or content not fully loaded? Initial scroll skipped/deferred.");
                        // 确保状态与实际情况一致
                        wasNearBottom = isNearBottom(targetNode);
                    }
                    console.log(`[ScrollFixer v1.4] Initial state - near bottom: ${wasNearBottom}`);

                    // Setup listeners/observer
                    if (!observer) {
                        targetNode.addEventListener('scroll', handleScroll, { passive: true });
                        console.log("[ScrollFixer v1.4] Scroll listener added.");
                        observer = new MutationObserver(handleMutations);
                        const config = { childList: true, subtree: true };
                        observer.observe(targetNode, config);
                        console.log("[ScrollFixer v1.4] MutationObserver started.");
                    }
                } else {
                    console.log("[ScrollFixer v1.4] Target node disappeared before initial setup.");
                }
            }, INITIAL_SCROLL_DELAY);

        } else {
             console.log(`[ScrollFixer v1.4] Chat container not found, retrying...`);
             setTimeout(findAndObserve, CHECK_INTERVAL);
        }
    }

    // --- SPA Navigation Handling & Initial Start ---
    // (与 v1.3 类似，注意清理 postCorrectionTimeoutId)
     let currentUrl = location.href;
     const urlObserver = new MutationObserver(() => {
         if (location.href !== currentUrl) {
             console.log(`[ScrollFixer v1.4] URL changed. Re-initializing for ${location.href}`);
             currentUrl = location.href;
             // Cleanup state and timers
             if (observer) { observer.disconnect(); observer = null; }
             if (targetNode && typeof targetNode.removeEventListener === 'function') {
                  targetNode.removeEventListener('scroll', handleScroll);
             }
             if (correctionFrameId) { cancelAnimationFrame(correctionFrameId); correctionFrameId = null; }
             clearTimeout(postCorrectionTimeoutId); // 清理后置检查计时器
             targetNode = null;
             wasNearBottom = false;
             isScrolling = false;
             clearTimeout(scrollDebounceTimeout);
             // styleAdded = false; // GM_addStyle persists
             setTimeout(findAndObserve, 500);
         }
     });
     urlObserver.observe(document.body, { childList: true, subtree: false });

     setTimeout(findAndObserve, 750);

})();