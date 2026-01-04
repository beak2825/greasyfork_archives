// ==UserScript==
// @name         剪贴板守护 (v30.0 终极版)
// @name:en      Clipboard Guard (v30.0 Ultimate Edition)
// @namespace    https://tampermonkey.net/
// @version      30.0
// @description  Protects clipboard access with permission prompts and enhanced UI
// @author       WillArixq
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544717/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%AE%88%E6%8A%A4%20%28v300%20%E7%BB%88%E6%9E%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544717/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%AE%88%E6%8A%A4%20%28v300%20%E7%BB%88%E6%9E%81%E7%89%88%29.meta.js
// ==/UserScript==

/*
MIT License
Copyright (c) 2025 WillArixq
Licensed under the MIT License: https://opensource.org/licenses/MIT
Contact: X (https://x.com/sturverse9731), Email (sturverse@icloud.com)
*/
(async function() {
    'use strict';

    // --- [1] 全局配置 (增强) ---
    const CONFIG = {
        DEBUG_MODE: true,
        DEBOUNCE_MS: 150,
        PERMISSION_KEY_PREFIX: 'cb_perm_v12_',
        DIALOG_MAX_WIDTH: '90vw',
        TOAST_DURATION: 2500,
        THEME_KEY: 'cb_theme_v12',
        ACTIVE_KEY: 'cb_active_v12',
        STATUS_INDICATOR: true,
        AUTO_DENY_TIMEOUT: 18000 // 18 seconds
    };

    // --- [2] 日志系统 ---
    const Logger = {
        levels: { DEBUG: 1, INFO: 2, ERROR: 3 },
        currentLevel: CONFIG.DEBUG_MODE ? 1 : 2,
        log(level, ...args) {
            if (this.levels[level] >= this.currentLevel) {
                console[level.toLowerCase()](
                    `%c[守护 v30.0]`,
                    'background: #3949AB; color: #fff; padding: 2px 4px; border-radius: 4px;',
                    ...args
                );
            }
        },
        debug(...args) { this.log('DEBUG', ...args); },
        info(...args) { this.log('INFO', ...args); },
        error(...args) { this.log('ERROR', ...args); }
    };

    // --- [3] 国际化 ---
    const I18N = {
        zh: {
            title_read: '剪贴板"读取"请求',
            title_write: '剪贴板"写入"请求',
            batch_title: '批量剪贴板请求',
            deny_once: '拒绝',
            allow_once: '允许',
            deny_always: '永久禁止',
            allow_always: '永久允许',
            deny_all: '全部禁止',
            allow_all: '全部允许',
            source: '请求来源: <b>{hostname}</b>',
            preview: '预览 ({count} 字符)',
            batch_summary: '该网站在短时间内发起了 {write} 次写入{read}请求。',
            batch_preview: '以下为第一个写入请求的预览：',
            reset_permissions: '重置所有剪贴板权限',
            permission_saved: '权限设置已保存！',
            navigation_blocked: '请先处理剪贴板权限请求',
            toggle_on: '激活脚本',
            toggle_off: '禁用脚本',
            script_enabled: '剪贴板守护已激活',
            script_disabled: '剪贴板守护已禁用',
            theme_light: '切换至浅色主题',
            theme_dark: '切换至深色主题',
            theme_auto: '切换至自动主题'
        },
        en: {
            title_read: 'Clipboard "Read" Request',
            title_write: 'Clipboard "Write" Request',
            batch_title: 'Batch Clipboard Requests',
            deny_once: 'Deny',
            allow_once: 'Allow',
            deny_always: 'Permanently Deny',
            allow_always: 'Permanently Allow',
            deny_all: 'Deny All',
            allow_all: 'Allow All',
            source: 'Request from: <b>{hostname}</b>',
            preview: 'Preview ({count} characters)',
            batch_summary: 'This site initiated {write} write{read} requests in a short time.',
            batch_preview: 'Below is a preview of the first write request:',
            reset_permissions: 'Reset All Clipboard Permissions',
            permission_saved: 'Permission settings saved!',
            navigation_blocked: 'Please handle the clipboard permission request first',
            toggle_on: 'Enable Script',
            toggle_off: 'Disable Script',
            script_enabled: 'Clipboard guard is now enabled',
            script_disabled: 'Clipboard guard is now disabled',
            theme_light: 'Switch to Light Theme',
            theme_dark: 'Switch to Dark Theme',
            theme_auto: 'Switch to Auto Theme'
        }
    };

    const getLang = () => navigator.language.startsWith('zh') ? 'zh' : 'en';

    // --- [4] 图标 (增强) ---
    const ICONS = {
        shield: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
        copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
        checkmark: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>`,
        sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
        desktop: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
    };

    // --- [5] CSS 样式（模块化与极致美化） ---
    const CSS_VARIABLES = `
        :root {
            --cb-transition-speed: 0.4s;
            --cb-bg: rgba(255, 255, 255, 0.95);
            --cb-text: #1d1d1f;
            --cb-text-light: #6e6e73;
            --cb-title: #000;
            --cb-pre-bg: rgba(120, 120, 128, 0.08);
            --cb-btn-secondary-bg: rgba(120, 120, 128, 0.15);
            --cb-btn-secondary-bg-hover: rgba(120, 120, 128, 0.25);
            --cb-btn-primary-bg: linear-gradient(145deg, #007FFF, #006AE0);
            --cb-btn-primary-bg-hover: linear-gradient(145deg, #0088FF, #0070E0);
            --cb-btn-primary-text: #fff;
            --cb-btn-secondary-text: #007aff;
            --cb-btn-deny-text-hover: #ff3b30;
            --cb-overlay-bg: rgba(0, 0, 0, 0.4);
            --cb-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0,0,0,0.1);
            --cb-border: 1px solid rgba(255, 255, 255, 0.6);
            --cb-icon-color: #007aff;
            --cb-toast-bg: rgba(0, 0, 0, 0.75);
            --cb-toast-text: #fff;
            --cb-status-indicator-active: #28a745;
            --cb-status-indicator-inactive: #6c757d;
            --cb-handle-bg: rgba(120, 120, 128, 0.2);
        }
        .cb-sentinel-dark-theme {
            --cb-bg: rgba(28, 28, 30, 0.92);
            --cb-text: #f2f2f7;
            --cb-text-light: #8e8e93;
            --cb-title: #fff;
            --cb-pre-bg: rgba(120, 120, 128, 0.2);
            --cb-btn-secondary-bg: rgba(120, 120, 128, 0.25);
            --cb-btn-secondary-bg-hover: rgba(120, 120, 128, 0.35);
            --cb-btn-primary-bg: linear-gradient(145deg, #0A84FF, #0063C7);
            --cb-btn-primary-bg-hover: linear-gradient(145deg, #0B97FF, #0A73E0);
            --cb-btn-secondary-text: #0a84ff;
            --cb-btn-deny-text-hover: #ff453a;
            --cb-overlay-bg: rgba(0, 0, 0, 0.5);
            --cb-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255,255,255,0.1);
            --cb-border: 1px solid rgba(255, 255, 255, 0.1);
            --cb-icon-color: #0a84ff;
            --cb-toast-bg: rgba(0, 0, 0, 0.85);
            --cb-toast-text: #f2f2f7;
            --cb-handle-bg: rgba(120, 120, 128, 0.3);
        }
    `;

    const CSS_ANIMATIONS = `
        @keyframes enter { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes exit { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.95) translateY(10px); } }
        @keyframes wiggle { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @keyframes toast-enter { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toast-exit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }
        @keyframes status-pulse {
            0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        .is-wiggling { animation: wiggle 0.3s ease-in-out; }
        .is-pulsing { animation: status-pulse 1.5s infinite; }
    `;

    const CSS_LAYOUT = `
        .cb-sentinel-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--cb-overlay-bg); backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px); z-index: 2147483647;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; animation: enter var(--cb-transition-speed) cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transition: all var(--cb-transition-speed) ease;
        }
        .cb-sentinel-overlay.is-closing { animation: exit calc(var(--cb-transition-speed) * 0.75) cubic-bezier(0.7, 0, 0.84, 0) forwards; }
        .cb-sentinel-dialog {
            background-color: var(--cb-bg); color: var(--cb-text); padding: 24px;
            border-radius: 22px; box-shadow: var(--cb-shadow); max-width: min(400px, ${CONFIG.DIALOG_MAX_WIDTH});
            border: var(--cb-border); display: flex; flex-direction: column; gap: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all var(--cb-transition-speed) ease;
            opacity: 0; animation: enter var(--cb-transition-speed) cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
            position: relative;
        }
        .cb-sentinel-overlay.is-closing .cb-sentinel-dialog { animation: exit calc(var(--cb-transition-speed) * 0.75) cubic-bezier(0.7, 0, 0.84, 0) forwards; }
        .cb-dialog-handle {
            position: absolute; top: 0; left: 0; right: 0;
            height: 30px; cursor: move; border-radius: 22px 22px 0 0;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.2s ease;
        }
        .cb-dialog-handle:hover { opacity: 1; background-color: var(--cb-handle-bg); }
        .cb-header, .cb-origin { display: flex; align-items: center; justify-content: center; gap: 10px; text-align: center; }
        .cb-header .icon, .cb-origin .icon { display: inline-flex; align-items: center; justify-content: center; }
        .cb-header .icon { color: var(--cb-icon-color); transition: color var(--cb-transition-speed) ease; }
        .cb-header h3 { margin: 0; color: var(--cb-title); font-size: 19px; font-weight: 600; transition: color var(--cb-transition-speed) ease; }
        .cb-origin { color: var(--cb-text-light); font-size: 13.5px; line-height: 1.4; background: var(--cb-pre-bg); padding: 8px 14px; border-radius: 12px; transition: all var(--cb-transition-speed) ease; }
        .cb-origin b { font-weight: 500; color: var(--cb-text); }
        .cb-content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: -8px; padding: 0 4px; }
        .cb-content-header span { font-size: 12px; color: var(--cb-text-light); }
        .cb-copy-button { background: none; border: none; cursor: pointer; color: var(--cb-text-light); padding: 4px; border-radius: 4px; transition: all 0.2s ease; }
        .cb-copy-button:hover { background: var(--cb-btn-secondary-bg); color: var(--cb-icon-color); }
        .cb-sentinel-dialog pre {
            background-color: var(--cb-pre-bg); border: none; padding: 12px; color: var(--cb-text);
            border-radius: 10px; max-height: 140px; overflow-y: auto; text-align: left;
            white-space: pre-wrap; word-break: break-all; font-size: 13px; font-family: "SF Mono", "Menlo", monospace;
            transition: all var(--cb-transition-speed) ease;
        }
        .cb-sentinel-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
        .cb-button-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .cb-button-separator { height: 1px; background-color: rgba(120,120,128,0.16); margin: 4px 0; }
        .cb-sentinel-buttons button {
            padding: 13px 0; border-radius: 12px; border: none; cursor: pointer;
            font-size: 16px; font-weight: 500; transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .cb-sentinel-buttons button:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .cb-sentinel-buttons button:active { transform: scale(0.97); filter: brightness(0.95); box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); }
        .cb-sentinel-buttons button:focus { outline: 2px solid var(--cb-icon-color); outline-offset: 2px; }
        .cb-sentinel-buttons .secondary { background-color: var(--cb-btn-secondary-bg); color: var(--cb-btn-secondary-text); }
        .cb-sentinel-buttons .secondary:hover { background-color: var(--cb-btn-secondary-bg-hover); }
        .cb-sentinel-buttons .primary { background-image: var(--cb-btn-primary-bg); color: var(--cb-btn-primary-text); font-weight: 600; }
        .cb-sentinel-buttons .primary:hover { background-image: var(--cb-btn-primary-bg-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,123,255,0.3); }
        .cb-sentinel-buttons .deny_always:hover { color: var(--cb-btn-deny-text-hover); }
        .cb-toast {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: var(--cb-toast-bg); color: var(--cb-toast-text); padding: 10px 18px;
            border-radius: 10px; font-size: 14px; z-index: 2147483648;
            opacity: 0; animation: toast-enter 0.3s ease forwards;
        }
        .cb-toast.is-closing { animation: toast-exit 0.3s ease forwards; }
        .cb-status-indicator {
            position: fixed; bottom: 15px; right: 15px; width: 36px; height: 36px;
            background-color: var(--cb-bg); border-radius: 50%; z-index: 2147483646;
            display: flex; justify-content: center; align-items: center;
            box-shadow: var(--cb-shadow); border: var(--cb-border);
            cursor: pointer; transition: all 0.2s ease;
        }
        .cb-status-indicator:hover { transform: translateY(-2px); box-shadow: var(--cb-shadow); }
        .cb-status-indicator .icon {
            color: var(--cb-status-indicator-inactive);
            transition: color 0.2s ease;
        }
        .cb-status-indicator.is-active .icon {
            color: var(--cb-status-indicator-active);
        }
    `;

    // 异步加载 CSS
    const loadCSS = () => GM_addStyle(`${CSS_VARIABLES}${CSS_ANIMATIONS}${CSS_LAYOUT}`);
    requestAnimationFrame(loadCSS);

    // --- [6] 工具函数 ---
    const escape = (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const showToast = (message) => {
        const existingToast = document.querySelector('.cb-toast');
        if (existingToast) existingToast.remove();
        const toast = document.createElement('div');
        toast.className = 'cb-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('is-closing');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        }, CONFIG.TOAST_DURATION);
    };

    // --- [7] 导航锁模块 ---
    const NavigationLocker = {
        isLocked: false,
        activate() { this.isLocked = true; },
        deactivate() { this.isLocked = false; }
    };

    const handleWindowEvents = (e) => {
        if (!NavigationLocker.isLocked || e.target.closest('.cb-sentinel-overlay')) return;

        if (e.type === 'beforeunload') {
            e.preventDefault();
            e.returnValue = I18N[getLang()].navigation_blocked;
            return e.returnValue;
        }

        if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
            const dialog = activeDialog?.querySelector('.cb-sentinel-dialog');
            if (dialog) {
                dialog.classList.add('is-wiggling');
                dialog.addEventListener('animationend', () => dialog.classList.remove('is-wiggling'), { once: true });
                showToast(I18N[getLang()].navigation_blocked);
            }
        }
    };

    // --- [8] 对话框管理器 ---
    const DialogManager = {
        close() {
            if (activeDialog) {
                const overlay = activeDialog;
                overlay.classList.add('is-closing');
                overlay.addEventListener('animationend', () => {
                    overlay.remove();
                    if (activeDialog === overlay) activeDialog = null;
                }, { once: true });
                NavigationLocker.deactivate();
            }
        },

        create(options) {
            this.close();
            NavigationLocker.activate();
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.className = 'cb-sentinel-overlay';
                activeDialog = overlay;

                const dialog = document.createElement('div');
                dialog.className = 'cb-sentinel-dialog';
                dialog.innerHTML = options.html;

                const handleButtonClick = (e) => {
                    const button = e.target.closest('button[data-value]');
                    if (button) {
                        resolve(button.dataset.value);
                        this.close();
                        return;
                    }
                };

                const handleCopyClick = (e) => {
                    const copyButton = e.target.closest('.cb-copy-button');
                    if (copyButton) {
                        const contentNode = dialog.querySelector('pre');
                        if (contentNode) {
                            GM_setClipboard(contentNode.textContent, 'text/plain');
                            copyButton.innerHTML = ICONS.checkmark;
                            copyButton.disabled = true;
                            setTimeout(() => {
                                copyButton.innerHTML = ICONS.copy;
                                copyButton.disabled = false;
                            }, 1500);
                        }
                    }
                };

                const handleKeydown = (e) => {
                    if (e.key === 'Enter') {
                        const denyButton = dialog.querySelector('.deny_once');
                        if (denyButton) {
                            resolve(denyButton.dataset.value);
                            this.close();
                        }
                    } else if (e.key === 'Escape') {
                        resolve('deny_once');
                        this.close();
                    }
                };

                dialog.addEventListener('click', handleButtonClick);
                dialog.addEventListener('click', handleCopyClick);
                dialog.addEventListener('keydown', handleKeydown);
                dialog.tabIndex = 0;
                overlay.appendChild(dialog);
                (document.body || document.documentElement).appendChild(overlay);
                dialog.focus();

                const applyTheme = (theme) => {
                    if (theme === 'dark') {
                        overlay.classList.add('cb-sentinel-dark-theme');
                    } else if (theme === 'light') {
                        overlay.classList.remove('cb-sentinel-dark-theme');
                    } else {
                        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
                        overlay.classList.toggle('cb-sentinel-dark-theme', darkThemeMq.matches);
                    }
                };
                GM_getValue(CONFIG.THEME_KEY, 'auto').then(applyTheme);
            });
        }
    };

    // --- [9] 核心逻辑 ---
    let activeDialog = null;
    let requestQueue = [];

    const buildContentPreviewHTML = (content, lang) => {
        if (!content) return '';
        const charCount = content.length;
        return `<div class="cb-content-header"><span>${lang.preview.replace('{count}', charCount)}</span><button class="cb-copy-button" title="${lang.preview}">${ICONS.copy}</button></div><pre>${escape(content)}</pre>`;
    };

    const buildDialogHeaderHTML = (title, hostname, lang) => `
        <div class="cb-dialog-handle"></div>
        <div class="cb-header"><span class="icon">${ICONS.shield}</span><h3>${title}</h3></div>
        <div class="cb-origin"><span class="icon">${ICONS.globe}</span><span>${lang.source.replace('{hostname}', hostname)}</span></div>
    `;

    const buildSingleRequestDialogHTML = (hostname, type, content) => {
        const lang = I18N[getLang()];
        const title = lang[`title_${type}`];
        const contentHTML = type === 'write' ? buildContentPreviewHTML(content, lang) : '';
        return `
            ${buildDialogHeaderHTML(title, hostname, lang)}
            ${contentHTML}
            <div class="cb-sentinel-buttons">
                <button class="primary deny_once" data-value="deny_once" title="${lang.deny_once}">${lang.deny_once}</button>
                <div class="cb-button-separator"></div>
                <button class="secondary deny_always" data-value="deny_always" title="${lang.deny_always}">${lang.deny_always}</button>
            </div>`;
    };

    const buildBatchRequestDialogHTML = (hostname, requests) => {
        const lang = I18N[getLang()];
        const writeCount = requests.filter(r => r.type === 'write').length;
        const readCount = requests.filter(r => r.type === 'read').length;
        let summary = lang.batch_summary.replace('{write}', writeCount > 0 ? ` <b>${writeCount}</b>` : '');
        summary = summary.replace('{read}', readCount > 0 ? `${writeCount > 0 ? ' and ' : ''} <b>${readCount}</b>` : '');

        const writeRequests = requests.filter(r => r.type === 'write');
        let previewsHTML = '';
        if (writeRequests.length > 0) {
            previewsHTML = `
                <p style="font-size:12px;text-align:center;color:var(--cb-text-light);margin-top:-10px;">${lang.batch_preview}</p>
                ${writeRequests.map(req => buildContentPreviewHTML(req.content, lang)).join('')}
            `;
        }

        return `
            ${buildDialogHeaderHTML(lang.batch_title, hostname, lang)}
            <p style="text-align:center; padding: 10px 0; color:var(--cb-text-light);">${summary}</p>
            ${previewsHTML}
            <div class="cb-sentinel-buttons" style="grid-template-columns: 1fr; display: grid;">
                <button class="primary" data-value="allow_all" title="${I18N[getLang()].allow_all}">${I18N[getLang()].allow_all}</button>
                <button class="secondary deny_all" data-value="deny_all" title="${I18N[getLang()].deny_all}">${I18N[getLang()].deny_all}</button>
            </div>`;
    };

    const processRequestQueue = async () => {
        if (requestQueue.length === 0 || activeDialog) return;

        const isEnabled = await GM_getValue(CONFIG.ACTIVE_KEY, true);

        if (!isEnabled) {
            Logger.info('脚本已禁用，请求直接通过。');
            requestQueue.forEach(req => req.executor().then(req.resolve).catch(req.reject));
            requestQueue = [];
            return;
        }

        try {
            const hostname = unsafeWindow.location.hostname;
            const requestsToProcess = [...requestQueue];
            requestQueue = [];

            const firstRequest = requestsToProcess[0];
            const permissionKey = `${CONFIG.PERMISSION_KEY_PREFIX}${hostname}_${firstRequest.type}`;
            const storedPermission = await GM_getValue(permissionKey);

            if (storedPermission === 'deny') {
                Logger.info('检测到永久禁止权限，自动拒绝请求。');
                requestsToProcess.forEach(req => req.reject(new DOMException('Clipboard access permanently denied by user.', 'NotAllowedError')));
                return;
            }
            if (storedPermission === 'allow') {
                Logger.info('检测到永久允许权限，自动允许请求。');
                requestsToProcess.forEach(req => req.executor().then(req.resolve).catch(req.reject));
                return;
            }

            const html = requestsToProcess.length === 1
                ? buildSingleRequestDialogHTML(hostname, firstRequest.type, firstRequest.content)
                : buildBatchRequestDialogHTML(hostname, requestsToProcess);

            const userChoice = await DialogManager.create({ html });

            let shouldDeny = false;

            switch (userChoice) {
                case 'deny_always':
                    await GM_setValue(permissionKey, 'deny');
                    shouldDeny = true;
                    showToast(I18N[getLang()].permission_saved);
                    break;
                case 'deny_once':
                case 'deny_all':
                    shouldDeny = true;
                    break;
                case 'allow_all':
                    await GM_setValue(permissionKey, 'allow');
                    shouldDeny = false;
                    showToast(I18N[getLang()].permission_saved);
                    break;
                default:
                    shouldDeny = true;
                    break;
            }

            if (shouldDeny) {
                requestsToProcess.forEach(req => req.reject(new DOMException('Clipboard access denied by user.', 'NotAllowedError')));
            } else {
                requestsToProcess.forEach(req => req.executor().then(req.resolve).catch(req.reject));
            }
        } catch (e) {
            Logger.error('处理请求队列时出错:', e);
            requestQueue.forEach(req => req.reject(new DOMException('Internal error in request queue.', 'AbortError')));
            requestQueue = [];
        }
    };

    const enqueueRequest = (requestDetails) => {
        return new Promise((resolve, reject) => {
            requestQueue.push({ ...requestDetails, resolve, reject });
            processRequestQueue();
        });
    };

    // --- [10] 拦截钩子模块 ---
    let originalClipboard = null;
    let originalExecCommand = null;

    const applyguardHooks = async () => {
        if (unsafeWindow.navigator.clipboard?.isguard) return;
        originalClipboard = originalClipboard || unsafeWindow.navigator.clipboard || {};
        originalExecCommand = originalExecCommand || unsafeWindow.document.execCommand;

        const clipboardProxy = new Proxy(originalClipboard, {
            get(target, prop) {
                if (!isScriptActive) {
                    return Reflect.get(target, prop);
                }

                if (['readText', 'read', 'writeText', 'write'].includes(prop) && target[prop]) {
                    return async function(...args) {
                        const type = prop.includes('read') ? 'read' : 'write';
                        const content = (prop === 'writeText' && args[0]) || (prop === 'write' && args[0]?.toString()) || null;

                        if (prop === 'writeText' && GM_setClipboard) {
                            const executor = () => {
                                GM_setClipboard(content, 'text/plain');
                                return Promise.resolve(content);
                            };
                            return enqueueRequest({ type, content, executor });
                        }

                        const executor = () => Reflect.apply(target[prop], target, args);
                        return enqueueRequest({ type, content, executor });
                    };
                }
                if (prop === 'isguard') return true;
                return Reflect.get(target, prop);
            }
        });

        Object.defineProperty(unsafeWindow.navigator, 'clipboard', { value: clipboardProxy, writable: true, configurable: true });

        if (originalExecCommand) {
            if (unsafeWindow.document.execCommand?.isguard) return;
            const execCommandOverride = function(cmd, ...args) {
                const isEnabled = isScriptActive;

                if (!isEnabled) {
                    return Reflect.apply(originalExecCommand, unsafeWindow.document, [cmd, ...args]);
                }

                const command = cmd.toLowerCase();
                if (['copy', 'cut', 'paste'].includes(command)) {
                    const type = command === 'paste' ? 'read' : 'write';
                    const content = type === 'write' ? unsafeWindow.getSelection()?.toString() : null;
                    const executor = () => Promise.resolve(Reflect.apply(originalExecCommand, unsafeWindow.document, [cmd, ...args]));
                    return enqueueRequest({ type, content, executor });
                }
                return Reflect.apply(originalExecCommand, unsafeWindow.document, [cmd, ...args]);
            };
            execCommandOverride.isguard = true;
            Object.defineProperty(unsafeWindow.document, 'execCommand', { value: execCommandOverride, writable: true, configurable: true });
        }
    };

    const clipboardEventListener = async (e) => {
        if (!(await GM_getValue(CONFIG.ACTIVE_KEY, true))) return;

        e.preventDefault();
        const type = e.type === 'paste' ? 'read' : 'write';
        const content = type === 'write' ? unsafeWindow.getSelection()?.toString() : null;
        enqueueRequest({
            type,
            content,
            executor: () => {
                const event = new Event(e.type, { bubbles: true, cancelable: true });
                window.dispatchEvent(event);
                return Promise.resolve();
            }
        });
    };

    // --- [11] 状态指示器模块 ---
    const StatusIndicator = {
        element: null,
        async init() {
            if (!CONFIG.STATUS_INDICATOR || document.querySelector('.cb-status-indicator')) return;
            this.element = document.createElement('div');
            this.element.className = 'cb-status-indicator';
            this.element.innerHTML = `<span class="icon">${ICONS.shield}</span>`;
            this.element.addEventListener('click', () => {
                showToast('Clipboard guard');
            });
            document.body.appendChild(this.element);
            this.updateStatus();
        },
        async updateStatus() {
            if (!this.element) return;
            const isActive = await GM_getValue(CONFIG.ACTIVE_KEY, true);
            this.element.classList.toggle('is-active', isActive);
            this.element.title = isActive ? I18N[getLang()].script_enabled : I18N[getLang()].script_disabled;
        }
    };

    // --- [12] 初始化与监控 ---
    let isScriptActive;

    const toggleScript = async () => {
        isScriptActive = !isScriptActive;
        await GM_setValue(CONFIG.ACTIVE_KEY, isScriptActive);
        showToast(isScriptActive ? I18N[getLang()].script_enabled : I18N[getLang()].script_disabled);
        StatusIndicator.updateStatus();
        updateMenuCommands();
    };

    const updateMenuCommands = () => {
        GM_registerMenuCommand(I18N[getLang()].reset_permissions, async () => {
            const keys = await GM_listValues();
            for (const key of keys) {
                if (key.startsWith(CONFIG.PERMISSION_KEY_PREFIX)) {
                    await GM_deleteValue(key);
                }
            }
            showToast(I18N[getLang()].reset_permissions);
        });

        GM_registerMenuCommand(isScriptActive ? I18N[getLang()].toggle_off : I18N[getLang()].toggle_on, toggleScript);

        GM_registerMenuCommand(I18N[getLang()].theme_auto, async () => {
            await GM_setValue(CONFIG.THEME_KEY, 'auto');
            showToast(`Theme set to Auto.`);
        });
        GM_registerMenuCommand(I18N[getLang()].theme_light, async () => {
            await GM_setValue(CONFIG.THEME_KEY, 'light');
            showToast(`Theme set to Light.`);
        });
        GM_registerMenuCommand(I18N[getLang()].theme_dark, async () => {
            await GM_setValue(CONFIG.THEME_KEY, 'dark');
            showToast(`Theme set to Dark.`);
        });
    };

    // 注册核心事件监听器
    isScriptActive = await GM_getValue(CONFIG.ACTIVE_KEY, true);
    applyguardHooks();

    window.addEventListener('copy', clipboardEventListener, true);
    window.addEventListener('cut', clipboardEventListener, true);
    window.addEventListener('paste', clipboardEventListener, true);
    window.addEventListener('click', handleWindowEvents, { capture: true });
    window.addEventListener('submit', handleWindowEvents, { capture: true });
    window.addEventListener('beforeunload', handleWindowEvents, { capture: true });
    window.addEventListener('popstate', handleWindowEvents, { capture: true });

    // 监听DOM变化，确保钩子保持激活
    if (document.body) {
        const observer = new MutationObserver(() => {
            if (!unsafeWindow.navigator.clipboard?.isguard || !unsafeWindow.document.execCommand?.isguard) {
                Logger.debug('检测到DOM变化，重新应用钩子。');
                applyguardHooks();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('unload', () => observer.disconnect());
    }

    // 注册菜单命令
    updateMenuCommands();

    // 初始化状态指示器
    if (CONFIG.STATUS_INDICATOR) {
        document.addEventListener('DOMContentLoaded', () => {
            StatusIndicator.init();
        });
    }

    Logger.info('剪贴板守护初始化完成。');
})();