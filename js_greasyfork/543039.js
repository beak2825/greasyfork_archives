// ==UserScript==
// @name         GitHub Proxy Redirector | GitHub 代理自动选择
// @namespace    https://github.com/DingerBtn/GithubAutoProxy
// @version      2.0
// @description  自动代理GitHub链接，支持自定义代理服务器和域名
// @author       DingerBtn
// @homepage     https://github.com/DingerBtn/GithubAutoProxy
// @license      GPL-3.0
// @match        *://github.com/*
// @match        *://gist.github.com/*
// @match        *://raw.githubusercontent.com/*
// @match        *://*.github.io/*
// @match        *://githubassets.com/*
// @match        *://github.dev/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://github.githubassets.com/favicons/favicon.png
// @thanks       https://github.akams.cn/
// @downloadURL https://update.greasyfork.org/scripts/543039/GitHub%20Proxy%20Redirector%20%7C%20GitHub%20%E4%BB%A3%E7%90%86%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/543039/GitHub%20Proxy%20Redirector%20%7C%20GitHub%20%E4%BB%A3%E7%90%86%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 只在 github 相关域名下启用脚本
    const GITHUB_DOMAINS = [
        'github.com',
        'gist.github.com',
        'raw.githubusercontent.com',
        'github.io',
        'githubassets.com',
        'github.dev'
    ];
    const isGithubSite = GITHUB_DOMAINS.some(domain => {
        const host = window.location.hostname.toLowerCase();
        return host === domain || host.endsWith('.' + domain);
    });
    if (!isGithubSite) return;

    // ========== 默认配置 ==========
    const DEFAULT_DOMAINS = [
        "github.com",
        "gist.github.com",
        "raw.githubusercontent.com",
        "github.io",
        "githubassets.com",
        "github.dev"
    ];
    const DEFAULT_CONFIG = {
        enabled: true,
        proxyList: [
            { id: 1, name: "默认代理", prefix: "https://github.akams.cn/", active: true, domains: [...DEFAULT_DOMAINS] }
        ]
    };

    // ========== 配置管理 ==========
    let config = GM_getValue('proxyConfig', DEFAULT_CONFIG);

    // 保证配置结构完整
    if (!config.proxyList) config.proxyList = DEFAULT_CONFIG.proxyList;
    if (typeof config.enabled !== 'boolean') config.enabled = DEFAULT_CONFIG.enabled;
    // 兼容老配置
    if (config.proxyList && config.proxyList.length > 0 && !config.proxyList[0].domains) {
        const oldDomains = config.targetDomains || DEFAULT_DOMAINS;
        config.proxyList.forEach(p => p.domains = [...oldDomains]);
        delete config.targetDomains;
    }

    const saveConfig = () => GM_setValue('proxyConfig', config);
    const getActiveProxy = () => config.proxyList.find(p => p.active) || config.proxyList[0];

    // ========== 代理核心 ==========
    // 只代理特定类型的 GitHub 链接
    const shouldProxy = (url) => {
        if (!config.enabled) return false;
        if (!url) return false;
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();
            const path = u.pathname;
            // 1. 分支源码
            if (host === 'github.com' &&
                (/\/archive\/(master\.zip|main\.zip|[\w.-]+\.(zip|tar\.gz))$/.test(path))) {
                return true;
            }
            // 2. release源码
            if (host === 'github.com' &&
                /\/archive\/(v[\w.-]+\.(zip|tar\.gz))$/.test(path)) {
                return true;
            }
            // 3. release文件
            if (host === 'github.com' &&
                /\/releases\/download\//.test(path)) {
                return true;
            }
            // 4. commit文件
            if (host === 'github.com' &&
                /\/blob\/[\w\d]+\//.test(path)) {
                return true;
            }
            // 5. gist
            if (host === 'gist.githubusercontent.com' &&
                /\/raw\//.test(path)) {
                return true;
            }
            // 6. api
            if (host === 'api.github.com') {
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const proxyUrl = (original) => {
        const proxyPrefix = getActiveProxy().prefix;
        if (original.startsWith(proxyPrefix)) return original;
        return proxyPrefix + original;
    };

    // ========== 代理逻辑 ==========
    // 1. 拦截a标签点击
    document.addEventListener('click', event => {
        const link = event.target.closest && event.target.closest('a');
        if (!link || !shouldProxy(link.href)) return;
        // 忽略新窗口/标签页
        if (event.ctrlKey || event.shiftKey || event.metaKey || event.button !== 0) return;
        event.preventDefault();
        window.location.href = proxyUrl(link.href);
    }, true);

    // 2. 拦截AJAX请求
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (shouldProxy(url)) {
            arguments[1] = proxyUrl(url);
        }
        return originalOpen.apply(this, arguments);
    };

    // 3. 处理动态内容
    const processLinks = () => {
        document.querySelectorAll('a[href]').forEach(link => {
            if (shouldProxy(link.href) && !link.dataset.proxied) {
                link.dataset.proxied = true;
                // 防止右键菜单直接跳转
                link.addEventListener('click', e => {
                    if (e.ctrlKey || e.shiftKey || e.metaKey || e.button !== 0) return;
                    e.preventDefault();
                    window.location.href = proxyUrl(link.href);
                });
            }
        });
    };

    // 4. 监听DOM变化
    const observer = new MutationObserver(processLinks);
    window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
        processLinks();
    });

    // 5. 处理页面初始加载
    window.addEventListener('load', processLinks);

    // ========== 设置界面 ========== 
    function createSettingsUI() {
        GM_addStyle(`
            /* 脚本名称样式 */
            .settings-title { font-size: 18px; font-weight: 600; }
            .manage-domains-btn {
                background: #0366d6;
                color: #fff;
                border: none;
                border-radius: 4px;
                padding: 6px 14px;
                font-size: 14px;
                margin-left: 14px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .manage-domains-btn:hover {
                background: #024fa2;
            }
            .proxy-domains {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin: 6px 0 0 0;
            }
            .proxy-domain-tag {
                background: #f1f8ff;
                border: 1px solid #c8e1ff;
                border-radius: 4px;
                padding: 2px 7px;
                font-size: 12px;
                display: flex;
                align-items: center;
            }
            .remove-proxy-domain {
                margin-left: 4px;
                cursor: pointer;
                color: #cb2431;
            }
            .add-proxy-domain {
                display: flex;
                margin-top: 4px;
            }
            .add-proxy-domain-input {
                flex: 1;
                padding: 4px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
            }
            .add-proxy-domain-btn {
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 10px;
                margin-left: 6px;
                cursor: pointer;
            }
            .proxy-settings {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: system-ui, sans-serif;
                color: #333;
            }
            .settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .settings-title {
                font-size: 18px;
                font-weight: 600;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
            }
            .section-title {
                margin: 15px 0 8px 0;
                font-weight: 500;
                color: #0366d6;
                font-size: 15px;
            }
            .proxy-list {
                margin: 10px 0;
            }
            .proxy-item {
                display: flex;
                align-items: center;
                padding: 8px;
                border: 1px solid #eee;
                border-radius: 4px;
                margin-bottom: 8px;
            }
            .proxy-radio {
                margin-right: 10px;
            }
            .proxy-input {
                flex: 1;
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            .domain-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 10px 0;
            }
            .domain-tag {
                background: #f1f8ff;
                border: 1px solid #c8e1ff;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 13px;
                display: flex;
                align-items: center;
            }
            .remove-domain {
                margin-left: 6px;
                cursor: pointer;
                color: #cb2431;
            }
            .add-domain {
                display: flex;
                margin-top: 10px;
            }
            .domain-input {
                flex: 1;
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            .add-btn {
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                margin-left: 8px;
                cursor: pointer;
            }
            .save-btn {
                background: #0366d6;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                width: 100%;
                margin-top: 15px;
                font-weight: 500;
                cursor: pointer;
            }
        `);

        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'proxy-settings';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <div class="settings-title">GitHub 代理选择</div>
                <button class="close-btn">×</button>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 15px;">
                    <input type="checkbox" id="proxyEnabled" ${config.enabled ? 'checked' : ''}>
                    <span>启用代理</span>
                </label>
            </div>
            <div class="section-title">代理服务器</div>
            <div class="proxy-list" id="proxyList"></div>
            <div class="section-title">目标域名</div>
            <div class="domain-list" id="domainList"></div>
            <div class="add-domain">
                <input type="text" class="domain-input" id="newDomain" placeholder="添加新域名 (如: github.com)">
                <button class="add-btn" id="addDomainBtn">+ 添加</button>
            </div>
            <button class="save-btn" id="saveConfigBtn">保存设置</button>
        `;
        document.body.appendChild(settingsPanel);

        // 关闭按钮
        settingsPanel.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(settingsPanel);
        });

        // 渲染代理服务器列表
        const renderProxyList = () => {
            const container = settingsPanel.querySelector('#proxyList');
            container.innerHTML = '';
            config.proxyList.forEach(proxy => {
                const proxyItem = document.createElement('div');
                proxyItem.className = 'proxy-item';
                proxyItem.innerHTML = `
                    <input type="radio" name="activeProxy" class="proxy-radio"
                           ${proxy.active ? 'checked' : ''} data-id="${proxy.id}">
                    <input type="text" class="proxy-input" value="${proxy.prefix}"
                           data-id="${proxy.id}" placeholder="https://代理地址/">
                    <button class="manage-domains-btn" data-id="${proxy.id}">管理域名</button>
                `;
                container.appendChild(proxyItem);
            });
        };

        // 域名管理弹窗
        function openDomainManager(proxyId) {
            const proxy = config.proxyList.find(p => p.id === proxyId);
            if (!proxy) return;
            let modal = document.createElement('div');
            modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:10000;display:flex;align-items:center;justify-content:center;';
            modal.innerHTML = `
                <div style="background:#fff;padding:24px 28px;border-radius:10px;min-width:340px;max-width:90vw;box-shadow:0 4px 16px rgba(0,0,0,0.18);">
                    <div style="font-size:17px;font-weight:600;margin-bottom:12px;">管理代理域名</div>
                    <div id="domain-list-modal" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;"></div>
                    <div style="display:flex;gap:8px;">
                        <input id="add-domain-modal-input" type="text" placeholder="添加域名 (如: github.com)" style="flex:1;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:14px;">
                        <button id="add-domain-modal-btn" style="background:#28a745;color:#fff;border:none;border-radius:4px;padding:6px 14px;cursor:pointer;">+ 添加</button>
                    </div>
                    <div style="text-align:right;margin-top:18px;">
                        <button id="close-domain-modal-btn" style="background:#0366d6;color:#fff;border:none;border-radius:4px;padding:7px 18px;font-size:15px;cursor:pointer;">完成</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const renderModalList = () => {
                const list = modal.querySelector('#domain-list-modal');
                list.innerHTML = '';
                proxy.domains.forEach(domain => {
                    const tag = document.createElement('div');
                    tag.style = 'background:#f1f8ff;border:1px solid #c8e1ff;border-radius:4px;padding:4px 10px;font-size:13px;display:flex;align-items:center;';
                    tag.innerHTML = `${domain}<span data-domain="${domain}" style="margin-left:6px;cursor:pointer;color:#cb2431;font-size:15px;">×</span>`;
                    tag.querySelector('span').onclick = () => {
                        proxy.domains = proxy.domains.filter(d => d !== domain);
                        renderModalList();
                        renderProxyDomainsSelect(proxy);
                    };
                    list.appendChild(tag);
                });
            };
            renderModalList();
            modal.querySelector('#add-domain-modal-btn').onclick = () => {
                const input = modal.querySelector('#add-domain-modal-input');
                const domain = input.value.trim().toLowerCase();
                if (domain && !proxy.domains.includes(domain)) {
                    proxy.domains.push(domain);
                    input.value = '';
                    renderModalList();
                    renderProxyDomainsSelect(proxy);
                }
            };
            modal.querySelector('#close-domain-modal-btn').onclick = () => {
                document.body.removeChild(modal);
            };
        }

        // 渲染域名列表
        const renderDomainList = () => {
            const container = settingsPanel.querySelector('#domainList');
            container.innerHTML = '';
            config.targetDomains.forEach(domain => {
                const domainTag = document.createElement('div');
                domainTag.className = 'domain-tag';
                domainTag.innerHTML = `
                    ${domain}
                    <span class="remove-domain" data-domain="${domain}">×</span>
                `;
                container.appendChild(domainTag);
            });
        };

        // 初始渲染
        renderProxyList();

        // 代理服务器单选、域名选择、管理域名按钮
        settingsPanel.addEventListener('change', e => {
            if (e.target.classList.contains('proxy-radio')) {
                const id = parseInt(e.target.dataset.id);
                config.proxyList.forEach(p => p.active = (p.id === id));
            }
            if (e.target.classList.contains('proxy-domain-checkbox')) {
                const id = parseInt(e.target.dataset.id);
                const domain = e.target.dataset.domain;
                const proxy = config.proxyList.find(p => p.id === id);
                if (!proxy) return;
                if (e.target.checked) {
                    if (!proxy.domains.includes(domain)) proxy.domains.push(domain);
                } else {
                    proxy.domains = proxy.domains.filter(d => d !== domain);
                }
            }
        });
        settingsPanel.addEventListener('click', e => {
            if (e.target.classList.contains('manage-domains-btn')) {
                const id = parseInt(e.target.dataset.id);
                openDomainManager(id);
            }
        });

        // 兼容保留原有域名管理（可选：如不需要可移除）
        // settingsPanel.querySelector('#addDomainBtn').addEventListener('click', ...)
        // settingsPanel.addEventListener('click', ...)

        // 启用/禁用代理
        settingsPanel.querySelector('#proxyEnabled').addEventListener('change', e => {
            config.enabled = e.target.checked;
        });

        // 保存配置
        settingsPanel.querySelector('#saveConfigBtn').addEventListener('click', () => {
            saveConfig();
            alert('设置已保存！页面将刷新应用更改');
            location.reload();
        });
    }

    // ========== 菜单与按钮 ==========
    GM_registerMenuCommand("GitHub 代理设置", createSettingsUI);

    // 页面右下角设置按钮
    function createSettingsButton() {
        const btn = document.createElement('button');
        btn.innerHTML = config.enabled ? '⚙️' : '⚙️❌';
        btn.title = config.enabled ? 'GitHub 代理已启用' : 'GitHub 代理已禁用';
        btn.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #0366d6;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        btn.addEventListener('click', createSettingsUI);
        document.body.appendChild(btn);
    }
    // 仅在 github 相关域名下插入设置按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSettingsButton);
    } else {
        createSettingsButton();
    }
})();