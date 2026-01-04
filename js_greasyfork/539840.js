// ==UserScript==
// @name         【v7.6 · 回归初心最终版】全局字体与RTL自适应
// @namespace    http://tampermonkey.net/
// @version     7.6
// @license MIT
// @description  【回归本源】放弃复杂的祖先查找，回归简单直接的元素处理，确保LI和它的父容器OL/UL都被正确设置RTL。
// @author       YourName & AI Assistant
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539840/%E3%80%90v76%20%C2%B7%20%E5%9B%9E%E5%BD%92%E5%88%9D%E5%BF%83%E6%9C%80%E7%BB%88%E7%89%88%E3%80%91%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93%E4%B8%8ERTL%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/539840/%E3%80%90v76%20%C2%B7%20%E5%9B%9E%E5%BD%92%E5%88%9D%E5%BF%83%E6%9C%80%E7%BB%88%E7%89%88%E3%80%91%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93%E4%B8%8ERTL%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置部分 ---
    const DEFAULTS = {
        fontName: 'ukij ekran',
        enableFontReplace: true,
        enableRtl: true,
        excludedSites: '',
        debounceTime: 150
    };
    const config = {
        fontName: GM_getValue('fontName', DEFAULTS.fontName),
        enableFontReplace: GM_getValue('enableFontReplace', DEFAULTS.enableFontReplace),
        enableRtl: GM_getValue('enableRtl', DEFAULTS.enableRtl),
        excludedSites: GM_getValue('excludedSites', DEFAULTS.excludedSites).split(',').map(s => s.trim()).filter(Boolean),
        debounceTime: GM_getValue('debounceTime', DEFAULTS.debounceTime)
    };
    if (config.excludedSites.some(site => window.location.hostname.includes(site))) return;

    const newFont = `"${config.fontName}"`;
    const rtlLangRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    // --- 样式注入 (Shadow DOM 穿透) ---
    const styleContent = `:host, * { font-family: ${newFont}, sans-serif !important; }`;
    function applyStyles(root) {
        if (!config.enableFontReplace || root.querySelector('.gm-font-style')) return;
        try {
            const style = document.createElement('style');
            style.className = 'gm-font-style';
            style.textContent = styleContent;
            root.appendChild(style);
        } catch (e) {}
    }
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (options) {
        const shadowRoot = originalAttachShadow.call(this, options);
        applyStyles(shadowRoot);
        return shadowRoot;
    };

    // --- 【RTL 核心逻辑 · 回归初心版】 ---
    function runFullScan(scopeNode) {
        if (!config.enableRtl || !scopeNode) return;

        const elementsToProcess = new Set();
        const walker = document.createTreeWalker(scopeNode, NodeFilter.SHOW_TEXT, {
            acceptNode: node => rtlLangRegex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        });

        while(walker.nextNode()) {
            let el = walker.currentNode.parentElement;
            if (el && !el.hasAttribute('dir')) {
                // 1. 添加文本的直接父元素
                elementsToProcess.add(el);

                // 2. 如果是列表项，也添加其父列表容器
                if (el.tagName === 'LI') {
                    const listParent = el.parentElement;
                    if (listParent && (listParent.tagName === 'UL' || listParent.tagName === 'OL')) {
                        elementsToProcess.add(listParent);
                    }
                }
            }
        }

        // 3. 一次性处理所有收集到的元素
        elementsToProcess.forEach(el => {
            el.dir = 'rtl';
        });

        // 递归处理 Shadow DOM
        scopeNode.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) runFullScan(el.shadowRoot);
        });
    }

    // --- 【输入框智能切换逻辑】 ---
    function handleActiveInput() {
        if (!config.enableRtl) return;
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
            const text = activeEl.isContentEditable ? activeEl.textContent : activeEl.value;
            if (rtlLangRegex.test(text)) {
                activeEl.dir = 'rtl';
            } else {
                activeEl.removeAttribute('dir');
            }
        }
    }

    // --- 工具函数与事件监听 ---
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    const observer = new MutationObserver(debounce(() => {
        handleActiveInput();
        runFullScan(document.body);
    }, config.debounceTime));

    function init() {
        applyStyles(document.head);
        document.querySelectorAll('*').forEach(el => { if (el.shadowRoot) applyStyles(el.shadowRoot); });
        if (document.body) {
             runFullScan(document.body);
             observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
        document.addEventListener('keyup', handleActiveInput, true);
    }

    // --- 设置菜单 (完整版) ---
    function showSettingsDialog() {

        if (document.getElementById('gm-font-config-container')) return;
        const dialogHTML = ` <div id="gm-font-config-overlay"></div> <div id="gm-font-config-dialog"> <h2>全局字体与RTL配置</h2> <div class="gm-config-form"> <div class="gm-form-group"> <label for="gm-font-name">要应用的字体名称:</label> <input type="text" id="gm-font-name" placeholder="例如: ukij ekran"> </div> <div class="gm-form-group gm-checkbox-group"> <input type="checkbox" id="gm-enable-font-replace"> <label for="gm-enable-font-replace">启用全局字体替换</label> </div> <div class="gm-form-group gm-checkbox-group"> <input type="checkbox" id="gm-enable-rtl"> <label for="gm-enable-rtl">启用维吾尔文自动RTL</label> </div> <div class="gm-form-group"> <label for="gm-excluded-sites">排除列表 (网站域名, 用逗号分隔):</label> <textarea id="gm-excluded-sites" rows="3"></textarea> </div> </div> <div class="gm-dialog-buttons"> <button id="gm-save-btn" class="gm-btn gm-btn-primary">保存并刷新</button> <button id="gm-cancel-btn" class="gm-btn">取消</button> </div> </div>`; const dialogCSS = ` #gm-font-config-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); z-index: 999999998; } #gm-font-config-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 450px; max-width: 90%; background-color: #fff; color: #333; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 999999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 20px 25px; box-sizing: border-box; } #gm-font-config-dialog h2 { margin: 0 0 20px; font-size: 20px; text-align: center; color: #1a1a1a; } .gm-form-group { margin-bottom: 15px; } .gm-form-group label { display: block; margin-bottom: 5px; font-weight: 500; font-size: 14px; } .gm-form-group input[type="text"], .gm-form-group textarea { width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; } .gm-form-group textarea { resize: vertical; } .gm-checkbox-group { display: flex; align-items: center; } .gm-checkbox-group input[type="checkbox"] { margin-right: 10px; width: 16px; height: 16px; } .gm-checkbox-group label { margin-bottom: 0; } .gm-dialog-buttons { margin-top: 25px; text-align: right; } .gm-btn { padding: 10px 18px; border: none; border-radius: 5px; font-size: 14px; font-weight: 500; cursor: pointer; margin-left: 10px; transition: background-color 0.2s; } .gm-btn-primary { background-color: #007bff; color: white; } .gm-btn-primary:hover { background-color: #0056b3; } .gm-btn:not(.gm-btn-primary) { background-color: #e0e0e0; color: #333; } .gm-btn:not(.gm-btn-primary):hover { background-color: #c7c7c7; }`;
        const container = document.createElement('div'); container.id = 'gm-font-config-container'; container.innerHTML = `<style>${dialogCSS}</style>${dialogHTML}`; (document.body || document.documentElement).appendChild(container); document.getElementById('gm-font-name').value = config.fontName; document.getElementById('gm-enable-font-replace').checked = config.enableFontReplace; document.getElementById('gm-enable-rtl').checked = config.enableRtl; document.getElementById('gm-excluded-sites').value = config.excludedSites.join(', ');
        const closeDialog = () => { document.removeEventListener('keydown', handleEscKey); container.remove(); };
        const handleEscKey = (e) => { if (e.key === 'Escape') closeDialog(); };
        document.addEventListener('keydown', handleEscKey);
        document.getElementById('gm-save-btn').addEventListener('click', () => { GM_setValue('fontName', document.getElementById('gm-font-name').value); GM_setValue('enableFontReplace', document.getElementById('gm-enable-font-replace').checked); GM_setValue('enableRtl', document.getElementById('gm-enable-rtl').checked); GM_setValue('excludedSites', document.getElementById('gm-excluded-sites').value); closeDialog(); alert('配置已保存！页面即将刷新以应用新设置。'); window.location.reload(); });
        document.getElementById('gm-cancel-btn').addEventListener('click', closeDialog);
        document.getElementById('gm-font-config-overlay').addEventListener('click', closeDialog);

    }

    // --- 脚本入口 ---
    GM_registerMenuCommand('⚙️ 配置脚本 (v7.6 回归初心版)', showSettingsDialog);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();