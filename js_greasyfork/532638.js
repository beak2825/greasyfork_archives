// ==UserScript==
// @name         微博优化
// @version      1.20
// @description  1 - “微博首页”自动跳转到“最新微博”；2 - 隐藏设备信息；3 - 搜索结果在当前窗口打开；4 - 添加搜索框清空按钮
// @match        *://*.weibo.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/1444380
// @downloadURL https://update.greasyfork.org/scripts/532638/%E5%BE%AE%E5%8D%9A%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532638/%E5%BE%AE%E5%8D%9A%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义跳转目标地址，即“最新微博”页面
    const targetUrl = "https://weibo.com/mygroups?gid=110003843385058";

    // 检查当前是否在首页，如果是就跳转
    function redirectToLatestWeibo() {
        const currentUrl = window.location.href;
        if (currentUrl === "https://weibo.com/" || currentUrl === "https://www.weibo.com/") {
            window.location.replace(targetUrl);
            return true;
        }
        return false;
    }

    // 点击页面上的各种首页按钮，都跳转到“最新微博”
    function interceptHomeLinks() {
        document.addEventListener("click", function(e) {
            const link = e.target.closest("a[href='https://weibo.com']") ||
                e.target.closest("a[href='https://www.weibo.com']") ||
                e.target.closest("a[href='https://weibo.com/']") ||
                e.target.closest("a[href='https://www.weibo.com/']") ||
                e.target.closest("a[href='/']");
            if (link) {
                const href = link.getAttribute("href");
                if (href === "/" || href === "https://weibo.com" || href === "https://www.weibo.com" ||
                    href === "https://weibo.com/" || href === "https://www.weibo.com/") {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = targetUrl;
                }
            }
        }, true);
    }

    // 隐藏设备信息
    function hideDeviceInfo() {
        const observer = new MutationObserver(() => {
            const fromDivs = document.querySelectorAll('div.from');
            fromDivs.forEach(div => {
                const children = Array.from(div.childNodes);
                children.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('来自')) {
                        node.textContent = node.textContent.replace(/来自\s*/, '');
                    }
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A' && node.getAttribute('href')?.startsWith('//app.weibo.com/t/feed')) {
                        node.style.display = 'none';
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const fromDivs = document.querySelectorAll('div.from');
        fromDivs.forEach(div => {
            const children = Array.from(div.childNodes);
            children.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('来自')) {
                    node.textContent = node.textContent.replace(/来自\s*/, '');
                }
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A' && node.getAttribute('href')?.startsWith('//app.weibo.com/t/feed')) {
                    node.style.display = 'none';
                }
            });
        });
    }

    // 阻止搜索结果在新窗口打开（包括搜索历史和建议）
    function preventSearchNewWindow() {
        // 拦截搜索链接的点击（包括历史和建议）
        document.addEventListener("click", function(e) {
            const link = e.target.closest("a[href*='s.weibo.com/weibo?q=']") ||
                        e.target.closest("a[href*='/search?containerid=']");
            if (link) {
                e.preventDefault();
                e.stopPropagation();
                const href = link.getAttribute("href");
                if (href.includes("s.weibo.com/weibo?q=") || href.includes("/search?containerid=")) {
                    window.location.href = href; // 在当前窗口打开
                }
            }
        }, true);

        // 拦截搜索表单提交（包括回车键）
        document.addEventListener("submit", function(e) {
            const form = e.target.closest("form[action*='s.weibo.com']") || e.target.closest("form");
            if (form) {
                e.preventDefault();
                e.stopPropagation();
                const searchInput = form.querySelector("input[type='text'], input[type='search']");
                if (searchInput && searchInput.value.trim()) {
                    const query = encodeURIComponent(searchInput.value.trim());
                    const searchUrl = `https://s.weibo.com/weibo?q=${query}`;
                    window.location.href = searchUrl; // 在当前窗口打开
                }
            }
        }, true);

        // 拦截键盘触发的历史和建议词选择
        document.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                const activeElement = document.activeElement;
                const historyItem = activeElement.closest("#historyBox .woo-pop-item-main") ||
                                   activeElement.closest(".woo-pop-wrap-main .woo-pop-item-main");
                if (historyItem) {
                    const link = historyItem.querySelector("a[href*='s.weibo.com/weibo?q=']") ||
                                 historyItem.querySelector("a[href*='/search?containerid=']");
                    if (link) {
                        e.preventDefault();
                        e.stopPropagation();
                        const href = link.getAttribute("href");
                        window.location.href = href; // 在当前窗口打开
                    }
                }
            }
        }, true);

        // 使用 MutationObserver 移除 target="_blank"
        const observer = new MutationObserver(() => {
            const searchLinks = document.querySelectorAll("a[href*='s.weibo.com/weibo?q='], a[href*='/search?containerid=']");
            searchLinks.forEach(link => {
                link.removeAttribute('target'); // 移除 target="_blank"
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'target'] });

        // 初始执行一次
        const searchLinks = document.querySelectorAll("a[href*='s.weibo.com/weibo?q='], a[href*='/search?containerid=']");
        searchLinks.forEach(link => {
            link.removeAttribute('target');
        });
    }

    // 添加搜索框清空按钮
    function setupClearButton() {
        // 注入清除图标样式
        const clearButtonStyle = document.createElement('style');
        clearButtonStyle.textContent = `
            .woo-input-wrap {
                position: relative;
            }
            .SearchBar-clear-icon {
                position: absolute;
                right: 12px; /* 位置已确认合适 */
                top: 50%;
                transform: translateY(-50%);
                width: 18px;
                height: 18px;
                cursor: pointer;
                display: none;
                fill: #999;
                z-index: 1000; /* 提高层级 */
                pointer-events: auto; /* 确保点击有效 */
            }
            .woo-input-wrap:hover .SearchBar-clear-icon.has-value,
            .woo-input-wrap input:focus ~ .SearchBar-clear-icon.has-value {
                display: block; /* 有值时，hover 或焦点显示 */
            }
            .SearchBar-clear-icon:hover {
                fill: #555; /* 悬停时颜色加深 */
            }
        `;
        document.head.appendChild(clearButtonStyle);
        console.debug('[WeiboScript] Clear button styles injected');

        // 查找搜索框容器和输入框
        const searchWrapper = document.querySelector('.woo-input-wrap:has(input[type="text"], input[type="search"])');
        const searchInput = searchWrapper?.querySelector('input[type="text"], input[type="search"]');
        if (!searchWrapper || !searchInput) {
            console.debug('[WeiboScript] No search wrapper or input found');
            return; // 无输入框，退出
        }

        // 检查是否已添加清除图标
        let clearIcon = searchWrapper.querySelector('.SearchBar-clear-icon');
        if (!clearIcon) {
            // 创建清除图标（SVG）
            clearIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            clearIcon.setAttribute('class', 'SearchBar-clear-icon');
            clearIcon.setAttribute('width', '18');
            clearIcon.setAttribute('height', '18');
            clearIcon.setAttribute('viewBox', '0 0 24 24');
            clearIcon.setAttribute('fill', 'currentColor');
            clearIcon.innerHTML = `
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 14.24l-1.41 1.41L12 14.12l-3.54 3.53-1.41-1.41L10.59 12 7.05 8.46l1.41-1.41L12 10.59l3.54-3.54 1.41 1.41L13.41 12l3.54 3.54z"/>
            `;
            searchWrapper.appendChild(clearIcon);
            console.debug('[WeiboScript] Clear icon added');
        }

        // 直接绑定 onclick 事件
        clearIcon.onclick = function(event) {
            console.debug('[WeiboScript] Clear icon onclick triggered');
            clearInput(event);
        };

        // 更新清除图标可见性
        function updateClearIconVisibility() {
            if (searchInput && clearIcon) {
                clearIcon.classList.toggle('has-value', searchInput.value.trim() !== '');
                console.debug('[WeiboScript] Clear icon visibility updated:', searchInput.value.trim() !== '');
            }
        }

        // 清空输入框内容
        function clearInput(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            console.debug('[WeiboScript] clearInput triggered');

            // 动态重新获取输入框和清除图标
            const wrapper = document.querySelector('.woo-input-wrap:has(input[type="text"], input[type="search"])');
            if (!wrapper) {
                console.debug('[WeiboScript] No wrapper found in clearInput');
                return;
            }
            const input = wrapper.querySelector('input[type="text"], input[type="search"]');
            const icon = wrapper.querySelector('.SearchBar-clear-icon');
            if (!input || !icon) {
                console.debug('[WeiboScript] No input or icon found in clearInput');
                return;
            }

            console.debug('[WeiboScript] Input value before clear:', input.value);

            // 触发完整的输入事件序列
            input.value = '';
            const inputEvent = new InputEvent('input', { bubbles: true, data: '' });
            input.dispatchEvent(inputEvent);
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
            const beforeInputEvent = new InputEvent('beforeinput', { bubbles: true, data: '' });
            input.dispatchEvent(beforeInputEvent);
            const compositionEndEvent = new CompositionEvent('compositionend', { bubbles: true, data: '' });
            input.dispatchEvent(compositionEndEvent);
            const keydownEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'Backspace' });
            input.dispatchEvent(keydownEvent);
            const keyupEvent = new KeyboardEvent('keyup', { bubbles: true, key: 'Backspace' });
            input.dispatchEvent(keyupEvent);

            // 尝试 React 的 onChange 和 onInput
            const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps') || key.startsWith('__reactEventHandlers'));
            if (reactPropsKey && input[reactPropsKey]) {
                if (input[reactPropsKey].onChange) {
                    input[reactPropsKey].onChange({ target: { value: '' } });
                    console.debug('[WeiboScript] React onChange triggered');
                }
                if (input[reactPropsKey].onInput) {
                    input[reactPropsKey].onInput({ target: { value: '' } });
                    console.debug('[WeiboScript] React onInput triggered');
                }
            }

            // 更新图标可见性
            icon.classList.remove('has-value');
            console.debug('[WeiboScript] Icon visibility cleared');

            // 延迟恢复焦点
            let focusAttempts = 0;
            const tryFocus = () => {
                if (focusAttempts >= 3) {
                    console.debug('[WeiboScript] Max focus attempts reached');
                    return;
                }
                if (document.contains(input)) {
                    input.focus();
                    const focusEvent = new Event('focus', { bubbles: true });
                    input.dispatchEvent(focusEvent);
                    console.debug('[WeiboScript] Focus attempt', focusAttempts + 1, 'Active element:', document.activeElement);
                    if (document.activeElement === input) return;
                }
                const fallbackInput = document.querySelector('.woo-input-wrap input[type="text"], .woo-input-wrap input[type="search"]');
                if (fallbackInput) {
                    fallbackInput.focus();
                    const focusEvent = new Event('focus', { bubbles: true });
                    fallbackInput.dispatchEvent(focusEvent);
                    console.debug('[WeiboScript] Fallback focus attempt', focusAttempts + 1, 'Active element:', document.activeElement);
                }
                focusAttempts++;
                requestAnimationFrame(tryFocus);
            };
            requestAnimationFrame(tryFocus);
        }

        // 全局点击监听器（调试用）
        document.addEventListener('click', function(event) {
            const clearIcon = event.target.closest('.SearchBar-clear-icon');
            console.debug('[WeiboScript] Click detected, target:', event.target, 'Clear icon:', !!clearIcon);
            if (clearIcon) {
                console.debug('[WeiboScript] Clear icon clicked, calling clearInput');
                clearInput(event);
            }
        }, { capture: true });

        // 阻止下拉菜单关闭
        document.addEventListener('click', function(event) {
            const popMain = event.target.closest('.woo-pop-main');
            const clearIcon = event.target.closest('.SearchBar-clear-icon');
            if (clearIcon && popMain) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                console.debug('[WeiboScript] Prevented pop-main click propagation');
            }
        }, { capture: true });

        // 绑定输入事件
        if (searchInput.__inputHandler) {
            searchInput.removeEventListener('input', searchInput.__inputHandler);
        }
        searchInput.addEventListener('input', updateClearIconVisibility);
        searchInput.__inputHandler = updateClearIconVisibility;

        // 初始可见性检查
        updateClearIconVisibility();
        console.debug('[WeiboScript] Initial setup completed');

        // 标记已设置
        searchInput.__clearButtonSetup = true;
    }

    // 监控动态添加的搜索输入框和清空按钮
    function observeSearchInputForClearButton() {
        document.querySelectorAll('.woo-input-wrap:has(input[type="text"], input[type="search"])').forEach(wrapper => {
            const searchInput = wrapper.querySelector('input[type="text"], input[type="search"]');
            if (searchInput && !searchInput.__clearButtonSetup) {
                console.debug('[WeiboScript] Detected new search input, setting up clear button');
                setupClearButton();
            }
        });

        // 监控清空图标的移除
        const wrappers = document.querySelectorAll('.woo-input-wrap');
        wrappers.forEach(wrapper => {
            const observer = new MutationObserver(() => {
                if (!wrapper.querySelector('.SearchBar-clear-icon')) {
                    console.debug('[WeiboScript] Clear icon removed, reinitializing');
                    setupClearButton();
                }
            });
            observer.observe(wrapper, { childList: true, subtree: true });
        });
    }

    // 初始化清空按钮
    function initClearButton() {
        setupClearButton();
        const clearButtonObserver = new MutationObserver(() => {
            observeSearchInputForClearButton();
        });
        clearButtonObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // 初始执行
    if (!redirectToLatestWeibo()) {
        interceptHomeLinks();
        hideDeviceInfo();
        preventSearchNewWindow();
        initClearButton();
    }
})();