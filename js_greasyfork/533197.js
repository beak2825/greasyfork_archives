// ==UserScript==

// @name         🔍 搜索快切

// @namespace    Aiccest

// @version      1.0.0

// @description  快速切换搜索引擎的工具栏，支持自定义搜索引擎

// @author       Aiccest

// @match        *://*/*

// @grant        GM_addStyle

// @grant        GM_setValue

// @grant        GM_getValue

// @grant        GM_registerMenuCommand

// @noframes

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/533197/%F0%9F%94%8D%20%E6%90%9C%E7%B4%A2%E5%BF%AB%E5%88%87.user.js
// @updateURL https://update.greasyfork.org/scripts/533197/%F0%9F%94%8D%20%E6%90%9C%E7%B4%A2%E5%BF%AB%E5%88%87.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const CONFIG = { DELAY: 500, DEBOUNCE: 150 };

    function debounce(fn, wait) {

        let t;

        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };

    }

    function escapeHTML(str) {

        return str.replace(/[&<>]/g, c => ({ '&': '&', '<': '<', '>': '>' })[c] || c);

    }

    function generateId(name) {

        let h = 0;

        for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;

        return 'engine_' + Math.abs(h);

    }

    const SEARCH_RULES = {

        preset: [

            { domains: ['www.baidu.com', 'baidu.com', 'm.baidu.com'], pathTest: /^\/(s|s\/|wappass\/bdstatic\/|from|mobile\/)/, paramKeys: ['wd', 'word', 'q'], exclude: [/^\/tieba/, /^\/zhidao/, /^\/question/, /^\/passport/], isBaidu: true },

            { domains: ['www.google.*', '*.google.*'], pathTest: /^\/search\b/, paramKeys: ['q'] },

            { domains: ['m.sm.cn'], pathTest: /^\/s\b/, paramKeys: ['q'] },

            { domains: ['*.so.com'], pathTest: /^\/s\b/, paramKeys: ['q'] },

            { domains: ['sogou.com', 'm.sogou.com'], pathTest: /^\/(web|web\/searchList\.jsp)\b/, paramKeys: ['q', 'keyword'] },

            { domains: ['*.bing.com'], pathTest: /^\/search\b/, paramKeys: ['q'] },

            { domains: ['zhihu.com'], pathTest: /^\/search\b/, paramKeys: ['q'] },

            { domains: ['metaso.cn'], pathTest: /^\/$/, paramKeys: ['q'] }

        ],

        custom(e) {

            try {

                const u = new URL(e.link.replace('%s', ''));

                let k = '';

                new URLSearchParams(u.search).forEach((v, key) => { if (v === '') k = key; });

                return { domains: [u.hostname], pathTest: new RegExp(`^${u.pathname}`), paramKeys: [k] };

            } catch {

                return null;

            }

        }

    };

    function isSearchEnginePage() {

        const u = new URL(location.href), p = new URLSearchParams(u.search);

        const e = GM_getValue('universal_search_engines', []);

        return [...SEARCH_RULES.preset, ...e.map(SEARCH_RULES.custom).filter(Boolean)].some(r => {

            if (!r.domains.some(d => u.hostname.includes(d.replace('*.', '')))) return false;

            if (r.exclude?.some(ex => ex.test(u.pathname))) return false;

            if (r.pathTest && !r.pathTest.test(u.pathname)) return false;

            return r.paramKeys.some(k => p.has(k));

        });

    }

    class BaiduHandler {

        constructor(render) {

            this.lastQuery = null;

            this.render = render;

            this.init();

        }

        init() {

            ['pushState', 'replaceState'].forEach(m => {

                const o = history[m];

                history[m] = (...args) => { o.apply(history, args); this.handleChange('history'); };

            });

            window.addEventListener('popstate', () => this.handleChange('popstate'));

            this.observer = new MutationObserver(m => {

                if (m.some(r => Array.from(r.addedNodes).some(n => n.id === 'content_left' || n.classList?.contains('c-container') || n.querySelector?.('[data-click]')))) {

                    this.handleChange('dom');

                }

            });

            this.observer.observe(document.body, { childList: true, subtree: true });

        }

        handleChange(src) {

            debounce(() => {

                const q = this.getQuery();

                if (q && (q !== this.lastQuery || src === 'popstate' || src === 'dom')) {

                    this.lastQuery = q;

                    document.querySelector('#search-toolbox')?.remove();

                    this.render();

                }

            }, 300)();

        }

        getQuery() {

            const p = new URLSearchParams(location.search);

            let q = p.get('wd') || p.get('word') || p.get('q');

            if (!q) {

                const i = document.querySelector('input#kw, input[name="wd"], input[type="search"]');

                q = i?.value?.trim();

            }

            return q || document.title.replace(/(百度搜索|_百度搜索|-百度搜索).*$/, '').trim();

        }

        destroy() {

            this.observer?.disconnect();

        }

    }

    class SearchBox {

        constructor() {

            this.engines = GM_getValue('universal_search_engines') || [

                { name: 'Google', link: 'https://www.google.com/search?q=%s' },

                { name: '百度', link: 'https://www.baidu.com/s?wd=%s' },

                { name: '神马', link: 'https://m.sm.cn/s?q=%s' },

                { name: '360搜索', link: 'https://www.so.com/s?q=%s' },

                { name: '搜狗', link: 'https://m.sogou.com/web/searchList.jsp?keyword=%s' },

                { name: '必应', link: 'https://cn.bing.com/search?q=%s' },

                { name: '知乎', link: 'https://www.zhihu.com/search?q=%s' },

                { name: '秘塔AI', link: 'https://metaso.cn/?q=%s' }

            ].map(e => ({ ...e, id: generateId(e.name) }));

            if (!GM_getValue('universal_search_engines')) GM_setValue('universal_search_engines', this.engines);

            if (!isSearchEnginePage()) return;

            this.injectStyles();

            if (SEARCH_RULES.preset[0].domains.some(d => location.hostname.includes(d.replace('*.', '')))) {

                this.baiduHandler = new BaiduHandler(() => this.renderToolbox());

            }

            this.renderToolbox();

            this.bindEvents();

            this.bindResizeHandler();

            GM_registerMenuCommand('⚙️ 设置', () => this.showSettings());

        }

        injectStyles() {

            GM_addStyle(`

                #search-toolbox {

                    position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.98);

                    border-top: 1px solid #ddd; padding: 8px; display: flex; gap: 6px; z-index: 2147483647;

                    overflow-x: auto; scrollbar-width: none;

                }

                #search-toolbox::-webkit-scrollbar { display: none; }

                #search-toolbox.long-content { justify-content: flex-start; }

                #search-toolbox:not(.long-content) { justify-content: center; }

                .search-engine {

                    padding: 4px 10px; background: #007bff; color: #fff; border-radius: 4px; font-size: 12px;

                    white-space: nowrap; flex-shrink: 0; cursor: pointer;

                }

                #settings-btn { background: #6c757d; }

                @media (max-width: 480px) {

                    .search-engine { font-size: 11px; padding: 4px 8px; }

                }

            `);

        }

        renderToolbox() {

            let t = document.querySelector('#search-toolbox');

            if (!t) {

                t = document.createElement('div');

                t.id = 'search-toolbox';

                document.body.appendChild(t);

            }

            t.innerHTML = this.engines.map(e => `<div class="search-engine" data-id="${escapeHTML(e.id)}" data-link="${escapeHTML(e.link)}">${escapeHTML(e.name)}</div>`).join('') + '<div class="search-engine" id="settings-btn">⚙️</div>';

            this.updateToolbox();

        }

        bindEvents() {

            document.addEventListener('click', e => {

                const t = e.target;

                if (t.closest('#search-toolbox') && t.id === 'settings-btn') {

                    e.preventDefault();

                    const p = document.querySelector('#settings-panel-container');

                    if (p) {

                        p.remove();

                    } else {

                        this.showSettings();

                        setTimeout(() => {

                            document.addEventListener('click', function closePanel(ev) {

                                const path = ev.composedPath();

                                const isInPanel = path.some(el => el?.id === 'settings-panel-container' || el?.classList?.contains('settings-panel'));

                                const isSettingsBtn = ev.target.matches('#settings-btn');

                                if (!isInPanel && !isSettingsBtn) {

                                    document.querySelector('#settings-panel-container')?.remove();

                                    document.removeEventListener('click', closePanel);

                                }

                            }, { capture: true });

                        }, 50);

                    }

                } else if (t.classList.contains('search-engine') && t.id !== 'settings-btn') {

                    const q = this.getQuery();

                    if (q) window.open(t.dataset.link.replace('%s', encodeURIComponent(q)), '_blank');

                }

            });

        }

        getQuery() {

            if (this.baiduHandler) return this.baiduHandler.getQuery();

            const p = new URLSearchParams(location.search);

            for (const k of ['q', 'wd', 'query']) {

                const v = p.get(k);

                if (v?.trim()) return v.trim();

            }

            return document.querySelector('input[type="search"]')?.value?.trim() || '';

        }

        showSettings() {

            const p = document.createElement('div');

            p.id = 'settings-panel-container';

            document.body.appendChild(p);

            // 创建 Shadow DOM

            const shadow = p.attachShadow({ mode: 'open' });

            // 创建样式

            const style = document.createElement('style');

            style.textContent = `

                .settings-panel {

                    width: 60%; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white;

                    padding: 12px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.15); z-index: 2147483647;

                    max-width: 600px; max-height: 80vh; overflow-y: auto; box-sizing: border-box;

                    font-family: Arial, sans-serif;

                }

                .settings-panel h3 {

                    margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #eee; font-size: 12px;

                    display: flex; justify-content: space-between; align-items: center;

                }

                .engine-item {

                    margin-bottom: 12px; /* 保留条目间间距 */

                }

                .name-row {

                    display: flex; gap: 6px; align-items: center; margin-bottom: 0; /* 移除名称栏底部间距 */

                }

                .name-row input[type="text"] {

                    flex: 1; min-width: 60px; max-width: 120px; padding: 6px 8px; box-sizing: border-box;

                    border: 1px solid #ddd; border-radius: 4px;

                }

                .engine-actions {

                    display: flex; gap: 4px; margin-left: auto;

                }

                .url-input {

                    width: 100%; margin: 0; /* 移除URL输入框间距，使其紧贴名称栏 */

                    padding: 7px 10px; box-sizing: border-box;

                    border: 1px solid #ddd; border-radius: 4px;

                }

                .action-bar {

                    display: flex; gap: 6px; margin-top: 8px; padding-top: 12px; border-top: 1px solid #eee;

                }

                .action-btn {

                    flex: 1; padding: 5px; height: 24px; line-height: 14px; text-align: center; border-radius: 4px;

                    font-size: 16px; border: none; cursor: pointer;

                }

                .engine-actions button {

                    width: 18px; height: 24px; padding: 0; font-size: 14px; border-radius: 1px;

                    line-height: 22px; border: 1px solid #ddd; background: #f8f9fa;

                }

                .engine-actions button:hover { background: #e9ecef; }

                .engine-actions button[disabled] { opacity: 0.5; cursor: not-allowed; }

                #add-engine { background: #28a745; color: white; }

                #save-settings { background: #007bff; color: white; }

                #close-panel { background: #6c757d; color: white; }

                @media (prefers-color-scheme: dark) {

                    .settings-panel { background: #2d2d2d; color: #eee; }

                    .engine-actions button { background: #333; border-color: #555; }

                    .url-input { background: #333; color: #fff; border-color: #555; }

                    .name-row input[type="text"] { background: #333; color: #fff; border-color: #555; }

                    .action-bar { border-top: 1px solid #444; }

                    .settings-panel h3 { border-bottom: 1px solid #444; }

                }

            `;

            // 创建内容

            const content = document.createElement('div');

            content.className = 'settings-panel';

            content.innerHTML = `

                <h3>🔧 搜索引擎管理</h3>

                <div id="engine-list">

                    ${this.engines.map((e, i) => `

                        <div class="engine-item" data-id="${escapeHTML(e.id)}">

                            <div class="name-row">

                                <input type="text" value="${escapeHTML(e.name)}" required>

                                <div class="engine-actions">

                                    <button class="move-up" ${i === 0 ? 'disabled' : ''}>↑</button>

                                    <button class="move-down" ${i === this.engines.length - 1 ? 'disabled' : ''}>↓</button>

                                    <button class="delete">×</button>

                                </div>

                            </div>

                            <input class="url-input" type="url" value="${escapeHTML(e.link)}" required>

                        </div>

                    `).join('')}

                </div>

                <div class="action-bar">

                    <button class="action-btn" id="add-engine">添加</button>

                    <button class="action-btn" id="save-settings">保存</button>

                    <button class="action-btn" id="close-panel">关闭</button>

                </div>

            `;

            // 将样式和内容添加到 Shadow DOM

            shadow.appendChild(style);

            shadow.appendChild(content);

            // 绑定事件

            content.addEventListener('click', (e) => this.handleSettingsClick(e));

        }

        handleSettingsClick(e) {

            const t = e.target;

            const p = t.closest('.settings-panel');

            if (!p) return;

            if (t.id === 'add-engine') {

                const item = document.createElement('div');

                item.className = 'engine-item';

                item.dataset.id = generateId('新引擎');

                item.innerHTML = `

                    <div class="name-row">

                        <input type="text" placeholder="引擎名称" required>

                        <div class="engine-actions">

                            <button class="move-up">↑</button>

                            <button class="move-down">↓</button>

                            <button class="delete">×</button>

                        </div>

                    </div>

                    <input class="url-input" type="url" placeholder="https://www.google.com/search?q=%s" required>

                `;

                p.querySelector('#engine-list').appendChild(item);

                p.scrollTop = p.scrollHeight;

            } else if (t.id === 'save-settings') {

                const engines = [];

                let valid = true;

                p.querySelectorAll('.engine-item').forEach(item => {

                    const nameInput = item.querySelector('input[type="text"]');

                    const urlInput = item.querySelector('input[type="url"]');

                    const name = nameInput.value.trim();

                    const link = urlInput.value.trim();

                    if (!name) {

                        alert('引擎名称不能为空！');

                        nameInput.focus();

                        valid = false;

                        return;

                    }

                    if (!/%s/.test(link)) {

                        alert('URL必须包含%s占位符！');

                        urlInput.focus();

                        valid = false;

                        return;

                    }

                    try {

                        new URL(link.replace('%s', 'test'));

                    } catch {

                        alert('请输入有效的URL！');

                        urlInput.focus();

                        valid = false;

                        return;

                    }

                    engines.push({ id: item.dataset.id, name, link });

                });

                if (valid) {

                    this.engines = engines;

                    GM_setValue('universal_search_engines', engines);

                    document.querySelector('#settings-panel-container')?.remove();

                    document.querySelector('#search-toolbox')?.remove();

                    this.renderToolbox();

                }

            } else if (t.id === 'close-panel') {

                document.querySelector('#settings-panel-container')?.remove();

            } else if (t.classList.contains('move-up') || t.classList.contains('move-down')) {

                const item = t.closest('.engine-item');

                if (t.classList.contains('move-up')) {

                    item.previousElementSibling?.before(item);

                } else {

                    item.nextElementSibling?.after(item);

                }

                p.querySelectorAll('.engine-item').forEach((el, i) => {

                    el.querySelector('.move-up').disabled = i === 0;

                    el.querySelector('.move-down').disabled = i === p.querySelectorAll('.engine-item').length - 1;

                });

            } else if (t.classList.contains('delete')) {

                if (p.querySelectorAll('.engine-item').length <= 1) {

                    alert('至少保留一个搜索引擎！');

                    return;

                }

                t.closest('.engine-item').remove();

            }

        }

        updateToolbox() {

            const t = document.querySelector('#search-toolbox');

            if (!t) return;

            t.classList.remove('long-content');

            t.getBoundingClientRect();

            const sw = t.scrollWidth, cw = t.clientWidth;

            t.classList.toggle('long-content', sw > cw);

            if (sw > cw) t.scrollLeft = 0;

        }

        bindResizeHandler() {

            const h = debounce(() => {

                requestAnimationFrame(() => this.updateToolbox());

            }, CONFIG.DEBOUNCE);

            window.addEventListener('resize', h);

            window.addEventListener('orientationchange', h);

            requestAnimationFrame(() => this.updateToolbox());

        }

        destroy() {

            this.baiduHandler?.destroy();

            document.querySelectorAll('#search-toolbox, #settings-panel-container').forEach(e => e.remove());

        }

    }

    function init() {

        if (document.body && isSearchEnginePage()) new SearchBox();

        else setTimeout(init, 200);

    }

    init();

})();