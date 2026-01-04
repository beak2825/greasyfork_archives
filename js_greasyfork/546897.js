// ==UserScript==
// @name         Universal Android-Back Button – 滚动记忆版
// @namespace    https://viayoo.com/universal-back
// @version      2.0.0
// @description  零延迟返回按钮，自动记录和恢复滚动位置，支持无痕模式
// @author       ￴
// @run-at       document-end
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/546897/Universal%20Android-Back%20Button%20%E2%80%93%20%E6%BB%9A%E5%8A%A8%E8%AE%B0%E5%BF%86%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546897/Universal%20Android-Back%20Button%20%E2%80%93%20%E6%BB%9A%E5%8A%A8%E8%AE%B0%E5%BF%86%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- 共用工具 ---------- */
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟缓存
    const pageCache = new Map();

    function isPseudoTurn(prev, next) {
        try {
            const u1 = new URL(prev);
            const u2 = new URL(next);

            // 1. 仅 hash 变化
            if (u1.origin === u2.origin &&
                u1.pathname === u2.pathname &&
                u1.search === u2.search) return true;

            // 2. 仅典型分页 query 变化
            const PAGE_KEYS = ['page', 'p', 'start', 'offset'];
            if (u1.origin === u2.origin && u1.pathname === u2.pathname) {
                const s1 = new URLSearchParams(u1.search);
                const s2 = new URLSearchParams(u2.search);

                for (const k of PAGE_KEYS) { s1.delete(k); s2.delete(k); }
                return s1.toString() === s2.toString();
            }

            return false;
        } catch (e) { return false; }
    }

    /* ---------- 1. 状态管理 ---------- */
    const TAB_ID_KEY = '_ub_tab_id';
    if (!sessionStorage.getItem(TAB_ID_KEY)) {
        sessionStorage.setItem(TAB_ID_KEY, Math.random().toString(36).slice(2));
    }
    const TAB_ID = sessionStorage.getItem(TAB_ID_KEY);
