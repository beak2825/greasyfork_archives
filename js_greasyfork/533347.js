// ==UserScript==
// @name         DISCUZ! 论坛 FormHash 提取_桌面通知版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动提取当前页面的formhash值并提供可视化操作面板，带桌面消息通知
// @author       sjx01
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533347/DISCUZ%21%20%E8%AE%BA%E5%9D%9B%20FormHash%20%E6%8F%90%E5%8F%96_%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/533347/DISCUZ%21%20%E8%AE%BA%E5%9D%9B%20FormHash%20%E6%8F%90%E5%8F%96_%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HOST_KEY = location.hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const CONFIG = {
        AUTO_COPY_KEY: `formhash_autocopy_${HOST_KEY}`,
        FORM_HASH_REGEX: /(?:formhash|form_hash)[=:"']+([0-9a-fA-F]{8})\b/,
        INPUT_SELECTORS: [
            'input[name="formhash"][type="hidden"]',
            'input[name="form_hash"][type="hidden"]',
            '[id^="formhash_"]',
            '[id$="_formhash"]'
        ],
        DEBOUNCE_DELAY: 800,
        OBSERVER_CONFIG: {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        }
    };

    const CSS_STYLE = `
        .formhash-panel {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255,255,255,0.98);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 2147483647;
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 320px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(0,0,0,0.1);
            animation: panelFadeIn 0.3s ease-out;
        }
        @keyframes panelFadeIn {
            from { opacity: 0; transform: translate(-50%, -10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .panel-header {
            font-size: 20px;
            color: #2c3e50;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
        }
        .hash-display {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }
        .hash-value {
            font-family: 'SFMono-Regular', Consolas, monospace;
            color: #e74c3c;
            word-break: break-all;
            flex: 1;
            font-size: 14px;
        }
        .copy-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 8px 18px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
            flex-shrink: 0;
        }
        .copy-btn:hover {
            background: #2980b9;
        }
        .copy-btn:active {
            transform: scale(0.95);
        }
        .config-area {
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            cursor: pointer;
            opacity: 0.6;
            padding: 4px;
            transition: opacity 0.2s;
        }
        .close-btn:hover {
            opacity: 1;
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 2147483646;
            animation: overlayFadeIn 0.3s ease-out;
        }
        @keyframes overlayFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;

    let currentHash = '';
    let observerInstance = null;
    let debounceTimer = null;
    let autoCopyEnabled = GM_getValue(CONFIG.AUTO_COPY_KEY, false);

    // 校验函数
    const isValidHash = hash => /^[0-9a-fA-F]{8}$/.test(hash);

    // 提取函数
    const extractFormHash = () => {
        // 策略1：多种输入框选择器
        for (const selector of CONFIG.INPUT_SELECTORS) {
            const input = document.querySelector(selector);
            if (input?.value && isValidHash(input.value)) {
                return input.value;
            }
        }

        // 策略2：链接参数提取
        for (const link of document.links) {
            try {
                const decodedHref = decodeURIComponent(link.href);
                const match = decodedHref.match(CONFIG.FORM_HASH_REGEX);
                if (match?.[1] && isValidHash(match[1])) {
                    return match[1];
                }
            } catch {
                const match = link.href.match(CONFIG.FORM_HASH_REGEX);
                if (match?.[1] && isValidHash(match[1])) {
                    return match[1];
                }
            }
        }

        // 策略3：脚本内容和页面文本提取
        const textContent = document.body.textContent;
        const fullMatch = textContent.match(CONFIG.FORM_HASH_REGEX);
        if (fullMatch?.[1] && isValidHash(fullMatch[1])) {
            return fullMatch[1];
        }

        return null;
    };

    // 安全复制方法
    const performCopy = async (hash) => {
        if (!hash || !isValidHash(hash)) return;

        try {
            await GM_setClipboard(hash, 'text');
            GM_notification({
                title: '✅ 复制成功',
                text: `已复制：${hash}`,
                timeout: 1500
            });
            currentHash = hash;
        } catch (error) {
            console.error('复制失败:', error);
            GM_notification({
                title: '❌ 复制失败',
                text: '请尝试手动复制',
                timeout: 2000
            });
        }
    };

    // 检测(带防抖)
    const checkAndUpdate = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const newHash = extractFormHash();
            if (newHash && newHash !== currentHash) {
                currentHash = newHash;
                if (autoCopyEnabled) {
                    performCopy(newHash);
                }
            }
        }, CONFIG.DEBOUNCE_DELAY);
    };

    // 监视器
    const toggleObserver = (enable) => {
        if (enable && !observerInstance) {
            observerInstance = new MutationObserver(mutations => {
                if (mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0)) {
                    checkAndUpdate();
                }
            });
            observerInstance.observe(document.body, CONFIG.OBSERVER_CONFIG);
        } else if (!enable && observerInstance) {
            observerInstance.disconnect();
            observerInstance = null;
        }
    };

    // 面板创建函数
    const createControlPanel = () => {
        // 移除所有已有面板
        const existingPanels = document.querySelectorAll('.formhash-panel, .overlay');
        existingPanels.forEach(el => el.remove());

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.onclick = () => closePanel();

        // 创建主面板
        const panel = document.createElement('div');
        panel.className = 'formhash-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3498db" stroke-width="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                FormHash 提取面板
            </div>
            <div class="hash-display">
                <span class="hash-value">${currentHash || '未检测到有效值'}</span>
                <button class="copy-btn">复制</button>
            </div>
            <div class="config-area">
                <input type="checkbox" id="autoCopy" ${autoCopyEnabled ? 'checked' : ''}>
                <label for="autoCopy">访问该网站时自动复制到剪贴板(带桌面消息通知)</label>
            </div>
            <div class="close-btn">×</div>
        `;

        // 事件绑定
        const copyHandler = () => {
            if (currentHash) performCopy(currentHash);
        };
        panel.querySelector('.copy-btn').addEventListener('click', copyHandler);

        const autoCopyCheckbox = panel.querySelector('#autoCopy');
        const changeHandler = (e) => {
            autoCopyEnabled = e.target.checked;
            GM_setValue(CONFIG.AUTO_COPY_KEY, autoCopyEnabled);
            toggleObserver(autoCopyEnabled);
            if (autoCopyEnabled) checkAndUpdate();
        };
        autoCopyCheckbox.addEventListener('change', changeHandler);

        const closeHandler = () => closePanel();
        panel.querySelector('.close-btn').addEventListener('click', closeHandler);

        // 添加元素到DOM
        document.body.append(overlay, panel);

        // 清理函数
        const cleanup = () => {
            panel.querySelector('.copy-btn').removeEventListener('click', copyHandler);
            autoCopyCheckbox.removeEventListener('change', changeHandler);
            panel.querySelector('.close-btn').removeEventListener('click', closeHandler);
            overlay.removeEventListener('click', closeHandler);
        };

        // 监听面板移除事件
        const observer = new MutationObserver((mutations) => {
            if (!document.body.contains(panel)) {
                cleanup();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true });
    };

    const closePanel = () => {
        document.querySelectorAll('.formhash-panel, .overlay').forEach(el => el.remove());
    };

    // 初始化
    const initialize = () => {
        // 样式注入
        if (!document.querySelector('#formhash-style')) {
            const style = document.createElement('style');
            style.id = 'formhash-style';
            style.textContent = CSS_STYLE;
            document.head.appendChild(style);
        }

        // 注册菜单命令
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand(`🔧 获取 ${location.hostname} 的formhash`, () => {
                currentHash = extractFormHash() || '';
                createControlPanel();
            });
        }

        // 初始化检测
        toggleObserver(autoCopyEnabled);
        checkAndUpdate();

        // 页面加载完成后再检测
        if (document.readyState === 'complete') {
            checkAndUpdate();
        } else {
            window.addEventListener('load', checkAndUpdate);
        }
    };

    // 安全启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
