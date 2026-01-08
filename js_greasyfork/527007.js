// ==UserScript==
// @name         禁止新标签页打开链接
// @name:en      No New Tab for Some Websites
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  让哔哩哔哩、微博、知乎、小红书、Appstorrent、Skymods等网站所有链接在当前标签页打开
// @description:en Force all Bilibili, Weibo, Zhihu, and RedNote links to open in the current tab
// @author       ChingyuanCheng
// @license      MIT
// @match        *://*.bilibili.com/*
// @match        *://*.weibo.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.xiaohongshu.com/*
// @match        *://*.smods.ru/*
// @match        *://*.modsbase.com/*
// @match        *://*.appstorrent.ru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527007/%E7%A6%81%E6%AD%A2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/527007/%E7%A6%81%E6%AD%A2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const IS_BILIBILI = location.hostname.endsWith('bilibili.com');

    // —— 辅助函数 —— //
    function isSupportedDomain(url) {
        try {
            if (!url) return false;
            const u = new URL(url, location.href);
            return (
                u.hostname.endsWith('.bilibili.com') ||
                u.hostname === 'bilibili.com' ||
                u.hostname.endsWith('.weibo.com') ||
                u.hostname === 'weibo.com' ||
                u.hostname.endsWith('.zhihu.com') ||
                u.hostname === 'zhihu.com' ||
                u.hostname.endsWith('.xiaohongshu.com') ||
                u.hostname === 'xiaohongshu.com' ||
                u.hostname.endsWith('.modsbase.com') ||
                u.hostname === 'modsbase.com' ||
                u.hostname.endsWith('.appstorrent.ru') ||
                u.hostname === 'appstorrent.ru' ||
                u.hostname.endsWith('.smods.ru') ||
                u.hostname === 'smods.ru'
            );
        } catch {
            return false;
        }
    }

    function isMatchPage() {
        return location.pathname.startsWith('/match/');
    }

    function isZhihuQuestionOrSearchLink(url) {
        try {
            const u = new URL(url, location.href);
            return u.pathname.startsWith('/question/') || u.pathname.startsWith('/search');
        } catch {
            return false;
        }
    }

    // 尝试从事件路径中找最近的 <a> 或具有 href-like 的元素
    function findAnchorInPath(path) {
        for (const el of path) {
            if (!el || el === window || el === document) continue;
            if (el.tagName === 'A' && el.href) return el;
            // 有些 JS link 用 data-href / href 属性放在非 <a> 元素
            if (el.getAttribute && (el.getAttribute('data-href') || el.getAttribute('href'))) {
                return el;
            }
        }
        return null;
    }

    // 将“可能的链接”规范化为 URL 字符串（或 null）
    function extractHrefFromElement(el) {
        if (!el) return null;
        if (el.tagName === 'A' && el.href) return el.href;
        const dh = el.getAttribute && (el.getAttribute('data-href') || el.getAttribute('href') || el.getAttribute('data-url') || el.getAttribute('data-link'));
        if (dh) {
            try { return new URL(dh, location.href).href; } catch { return null; }
        }
        return null;
    }

    // —— 全局拦截 monkey-patch —— //

    // 1) 拦截 window.open —— (document-start) 早期注入
    (function patchWindowOpen() {
        const originalOpen = window.open;
        window.open = function (url, target, features) {
            try {
                // url 可能为 undefined/null
                if (typeof url === 'string' && isSupportedDomain(url)) {
                    // console.log('[NoNewTab] intercepted window.open -> navigating in-place:', url);
                    location.href = url;
                    return null;
                }
                // 若是 call window.open with a URL object
                if (url && url.href && isSupportedDomain(url.href)) {
                    // console.log('[NoNewTab] intercepted window.open (URL object) -> navigating in-place:', url.href);
                    location.href = url.href;
                    return null;
                }
            } catch (e) { /* ignore */ }
            return originalOpen.apply(this, arguments);
        };
    })();

    // 2) 覆盖 Element.prototype.setAttribute，当站点尝试动态 setAttribute('target', '_blank') 时拦截（适用于评论区动态产生 target）
    (function patchSetAttribute() {
        const orig = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            try {
                if (name === 'target' && value === '_blank' && this.tagName === 'A') {
                    const href = this.href || this.getAttribute('href') || this.getAttribute('data-href');
                    if (href && isSupportedDomain(href)) {
                        return orig.call(this, name, ''); // set to empty (或直接 return 不设置)
                    }
                }
            } catch (e) { /* ignore */ }
            return orig.apply(this, arguments);
        };
    })();

    // 3) 监控 attachShadow —— 如果页面用 Shadow DOM 渲染评论区，我们也在 shadowRoot 上挂事件与 observer
    const shadowRoots = new Set();
    (function patchAttachShadow() {
        const origAttach = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function(init) {
            const sr = origAttach.call(this, init);
            try {
                // 注册并观察
                observeRoot(sr);
                shadowRoots.add(sr);
            } catch (e) {}
            return sr;
        };
    })();

    // —— 事件拦截器（覆盖 click / auxclick / mousedown / submit / keydown） —— //

    // 统一处理导航：阻止默认并在当前页打开
    function navigateInPlace(url) {
        if (!url) return;
        try {
            if (isMatchPage() && url === 'https://www.bilibili.com') {
                // 一些特殊情况需要直接打开
                location.href = url;
            } else {
                location.href = url;
            }
        } catch (e) { console.error(e); }
    }

    // 核心点击处理（捕获阶段）
    function onClickCapture(e) {
        try {
            // 忽略右键菜单等
            if (e.defaultPrevented) return;
            const path = e.composedPath ? e.composedPath() : (e.path || []);
            const anchor = findAnchorInPath(path.length ? path : [e.target]);
            const href = extractHrefFromElement(anchor);
            if (href && isSupportedDomain(href)) {
                // 一些特殊处理：知乎问题/搜索、B站 match 页面等（保留之前逻辑）
                if (location.hostname.includes('zhihu.com') && isZhihuQuestionOrSearchLink(href)) {
                    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                    navigateInPlace(href); return;
                }
                // 常规拦截：无论是否 target/_blank，只要是受支持域名，都在当前页打开
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                navigateInPlace(href);
            }
        } catch (err) { /* ignore errors */ }
    }

    // 中键 / 辅助键处理（auxclick 处理中键打开新标签）
    function onAuxClickCapture(e) {
        try {
            if (e.button !== 1) return; // 中键（一般 button===1），也可根据浏览器不同调整
            const path = e.composedPath ? e.composedPath() : (e.path || []);
            const anchor = findAnchorInPath(path.length ? path : [e.target]);
            const href = extractHrefFromElement(anchor);
            if (href && isSupportedDomain(href)) {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                navigateInPlace(href);
            }
        } catch (err) { /* ignore */ }
    }

    // mousedown 作为兜底（某些浏览器先发 mousedown，再发 auxclick）
    function onMouseDownCapture(e) {
        try {
            // 中键按下阻止默认（避免浏览器在后续直接打开新标签）
            if (e.button === 1) {
                const path = e.composedPath ? e.composedPath() : (e.path || []);
                const anchor = findAnchorInPath(path.length ? path : [e.target]);
                const href = extractHrefFromElement(anchor);
                if (href && isSupportedDomain(href)) {
                    e.preventDefault(); e.stopPropagation();
                }
            }
        } catch (err) {}
    }

    // 键盘回车（针对输入框回车搜索、以及键盘激活链接）
    function onKeyDownCapture(e) {
        try {
            // 回车触发: 处理搜索输入框（更宽泛的检测：placeholder/role/aria-label 包含“搜索”或 form[role=search]）
            if (e.key === 'Enter' || e.keyCode === 13) {
                const tg = e.target;
                if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) {
                    const placeholder = (tg.getAttribute && tg.getAttribute('placeholder')) || '';
                    const aria = (tg.getAttribute && tg.getAttribute('aria-label')) || '';
                    if (/搜索|查找|Search/i.test(placeholder + aria) || tg.closest && tg.closest('form[role="search"], [role="search"]')) {
                        // 劫持 B 站搜索（广泛匹配）
                        const keyword = tg.value || tg.textContent || '';
                        if (keyword.trim()) {
                            // 只有在 B 站域名下才把回车劫持到 B 站搜索
                            if (IS_BILIBILI) {
                                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                                const searchUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
                                location.href = searchUrl;
                                return;
                            } else {
                                // 在非 B 站域名上不要干预
                                return;
                            }
                        }
                    }
                }

                // 也处理键盘激活的 link（当 focus 在可点击元素上按 Enter）
                const focused = document.activeElement;
                if (focused) {
                    const href = extractHrefFromElement(focused);
                    if (href && isSupportedDomain(href)) {
                        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                        navigateInPlace(href);
                    }
                }
            }
        } catch (err) {}
    }

    // 表单 submit 兜底：移除 target="_blank"
    function onSubmitCapture(e) {
        try {
            const form = e.target;
            if (form && form.tagName === 'FORM' && form.getAttribute('target') === '_blank') {
                form.removeAttribute('target');
            }
        } catch (err) {}
    }

    // 将事件绑定到一个 root（document 或 shadowRoot）
    function attachRootListeners(root = document) {
        try {
            root.addEventListener('click', onClickCapture, true);
            root.addEventListener('auxclick', onAuxClickCapture, true);
            root.addEventListener('mousedown', onMouseDownCapture, true);
            root.addEventListener('keydown', onKeyDownCapture, true);
            root.addEventListener('submit', onSubmitCapture, true);
        } catch (e) {}
    }

    // —— 动态 DOM 清理（移除 target="_blank"）并处理 shadow roots —— //
    function observeRoot(root = document) {
        attachRootListeners(root);

        const observer = new MutationObserver(mutations => {
            try {
                for (const m of mutations) {
                    // 新增节点，尽快移除 target
                    if (m.addedNodes && m.addedNodes.length) {
                        m.addedNodes.forEach(node => {
                            if (!node || !node.querySelectorAll) return;
                            node.querySelectorAll && node.querySelectorAll('a[target="_blank"]').forEach(a => {
                                const href = a.href || a.getAttribute('href') || a.getAttribute('data-href');
                                if (href && isSupportedDomain(href)) {
                                    try { a.removeAttribute('target'); } catch (e) {}
                                }
                            });
                            // forms
                            node.querySelectorAll && node.querySelectorAll('form[target="_blank"]').forEach(f => f.removeAttribute('target'));
                        });
                    }
                    // 属性变更
                    if (m.type === 'attributes' && m.attributeName === 'target') {
                        const el = m.target;
                        if (el && el.tagName === 'A') {
                            const href = el.href || el.getAttribute('href') || el.getAttribute('data-href');
                            if (href && isSupportedDomain(href)) {
                                try { el.removeAttribute('target'); } catch (e) {}
                            }
                        }
                    }
                }
            } catch (e) {}
        });

        try {
            observer.observe(root instanceof Document ? root.body || root.documentElement : root, { childList: true, subtree: true, attributes: true, attributeFilter: ['target'] });
        } catch (e) {}
    }

    function initObservers() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => observeRoot(document));
        } else {
            observeRoot(document);
        }
        try {
            document.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) {
                    try { observeRoot(el.shadowRoot); } catch (e) {}
                }
            });
        } catch (e) {}
    }

    function init() {
        attachRootListeners(document);
        initObservers();
        try {
            document.querySelectorAll && document.querySelectorAll('a[target="_blank"]').forEach(a => {
                const href = a.href || a.getAttribute('href') || a.getAttribute('data-href');
                if (href && isSupportedDomain(href)) a.removeAttribute('target');
            });
            document.querySelectorAll && document.querySelectorAll('form[target="_blank"]').forEach(f => f.removeAttribute('target'));
        } catch (e) {}
    }

    // 特殊：B 站搜索的更强拦截（保留并扩展）
    function hijackBilibiliSearch() {
        if (!IS_BILIBILI) return;

        // 通过 capture 拦截回车
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                const target = e.target;
                if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
                    const placeholder = (target.getAttribute && target.getAttribute('placeholder')) || '';
                    const aria = (target.getAttribute && target.getAttribute('aria-label')) || '';
                    if (/搜索|查找|Search/i.test(placeholder + aria) || target.closest && target.closest('form[role="search"], [role="search"]')) {
                        const keyword = target.value || '';
                        if (keyword.trim()) {
                            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                            const searchUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
                            location.href = searchUrl;
                        }
                    }
                }
            }
        }, true);

        // 搜索按钮点击（捕获）
        document.addEventListener('click', function(e) {
            // 【重要修复】：如果点击的是输入框本身，绝对不要将其视为点击搜索按钮，避免聚焦输入框时页面刷新
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            let target = e.target;
            while (target && target !== document) {
                if (target.tagName === 'BUTTON' || (target.className && typeof target.className === 'string')) {
                    const cls = target.className || '';
                    // 【重要修复】：移除过于宽泛的 "search" 匹配，只匹配明确的按钮类名，防止误匹配容器
                    if (cls.includes('search-btn') || cls.includes('nav-search-submit') || cls.includes('nav-search-btn') || cls.includes('search-submit')) {
                        const form = target.closest('form');
                        const input = form ? form.querySelector('input') : document.querySelector('input[placeholder*="搜索"], input[aria-label*="搜索"]');
                        const keyword = input && input.value ? input.value.trim() : '';
                        if (keyword) {
                            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                            location.href = `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
                            return;
                        }
                    }
                }
                target = target.parentElement;
            }
        }, true);
    }

    // 启动
    init();
    hijackBilibiliSearch();
})();