0
    const STACK_KEY = `_ub_stack_${TAB_ID}`;
    const CACHE_KEY = `_ub_cache_${TAB_ID}`;
    const BACK_FLAG = `_ub_is_back_${TAB_ID}`;
    const SCROLL_KEY = `_ub_scroll_${TAB_ID}`;

    let stack = JSON.parse(sessionStorage.getItem(STACK_KEY) || '[]');
    let cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
    let scrollPositions = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}');

    function saveState() {
        sessionStorage.setItem(STACK_KEY, JSON.stringify(stack));
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        sessionStorage.setItem(SCROLL_KEY, JSON.stringify(scrollPositions));
    }

    // 清理过期缓存和滚动记录
    function cleanCache() {
        const now = Date.now();
        for (const url in cache) {
            if (cache[url].expiry < now) {
                delete cache[url];
            }
        }
        // 清理超过24小时的滚动记录
        for (const url in scrollPositions) {
            if (scrollPositions[url].timestamp < now - 24 * 60 * 60 * 1000) {
                delete scrollPositions[url];
            }
        }
    }

    /* ---------- 2. 滚动位置监控 ---------- */
    let scrollTimer = null;
    let lastScrollY = window.scrollY;
    let lastScrollX = window.scrollX;

    // 实时保存滚动位置
    function saveScrollPosition() {
        scrollPositions[location.href] = {
            x: window.scrollX,
            y: window.scrollY,
            timestamp: Date.now(),
            height: document.documentElement.scrollHeight
        };
        saveState();
    }

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            // 只有滚动距离超过50像素才保存
            if (Math.abs(window.scrollY - lastScrollY) > 50 || 
                Math.abs(window.scrollX - lastScrollX) > 50) {
                saveScrollPosition();
                lastScrollY = window.scrollY;
                lastScrollX = window.scrollX;
            }
        }, 300); // 300ms延迟，避免频繁保存
    });

    // 页面即将离开时保存滚动位置
    window.addEventListener('beforeunload', saveScrollPosition);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveScrollPosition();
        }
    });

    /* ---------- 3. 页面加载记录 ---------- */
    (function recordPage() {
        const isBack = sessionStorage.getItem(BACK_FLAG) === '1';
        sessionStorage.removeItem(BACK_FLAG);

        const ref = document.referrer;
        if (!isBack && ref && ref !== location.href && !isPseudoTurn(ref, location.href)) {
            // 保存上一页的滚动位置
            if (ref) {
                // 这里不需要额外保存，因为上一页离开时已经保存了
            }
            
            stack.push({
                url: ref,
                title: document.title,
                timestamp: Date.now()
            });
            if (stack.length > 50) stack.shift();
            saveState();
            
            // 预加载上一页
            if (!cache[ref] || cache[ref].expiry < Date.now()) {
                prefetchPage(ref);
            }
        }
        
        // 恢复滚动位置
        if (scrollPositions[location.href]) {
            const { x, y, height } = scrollPositions[location.href];
            
            // 等待页面完全加载
            const restoreScroll = () => {
                // 检查页面高度是否足够
                if (document.documentElement.scrollHeight >= height * 0.8) {
                    window.scrollTo(x, y);
                    // 显示提示
                    showScrollRestored(y);
                } else {
                    // 如果页面还没加载完，稍后再试
                    setTimeout(restoreScroll, 100);
                }
            };
            
            // 延迟执行，确保页面渲染完成
            setTimeout(restoreScroll, 100);
        }
    })();

    /* ---------- 4. SPA 导航优化 ---------- */
    (function hijackSPA() {
        const rawPush = history.pushState;
        const rawReplace = history.replaceState;

        function wrapper(rawFn) {
            return function () {
                const prev = location.href;
                // 离开前保存滚动位置
                saveScrollPosition();
                
                rawFn.apply(this, arguments);
                const next = location.href;
                if (prev !== next && !isPseudoTurn(prev, next)) {
                    stack.push({
                        url: prev,
                        title: document.title,
                        timestamp: Date.now()
                    });
                    saveState();
                    
                    // 预加载可能的目标页面
                    prefetchPossibleTargets();
                }
            };
        }
        history.pushState = wrapper(rawPush);
        history.replaceState = wrapper(rawReplace);

        window.addEventListener('popstate', () => {
            const cur = location.href;
            if (stack.length && stack[stack.length - 1].url === cur) {
                stack.pop();
                saveState();
            }
            // 恢复滚动位置
            if (scrollPositions[cur]) {
                const { x, y } = scrollPositions[cur];
                setTimeout(() => {
                    window.scrollTo(x, y);
                    showScrollRestored(y);
                }, 100);
            }
        });
    })();

    /* ---------- 5. 智能预加载系统 ---------- */
    function prefetchPage(url) {
        if (cache[url] && cache[url].expiry > Date.now()) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "X-Purpose": "prefetch"
            },
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const content = extractMainContent(doc);
                
                cache[url] = {
                    content: content,
                    title: doc.title,
                    expiry: Date.now() + CACHE_EXPIRY
                };
                saveState();
            }
        });
    }

    function prefetchPossibleTargets() {
        // 预加载栈顶3个页面
        stack.slice(-3).forEach(item => {
            if (!cache[item.url] || cache[item.url].expiry < Date.now()) {
                prefetchPage(item.url);
            }
        });
    }

    function extractMainContent(doc) {
        const selectors = [
            'article', 'main', '.article', '.post', 
            '.content', '#content', 'body'
        ];
        
        for (const sel of selectors) {
            const el = doc.querySelector(sel);
            if (el) return el.innerHTML;
        }
        return doc.body.innerHTML;
    }

    /* ---------- 6. 零刷新导航 ---------- */
    async function navigateTo(url) {
        cleanCache();
        
        // 保存当前页面的滚动位置
        saveScrollPosition();

        // 1. 尝试从缓存加载
        if (cache[url]) {
            updatePage(cache[url]);
            history.replaceState(null, '', url);
            
            // 恢复目标页面的滚动位置
            restoreScrollForUrl(url);
            return;
        }

        // 2. 显示加载状态
        btn.textContent = '⌛';
        toast('快速加载中...');

        // 3. 尝试快速获取
        try {
            const response = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const content = extractMainContent(doc);
            
            // 更新缓存
            cache[url] = {
                content: content,
                title: doc.title,
                expiry: Date.now() + CACHE_EXPIRY
            };
            saveState();
            
            updatePage(cache[url]);
            history.replaceState(null, '', url);
            
            // 恢复目标页面的滚动位置
            restoreScrollForUrl(url);
        } catch (e) {
            // 回退到传统导航
            sessionStorage.setItem(BACK_FLAG, '1');
            location.href = url;
        } finally {
            btn.textContent = '←';
        }
    }

    function restoreScrollForUrl(url) {
        if (scrollPositions[url]) {
            const { x, y } = scrollPositions[url];
            setTimeout(() => {
                window.scrollTo({
                    left: x,
                    top: y,
                    behavior: 'smooth' // 平滑滚动
                });
                showScrollRestored(y);
            }, 100);
        }
    }

    function updatePage(data) {
        document.title = data.title;
        
        const container = document.querySelector(
            'article, main, .article, .post, .content, #content'
        ) || document.body;
        
        container.innerHTML = data.content;
        
        // 重新插入按钮（因为替换了内容）
        insertBtn();
        
        // 触发可能的脚本重新执行
        if (typeof window.onPageUpdated === 'function') {
            window.onPageUpdated();
        }
    }

    /* ---------- 7. 优化按钮实现 ---------- */
    const btn = createButton();
    
    function createButton() {
        const btn = document.createElement('div');
        btn.textContent = '←';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '52px',
            height: '52px',
            lineHeight: '52px',
            textAlign: 'center',
            fontSize: '26px',
            fontWeight: 'bold',
            borderRadius: '50%',
            color: '#000',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
            userSelect: 'none',
            cursor: 'pointer',
            transition: 'all .2s',
            zIndex: 2147483646
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateX(-50%) scale(1.1)';
            btn.style.background = 'rgba(255,255,255,0.95)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateX(-50%) scale(1)';
            btn.style.background = 'rgba(255,255,255,0.85)';
        });

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 保存当前滚动位置
            saveScrollPosition();
            
            // 先把连续的伪页全部弹掉
            while (stack.length && isPseudoTurn(stack[stack.length - 1].url, location.href)) {
                stack.pop();
            }

            if (stack.length) {
                const target = stack.pop().url;
                saveState();
                await navigateTo(target);
            } else if (history.length > 1) {
                history.back();
            } else if (document.referrer) {
                await navigateTo(document.referrer);
            } else {
                toast('没有可返回的页面');
            }
        });

        return btn;
    }

    function insertBtn() {
        if (!document.body.contains(btn)) {
            document.body.appendChild(btn);
        }
    }

    /* ---------- 8. Toast 提示 ---------- */
    function toast(msg) {
        const t = document.createElement('div');
        t.textContent = msg;
        Object.assign(t.style, {
            position: 'fixed',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            zIndex: 2147483647,
            opacity: '0',
            transition: 'opacity .3s',
            maxWidth: '80vw',
            wordBreak: 'break-word'
        });
        document.body.appendChild(t);
        requestAnimationFrame(() => t.style.opacity = '1');
        setTimeout(() => {
            t.style.opacity = '0';
            setTimeout(() => t.remove(), 300);
        }, 1800);
    }

    // 显示滚动恢复提示
    function showScrollRestored(scrollY) {
        if (scrollY > 100) { // 只有滚动超过100像素才显示提示
            const indicator = document.createElement('div');
            indicator.textContent = '↓ 已恢复到上次位置';
            Object.assign(indicator.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(76, 175, 80, 0.9)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                zIndex: 2147483647,
                opacity: '0',
                transition: 'opacity .3s',
                pointerEvents: 'none'
            });
            document.body.appendChild(indicator);
            requestAnimationFrame(() => indicator.style.opacity = '1');
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.remove(), 300);
            }, 2000);
        }
    }

    /* ---------- 初始化 ---------- */
    insertBtn();
    prefetchPossibleTargets();
    cleanCache(); // 启动时清理过期数据
})();
