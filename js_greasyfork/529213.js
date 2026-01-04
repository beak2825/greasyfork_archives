// ==UserScript==
// @name         通用复制限制解除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除网页上的复制限制，并提供高级设置选项
// @author       sjx01
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529213/%E9%80%9A%E7%94%A8%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/529213/%E9%80%9A%E7%94%A8%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        ENABLE_KEY: 'copyLiberatorEnabled',
        POS_KEY: 'copyLiberatorPosition',
        DEFAULT_STATE: false, // 默认不开启复制保护解除
        SITE_RULES: {} // 可以在这里定义特殊站点的规则
    };

    let siteSettings = {};
    let lastMouseDownTime = 0;

    function loadSiteSettings() {
        const savedSettings = GM_getValue('siteSettings', '{}');
        try {
            siteSettings = JSON.parse(savedSettings);
        } catch (e) {
            console.error("Failed to parse site settings:", e);
            siteSettings = {}; // 如果解析失败，则使用默认空对象
        }
    }

    function saveSiteSettings() {
        const settingsString = JSON.stringify(siteSettings);
        GM_setValue('siteSettings', settingsString);
    }

    function getDomainSettings(domain) {
        if (!siteSettings[domain]) {
            return { enableCopy: CONFIG.DEFAULT_STATE, showSwitch: CONFIG.DEFAULT_STATE };
        }
        return siteSettings[domain];
    }

    function disableGlobalProtection(domain) {
        GM_addStyle(`
            * {
                user-select: '' !important;
                -webkit-user-select: '' !important;
                -moz-user-select: '' !important;
            }
            [class*="mask"], [id*="shield"] {
                display: '' !important;
            }
            .reader-word-layer { opacity: '' !important; }
        `);
    }

    function enableGlobalProtection(domain) {
        const settings = getDomainSettings(domain);
        if (settings.enableCopy) {
            GM_addStyle(`
                * {
                    user-select: auto !important;
                    -webkit-user-select: auto !important;
                    -moz-user-select: text !important;
                }
                [class*="mask"], [id*="shield"] {
                    display: none !important;
                }
                .reader-word-layer { opacity: 1 !important; }
                body {
                    -webkit-touch-callout: text !important;
                    -webkit-tap-highlight-color: transparent !important;
                }
            `);

            // 禁用所有阻止复制的事件监听器
            disableCopyBlockingEvents();

            // 恢复快捷键复制功能
            restoreKeyboardShortcuts();

            // 恢复右键菜单复制功能
            restoreRightClickContextMenu();
        }
    }

    function disableCopyBlockingEvents() {
        ['copy', 'cut', 'contextmenu'].forEach(eventName => {
            document.addEventListener(eventName, (event) => {
                event.stopImmediatePropagation();
            }, true);
        });
    }

    function restoreKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
                // 允许 Ctrl+C 复制、粘贴 Ctrl+V、剪切 Ctrl+X、全选 Ctrl+A
                e.stopImmediatePropagation();
            }
        }, true);
    }

    function restoreRightClickContextMenu() {
        document.addEventListener('contextmenu', (event) => {
            event.stopImmediatePropagation();
        }, true);
    }

    function createSmartSwitch(domain) {
        const pos = GM_getValue(CONFIG.POS_KEY, { x: window.innerWidth - 120, y: window.innerHeight - 80 });
        const settings = getDomainSettings(domain);
        const isEnabled = settings.enableCopy;
        const shouldShow = settings.showSwitch;

        if (!shouldShow) return; // 如果不需要显示悬浮窗，则直接返回

        const switchBtn = document.createElement('div');
        switchBtn.className = 'cp-pro-smart-switch';
        Object.assign(switchBtn.style, {
            position: 'fixed',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            zIndex: 99999,
            background: isEnabled ? '#4CAF50' : '#f44336',
            padding: '8px 12px',
            borderRadius: '15px',
            cursor: 'move',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            color: 'white',
            fontSize: '14px'
        });
        switchBtn.textContent = isEnabled ? '🔓 已解锁' : '🔒 已锁定';

        let isDragging = false;
        let startX = 0, startY = 0;
        let lastMouseDownTime = 0;

        switchBtn.addEventListener('mousedown', (e) => {
            lastMouseDownTime = Date.now();
            isDragging = false;
            startX = e.clientX - switchBtn.offsetLeft;
            startY = e.clientY - switchBtn.offsetTop;
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseUp(e) {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', onMouseUp);

            const currentTime = Date.now();
            if (currentTime - lastMouseDownTime < 200 && !isDragging) {
                // 点击操作
                toggleEnableCopy(domain, switchBtn);
            } else {
                // 拖动操作
                GM_setValue(CONFIG.POS_KEY, {
                    x: switchBtn.offsetLeft,
                    y: switchBtn.offsetTop
                });
            }
        }

        const onDrag = (e) => {
            if (!isDragging) {
                isDragging = true; // 标记为拖动
            }
            // 在拖动逻辑中添加边界检测
            const maxX = window.innerWidth - switchBtn.offsetWidth;
            const maxY = window.innerHeight - switchBtn.offsetHeight;
            const newX = Math.min(maxX, Math.max(0, e.clientX - startX));
            const newY = Math.min(maxY, Math.max(0, e.clientY - startY));
            switchBtn.style.left = `${newX}px`;
            switchBtn.style.top = `${newY}px`;
        };

        document.body.appendChild(switchBtn);
    }

    function toggleEnableCopy(domain, switchBtn) {
        const settings = getDomainSettings(domain);
        const newEnabledState = !settings.enableCopy;
        GM_setValue(CONFIG.ENABLE_KEY, newEnabledState);
        siteSettings[domain].enableCopy = newEnabledState;
        saveSiteSettings();
        switchBtn.textContent = newEnabledState ? '🔓 已解锁' : '🔒 已锁定';
        switchBtn.style.background = newEnabledState ? '#4CAF50' : '#f44336';
        newEnabledState ? enableGlobalProtection(domain) : disableGlobalProtection(domain);
    }

    function applyDomainSettings(domain) {
        const settings = getDomainSettings(domain);
        if (settings.enableCopy) {
            enableGlobalProtection(domain);
        } else {
            disableGlobalProtection(domain);
        }
        if (settings.showSwitch) {
            createSmartSwitch(domain);
        }
    }

    function initEngine() {
        loadSiteSettings();

        const currentHost = location.hostname;
        applyDomainSettings(currentHost);

        observeDynamicContent();

        GM_registerMenuCommand('打开设置面板', () => showSettingsPanel());
    }

    function observeDynamicContent() {
        const observer = new MutationObserver(() => {
            handleSpecialSites();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    function handleSpecialSites() {
        // 在这里处理特定网站的特殊规则
    }

    function forceKeyCapture(event) {
        // 捕获并处理键盘事件
    }

    function forceRightClick(event) {
        // 捕获并处理右键点击事件
    }

    //设置面板功能样式
    function showSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'cp-pro-settings-panel';

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'cp-pro-close-btn'; // 添加类名以便于美化
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => panel.remove();
        panel.prepend(closeButton);

        // 面板头部
        const header = document.createElement('div');
        header.className = 'cp-pro-panel-header';
        header.innerHTML = '<h3>高级设置</h3>';
        panel.appendChild(header);

        // 添加搜索框
        const searchInput = document.createElement('input');
        searchInput.className = 'cp-pro-search-domain';
        searchInput.placeholder = '搜索域名...';
        searchInput.oninput = (e) => filterDomains(e.target.value);
        panel.appendChild(searchInput);

        // 域名列表
        const domainList = document.createElement('div');
        domainList.className = 'cp-pro-domain-list';
        panel.appendChild(domainList);

        // 生成设置项
        const currentHost = location.hostname;
        const domains = new Set([
            currentHost,
            ...Object.keys(siteSettings).filter(domain => domain !== currentHost)
        ]);

        domains.forEach(domain => {
            const settings = getDomainSettings(domain);
            const domainItem = createDomainItem(domain, settings);
            domainList.appendChild(domainItem);
        });

        // 添加新域名
        const addDomainSection = createAddDomainSection();
        panel.appendChild(addDomainSection);

        // 组装面板
        document.body.appendChild(panel);

        // 点击外部关闭
        panel.addEventListener('click', e => e.stopPropagation());
        document.addEventListener('click', () => panel.remove(), { once: true });

        // 面板元素样式
        GM_addStyle(`
            .cp-pro-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ffffff;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(0,0,0,0.2);
                z-index: 2147483647;
                width: 90%;
                max-width: 500px;
                font-family: Arial, sans-serif;
                max-height: 80vh;
                overflow-y: auto;
            }
            .cp-pro-panel-header {
                border-bottom: 2px solid #eee;
                padding-bottom: 15px;
                margin-bottom: 20px;
                position: relative;
            }
            .cp-pro-close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: transparent;
                border: none;
                font-size: 24px;
                color: #aaa;
                cursor: pointer;
            }
            .cp-pro-close-btn:hover {
                color: #000;
            }
            .cp-pro-domain-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                margin: 8px 0;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .cp-pro-switch {
                position: relative;
                display: inline-block;
                margin: 0 10px;
            }
            .cp-pro-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .cp-pro-switch .slider {
                position: relative;
                cursor: pointer;
                width: 40px;
                height: 20px;
                background-color: #ccc;
                transition: .4s;
                border-radius: 20px;
                display: inline-block;
                vertical-align: middle;
            }
            .cp-pro-switch input:checked + .slider {
                background-color: #4CAF50;
            }
            .cp-pro-switch .slider:before {
                content: "";
                position: absolute;
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            .cp-pro-switch input:checked + .slider:before {
                transform: translateX(20px);
            }
            .cp-pro-search-domain {
                width: 30%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-right: 8px;
            }
            .cp-pro-add-domain {
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }
            .cp-pro-add-domain input {
                width: 70%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-right: 8px;
            }
            .cp-pro-add-btn {
                background: #2196F3;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }
            .cp-pro-delete-btn {
                background: #ff4d4d;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .cp-pro-delete-btn:hover {
                background: #ff1a1a;
            }
        `);
    }

    //空域名过滤
    function filterDomains(keyword) {
        document.querySelectorAll('.cp-pro-domain-item').forEach(item => {
            const domain = item.querySelector('span').textContent;
            item.style.display = domain.includes(keyword) ? '' : 'none';
        });
    }

    function createDomainItem(domain, settings) {
        const item = document.createElement('div');
        item.className = 'cp-pro-domain-item';

        const domainName = document.createElement('span');
        domainName.textContent = domain;
        item.appendChild(domainName);

        const toggleSwitch = createToggleSwitch('解除复制保护 ', settings.enableCopy, (checked) => {
            if (!siteSettings[domain]) {
                siteSettings[domain] = {};
            }
            siteSettings[domain].enableCopy = checked;
            if (checked) {
                enableGlobalProtection(domain);
            } else {
                disableGlobalProtection(domain);
            }
            saveSiteSettings();
            updateSmartSwitch(domain);
        });
        item.appendChild(toggleSwitch);

        const floatWindowSwitch = createToggleSwitch('显示悬浮窗 ', settings.showSwitch, (checked) => {
            if (!siteSettings[domain]) {
                siteSettings[domain] = {};
            }
            siteSettings[domain].showSwitch = checked;
            saveSiteSettings();
            updateSmartSwitch(domain);
        });
        item.appendChild(floatWindowSwitch);

        const deleteButton = createDeleteButton(domain, item);
        item.appendChild(deleteButton);

        return item;
    }

    function updateSmartSwitch(domain) {
        document.querySelectorAll('.cp-pro-smart-switch').forEach(el => el.remove());
        createSmartSwitch(domain);
    }

    function createAddDomainSection() {
        const section = document.createElement('div');
        section.className = 'cp-pro-add-domain';

        const input = document.createElement('input');
        input.placeholder = '请输入域名...';
        section.appendChild(input);

        const addButton = document.createElement('button');
        addButton.className = 'cp-pro-add-btn';
        addButton.textContent = '添加';
        addButton.onclick = () => {
            const domain = input.value.trim();
            if (domain && !siteSettings[domain]) {
                siteSettings[domain] = { enableCopy: false, showSwitch: false };
                const newItem = createDomainItem(domain, siteSettings[domain]);
                document.querySelector('.cp-pro-domain-list').appendChild(newItem);
                saveSiteSettings();
            }
        };
        section.appendChild(addButton);

        return section;
    }

    function createToggleSwitch(labelText, initialState, onChange) {
        const label = document.createElement('label');
        label.className = 'cp-pro-switch';
        label.innerHTML = labelText;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = initialState;
        input.onchange = (e) => {
            const checked = e.target.checked;
            onChange(checked);
        };

        const slider = document.createElement('span');
        slider.className = 'slider round';

        label.appendChild(input);
        label.appendChild(slider);
        return label;
    }

    function createDeleteButton(domain, itemElement) {
        const button = document.createElement('button');
        button.className = 'cp-pro-delete-btn'; // 添加类名以便于美化
        button.textContent = '删除';
        button.onclick = () => {
            delete siteSettings[domain];
            saveSiteSettings();
            itemElement.remove(); // 移除对应的列表项
        };
        return button;
    }

    initEngine();
})();
