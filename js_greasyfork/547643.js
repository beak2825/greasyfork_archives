// ==UserScript==
// @name        Website Element Blocker (Long-press to block)
// @name:zh-CN  网页元素屏蔽器 (长按屏蔽)
// @namespace   http://tampermonkey.net/
// @version     1.6
// @description Long-press on an element on your phone to bring up a menu to block it. Remembers your choices.
// @description:zh-CN 在手机上长按一个元素，会弹出一个菜单来屏蔽它。可以记住你的选择。
// @author      Your AI Assistant
// @match       *://*/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547643/Website%20Element%20Blocker%20%28Long-press%20to%20block%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547643/Website%20Element%20Blocker%20%28Long-press%20to%20block%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const LONG_PRESS_DURATION = 500; // 长按时长 (毫秒)
    const STORAGE_KEY_PREFIX = 'element_blocker_';

    let pressTimer = null;
    let longPressFired = false;
    let targetElement = null;
    let highlightElements = [];

    // --- 样式注入 ---
    GM_addStyle(`
        .blocker-highlight-wrapper {
            position: relative !important;
            z-index: 2147483646 !important;
        }
        
        .blocker-highlight-border {
            position: absolute;
            background: linear-gradient(90deg, 
                rgba(255, 0, 0, 0.8) 0%, 
                rgba(255, 127, 0, 0.8) 25%, 
                rgba(255, 255, 0, 0.8) 50%, 
                rgba(0, 255, 0, 0.8) 75%, 
                rgba(0, 0, 255, 0.8) 100%);
            animation: blocker-rainbow 2s linear infinite;
            z-index: 2147483645;
            pointer-events: none;
        }
        
        .blocker-highlight-top {
            top: -4px;
            left: 0;
            right: 0;
            height: 4px;
        }
        
        .blocker-highlight-right {
            top: 0;
            right: -4px;
            bottom: 0;
            width: 4px;
        }
        
        .blocker-highlight-bottom {
            bottom: -4px;
            left: 0;
            right: 0;
            height: 4px;
        }
        
        .blocker-highlight-left {
            top: 0;
            left: -4px;
            bottom: 0;
            width: 4px;
        }
        
        @keyframes blocker-rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        #blocker-menu {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 2147483647 !important;
            display: flex;
            flex-direction: column;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-family: sans-serif;
            font-size: 16px;
        }
        #blocker-menu button {
            background-color: #555;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
        }
        #blocker-menu button:hover {
            background-color: #777;
        }
    `);

    // --- 核心功能 ---
    function getCssSelector(el) {
        if (!(el instanceof Element)) return;
        const path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += `#${el.id}`;
                path.unshift(selector);
                break;
            } else {
                let sib = el, nth = 1;
                while (sib.previousElementSibling) {
                    sib = sib.previousElementSibling;
                    if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(' > ');
    }

    function createHighlightBorder(className) {
        const border = document.createElement('div');
        border.className = `blocker-highlight-border ${className}`;
        return border;
    }

    function highlightElement(el) {
        unhighlightAll();
        if (!el) return;
        
        // 创建一个包装元素来包含边框
        const wrapper = document.createElement('div');
        wrapper.className = 'blocker-highlight-wrapper';
        
        // 保存原始元素的样式和位置
        const originalStyle = el.getAttribute('style') || '';
        const originalPosition = window.getComputedStyle(el).position;
        
        // 确保元素有相对定位以便边框正确放置
        if (originalPosition === 'static') {
            el.style.position = 'relative';
        }
        
        // 添加四个边框
        wrapper.appendChild(createHighlightBorder('blocker-highlight-top'));
        wrapper.appendChild(createHighlightBorder('blocker-highlight-right'));
        wrapper.appendChild(createHighlightBorder('blocker-highlight-bottom'));
        wrapper.appendChild(createHighlightBorder('blocker-highlight-left'));
        
        // 用包装元素包裹原始元素
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        
        // 保存引用以便之后移除
        highlightElements.push({
            wrapper: wrapper,
            originalStyle: originalStyle,
            originalPosition: originalPosition,
            element: el
        });
    }

    function unhighlightAll() {
        highlightElements.forEach(item => {
            // 恢复原始元素的样式和位置
            if (item.originalPosition === 'static') {
                item.element.style.position = '';
            }
            item.element.setAttribute('style', item.originalStyle);
            
            // 将元素放回原处并移除包装
            item.wrapper.parentNode.insertBefore(item.element, item.wrapper);
            item.wrapper.remove();
        });
        
        highlightElements = [];
    }

    function showBlockMenu(el) {
        // 移除旧菜单
        const oldMenu = document.getElementById('blocker-menu');
        if (oldMenu) oldMenu.remove();

        const menu = document.createElement('div');
        menu.id = 'blocker-menu';

        let currentEl = el;
        let level = 0;

        const createButton = (elem, text) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.onclick = (e) => {
                e.stopPropagation();
                blockElement(elem);
                hideBlockMenu();
            };
            button.onmouseover = () => highlightElement(elem);
            button.onmouseout = () => highlightElement(targetElement);
            return button;
        };

        // 添加 "屏蔽当前" 按钮
        menu.appendChild(createButton(currentEl, `屏蔽当前 (${currentEl.tagName.toLowerCase()})`));

        // 添加 "屏蔽上层" 按钮 (最多5层)
        while (currentEl.parentElement && level < 5) {
            currentEl = currentEl.parentElement;
            if (currentEl.tagName.toLowerCase() === 'body' || currentEl.tagName.toLowerCase() === 'html') break;
            level++;
            menu.appendChild(createButton(currentEl, `屏蔽上${level}层 (${currentEl.tagName.toLowerCase()})`));
        }

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.backgroundColor = '#800';
        cancelButton.onclick = hideBlockMenu;
        menu.appendChild(cancelButton);

        document.body.appendChild(menu);
        highlightElement(el);
    }

    function hideBlockMenu() {
        const menu = document.getElementById('blocker-menu');
        if (menu) menu.remove();
        unhighlightAll();
    }

    function blockElement(el) {
        const selector = getCssSelector(el);
        if (!selector) return;

        const hostname = window.location.hostname;
        const key = STORAGE_KEY_PREFIX + hostname;
        const blockedSelectors = GM_getValue(key, []);

        if (!blockedSelectors.includes(selector)) {
            blockedSelectors.push(selector);
            GM_setValue(key, blockedSelectors);
            applyBlocking(hostname);
            console.log(`[Element Blocker] 已屏蔽: ${selector}`);
        }
    }

    function applyBlocking(hostname) {
        const key = STORAGE_KEY_PREFIX + hostname;
        const selectors = GM_getValue(key, []);
        if (selectors.length > 0) {
            let style = document.getElementById('dynamic-blocker-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'dynamic-blocker-style';
                document.head.appendChild(style);
            }
            style.textContent = `${selectors.join(', ')} { display: none !important; }`;
            console.log(`[Element Blocker] 已应用 ${selectors.length} 条屏蔽规则于 ${hostname}`);
        }
    }

    function clearBlockingRules() {
        const hostname = window.location.hostname;
        const key = STORAGE_KEY_PREFIX + hostname;
        GM_setValue(key, []);
        const style = document.getElementById('dynamic-blocker-style');
        if (style) style.textContent = '';
        alert(`已清除网站 [${hostname}] 的所有屏蔽规则。`);
    }

    // --- 事件监听 ---
    function onTouchStart(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        longPressFired = false;
        targetElement = e.target;
        pressTimer = window.setTimeout(() => {
            longPressFired = true;
            e.preventDefault();
            showBlockMenu(targetElement);
        }, LONG_PRESS_DURATION);
    }

    function onTouchEnd(e) {
        clearTimeout(pressTimer);
    }

    function onTouchMove(e) {
        clearTimeout(pressTimer);
    }

    // 绑定事件
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchmove', onTouchMove);

    // --- 页面加载时应用规则 & 注册菜单 ---
    applyBlocking(window.location.hostname);
    GM_registerMenuCommand('清除当前网站的屏蔽规则', clearBlockingRules);
})();