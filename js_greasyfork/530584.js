// ==UserScript==
// @name         Bing 搜索增强
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Bing搜索增强：智能翻页/快捷操作/结果优化
// @author       Aethersailor
// @match        *://www.bing.com/search*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530584/Bing%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/530584/Bing%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式开关
    const DEBUG = true;
    function log(...args) { DEBUG && console.log('[Bing增强]', ...args); }

    // 元素选择器 (Bing 2023)
    const SELECTORS = {
        nextPage: 'a.sb_pagN',
        prevPage: 'a.sb_pagP',
        pager: '.sb_pag',
        results: '#b_results',
        resultItem: 'li.b_algo',
        resultLink: 'h2 a'
    };

    // 配置存储键
    const CONFIG_KEYS = {
        AUTO_SCROLL: 'autoScroll',
        INTERVAL: 'interval',
        KEY_NAV: 'keyNav',
        STICKY_PAGER: 'stickyPager',
        MAX_RESULTS: 'maxResults',
        FILTER_DOMAIN: 'filterDomain',
        PANEL_STATE: 'panelState'
    };

    // 初始化配置
    const config = {
        [CONFIG_KEYS.AUTO_SCROLL]: GM_getValue(CONFIG_KEYS.AUTO_SCROLL, false),
        [CONFIG_KEYS.INTERVAL]: GM_getValue(CONFIG_KEYS.INTERVAL, 2),
        [CONFIG_KEYS.KEY_NAV]: GM_getValue(CONFIG_KEYS.KEY_NAV, false),
        [CONFIG_KEYS.STICKY_PAGER]: GM_getValue(CONFIG_KEYS.STICKY_PAGER, false),
        [CONFIG_KEYS.MAX_RESULTS]: GM_getValue(CONFIG_KEYS.MAX_RESULTS, false) || isMaxResultsEnabled(),
        [CONFIG_KEYS.FILTER_DOMAIN]: GM_getValue(CONFIG_KEYS.FILTER_DOMAIN, false),
        [CONFIG_KEYS.PANEL_STATE]: GM_getValue(CONFIG_KEYS.PANEL_STATE, 'collapsed')
    };

    /******************** 控制面板实现 ********************/
    function createControlPanel() {
        // 清理旧面板
        const oldPanel = document.getElementById('bing-enhancer-panel');
        if (oldPanel) oldPanel.remove();

        // 创建新面板
        const panel = document.createElement('div');
        panel.id = 'bing-enhancer-panel';
        panel.innerHTML = `
            <div class="panel-toggle">⚙️</div>
            <div class="panel-content">
                <h3>搜索增强</h3>
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="autoScroll">
                        自动翻页
                        <select id="scrollInterval">
                            ${[1,2,3,4,5].map(t => `<option value="${t}">${t}秒</option>`).join('')}
                        </select>
                    </label>
                </div>
                <div class="control-group">
                    <label><input type="checkbox" id="keyNav"> 方向键翻页</label>
                </div>
                <div class="control-group">
                    <label><input type="checkbox" id="stickyPager"> 置顶翻页按钮</label>
                </div>
                <div class="control-group">
                    <label><input type="checkbox" id="maxResults"> 最大化结果</label>
                </div>
                <div class="control-group">
                    <label><input type="checkbox" id="filterDomain"> 过滤.cn/.top</label>
                </div>
            </div>
        `;

        // 样式保障
        GM_addStyle(`
            #bing-enhancer-panel {
                position: fixed !important;
                top: 15px !important;
                left: 15px !important;
                z-index: 2147483647 !important;
                background: rgba(255,255,255,0.98) !important;
                backdrop-filter: blur(5px) !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
                transition: all 0.3s ease !important;
                min-width: 40px !important;
                min-height: 40px !important;
                overflow: visible !important;
                pointer-events: auto !important;
            }
            .panel-toggle {
                width: 40px !important;
                height: 40px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 24px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                user-select: none;
            }
            .panel-content {
                display: none;
                position: absolute;
                left: 50px;
                top: 0;
                background: inherit;
                border-radius: 8px;
                padding: 15px;
                min-width: 250px;
                box-shadow: inherit;
                z-index: 9999 !important;
            }
            #bing-enhancer-panel.expanded .panel-content {
                display: block;
            }
            .control-group {
                margin: 10px 0;
            }
            .control-group label {
                cursor: pointer;
                display: flex;
                align-items: center;
            }
        `);

        document.body.appendChild(panel);
        setupPanelEvents(panel);
        updateControlStates();
        log('控制面板已初始化');
    }

    function setupPanelEvents(panel) {
        let isExpanded = config[CONFIG_KEYS.PANEL_STATE] === 'expanded';
        const toggle = panel.querySelector('.panel-toggle');
        const content = panel.querySelector('.panel-content');

        // 初始化面板状态
        panel.classList.toggle('expanded', isExpanded);

        // 单一可靠的点击事件处理
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            isExpanded = !isExpanded;
            panel.classList.toggle('expanded', isExpanded);
            GM_setValue(CONFIG_KEYS.PANEL_STATE, isExpanded ? 'expanded' : 'collapsed');
        });

        // 阻止内容区域点击冒泡
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 优化文档点击处理
        document.addEventListener('click', function(e) {
            if (isExpanded && !panel.contains(e.target)) {
                panel.classList.remove('expanded');
                isExpanded = false;
                GM_setValue(CONFIG_KEYS.PANEL_STATE, 'collapsed');
            }
        });

        // 配置变更处理
        panel.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', () => {
                saveConfig();
                applyAllFeatures();
            });
        });
    }

    /******************** 核心功能 ********************/
    // 自动翻页
    let scrollInterval;
    function handleAutoScroll(enable, interval) {
        clearInterval(scrollInterval);
        if (enable) {
            scrollInterval = setInterval(() => {
                const nextBtn = document.querySelector(SELECTORS.nextPage);
                nextBtn && nextBtn.click();
            }, interval * 1000);
        }
    }

    // 方向键导航
    function handleKeyNav(enable) {
        const handler = e => {
            if (e.key === 'ArrowRight') document.querySelector(SELECTORS.nextPage)?.click();
            if (e.key === 'ArrowLeft') document.querySelector(SELECTORS.prevPage)?.click();
        };
        document[enable ? 'addEventListener' : 'removeEventListener']('keydown', handler);
    }

    // 置顶翻页按钮
    function handleStickyPager(enable) {
        const pager = document.querySelector(SELECTORS.pager);
        if (pager) {
            pager.style.cssText = enable ?
                'position:sticky;top:0;background:#fff;z-index:999;padding:12px 0;box-shadow:0 2px 5px rgba(0,0,0,0.1);' :
                '';
        }
    }

    // 最大化结果
    function handleMaxResults(enable) {
        const url = new URL(location.href);
        if (enable) {
            url.searchParams.set('count', '50');
        } else {
            url.searchParams.delete('count');
        }
        if (url.href !== location.href) {
            history.replaceState(null, '', url);
            location.reload();
        }
    }

    // 域名过滤
    function handleDomainFilter(enable) {
        const styleId = 'domain-filter-style';
        if (enable) {
            GM_addStyle(`
                ${SELECTORS.resultItem} a[href*=".cn"],
                ${SELECTORS.resultItem} a[href*=".top"] {
                    display: none !important;
                }
            `, styleId);
        } else {
            const style = document.getElementById(styleId);
            style?.remove();
        }
    }

    /******************** 工具函数 ********************/
    function updateControlStates() {
        document.getElementById('autoScroll').checked = config.autoScroll;
        document.getElementById('scrollInterval').value = config.interval;
        document.getElementById('keyNav').checked = config.keyNav;
        document.getElementById('stickyPager').checked = config.stickyPager;
        document.getElementById('maxResults').checked = config.maxResults;
        document.getElementById('filterDomain').checked = config.filterDomain;
    }

    function saveConfig() {
        config.autoScroll = document.getElementById('autoScroll').checked;
        config.interval = parseInt(document.getElementById('scrollInterval').value);
        config.keyNav = document.getElementById('keyNav').checked;
        config.stickyPager = document.getElementById('stickyPager').checked;
        config.maxResults = document.getElementById('maxResults').checked;
        config.filterDomain = document.getElementById('filterDomain').checked;

        Object.entries(config).forEach(([key, value]) => {
            GM_setValue(key, value);
        });
    }

    function applyAllFeatures() {
        handleAutoScroll(config.autoScroll, config.interval);
        handleKeyNav(config.keyNav);
        handleStickyPager(config.stickyPager);
        handleMaxResults(config.maxResults);
        handleDomainFilter(config.filterDomain);
    }

    function isMaxResultsEnabled() {
        return new URL(location.href).searchParams.get('count') === '50';
    }

    /******************** 初始化 ********************/
    function init() {
        // DOM加载保障
        const checkReady = () => {
            if (document.querySelector(SELECTORS.results)) {
                createControlPanel();
                applyAllFeatures();
                log('初始化完成');
            } else {
                setTimeout(checkReady, 500);
            }
        };

        checkReady();
    }

    // 启动初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        document.addEventListener('DOMContentLoaded', init);
    }
})();