// ==UserScript==
// @name         B站（bilibili）链接参数净化
// @namespace    You Boy
// @version      1.4.2
// @description  清理B站链接追踪参数，支持自定义、批量添加和重置规则，性能最优，无页面侵入。
// @author       You Boy
// @match        *://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542259/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/542259/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 如果当前窗口不是顶层窗口，则不执行脚本，防止在iframe中重复运行
    if (window.self !== window.top) {
        return;
    }

    // --- 1. Greasemonkey 沙箱环境 ---
    // 此部分负责GM API调用，并作为注入脚本的入口。
    // 默认参数 感谢脚本 https://greasyfork.org/zh-CN/scripts/393995 提供
    const DEFAULT_PARAMS = [
        'spm_id_from', 'from_source', 'msource', 'bsource', 'seid', 'source',
        'session_id', 'visit_id', 'sourceFrom', 'from_spmid', 'share_source',
        'share_medium', 'share_plat', 'share_session_id', 'share_tag', 'unique_k',
        'csource', 'vd_source', 'tab', 'is_story_h5', 'share_from', 'plat_id',
        '-Arouter', 'spmid', 'live_from', 'launch_id', 'hotRank', 'trackid',
    ];

    const paramsToInject = GM_getValue('customParams', DEFAULT_PARAMS);

    // 监听注入脚本的保存请求 (页面环境 -> 沙箱)
    window.addEventListener('blc-save-params', (event) => {
        GM_setValue('customParams', event.detail);
    });

    // 注册菜单命令，点击时通知注入脚本打开设置面板
    GM_registerMenuCommand('设置', () => {
        window.dispatchEvent(new CustomEvent('blc-open-settings'));
    });

    // 注入UI样式
    GM_addStyle(`
        #blc-settings-panel { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; width: 450px; max-width: 90vw; height: 400px; max-height: 80vh; background: #fff; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); flex-direction: column; }
        .blc-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid #eee; flex-shrink: 0; }
        .blc-header h3 { margin: 0; font-size: 16px; }
        #blc-close-btn { font-size: 24px; cursor: pointer; color: #999; }
        .blc-add { display: flex; padding: 10px 15px; border-bottom: 1px solid #eee; flex-shrink: 0; }
        #blc-new-param { flex-grow: 1; border: 1px solid #ccc; border-radius: 4px; padding: 8px; margin-right: 10px; }
        #blc-add-btn, #blc-reset-btn { border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
        #blc-add-btn { background-color: #00a1d6; color: #fff; margin-right: 5px; }
        #blc-add-btn:hover { background-color: #00b5e5; }
        #blc-reset-btn { background-color: #f1f1f1; color: #333; border: 1px solid #ccc; }
        #blc-reset-btn:hover { background-color: #e0e0e0; }
        .blc-list { padding: 10px; overflow-y: auto; flex-grow: 1; display: flex; flex-wrap: wrap; align-content: flex-start; }
        .blc-param { display: inline-flex; align-items: center; background: #eef0f2; color: #333; padding: 5px 10px; border-radius: 15px; margin: 5px; font-size: 14px; }
        .blc-param span { margin-right: 8px; }
        .blc-delete { color: #999; cursor: pointer; font-weight: bold; font-size: 16px; }
        .blc-delete:hover { color: #ff4d4d; }
    `);

    // --- 2. 待注入的工作代码 ---
    // 此函数将转换为字符串并注入页面，以突破沙箱限制。
    // 注意：此函数内部无法直接调用 GM_* API。
    function injectedCode() {
        // 确保代码在注入后立即执行并拥有独立作用域
        (() => {
            // 通过注入时挂载在script标签上的data属性，获取初始配置
            const scriptTag = document.getElementById('blc-injected-script');
            const initialParams = JSON.parse(scriptTag.dataset.initialParams);
            const defaultParams = JSON.parse(scriptTag.dataset.defaultParams);

            const paramsToRemove = new Set(initialParams);

            // 向沙箱中的“加载器”发送保存请求
            function saveParams() {
                window.dispatchEvent(new CustomEvent('blc-save-params', {
                    detail: Array.from(paramsToRemove)
                }));
            }

            // --- 核心净化逻辑 ---
            function cleanUrl(urlString) {
                if (!urlString) return urlString;
                // 登录等重要功能页面不处理
                if (urlString.includes('passport.bilibili.com')) return urlString;
                try {
                    const url = new URL(urlString,window.location.href);
                    let modified = false;
                    const paramsToDelete = [];
                    for (const param of url.searchParams.keys()) {
                        if (paramsToRemove.has(param)) {
                            paramsToDelete.push(param);
                            modified = true;
                        }
                    }

                    if (modified) {
                        paramsToDelete.forEach(p => url.searchParams.delete(p));
                        return url.toString();
                    }
                    return urlString;
                } catch (e) {
                    // 如果URL解析失败，返回原始字符串
                    return urlString;
                }
            }

            // --- 事件净化策略 ---
            // 策略1: 鼠标悬停预处理，提升性能
            document.addEventListener('mouseover', event => {
                const link = event.target.closest('a[href]');
                if (link && !link.dataset.cleanedHref) {
                    const cleanedHref = cleanUrl(link.href);
                    if (link.href !== cleanedHref) {
                        link.dataset.cleanedHref = cleanedHref; // 缓存净化后的链接
                        link.href = cleanedHref;
                    }
                }
            }, true);

            // 策略2: 终极点击修复，拦截 mousedown/click/contextmenu 事件
            const finalClickFix = e => {
                const link = e.target.closest('a[href]');
                if (link) {
                    // 优先使用缓存，否则实时计算
                    const cleanedHref = link.dataset.cleanedHref || cleanUrl(link.href);
                    if (link.href !== cleanedHref) {
                        link.href = cleanedHref;
                    }
                    // 阻止B站脚本在点击事件的后续阶段（如mouseup）重新污染链接
                    e.stopImmediatePropagation();
                }
            };
            document.addEventListener('mousedown', finalClickFix, true);
            document.addEventListener('click', finalClickFix, true);
            document.addEventListener('contextmenu', finalClickFix, true);


            // --- 导航补丁 (用于处理SPA页面跳转) ---
            // 拦截 history API
            const originalPushState = history.pushState;
            history.pushState = function (state, title, url) {
                const cleanedUrl = cleanUrl(url ? url.toString() : '');
                return originalPushState.apply(this, [state, title, cleanedUrl]);
            };

            const originalReplaceState = history.replaceState;
            history.replaceState = function (state, title, url) {
                const cleanedUrl = cleanUrl(url ? url.toString() : '');
                return originalReplaceState.apply(this, [state, title, cleanedUrl]);
            };

            // 拦截 window.open
            const originalOpen = window.open;
            window.open = function (url, target, features) {
                const cleanedUrl = cleanUrl(url ? url.toString() : '');
                return originalOpen.apply(this, [cleanedUrl, target, features]);
            };

            // --- 懒加载设置面板 ---
            let settingsPanel = null;

            function createSettingsPanel() {
                if (settingsPanel) return;
                settingsPanel = document.createElement('div');
                settingsPanel.id = 'blc-settings-panel';
                document.body.appendChild(settingsPanel);

                settingsPanel.addEventListener('click', e => {
                    const targetId = e.target.id;
                    if (targetId === 'blc-close-btn') {
                        settingsPanel.style.display = 'none';
                    } else if (targetId === 'blc-add-btn') {
                        addParamsFromInput();
                    } else if (targetId === 'blc-reset-btn') {
                        if (confirm('确定要重置为默认列表吗？')) {
                            paramsToRemove.clear();
                            defaultParams.forEach(p => paramsToRemove.add(p));
                            saveParams();
                            renderPanelContent();
                        }
                    } else if (e.target.classList.contains('blc-delete')) {
                        const paramToDelete = e.target.dataset.param;
                        paramsToRemove.delete(paramToDelete);
                        saveParams();
                        renderPanelContent();
                    }
                });

                settingsPanel.addEventListener('keydown', e => {
                    if (e.key === 'Enter' && e.target.id === 'blc-new-param') {
                        addParamsFromInput();
                    }
                });
            }

            function renderPanelContent() {
                if (!settingsPanel) return;
                settingsPanel.innerHTML = `
                    <div class="blc-header"><h3>链接清理参数列表</h3><span id="blc-close-btn">&times;</span></div>
                    <div class="blc-add">
                        <input type="text" id="blc-new-param" placeholder="输入参数，用逗号,分隔批量添加"/>
                        <button id="blc-add-btn">添加</button>
                        <button id="blc-reset-btn">重置</button>
                    </div>
                    <div class="blc-list">
                        ${Array.from(paramsToRemove).sort().map(p => `
                            <div class="blc-param"><span>${p}</span><span class="blc-delete" data-param="${p}">&times;</span></div>
                        `).join('')}
                    </div>`;
                document.getElementById('blc-new-param').focus();
            }

            function addParamsFromInput() {
                const input = document.getElementById('blc-new-param');
                if (!input) return;
                const newParams = input.value.split(',').map(p => p.trim()).filter(p => p);
                if (newParams.length > 0) {
                    newParams.forEach(p => paramsToRemove.add(p));
                    saveParams();
                    input.value = '';
                    renderPanelContent();
                }
            }

            // --- 初始化 ---
            // 检查并清理当前页面URL，防止直接打开带参数的链接
            const currentUrl = window.location.href;
            const cleanedPageUrl = cleanUrl(currentUrl);
            if (currentUrl !== cleanedPageUrl) {
                history.replaceState(history.state, '', cleanedPageUrl);
            }

            // 监听来自“加载器”的打开设置请求
            window.addEventListener('blc-open-settings', () => {
                if (settingsPanel && settingsPanel.style.display !== 'none') {
                    settingsPanel.style.display = 'none';
                    return;
                }
                // 确保body存在后再创建UI
                if (!document.body) {
                    document.addEventListener('DOMContentLoaded', () => {
                        createSettingsPanel();
                        renderPanelContent();
                        settingsPanel.style.display = 'flex';
                    });
                } else {
                    createSettingsPanel();
                    renderPanelContent();
                    settingsPanel.style.display = 'flex';
                }
            });
        })();
    }

    // --- 3. 执行注入 ---
    const injectedScript = document.createElement('script');
    injectedScript.id = 'blc-injected-script';
    // 通过data属性将配置数据“携带”到页面环境
    injectedScript.dataset.initialParams = JSON.stringify(paramsToInject);
    injectedScript.dataset.defaultParams = JSON.stringify(DEFAULT_PARAMS);
    injectedScript.textContent = `(${injectedCode.toString()})();`;

    // 尽早注入脚本以抢占B站脚本的API
    (document.head || document.documentElement).appendChild(injectedScript);
    injectedScript.remove();

})();