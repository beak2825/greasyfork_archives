// ==UserScript==
// @name         搜索引擎定制过滤器
// @version      1.0.0
// @description  完全可定制的搜索引擎结果过滤，屏蔽“知乎”、“CSDN”等
// @license      MIT
// @author       Fig
// @match        *://www.google.com/search*
// @match        *://cse.google.com/search*
// @match        *://www.bing.com/search*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/106004
// @downloadURL https://update.greasyfork.org/scripts/529286/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%AE%9A%E5%88%B6%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529286/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%AE%9A%E5%88%B6%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG_KEY = 'SEARCH_FILTER_V2';
    const defaultSites = ['zhihu.com', 'csdn.net'];

    // 初始化存储系统
    const initializeStorage = () => {
        try {
            if (!GM_getValue(CONFIG_KEY)) {
                GM_setValue(CONFIG_KEY, defaultSites);
            }
        } catch (e) {
            console.error('存储初始化失败:', e);
        }
    };
    initializeStorage();

    // 获取有效域名列表
    const getValidSites = () => {
        try {
            const sites = GM_getValue(CONFIG_KEY) || [];
            return sites.filter(s => isValidDomain(s));
        } catch (e) {
            return defaultSites;
        }
    };

    // 核心过滤逻辑
    const applySearchFilter = () => {
        const params = new URLSearchParams(location.search);
        let query = params.get('q') || '';
        if (!query) return;

        const blockedSites = getValidSites();
        let modified = false;

        blockedSites.forEach(domain => {
            const exclusionPattern = new RegExp(`(^|\\s)-site:${escapeRegExp(domain)}(\\s|$)`, 'i');
            if (!exclusionPattern.test(query)) {
                query += ` -site:${domain}`;
                modified = true;
            }
        });

        if (modified) {
            params.set('q', query.trim());
            const newSearch = params.toString();
            if (decodeURIComponent(location.search) !== decodeURIComponent('?' + newSearch)) {
                history.replaceState(null, '', '?' + newSearch);
            }
        }
    };

    // 配置界面
    const createControlPanel = () => {
        const style = GM_addStyle(`
            .search-filter-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.5);
                z-index: 2147483647;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .search-filter-dialog {
                background: #fff;
                border-radius: 8px;
                padding: 20px;
                min-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .search-filter-textarea {
                width: 100%;
                height: 200px;
                margin: 10px 0;
                padding: 8px;
                border: 1px solid #ddd;
                font-family: monospace;
            }
            .search-filter-buttons {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            .search-filter-button {
                flex: 1;
                padding: 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .search-filter-save {
                background: #007bff;
                color: white;
            }
            .search-filter-cancel {
                background: #6c757d;
                color: white;
            }
        `);

        const overlay = document.createElement('div');
        overlay.className = 'search-filter-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'search-filter-dialog';
        dialog.innerHTML = `
            <h3>管理屏蔽网站 (每行一个域名)</h3>
            <textarea class="search-filter-textarea" placeholder="示例：\nzhihu.com\ncsdn.net">${getValidSites().join('\n')}</textarea>
            <div class="search-filter-buttons">
                <button class="search-filter-button search-filter-save">保存</button>
                <button class="search-filter-button search-filter-cancel">取消</button>
            </div>
        `;

        // 事件绑定
        dialog.querySelector('.search-filter-save').addEventListener('click', handleSave);
        dialog.querySelector('.search-filter-cancel').addEventListener('click', () => overlay.remove());

        overlay.appendChild(dialog);
        document.documentElement.appendChild(overlay);

        // 处理保存操作
        async function handleSave() {
            const textarea = dialog.querySelector('textarea');
            const newSites = textarea.value
                .split('\n')
                .map(s => s.trim())
                .filter(s => {
                    if (!s) return false;
                    const normalized = normalizeDomain(s);
                    const valid = isValidDomain(normalized);
                    if (!valid) alert(`无效域名: ${s}`);
                    return valid;
                })
                .map(normalizeDomain);

            if (newSites.length === 0) {
                alert('至少需要保留一个有效域名');
                return;
            }

            try {
                await GM_setValue(CONFIG_KEY, [...new Set(newSites)]);
                alert('保存成功! 页面将刷新应用设置');
                location.href = location.href; // 完整重载页面
            } catch (error) {
                console.error('保存失败:', error);
                alert('保存失败，请检查控制台');
            }
        }
    };

    // 域名处理工具
    const normalizeDomain = (input) => {
        return input
            .replace(/^https?:\/\/(www\.)?/i, '')
            .replace(/\/.*$/, '')
            .toLowerCase()
            .trim();
    };

    const isValidDomain = (domain) => {
        return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain);
    };

    const escapeRegExp = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // 注册菜单命令
    GM_registerMenuCommand('🛡️ 管理屏蔽网站', createControlPanel);

    // 主执行逻辑
    if (document.readyState === 'complete') {
        applySearchFilter();
    } else {
        window.addEventListener('load', applySearchFilter);
    }
})();