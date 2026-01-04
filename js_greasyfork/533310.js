// ==UserScript==
// @name         快速搜索选中内容
// @name:en      Quick Search Selected Text (URL Jump+Page Dark Detect)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  选中网页文本或双击Alt/Option键弹出搜索框，输入内容按回车默认Google搜索，输入网址按回车直接跳转。根据页面背景适配深/浅色模式。
// @description:en Double-press Alt/Option key for search popup. Enter searches Google by default, or navigates if input is a URL. Adapts to page background color.
// @author       Ven (powered by Gemini)
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533310/%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E9%80%89%E4%B8%AD%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/533310/%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E9%80%89%E4%B8%AD%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const TRIGGER_KEY = 'Alt';
    const DOUBLE_PRESS_INTERVAL = 300;
    const DEFAULT_SEARCH_ENGINE_NAME = 'Google';
    const DARK_MODE_LUMINANCE_THRESHOLD = 0.35;
    const SEARCH_ENGINES = [
        { name: '百度', url: 'https://www.baidu.com/s?wd=' },
        { name: 'Google', url: 'https://www.google.com/search?q=' },
        { name: '淘宝', url: 'https://s.taobao.com/search?q=' },
        { name: '京东', url: 'https://search.jd.com/Search?keyword={query}&enc=utf-8&wq={query}' }
    ];

    // --- 状态变量 ---
    let lastKeyPressTime = 0;
    let popupVisible = false;
    let popupElement = null;

    // --- 样式 (与 v1.6 相同) ---
    GM_addStyle(`
        /* --- 通用样式 --- */
        #quick-search-popup-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.85);
            z-index: 99999;
            border-radius: 12px;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            min-width: 380px;
            max-width: 650px;
            opacity: 0;
            transition: opacity 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            visibility: hidden;
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            background-color: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px) saturate(150%);
            -webkit-backdrop-filter: blur(12px) saturate(150%);
            background-image: linear-gradient(to bottom right, rgba(255, 255, 255, 0.75), rgba(245, 245, 255, 0.65));
            border: 1px solid rgba(200, 200, 200, 0.5);
            box-shadow:
                0 0 10px 3px rgba(100, 150, 255, 0.15),
                0 0 25px 8px rgba(200, 150, 255, 0.1),
                0 4px 15px rgba(0, 0, 0, 0.1);
        }
        #quick-search-popup-container.visible {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            visibility: visible;
        }
        #quick-search-popup-container h3 {
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            font-size: 18px;
            font-weight: 500;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            text-align: center;
            color: #222;
            cursor: default;
             transition: color 0.3s ease, border-color 0.3s ease;
        }
        #quick-search-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid rgba(204, 204, 204, 0.8);
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 15px;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, 0.8);
            color: #333;
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }
         #quick-search-input::placeholder {
             color: #999;
             transition: color 0.3s ease;
         }
         #quick-search-input:focus {
             outline: none;
             border-color: rgba(0, 123, 255, 0.8);
             box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
         }
        #quick-search-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .quick-search-button {
            padding: 8px 15px;
            border: none;
            background-color: #007bff;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            text-align: center;
            transition: background-color 0.2s ease, transform 0.1s ease;
            flex-grow: 1;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .quick-search-button:hover {
            background-color: #0056b3;
            transform: translateY(-1px);
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
         .quick-search-button:active {
             transform: translateY(0px);
             background-color: #004085;
             box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
         }

        /* --- 深色模式样式 (通过 .dark-mode 类应用) --- */
        #quick-search-popup-container.dark-mode {
            background-color: rgba(40, 40, 45, 0.75);
            background-image: linear-gradient(to bottom right, rgba(50, 50, 55, 0.8), rgba(30, 30, 35, 0.7));
            border: 1px solid rgba(100, 100, 100, 0.5);
            box-shadow:
                0 0 12px 4px rgba(120, 180, 255, 0.25),
                0 0 30px 10px rgba(220, 180, 255, 0.2),
                0 4px 20px rgba(0, 0, 0, 0.3);
        }
        #quick-search-popup-container.dark-mode h3 {
            color: #eee;
            border-bottom-color: rgba(255, 255, 255, 0.15);
        }
        #quick-search-popup-container.dark-mode #quick-search-input {
            background-color: rgba(50, 50, 55, 0.8);
            border-color: rgba(100, 100, 100, 0.7);
            color: #eee;
        }
        #quick-search-popup-container.dark-mode #quick-search-input::placeholder {
            color: #bbb;
        }
        #quick-search-popup-container.dark-mode #quick-search-input:focus {
            border-color: rgba(100, 170, 255, 0.8);
            box-shadow: 0 0 0 2px rgba(100, 170, 255, 0.25);
        }
    `);

    // --- 功能函数 ---

    // --- 颜色处理和亮度计算 (与 v1.6 相同) ---
    function parseColor(colorString) {
        if (!colorString) return null;
        let match = colorString.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
        if (match) {
            return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), a: match[4] !== undefined ? parseFloat(match[4]) : 1 };
        }
        match = colorString.match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);
        if (match) {
            let hex = match[1];
            if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
            return { r: parseInt(hex.substring(0, 2), 16), g: parseInt(hex.substring(2, 4), 16), b: parseInt(hex.substring(4, 6), 16), a: 1 };
        }
        if (colorString.toLowerCase() === 'transparent') {
             return { r: 0, g: 0, b: 0, a: 0 };
         }
        return null;
    }
    function getLuminance(rgb) {
        if (!rgb) return 1;
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function isPageDark() {
        try {
            let element = document.body;
            let bgColor = window.getComputedStyle(element).backgroundColor;
            let rgb = parseColor(bgColor);
            if (rgb && rgb.a < 0.1) {
                 element = document.documentElement;
                 bgColor = window.getComputedStyle(element).backgroundColor;
                 rgb = parseColor(bgColor);
                 if (rgb && rgb.a < 0.1) return false;
            }
            if (!rgb) {
                 console.warn("Quick Search Script: Could not determine page background color.");
                 return false;
            }
            const luminance = getLuminance(rgb);
            return luminance < DARK_MODE_LUMINANCE_THRESHOLD;
        } catch (error) {
            console.error("Quick Search Script: Error detecting page darkness:", error);
            return false;
        }
    }

    // --- URL 检测函数 ---
    /**
     * 检查字符串是否像一个 URL
     * @param {string} text - 要检查的文本
     * @returns {boolean} - 如果像 URL 返回 true
     */
    function isLikelyUrl(text) {
        if (!text) return false;
        text = text.trim();
        if (text.includes(' ') || text.length < 4) { // URL 不应包含空格，且长度通常大于3
            return false;
        }
        // 检查是否以常见协议开头
        if (/^(https?:\/\/|ftp:\/\/|file:\/\/)/i.test(text)) {
            return true;
        }
        // 检查是否是常见的域名模式 (e.g., example.com, localhost, IP)
        // 允许 localhost
        if (text.toLowerCase() === 'localhost' || text.startsWith('localhost:')) {
            return true;
        }
        // 允许 IP 地址 (简单检查)
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(text)) {
             // 进一步检查 IP 段是否有效 (0-255)
             const parts = text.split(':')[0].split('.');
             if (parts.length === 4 && parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255)) {
                 return true;
             }
        }
        // 检查类域名格式: 包含至少一个点，点前后有字符，顶级域名至少2个字母
        if (text.includes('.') && /^[a-z0-9-]+(\.[a-z0-9-]+)+(\:[0-9]+)?(\/.*)?$/i.test(text)) {
             // 排除明显不是 URL 的情况，例如文件名 "file.txt"
             if (text.includes('.') && !text.endsWith('.') && text.indexOf('.') > 0) {
                  // 检查顶级域名部分是否至少有两个字母
                  const parts = text.split('/'); // 移除路径部分
                  const domainParts = parts[0].split(':'); // 移除端口部分
                  const hostParts = domainParts[0].split('.');
                  if (hostParts.length > 1 && hostParts[hostParts.length - 1].length >= 2 && /^[a-z]+$/i.test(hostParts[hostParts.length - 1])) {
                       return true;
                  }
             }
        }
        return false;
    }


    // 创建搜索弹窗 (逻辑不变)
    function createPopup() {
        if (popupElement) return;
        popupElement = document.createElement('div');
        popupElement.id = 'quick-search-popup-container';
        popupElement.innerHTML = `
            <h3>快速搜索</h3>
            <input type="text" id="quick-search-input" placeholder="输入或粘贴文本 / 网址">
            <div id="quick-search-buttons">
                ${SEARCH_ENGINES.map(engine => `
                    <button class="quick-search-button" data-url="${engine.url}" data-name="${engine.name}">${engine.name}</button>
                `).join('')}
            </div>
        `;
        document.body.appendChild(popupElement);
        popupElement.querySelector('#quick-search-buttons').addEventListener('click', handleSearchButtonClick);
        popupElement.querySelector('#quick-search-input').addEventListener('keydown', handleInputKeydown);
        document.addEventListener('click', handleClickOutside, true);
    }

    // 显示弹窗 (逻辑不变)
    function showPopup(text) {
        if (!popupElement) {
            createPopup();
        } else {
            popupElement.style.transform = 'translate(-50%, -50%) scale(0.85)';
            void popupElement.offsetWidth;
        }
        if (isPageDark()) {
            popupElement.classList.add('dark-mode');
        } else {
            popupElement.classList.remove('dark-mode');
        }
        const currentSelectedText = (text || "").trim();
        const input = popupElement.querySelector('#quick-search-input');
        input.value = currentSelectedText;
        requestAnimationFrame(() => {
             popupElement.classList.add('visible');
             popupVisible = true;
        });
        setTimeout(() => {
            input.focus();
            if (currentSelectedText) {
                input.select();
            }
        }, 50);
    }

    // 隐藏弹窗 (逻辑不变)
    function hidePopup() {
        if (popupElement && popupVisible) {
            popupElement.classList.remove('visible');
            popupVisible = false;
        }
    }

    // 处理搜索按钮点击 (逻辑不变)
    function handleSearchButtonClick(event) {
        if (event.target.classList.contains('quick-search-button')) {
            const button = event.target;
            triggerSearch(button.dataset.name, button.dataset.url);
        }
    }

    // 触发搜索 (逻辑不变)
    function triggerSearch(engineName, baseUrl) {
         const query = popupElement.querySelector('#quick-search-input').value.trim();
         if (query && baseUrl) {
             let finalUrl;
             if (engineName === '京东') {
                  finalUrl = baseUrl.replace(/\{query\}/g, encodeURIComponent(query));
             } else {
                  finalUrl = baseUrl + encodeURIComponent(query);
             }
             GM_openInTab(finalUrl, { active: true });
             hidePopup();
         } else if (!query) {
            const input = popupElement.querySelector('#quick-search-input');
            input.focus();
            input.placeholder = "请输入搜索内容!";
            popupElement.style.transition = 'transform 0.08s ease-in-out';
             const baseTransform = popupElement.classList.contains('visible') ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.85)';
             popupElement.style.transform = baseTransform + ' translateX(5px)';
             setTimeout(() => {
                 popupElement.style.transform = baseTransform + ' translateX(-5px)';
                 setTimeout(() => {
                     popupElement.style.transform = baseTransform;
                      setTimeout(() => {
                          popupElement.style.transition = 'opacity 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
                          input.placeholder = "输入或粘贴文本 / 网址"; // 更新 placeholder
                     }, 80);
                 }, 80);
             }, 80);
         }
    }


    // 处理输入框键盘事件 (修改 Enter 逻辑)
    function handleInputKeydown(event) {
        if (event.key === TRIGGER_KEY) {
             event.stopPropagation();
        }

        if (event.key === 'Enter') {
            event.preventDefault(); // 阻止默认行为
            const inputText = popupElement.querySelector('#quick-search-input').value.trim();

            if (inputText) {
                // --- 检查输入是否为 URL ---
                if (isLikelyUrl(inputText)) {
                    let urlToOpen = inputText;
                    // 如果没有协议，默认添加 http://
                    if (!/^(https?:\/\/|ftp:\/\/|file:\/\/)/i.test(urlToOpen)) {
                        urlToOpen = 'http://' + urlToOpen;
                    }
                    console.log("Opening URL:", urlToOpen); // 调试信息
                    GM_openInTab(urlToOpen, { active: true });
                    hidePopup();
                } else {
                    // --- 如果不是 URL，执行默认搜索 ---
                    const defaultEngineButton = popupElement.querySelector(`.quick-search-button[data-name="${DEFAULT_SEARCH_ENGINE_NAME}"]`);
                    if (defaultEngineButton) {
                        triggerSearch(defaultEngineButton.dataset.name, defaultEngineButton.dataset.url);
                    } else {
                        // 备选：使用第一个按钮
                        const firstButton = popupElement.querySelector('.quick-search-button');
                        if (firstButton) {
                             triggerSearch(firstButton.dataset.name, firstButton.dataset.url);
                        }
                    }
                }
            } else {
                 // 如果输入为空，触发提示 (同 triggerSearch 中的空输入处理)
                 triggerSearch(null, null); // 调用 triggerSearch 处理空输入提示
            }

        } else if (event.key === 'Escape') {
            hidePopup();
        }
    }

    // 处理点击弹窗外部 (逻辑不变)
    function handleClickOutside(event) {
        if (popupVisible && popupElement && !popupElement.contains(event.target)) {
             if (event instanceof MouseEvent && event.detail > 0) {
                 hidePopup();
             }
        }
    }


    // 处理键盘按下事件 (逻辑不变)
    function handleKeyDown(event) {
        if (popupVisible && event.key === 'Escape' && document.activeElement !== popupElement.querySelector('#quick-search-input')) {
             hidePopup();
             return;
        }
        if (event.key === TRIGGER_KEY && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            if (document.activeElement === popupElement?.querySelector('#quick-search-input')) {
                 return;
            }
            const now = Date.now();
            if (now - lastKeyPressTime < DOUBLE_PRESS_INTERVAL) {
                const currentSelectedText = window.getSelection().toString();
                showPopup(currentSelectedText);
                lastKeyPressTime = 0;
            } else {
                lastKeyPressTime = now;
            }
        }
    }

    // --- 初始化 ---
    document.addEventListener('keydown', handleKeyDown, true);
    console.log('Quick Search Script (v1.7 URL Jump+Page Dark Detect) Loaded.');

})();