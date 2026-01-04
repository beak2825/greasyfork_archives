// ==UserScript==
// @name         DISCUZ! 论坛 FormHash 提取
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动提取当前页面的formhash值并提供可视化操作面板
// @author       sjx01
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533345/DISCUZ%21%20%E8%AE%BA%E5%9D%9B%20FormHash%20%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533345/DISCUZ%21%20%E8%AE%BA%E5%9D%9B%20FormHash%20%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const HOST_KEY = location.hostname.replace(/[^\w]/g, '_');
    const CONFIG = {
        AUTO_COPY_KEY: `formhash_autocopy_${HOST_KEY}`,
        FORM_HASH_REGEX: /(?:formhash|form_hash)[=:"']*([0-9a-fA-F]{8})\b/,
        PRIORITY_SELECTORS: [
            'input[name="formhash"][type="hidden"]',
            'input[name="form_hash"][type="hidden"]',
            '[id*="formhash"i]',
            '[name*="formhash"i]'
        ],
        CHECK_INTERVAL: 100,
        MAX_CHECKS: 3
    };

    // 控制面板样式
    const CSS_STYLE = `
        .formhash-panel {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2147483647;
            font-family: system-ui, sans-serif;
            min-width: 280px;
            border: 1px solid #eee;
            animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -8px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .panel-header {
            font-size: 18px;
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .hash-display {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 6px;
            margin: 12px 0;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .hash-value {
            font-family: monospace;
            color: #c0392b;
            word-break: break-all;
            flex: 1;
            font-size: 13px;
        }
        .copy-btn {
            background: #2980b9;
            color: #fff;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            flex-shrink: 0;
            transition: opacity 0.2s;
        }
        .copy-btn:hover {
            opacity: 0.9;
        }
        .config-area {
            margin-top: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
            opacity: 0.6;
            padding: 2px;
            line-height: 1;
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.25);
            z-index: 2147483646;
            animation: overlayFadeIn 0.2s ease-out;
        }
        @keyframes overlayFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;

    // 状态管理
    let currentHash = '';
    let checkCount = 0;
    let autoCopyEnabled = false;
    let observer = null;
    let activePanel = null;

    // 验证函数
    const isValidHash = hash => /^[\da-fA-F]{8}$/.test(hash);

    // 高效扫描方法
    const performScan = () => {
        // 优先从隐藏输入框获取
        for (const selector of CONFIG.PRIORITY_SELECTORS) {
            const el = document.querySelector(selector);
            const value = el?.value || el?.textContent;
            if (value && isValidHash(value)) return value;
        }

        // 从链接参数中搜索
        const links = document.querySelectorAll('a[href]');
        for (const link of links) {
            const match = link.href.match(CONFIG.FORM_HASH_REGEX);
            if (match?.[1]) return match[1];
        }

        // body中快速搜索
        const bodyText = document.body.textContent;
        const textMatch = bodyText.match(CONFIG.FORM_HASH_REGEX);
        return textMatch?.[1] || null;
    };

    // 参数处理
    const updateHandler = (newHash) => {
        if (!newHash || newHash === currentHash) return;
        currentHash = newHash;
        if (autoCopyEnabled) {
            GM_setClipboard(newHash, 'text').catch(console.debug);
        }
        if (activePanel) {
            activePanel.querySelector('.hash-value').textContent = newHash;
        }
    };

    // 控制面板创建函数
    const createControlPanel = () => {
        // 移除现有面板
        document.querySelectorAll('.formhash-panel, .overlay').forEach(el => el.remove());

        // 创建元素
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const panel = document.createElement('div');
        panel.className = 'formhash-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2980b9">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                FormHash 提取面板
            </div>
            <div class="hash-display">
                <span class="hash-value">${currentHash || '未检测到有效值'}</span>
                <button class="copy-btn">复制</button>
            </div>
            <div class="config-area">
                <input type="checkbox" id="fh-auto-copy" ${autoCopyEnabled ? 'checked' : ''}>
                <label for="fh-auto-copy">访问该网站时自动复制到剪贴板</label>
            </div>
            <div class="close-btn">×</div>
        `;

        // 关闭面板函数
        const closePanel = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(panel);
            activePanel = null;
        };

        // 复制事件绑定
        panel.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('close-btn') || target === overlay) {
                closePanel();
            } else if (target.classList.contains('copy-btn')) {
                if (currentHash) {
                    GM_setClipboard(currentHash, 'text')
                        .then(() => GM_notification({title: '已复制', text: currentHash}))
                        .catch(console.debug);
                }
            } else if (target.matches('#fh-auto-copy')) {
                autoCopyEnabled = target.checked;
                GM_setValue(CONFIG.AUTO_COPY_KEY, autoCopyEnabled);
                if (autoCopyEnabled && currentHash) {
                    GM_setClipboard(currentHash, 'text').catch(console.debug);
                }
            }
        });

        // 添加到DOM
        document.body.append(overlay, panel);
        activePanel = panel;

        // 立即更新状态
        if (!currentHash) {
            const newHash = performScan();
            if (newHash) {
                panel.querySelector('.hash-value').textContent = newHash;
                currentHash = newHash;
            }
        }
    };

    // 初始化检测
    const initDetection = () => {
        const check = () => {
            const newHash = performScan();
            if (newHash) {
                updateHandler(newHash);
                return true;
            }
            return ++checkCount < CONFIG.MAX_CHECKS;
        };

        const interval = setInterval(() => {
            if (!check()) clearInterval(interval);
        }, CONFIG.CHECK_INTERVAL);

        // 最终检测
        setTimeout(() => {
            if (!currentHash) updateHandler(performScan());
        }, 1500);
    };

    // 初始化
    const initialize = () => {
        autoCopyEnabled = GM_getValue(CONFIG.AUTO_COPY_KEY, false);

        // 注入样式
        if (!document.getElementById('formhash-css')) {
            const style = document.createElement('style');
            style.id = 'formhash-css';
            style.textContent = CSS_STYLE;
            document.head.appendChild(style);
        }

        // 初始化检测
        document.addEventListener('DOMContentLoaded', initDetection);

        // 注册菜单
        GM_registerMenuCommand(`🔧 获取 ${location.hostname} 的formhash`, createControlPanel);

        // 动态内容监听
        observer = new MutationObserver(mutations => {
            if (mutations.some(m => m.addedNodes.length || m.removedNodes.length)) {
                const newHash = performScan();
                updateHandler(newHash);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    };

    // 安全启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
