// ==UserScript==
// @name         强制后台新建标签页打开所有链接
// @namespace    https://greasyfork.org/
// @version      1.4
// @license      MIT
// @author       pugfly
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @description 所有链接强制后台新建标签页打开，兼容Firefox和Chrome
// @downloadURL https://update.greasyfork.org/scripts/525729/%E5%BC%BA%E5%88%B6%E5%90%8E%E5%8F%B0%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/525729/%E5%BC%BA%E5%88%B6%E5%90%8E%E5%8F%B0%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 全局配置 =====
    const CONFIG = {
        XUEQIU: {
            WHITELIST: [
                /\/u\/[\w-]+$/,          // 用户主页
                /\/S\/[A-Z0-9_.]+$/,     // 股票代码
                /\/\d+\/status\/\d+/     // 帖子详情
            ],
            BLACKLIST_KEYWORDS: /(展开|收起|评论|回复|讨论|更多|分享|收藏|点赞|举报|关闭)/,
            FIX_CSS: `
                [class*='modal-close'], [class*='ad-close'] {
                    z-index: 9999 !important;
                    pointer-events: auto !important;
                }
            `
        }
    };

    // ===== 雪球网专用模块 =====
    if (window.location.hostname.includes('xueqiu.com')) {
        // 1. 样式修复
        GM_addStyle(CONFIG.XUEQIU.FIX_CSS);

        // 2. 智能链接处理
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link || !link.href) return;

            // 排除功能链接
            const isFunctional = 
                CONFIG.XUEQIU.BLACKLIST_KEYWORDS.test(link.textContent) ||
                link.href.startsWith('javascript:') ||
                link.hasAttribute('onclick');

            // 匹配白名单链接
            const shouldOpen = CONFIG.XUEQIU.WHITELIST.some(re => re.test(link.href));

            if (!isFunctional && shouldOpen) {
                e.preventDefault();
                e.stopImmediatePropagation();
                GM_openInTab(link.href, { active: false });
            }
        }, true);

        // 3. 拦截SPA路由
        const nativePushState = history.pushState;
        history.pushState = function(state, title, url) {
            if (url && CONFIG.XUEQIU.WHITELIST.some(re => re.test(url))) {
                GM_openInTab(url, { active: false });
                return;
            }
            nativePushState.apply(this, arguments);
        };

        return; // 阻断后续通用逻辑
    }

    // ===== 通用网站模块 =====
    let isProcessing = false;
    
    // 1. 链接点击处理
    document.addEventListener('click', function(e) {
        if (isProcessing) return;
        isProcessing = true;

        let target = e.target;
        while (target && target.tagName !== 'A') target = target.parentElement;
        if (!target?.href) return;

        // 排除功能链接
        if (target.href.startsWith('javascript:') || target.hasAttribute('onclick')) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        GM_openInTab(target.href, { active: false });

        setTimeout(() => isProcessing = false, 50);
    }, true);

    // 2. 表单提交处理
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName !== 'FORM') return;

        e.preventDefault();
        const url = new URL(form.action || window.location.href);
        new FormData(form).forEach((v,k) => url.searchParams.append(k,v));
        GM_openInTab(url.href, { active: false });
    }, true);

    // 3. 回车键处理
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const input = e.target;
            const form = input.closest('form');
            if (form) return; // 由表单提交处理

            const url = new URL(window.location.href);
            url.searchParams.set(input.name || 'q', input.value);
            GM_openInTab(url.href, { active: false });
            e.preventDefault();
        }
    }, true);

    // 4. 动态内容监控
    new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    node.querySelectorAll('a').forEach(link => {
                        link.setAttribute('target', '_blank');
                    });
                }
            });
        });
    }).observe(document, { subtree: true, childList: true });
})();