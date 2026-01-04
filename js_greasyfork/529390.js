// ==UserScript==
// @name         B站一键拉黑UP主
// @description  在B站首页、视频页和搜索页添加拉黑按钮，一键拉黑UP主。完整支持BewlyBewly插件首页布局适配。
// @match        https://bilibili.com/
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @version      1.2.0
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @namespace    https://github.com/codertesla/bilibili-1-click-blocker
// @author       codertesla
// @supportURL   https://github.com/codertesla/bilibili-1-click-blocker
// @homepageURL  https://github.com/codertesla/bilibili-1-click-blocker
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529390/B%E7%AB%99%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91UP%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/529390/B%E7%AB%99%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91UP%E4%B8%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 样式定义 ---
    const BILI_BLACKLIST_STYLES = `
        /* 通用按钮样式 */
        .bilibili-blacklist-btn {
          color: #fb7299 !important;
          cursor: pointer !important;
          font-weight: normal !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 1px 5px !important;
          border: 1px solid #fb7299 !important;
          border-radius: 4px !important;
          font-size: 11px !important; /* 统一基础字号 */
          transition: all 0.2s ease !important;
          background-color: white !important;
          box-shadow: 0 0 2px rgba(251, 114, 153, 0.2) !important;
          width: auto !important;
          min-width: unset !important;
          max-width: none !important;
          box-sizing: border-box !important;
          text-align: center !important;
          white-space: nowrap !important;
          gap: 1px !important;
          vertical-align: middle; /* 垂直对齐 */
          line-height: normal; /* 正常行高 */
          margin: 0 5px 0 0 !important; /* 默认右边距，给后面元素空间 */
        }
        .bilibili-blacklist-btn:hover {
          background-color: #fb7299 !important;
          color: white !important;
          box-shadow: 0 0 4px rgba(251, 114, 153, 0.4) !important;
        }
        .bilibili-blacklist-btn:active {
          transform: scale(0.95) !important;
        }
        .bilibili-blacklist-btn::before {
          content: "" !important; margin-right: 0 !important; width: 0 !important;
        }
        /* 按钮动画 */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .bilibili-blacklist-btn { animation: fadeIn 0.3s ease-out !important; }

        /* --- 首页特定调整 --- */
        /* 将按钮添加到 info--bottom 前面时 */
        .bili-video-card__info--bottom > .bilibili-blacklist-btn {
          /* 首页按钮放在前面，给右边距 */
          margin-right: 8px !important;
          margin-left: 0 !important;
        }

         /* --- 视频页特定调整 --- */
        /* 将按钮添加到 upname > a > span.name 后面时 */
        .upname a > .bilibili-blacklist-btn {
           margin-left: 5px !important; /* 视频页按钮放名字后面，给左边距 */
           margin-right: 0 !important;
           font-size: 10px !important; /* 视频页按钮可以小一点 */
           padding: 0px 4px !important;
        }

        /* --- 卡片悬浮按钮特定调整 --- */
        .blacklist-button-container {
          position: absolute !important; top: 5px !important; right: 5px !important; z-index: 100 !important;
          opacity: 0 !important; transition: opacity 0.2s ease !important;
        }
        .bili-video-card:hover .blacklist-button-container,
        .video-card:hover .blacklist-button-container,
        .feed-card:hover .blacklist-button-container {
          opacity: 1 !important;
        }
        .blacklist-button-container .bilibili-blacklist-btn {
          padding: 0px 4px !important; font-size: 10px !important;
          min-width: unset !important; max-width: none !important; white-space: nowrap !important;
          margin: 0 !important; /* 悬浮按钮不需要外边距 */
        }

        /* --- Toast 提示样式 (v1.1.9 优化) --- */
        .bili-blacklist-toast {
            position: fixed !important;
            z-index: 99999 !important;
            top: 30px !important;
            left: 50% !important;
            transform: translateX(-50%) translateY(0) !important;
            background-color: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 10px 20px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            transition: opacity 0.3s ease, transform 0.3s ease !important;
            opacity: 1 !important;
            animation: toastIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }
        @keyframes toastIn {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px) !important;
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0) !important;
            }
        }
        .bili-blacklist-toast-icon {
            font-size: 18px !important;
            line-height: 1 !important;
        }
        .bili-blacklist-toast-content {
            line-height: 1.5 !important;
        }

        /* --- 新增：插件修改布局的适配样式 --- */
        /* 适配 group/desc 布局中的 channel-name 按钮 */
        .group\\/desc .channel-name + .bilibili-blacklist-btn {
          margin-left: 8px !important;
          margin-right: 0 !important;
          font-size: 10px !important;
          padding: 1px 4px !important;
          vertical-align: middle !important;
        }

        /* 适配插件修改布局的悬浮按钮容器 */
        .group\\/desc .blacklist-button-container {
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          z-index: 100 !important;
          opacity: 0 !important;
          transition: opacity 0.2s ease !important;
        }

        .group\\/desc:hover .blacklist-button-container {
          opacity: 1 !important;
        }
    `;

    // 调试功能
    let DEBUG = false;
    try {
        DEBUG = window.localStorage && window.localStorage.getItem("BILIBILI_BLACKLIST_DEBUG") === "true";
    } catch (error) {
        DEBUG = false;
    }
    if (!DEBUG && typeof window !== "undefined" && window.BILIBILI_BLACKLIST_DEBUG === true) {
        DEBUG = true;
    }
    function log(...args) {
        if (DEBUG) {
            console.log("[拉黑脚本]", ...args);
        }
    }

    // 等待jQuery加载
    function waitForJQuery(callback) {
        if (typeof jQuery !== 'undefined') {
            log('jQuery已加载');
            callback(jQuery);
        } else {
            log('等待jQuery加载...');
            setTimeout(function () { waitForJQuery(callback); }, 50);
        }
    }

    // --- Debounce 函数 ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    // ---

    // 主函数
    waitForJQuery(function ($) {
        log('脚本初始化开始 v1.1.9-toast-fix');

        // --- 样式注入 ---
        // 1. 注入到主文档
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(BILI_BLACKLIST_STYLES);
        }

        // 2. 注入到 Shadow DOM
        const injectedShadowHosts = new WeakSet();
        const shadowRootRegistry = new Set();
        const shadowInjectionQueue = new Set();
        let shadowInjectionScheduled = false;
        let shadowInjectionTaskId = null;

        function scheduleShadowInjectionProcessor() {
            if (shadowInjectionScheduled || shadowInjectionQueue.size === 0) {
                return;
            }
            shadowInjectionScheduled = true;
            const processor = window.requestIdleCallback || window.requestAnimationFrame;
            if (processor) {
                shadowInjectionTaskId = processor(processShadowInjectionQueue);
            } else {
                shadowInjectionTaskId = window.setTimeout(() => processShadowInjectionQueue(), 16);
            }
        }

        function processShadowInjectionQueue(deadline) {
            shadowInjectionScheduled = false;
            shadowInjectionTaskId = null;

            const pending = Array.from(shadowInjectionQueue);
            shadowInjectionQueue.clear();

            const canYield = typeof deadline === "object" && typeof deadline.timeRemaining === "function";

            for (let i = 0; i < pending.length; i++) {
                processShadowCandidates(pending[i]);
                if (canYield && deadline.timeRemaining() <= 0) {
                    for (let j = i + 1; j < pending.length; j++) {
                        shadowInjectionQueue.add(pending[j]);
                    }
                    scheduleShadowInjectionProcessor();
                    break;
                }
            }
        }

        function processShadowInjectionQueueImmediately() {
            if (shadowInjectionScheduled) {
                if (typeof window.cancelIdleCallback === "function" && shadowInjectionTaskId !== null) {
                    window.cancelIdleCallback(shadowInjectionTaskId);
                } else if (shadowInjectionTaskId !== null) {
                    window.clearTimeout(shadowInjectionTaskId);
                }
                shadowInjectionScheduled = false;
                shadowInjectionTaskId = null;
            }
            if (shadowInjectionQueue.size === 0) {
                return;
            }
            const pending = Array.from(shadowInjectionQueue);
            shadowInjectionQueue.clear();
            pending.forEach(node => processShadowCandidates(node));
        }

        function ensureShadowStyle(host) {
            if (!host || !host.shadowRoot) {
                return;
            }

            if (!host.shadowRoot.querySelector("style[data-bilibili-blacklist-style=\"true\"]")) {
                const style = document.createElement("style");
                style.setAttribute("data-bilibili-blacklist-style", "true");
                style.textContent = BILI_BLACKLIST_STYLES;
                host.shadowRoot.appendChild(style);
                log("[Shadow DOM] Styles injected into:", host);
            }

            injectedShadowHosts.add(host);
            shadowRootRegistry.add(host.shadowRoot);
        }

        function processShadowCandidates(root) {
            if (!root) {
                return;
            }

            const stack = [];

            if (root === document || root === document.body) {
                if (document.documentElement) {
                    stack.push(document.documentElement);
                }
            } else if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                for (let i = 0; i < root.childNodes.length; i++) {
                    const fragmentChild = root.childNodes[i];
                    if (fragmentChild.nodeType === Node.ELEMENT_NODE) {
                        stack.push(fragmentChild);
                    }
                }
            } else if (root.nodeType === Node.ELEMENT_NODE) {
                stack.push(root);
            }

            while (stack.length > 0) {
                const current = stack.pop();
                if (!current || current.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }

                if (current.shadowRoot && !injectedShadowHosts.has(current)) {
                    ensureShadowStyle(current);
                } else if (current.shadowRoot) {
                    shadowRootRegistry.add(current.shadowRoot);
                }

                const children = current.children;
                for (let i = 0; i < children.length; i++) {
                    stack.push(children[i]);
                }
            }
        }

        function queueShadowInjection(root) {
            if (!root) {
                return;
            }

            if (Array.isArray(root) ||
                (typeof NodeList !== "undefined" && NodeList.prototype.isPrototypeOf(root)) ||
                (typeof HTMLCollection !== "undefined" && HTMLCollection.prototype.isPrototypeOf(root))) {
                Array.from(root).forEach(node => queueShadowInjection(node));
                return;
            }

            if (root === document) {
                root = document.documentElement;
            }

            if (!root) {
                return;
            }

            shadowInjectionQueue.add(root);
            scheduleShadowInjectionProcessor();
        }

        function injectStylesIntoShadowDOMs(css, roots) {
            if (css !== BILI_BLACKLIST_STYLES) {
                return;
            }

            if (typeof roots === "undefined") {
                queueShadowInjection(document.documentElement);
                if (shadowRootRegistry.size === 0) {
                    processShadowInjectionQueueImmediately();
                }
                return;
            }

            if (Array.isArray(roots) ||
                (typeof NodeList !== "undefined" && NodeList.prototype.isPrototypeOf(roots)) ||
                (typeof HTMLCollection !== "undefined" && HTMLCollection.prototype.isPrototypeOf(roots))) {
                Array.from(roots).forEach(node => queueShadowInjection(node));
            } else {
                queueShadowInjection(roots);
            }
        }
        // ---

        // Cookie获取函数 (保持不变)
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return '';
        }

        // 检查是否登录 (保持不变)
        const csrf = getCookie('bili_jct');
        if (!csrf) {
            log('警告: 未获取到bili_jct Cookie，可能未登录');
            showToast('B站拉黑脚本提示：请先登录B站账号！', 5000);
        } else {
            log('成功获取CSRF token');
        }

        // 菜单控制 (保持不变)
        const menuctl = ({ initValue = 0 }) => {
            let total = initValue;
            let menuId = null;
            const currentName = () => "去管理黑名单 --（ " + (total < 1 ? "请留意黑名单数量 ）" : `总共：${total} ）`);
            const register = () => {
                try {
                    menuId = GM_registerMenuCommand(currentName(), () => {
                        window.open('https://account.bilibili.com/account/blacklist', '_blank');
                    });
                    log('注册菜单成功: ', currentName());
                } catch (e) { log('注册菜单失败: ', e); }
            };
            register();
            const ctl = {
                get total() { return total; },
                set total(newValue) {
                    if (newValue == total) return;
                    if (menuId !== null) { try { GM_unregisterMenuCommand(menuId); log('解除注册旧菜单'); } catch (e) { log('解除注册旧菜单失败: ', e); } }
                    total = newValue;
                    register();
                },
            };
            return ctl;
        };
        const menu = menuctl({ initValue: 0 });

        // 显示自定义提示框 (保持不变)
        function showToast(message, duration = 3000) {
            $('.bili-blacklist-toast').remove();
            const toast = $(`<div class="bili-blacklist-toast"><span class="bili-blacklist-toast-icon">✓</span><div class="bili-blacklist-toast-content">${message}</div></div>`);
            $('body').append(toast);
            setTimeout(() => {
                toast.css({
                    'opacity': '0',
                    'transform': 'translateX(-50%) translateY(-20px)'
                });
                setTimeout(() => toast.remove(), 300); // 等待动画完成再移除
            }, duration);
        }


        // 拉黑功能 (保持不变)
        // === 更新后的 window.tools_toblack 函数 ===
        window.tools_toblack = (uid, upName) => {
            log('执行拉黑操作，UID:', uid, '名称:', upName);
            const isVideoPage = window.location.href.includes('/video/');

            // --- 辅助函数：更新按钮状态为“已拉黑” ---
            const setButtonToBlocked = (targetUid) => {
                log(`准备将 UID ${targetUid} 的按钮状态更新为 '已拉黑'`);
                const selector = `.bilibili-blacklist-btn[data-uid="${targetUid}"]:not(:disabled)`;

                // 使用 findInShadowDOM 查找按钮，以兼容所有情况
                findInShadowDOM(selector).each(function () {
                    const $button = $(this);
                    if ($button.is(':visible')) {
                        log('找到按钮并更新为已拉黑:', $button[0]);
                        $button.text('已拉黑').css({ 'opacity': '0.6', 'cursor': 'not-allowed', 'background-color': '#eee', 'border-color': '#ddd', 'color': '#aaa' }).prop('disabled', true).off('click');
                    }
                });
            };
            // --- 辅助函数结束 ---


            // 执行 API 请求
            fetch("https://api.bilibili.com/x/relation/modify", {
                method: "POST", credentials: 'include', headers: { "Content-Type": "application/x-www-form-urlencoded", },
                body: new URLSearchParams({ 'fid': uid, 'act': 5, 're_src': 11, 'gaia_source': 'web_main', 'csrf': getCookie('bili_jct'), })
            }).then(res => {
                if (!res.ok) { throw new Error(`HTTP error! Status: ${res.status}`); } return res.json();
            }).then(data => {
                log('拉黑API响应:', data);
                if (data.code === 0) { // 拉黑成功
                    log('拉黑成功:', uid);
                    showToast(`已成功将 "${upName || 'UP主'}" 加入黑名单`);
                    setButtonToBlocked(uid); // 调用辅助函数更新按钮状态
                    if (!isVideoPage) { // 首页额外操作：移除卡片
                        log('执行首页移除操作...');
                        // 同时在主文档和 Shadow DOM 中查找并移除卡片
                        const cardSelectors = [
                            `.bili-video-card[data-up-id="${uid}"]`,
                            `.feed-card[data-up-id="${uid}"]`,
                            `.video-card[data-up-id="${uid}"]`,
                            `.group\\/desc[data-up-id="${uid}"]`,
                            `div.uid_${uid}`
                        ].join(', ');
                        findInShadowDOM(cardSelectors).fadeOut(300, function () { $(this).remove(); });
                    }
                } else { // 拉黑失败 (API返回错误码)
                    log('拉黑失败:', data.message || `错误码 ${data.code}`);

                    // === 新增：检查是否是 "已拉黑" 错误码 ===
                    if (data.code === 22120) {
                        log('检测到错误码 22120 (用户已被拉黑)');
                        showToast('该用户已被拉黑'); // 显示更具体的提示
                        setButtonToBlocked(uid); // 同样调用辅助函数更新按钮状态
                    } else {
                        // 对于其他所有错误，只显示通用失败提示，不改变按钮状态
                        showToast(`拉黑失败: ${data.message || `错误码 ${data.code}`}`);
                    }
                    // === 检查结束 ===
                }
            }).catch(err => { // 网络请求错误等
                log('拉黑请求错误:', err);
                showToast('拉黑请求失败，请检查网络或登录状态');
                // 网络错误不改变按钮状态
            });
            updateBlacklistCount(); // 更新黑名单计数
        };


        // 更新黑名单计数 (保持不变)
        function updateBlacklistCount() {
            fetch("https://api.bilibili.com/x/relation/blacks?re_version=0&pn=1&ps=20&jsonp=jsonp&web_location=333.33", {
                method: "GET", credentials: 'include',
            }).then(res => {
                if (!res.ok) { throw new Error(`HTTP error! Status: ${res.status}`); } return res.json();
            }).then(data => {
                log('黑名单API响应:', data); if (data.code === 0) { menu.total = data.data.total; log('更新黑名单计数:', data.data.total); }
                else { log('获取黑名单失败:', data.message || '未知错误'); }
            }).catch(err => { log('获取黑名单请求错误:', err); });
        }

        // --- 新增：Shadow DOM 搜索函数 ---
        function findInShadowDOM(selector) {
            let results = $(selector);

            if (shadowRootRegistry.size === 0 && shadowInjectionQueue.size === 0) {
                queueShadowInjection(document.documentElement);
                processShadowInjectionQueueImmediately();
            } else if (shadowRootRegistry.size === 0) {
                processShadowInjectionQueueImmediately();
            }

            shadowRootRegistry.forEach(shadowRoot => {
                if (!shadowRoot) {
                    return;
                }
                const matches = shadowRoot.querySelectorAll(selector);
                if (matches.length > 0) {
                    results = results.add(matches);
                }
            });

            return results;
        }

        // === 处理首页 (已修改，新增插件布局适配) ===
        function processHomePage() {
            log('处理首页');

            // 全局调试：检查页面基本状态
            log('=== 页面基本状态 ===');
            log(`jQuery版本: ${$.fn.jquery}, 页面URL: ${window.location.href}`);
            log(`页面title: ${document.title}`);
            log(`DOM中总div数量: ${$('div').length}`);
            log(`包含data-v-属性的元素数量: ${$('[data-v-89bbbbc2]').length}`);
            log(`包含class="video-card"的元素数量: ${$('.video-card').length}`);
            log(`包含class包含"video"的元素数量: ${$('[class*="video"]').length}`);

            const possibleContainers = ['.bili-video-card', '.video-card', '.bili-video-card__wrap', '.feed-card', '.group\\/desc'];
            let foundCards = false;

            // 调试：检查页面中存在哪些可能的容器
            log('=== 首页调试信息 ===');
            possibleContainers.forEach(selector => {
                const allElements = $(selector);
                const unprocessedElements = $(`${selector}:not([data-toblack-processed="true"])`);
                log(`容器 ${selector}: 总数=${allElements.length}, 未处理=${unprocessedElements.length}`);

                // 如果是.video-card，显示更多调试信息
                if (selector === '.video-card' && allElements.length > 0) {
                    log('  .video-card示例:');
                    allElements.slice(0, 2).each((i, el) => {
                        const $el = $(el);
                        log(`    示例${i + 1}: class="${$el.attr('class')}", 内部是否有channel-name: ${$el.find('.channel-name').length}`);
                        const channelLinks = $el.find('.channel-name');
                        if (channelLinks.length > 0) {
                            channelLinks.each((j, link) => {
                                log(`      channel-name ${j + 1}: href="${$(link).attr('href')}", text="${$(link).text().trim()}"`);
                            });
                        }
                    });
                }
            });

            // 额外调试：检查是否有其他可能的BewlyBewly容器
            const bewlyContainerSelectors = [
                '.video-card', '.video-card.group', '[class*="video-card"]'
            ];
            log('=== BewlyBewly容器检查 ===');
            bewlyContainerSelectors.forEach(selector => {
                const elements = $(selector);
                if (elements.length > 0) {
                    log(`可能的BewlyBewly容器 ${selector}: ${elements.length}个`);
                    // 只显示前3个元素的类名作为参考
                    elements.slice(0, 3).each((i, el) => {
                        log(`  示例${i + 1}: class="${$(el).attr('class')}" tag="${el.tagName}"`);
                    });
                }
            });

            possibleContainers.forEach(containerSelector => {
                const cards = findInShadowDOM(`${containerSelector}:not([data-toblack-processed="true"])`);

                if (cards.length > 0) {
                    // log(`找到 ${cards.length} 个未处理的视频卡片 (${containerSelector})`); // 减少日志
                    foundCards = true;

                    cards.each((index, card) => {
                        const $card = $(card);
                        // 标记立即处理，避免重复
                        $card.attr('data-toblack-processed', 'true');

                        let ownerLinkElement = null;
                        let upName = '';
                        let ownerUrl = '';
                        let uid = '';

                        // 调试：记录正在处理的卡片信息
                        log(`正在处理卡片 (${containerSelector}):`, $card[0]);

                        // 优先使用新结构选择器
                        ownerLinkElement = $card.find('a.bili-video-card__info--owner');
                        if (ownerLinkElement.length > 0) {
                            ownerUrl = ownerLinkElement.attr('href');
                            const authorSpan = ownerLinkElement.find('span.bili-video-card__info--author');
                            if (authorSpan.length > 0) {
                                upName = authorSpan.attr('title') || authorSpan.text().trim(); // 优先用 title
                            } else {
                                // 备选：直接取链接文本，尝试去除日期
                                upName = ownerLinkElement.text().trim().split('·')[0].trim();
                            }
                            log(`首页: 结构匹配成功 (a.bili-video-card__info--owner)`);
                        } else {
                            // 新增：检查插件修改布局中的 channel-name 结构
                            const channelNameElement = $card.find('a.channel-name');
                            if (channelNameElement.length > 0) {
                                ownerLinkElement = channelNameElement;
                                ownerUrl = channelNameElement.attr('href');
                                // 在 channel-name 中提取名称，可能在嵌套的 span 中
                                const nameSpans = channelNameElement.find('span span');
                                if (nameSpans.length > 0) {
                                    upName = nameSpans.last().text().trim();
                                } else {
                                    upName = channelNameElement.text().trim();
                                }
                                log(`首页: 插件布局结构匹配成功 (a.channel-name)`);
                            } else {
                                // Fallback 到旧的选择器逻辑
                                const possibleOwnerSelectors = ['.up-name', '.author-text', '.up-name__text'];
                                for (const selector of possibleOwnerSelectors) {
                                    const element = $card.find(selector);
                                    if (element.length > 0) {
                                        ownerLinkElement = element; // 记录找到的元素
                                        ownerUrl = element.attr('href');
                                        upName = element.text().trim();
                                        log(`首页: 备选结构匹配成功 (${selector})`);
                                        break;
                                    }
                                }
                            }
                        }

                        if (!ownerUrl || !ownerLinkElement) {
                            log('❌ 未能找到卡片上的UP主链接，调试信息：');
                            log('- ownerUrl:', ownerUrl);
                            log('- ownerLinkElement:', ownerLinkElement);
                            log('- 卡片HTML结构:', $card[0].outerHTML.substring(0, 500) + '...');

                            // 额外调试：尝试找到卡片中所有的链接
                            const allLinks = $card.find('a[href*="space"]');
                            log('- 卡片中所有包含"space"的链接数量:', allLinks.length);
                            allLinks.each((i, link) => {
                                log(`  链接${i + 1}: href="${$(link).attr('href')}", text="${$(link).text().trim()}", class="${$(link).attr('class')}"`);
                            });

                            return; // Skip card
                        }

                        // 提取 UID (新增对 //space.bilibili.com/ 格式的支持)
                        if (ownerUrl.includes('/space.bilibili.com/')) {
                            uid = ownerUrl.split('/space.bilibili.com/')[1].split('?')[0].split('/')[0];
                        } else if (ownerUrl.includes('//space.bilibili.com/')) {
                            // 处理插件修改布局中的 //space.bilibili.com/ 格式
                            uid = ownerUrl.split('//space.bilibili.com/')[1].split('?')[0].split('/')[0];
                        } else if (ownerUrl.includes('/space/')) {
                            uid = ownerUrl.split('/space/')[1].split('?')[0].split('/')[0];
                        } else {
                            const match = ownerUrl.match(/\/(\d+)(\/|\?|$)/);
                            if (match && match[1]) { uid = match[1]; }
                        }

                        if (!uid || !/^\d+$/.test(uid)) {
                            // log('无法从URL提取有效的首页UID:', ownerUrl);
                            return; // Skip card
                        }

                        // 给卡片添加 data-up-id 属性，方便拉黑后移除
                        $card.attr('data-up-id', uid);

                        if (!upName) { upName = `UID: ${uid}`; } // Default name if extraction failed
                        log('提取首页UID:', uid, '名称:', upName);

                        // --- 按钮放置 ---
                        let buttonAdded = false;



                        // 新增：优先尝试插件布局的 channel-name 后面
                        if (!buttonAdded && ownerLinkElement && ownerLinkElement.hasClass('channel-name')) {
                            if (ownerLinkElement.next('.bilibili-blacklist-btn').length === 0) {
                                const blackButton = $(`<a class="bilibili-blacklist-btn" data-uid="${uid}">拉黑</a>`);
                                blackButton.on('click', function (e) { e.preventDefault(); e.stopPropagation(); window.tools_toblack(uid, upName); });
                                ownerLinkElement.after(blackButton);
                                buttonAdded = true;
                                log('按钮添加到 channel-name 后面');
                            } else { buttonAdded = true; /* Already exists */ }
                        }

                        // 原有逻辑：尝试添加到 info--bottom 的前面
                        if (!buttonAdded) {
                            const bottomInfoDiv = $card.find('.bili-video-card__info--bottom');
                            if (bottomInfoDiv.length > 0) {
                                if (bottomInfoDiv.find('.bilibili-blacklist-btn').length === 0) { // 避免重复添加
                                    const blackButton = $(`<a class="bilibili-blacklist-btn" data-uid="${uid}">拉黑</a>`);
                                    blackButton.on('click', function (e) { e.preventDefault(); e.stopPropagation(); window.tools_toblack(uid, upName); });
                                    bottomInfoDiv.prepend(blackButton);
                                    buttonAdded = true;
                                    log('按钮添加到 info--bottom 前面');
                                } else { buttonAdded = true; /* Already exists */ }
                            }
                        }

                        // 备选：添加到卡片右上角悬浮 (如果上面没成功)
                        if (!buttonAdded && $card.find('.blacklist-button-container').length === 0) {
                            if (!$card.css('position') || $card.css('position') === 'static') {
                                $card.css('position', 'relative'); //确保卡片有定位上下文
                            }
                            const container = $('<div class="blacklist-button-container"></div>');
                            const blackButton = $(`<a class="bilibili-blacklist-btn" data-uid="${uid}">拉黑</a>`);
                            blackButton.on('click', function (e) { e.preventDefault(); e.stopPropagation(); window.tools_toblack(uid, upName); });
                            container.append(blackButton);
                            $card.append(container);
                            buttonAdded = true;
                            log('按钮添加到悬浮容器');
                        }

                        // 旧的 UID class 逻辑，保留
                        $card.addClass('uid_' + uid);
                    });
                }
            });
            // if (!foundCards) { log('本次未找到任何需要处理的视频卡片'); } // 减少日志
        }


        // === 处理视频页面 (保持不变, 使用 v1.0.7 的逻辑) ===
        function processVideoPage() {
            log('处理视频页面');

            function findAndProcessUpInfo() {
                // Target the container div first, ensure it's not already processed
                const upnameDivs = $('div.upname:not([data-toblack-processed="true"])');

                if (upnameDivs.length > 0) {
                    log(`找到 ${upnameDivs.length} 个未处理的视频页UP主容器 (div.upname)`);

                    upnameDivs.each(function () {
                        const upnameDiv = $(this);
                        // Find the main link (<a>) inside the div, which contains the space URL
                        const linkElement = upnameDiv.find('a[href*="/space.bilibili.com/"], a[href*="/space/"]');
                        // Find the name span (span.name) inside the link
                        const nameElement = linkElement.find('span.name');

                        if (linkElement.length > 0 && nameElement.length > 0) {
                            if (linkElement.find('.bilibili-blacklist-btn').length > 0) {
                                upnameDiv.attr('data-toblack-processed', 'true');
                                // log('按钮已存在于 upname link 中，跳过'); //减少日志
                                return;
                            }
                            const upUrl = linkElement.attr('href');
                            const upName = nameElement.text().trim();
                            if (!upUrl || !upName) { upnameDiv.attr('data-toblack-processed', 'true'); return; }
                            let uid = '';
                            if (upUrl.includes('/space.bilibili.com/')) { uid = upUrl.split('/space.bilibili.com/')[1].split('?')[0].split('/')[0]; }
                            else if (upUrl.includes('/space/')) { uid = upUrl.split('/space/')[1].split('?')[0].split('/')[0]; }
                            else { const match = upUrl.match(/\/(\d+)(\/|\?|$)/); if (match && match[1]) { uid = match[1]; } }
                            if (!uid || !/^\d+$/.test(uid)) { upnameDiv.attr('data-toblack-processed', 'true'); return; }
                            // ... (code to extract uid and upName) ...

                            log('提取视频页UID:', uid, '名称:', upName);
                            const blackButton = $(`<a class="bilibili-blacklist-btn" data-uid="${uid}">拉黑</a>`);

                            // === MODIFIED CLICK HANDLER for Video Page ===
                            blackButton.on('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('[拉黑脚本] --- 视频页按钮点击事件触发 ---'); // Log: Handler Fired

                                const buttonElement = $(this);
                                // Re-read UID from the button's data attribute at the time of click
                                const clickedUid = buttonElement.data('uid');
                                // Use the name captured when the button was created (closure)
                                // Alternatively, could try finding the name span again relative to buttonElement if needed
                                const clickedName = upName;

                                console.log('[拉黑脚本] 点击时获取的 UID:', clickedUid, typeof clickedUid);
                                console.log('[拉黑脚本] 点击时获取的 Name:', clickedName);

                                // Validate the UID before calling the API function
                                if (!clickedUid || typeof clickedUid === 'undefined' || String(clickedUid).trim() === '' || !/^\d+$/.test(String(clickedUid))) {
                                    console.error('[拉黑脚本] 错误：点击时 UID 无效!', clickedUid);
                                    showToast('拉黑失败：无法获取有效的 UP 主 ID');
                                    // Optionally add more specific error messages based on the condition
                                    // if (!clickedUid) { showToast('拉黑失败：UID 未定义'); }
                                    // else if (!/^\d+$/.test(String(clickedUid))) { showToast('拉黑失败：UID 非数字'); }
                                    return; // Stop if UID is invalid
                                }

                                // If UID is valid, proceed to call the block function
                                console.log('[拉黑脚本] UID 有效，准备调用 tools_toblack...');
                                try {
                                    window.tools_toblack(String(clickedUid), clickedName);
                                } catch (apiError) {
                                    console.error('[拉黑脚本] 调用 tools_toblack 时出错:', apiError);
                                    showToast('拉黑操作内部出错，请检查控制台');
                                }
                            });
                            // === END MODIFIED CLICK HANDLER ===

                            nameElement.after(blackButton); // Insert button after the name span
                            upnameDiv.attr('data-toblack-processed', 'true');
                            log('已添加拉黑按钮到视频页UP主:', upName);
                        } else { upnameDiv.attr('data-toblack-processed', 'true'); }
                    });
                    return true; // Found and processed elements
                }
                return false; // Did not find any new div.upname to process this time
            }

            // Retry logic (保持不变)
            if (!findAndProcessUpInfo()) {
                // log('首次未找到UP主信息 (div.upname)，将在稍后重试'); // Reduce log noise
                let retryCount = 0; const maxRetries = 5; const retryInterval = 800;
                if (window.videoPageRetryTimer) { clearInterval(window.videoPageRetryTimer); }
                window.videoPageRetryTimer = setInterval(() => {
                    retryCount++;
                    if (findAndProcessUpInfo() || retryCount >= maxRetries) {
                        clearInterval(window.videoPageRetryTimer); window.videoPageRetryTimer = null;
                        if (retryCount >= maxRetries && !$('div.upname .bilibili-blacklist-btn').length) { log('在多次尝试后仍未找到或添加按钮到 UP主信息 (div.upname)'); }
                        else if ($('div.upname .bilibili-blacklist-btn').length > 0) { log(`通过重试找到并处理了 UP 主信息`); }
                    }
                }, retryInterval);
            }
        }


        // 统一处理入口 (保持不变)
        function processPage() {
            if (window.processingPage) { return; } // 简化跳过逻辑
            window.processingPage = true;
            try {
                const isVideoPage = window.location.href.includes('/video/');
                if (isVideoPage) { processVideoPage(); } else { processHomePage(); }
            } catch (error) {
                log("处理页面时出错:", error);
            } finally {
                // 使用 setTimeout 确保 processingPage 标志在稍后重置
                setTimeout(() => { window.processingPage = false; }, 300); // 减少延迟
            }
        }


        // === 设置DOM观察器 (已修改首页目标) ===
        function setupObserver() {
            if (window.blacklistObserverSet) { log('观察器已存在，跳过设置'); return; }
            log('设置DOM观察器');

            // --- Debounce 处理函数 ---
            const debouncedProcessPage = debounce(processPage, 300);
            // ---

            const observer = new MutationObserver(function (mutations) {
                const shadowCandidates = [];

                mutations.forEach(mutation => {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                                shadowCandidates.push(node);
                            }
                        });
                    } else if (mutation.type === "attributes" && mutation.target && mutation.target.shadowRoot) {
                        shadowCandidates.push(mutation.target);
                    }
                });

                if (shadowCandidates.length > 0) {
                    injectStylesIntoShadowDOMs(BILI_BLACKLIST_STYLES, shadowCandidates);
                }

                debouncedProcessPage();
            });

            const isVideoPage = window.location.href.includes('/video/');
            const isSearchPage = window.location.href.includes('search.bilibili.com');
            let targetNode = null;

            if (isVideoPage) {
                // 视频页目标 (保持 v1.0.7 的选择)
                targetNode = document.querySelector('#viewbox_report') ||
                    document.querySelector('.video-info-detail') ||
                    document.querySelector('#app .left-container');
                log('尝试为视频页选择观察节点:', targetNode ? (targetNode.id || targetNode.className) : '未找到特定节点');
            } else if (isSearchPage) {
                // 搜索页面目标: 添加搜索结果特定的选择器
                targetNode = document.querySelector('.video-list') ||        // 搜索结果视频列表
                    document.querySelector('.search-content') ||    // 搜索内容区域
                    document.querySelector('.search-page') ||       // 搜索页面容器
                    document.querySelector('#app .bili-grid') ||    // 通用网格布局
                    document.querySelector('#app .bili-layout') ||  // 更通用的布局容器
                    document.querySelector('#app');                 // 万不得已才用 #app
                log('尝试为搜索页面选择观察节点:', targetNode ? (targetNode.id || targetNode.className) : '未找到特定节点');
            } else {
                // 首页目标: 优先尝试包含BewlyBewly video-card的容器
                targetNode = document.querySelector('[data-v-89bbbbc2]') ||  // BewlyBewly的数据属性容器
                    document.querySelector('#app .feed-list') ||             // 推荐流
                    document.querySelector('#i_cecream') ||                  // 首页外层容器 ID 之一
                    document.querySelector('.bili-grid') ||                  // 通用网格布局
                    document.querySelector('#app .bili-layout') ||           // 更通用的布局容器
                    document.querySelector('#app');                          // 万不得已才用 #app
                log('尝试为首页选择观察节点:', targetNode ? (targetNode.id || targetNode.className || targetNode.tagName) : '未找到特定节点');
            }

            // 最终备选：如果找不到任何特定节点，就观察body
            if (!targetNode) {
                targetNode = document.body;
                log('警告：未找到特定观察节点，将观察整个 body');
            }

            if (targetNode) {
                log('最终选择观察节点:', targetNode);
                observer.observe(targetNode, { childList: true, subtree: true });
                window.blacklistObserverSet = true;
                log('DOM观察器已启动');
            } else {
                log('警告：未能找到合适的DOM节点进行观察，MutationObserver 未启动。按钮可能只在初始加载时添加。');
            }

            // 初始加载时检查 (总会执行一次)
            injectStylesIntoShadowDOMs(BILI_BLACKLIST_STYLES); // 首次注入
            setTimeout(processPage, 1500);

            // BewlyBewly可能需要更长加载时间，增加延迟重试
            setTimeout(() => {
                log('=== 延迟重试检查 (为BewlyBewly) ===');
                processPage();
            }, 3000);

            setTimeout(() => {
                log('=== 最后一次重试检查 ===');
                processPage();
            }, 5000);

            // 定期检查作为后备 (可选，可以注释掉)
            // if (window.blacklistInterval) clearInterval(window.blacklistInterval);
            // window.blacklistInterval = setInterval(processPage, 10000);
        }


        // 暴露给全局作用域 (保持不变)
        window.blacklistScript = { processPage, processHomePage, processVideoPage };

        // 启动逻辑 (保持不变)
        $(document).ready(function () {
            log('页面就绪，初始化脚本');
            setupObserver();
            updateBlacklistCount();
        });

        // 后备启动逻辑 (保持不变)
        setTimeout(function () {
            if (!window.blacklistObserverSet && !$('body').data('blacklist-init-fallback')) {
                log('延时后备初始化');
                $('body').data('blacklist-init-fallback', true);
                setupObserver();
                updateBlacklistCount();
                processPage();
            }
        }, 3000);

        log('脚本初始化完成');
    });
})();
