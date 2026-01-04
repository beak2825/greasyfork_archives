// ==UserScript==
// @name         【SillyTavern / ST酒馆】html代码注入器-改
// @name:zh      【ST酒馆】html代码注入器-改
// @name:zh-CN   【ST酒馆】html代码注入器-改
// @name:zh-TW   【ST酒館】html程式碼注入器-改
// @name:ja      【SillyTavern】 HTMLコードインジェクター-改
// @name:ko      【SillyTavern】 HTML코드 삽입기-수정
// @name:en      【SillyTavern】 HTML Code Injector - Modified 
// @name:fr      【SillyTavern】 Injecteur de code HTML - Modifié
// @name:de      【SillyTavern】 HTML-Code-Injektor - Modifiziert 
// @namespace    https://greasyfork.org/users/590339-miaotouy
// @version      1.1.6.1
// @description  可以让ST酒馆独立运行html代码 (Inject HTML code into SillyTavern pages.)
// @description:zh  可以让ST酒馆独立运行html代码
// @description:zh-CN  可以让ST酒馆独立运行html代码
// @description:zh-TW  讓SillyTavern獨立運行html程式碼
// @description:ja  SillyTavernでhtmlコードを独立して実行できるようにします
// @description:ko  SillyTavern에서 HTML 코드를 독립적으로 실행할 수 있습니다.
// @description:en  Inject HTML code into SillyTavern pages.
// @description:fr  Permet d'exécuter du code HTML de manière indépendante dans SillyTavern.
// @description:de  Ermöglicht die unabhängige Ausführung von HTML-Code in SillyTavern.
// @author       Qianzhuo
// @match        *://localhost:8000/*
// @match        *://127.0.0.1:8000/*
// @match        *://192.168.*.*:*/*
// @match        *://*/*:8000/*
// @match        *://frp-kit.top:*/*
// @include      /^https?:\/\/.*:8000\//
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/512517/%E3%80%90SillyTavern%20%20ST%E9%85%92%E9%A6%86%E3%80%91html%E4%BB%A3%E7%A0%81%E6%B3%A8%E5%85%A5%E5%99%A8-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/512517/%E3%80%90SillyTavern%20%20ST%E9%85%92%E9%A6%86%E3%80%91html%E4%BB%A3%E7%A0%81%E6%B3%A8%E5%85%A5%E5%99%A8-%E6%94%B9.meta.js
// ==/UserScript==
/*
原作者：Qianzhuo
修改者：miaotouy

【SillyTavern / ST酒馆】html代码注入器 © 2024 by Qianzhuo is licensed under CC BY-NC 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc/4.0/
*/
(function () {
    'use strict';
    // ---------------------------------------- 全局变量 ----------------------------------------
    let isInjectionEnabled, displayMode, lastMesTextContent, activationMode, customStartFloor, customEndFloor, savedPosition, isEdgeControlsCollapsed;
    let edgeControls, settingsPanel;
    // ---------------------------------------- 初始化函数 ----------------------------------------
    function initScript() {
        if (!document.title.includes('SillyTavern')) {
            console.log('页面标题不是 "SillyTavern"，脚本未运行。');
            return;
        }
        initVariables();
        createUI();
        addEventListeners();
        addDragFunctionality();
        startObservers();
        console.log('HTML注入器脚本已初始化');
    }
    function initVariables() {
        isInjectionEnabled = false;
        displayMode = parseInt(GM_getValue('displayMode', 1));
        lastMesTextContent = '';
        activationMode = GM_getValue('activationMode', 'all');
        customStartFloor = GM_getValue('customStartFloor', 1);
        customEndFloor = GM_getValue('customEndFloor', -1);
        savedPosition = GM_getValue('edgeControlsPosition', 'top-right');
        isEdgeControlsCollapsed = GM_getValue('isEdgeControlsCollapsed', true);
    }
    // ---------------------------------------- UI 创建函数 ----------------------------------------
    function createUI() {
        createSettingsPanel();
        createEdgeControls();
        addStyles();
    }
    function createSettingsPanel() {
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'html-injector-settings';
        settingsPanel.classList.add('drawer');
        settingsPanel.style.display = 'none';
        settingsPanel.innerHTML = `
            <div id="html-injector-settings-header" class="inline-drawer-header">
                <span class="inline-drawer-title">HTML注入器设置</span>
                <div id="html-injector-close-settings" class="inline-drawer-icon fa-solid fa-circle-xmark"></div>
            </div>
            <div id="settings-content">
                <div class="settings-section">
                    <h3 class="settings-subtitle">边缘控制面板位置</h3>
                    <select id="edge-controls-position" class="settings-select theme-element">
                    <option value="top-right">界面右上角</option>
                    <option value="right-three-quarters">界面右侧3/4位置</option>
                    <option value="right-middle">界面右侧中间</option>
                </select>
                </div>
                <div class="settings-section">
                <h3 class="settings-subtitle">显示模式</h3>
                <label class="settings-option"><input type="radio" name="display-mode" value="1" ${displayMode === 1 ? 'checked' : ''}> 原代码和注入效果一起显示</label>
                <label class="settings-option"><input type="radio" name="display-mode" value="2" ${displayMode === 2 ? 'checked' : ''}> 原代码以摘要形式显示</label>
                <label class="settings-option"><input type="radio" name="display-mode" value="3" ${displayMode === 3 ? 'checked' : ''}> 隐藏原代码，只显示注入效果</label>
            </div>
                <div class="settings-section">
                    <h3 class="settings-subtitle">激活楼层</h3>
                    <select id="activation-mode" class="settings-select theme-element">
                        <option value="all">全部楼层</option>
                        <option value="first">第一层</option>
                        <option value="last">最后一层</option>
                        <option value="lastN">最后N层</option>
                        <option value="custom">自定义楼层</option>
                    </select>
                    <div id="custom-floor-settings" class="settings-subsection" style="display: none;">
                        <label class="settings-option">起始楼层: <input type="number" id="custom-start-floor" min="1" value="1"></label>
                        <label class="settings-option">结束楼层: <input type="number" id="custom-end-floor" min="-1" value="-1"></label>
                        <p class="settings-note">（-1 表示最后一层）</p>
                    </div>
                    <div id="last-n-settings" class="settings-subsection" style="display: none;">
                        <label class="settings-option">最后 <input type="number" id="last-n-floors" min="1" value="1"> 层</label>
                    </div>
                </div>
            </div>
            <div class="settings-footer">
                <p>安全提醒：请仅注入您信任的代码。不安全的代码可能会对您的系统造成潜在风险。</p>
                <p>注意：要注入的 HTML 代码应该用 \`\`\` 包裹，例如：</p>
                <pre class="code-example">
\`\`\`
&lt;h1&gt;Hello, World!&lt;/h1&gt;
&lt;p&gt;This is an example.&lt;/p&gt;
\`\`\`
        </pre>
        <p>以下是对应ST酒馆功能的特殊类名及简单的使用方法：</p>
        <pre class="code-example">
\`\`\`
&lt;button class="qr-button"&gt;(你的QR按钮名字)&lt;/button&gt;
&lt;textarea class="st-text"&gt;(对应酒馆的输入文本框，输入内容会同步到酒馆的文本框里)&lt;/textarea&gt;
&lt;button class="st-send-button"&gt;(对应酒馆的发送按钮)&lt;/button&gt;
\`\`\`
                </pre>
                <p>【注意】通过JavaScript动态插入st-text框的内容同步到st酒馆的输入框需要处理时间，如果需要同步，请添加一个小延迟来确保文本有时间进行同步.</p>
                <a href="https://discord.com/channels/1134557553011998840/1271783456690409554" target="_blank"> →Discord教程帖指路← 有详细说明与gal界面等模版 </a>
            </div>
        `;
        document.body.appendChild(settingsPanel);
    }
    function createEdgeControls() {
        edgeControls = document.createElement('div');
        edgeControls.id = 'html-injector-edge-controls';
        edgeControls.innerHTML = `
            <div id="html-injector-drag-handle">
                <div class="drag-dots"></div>
            </div>
            <label class="html-injector-switch">
                <input type="checkbox" id="edge-injection-toggle">
                <span class="html-injector-slider"></span>
            </label>
            <button id="html-injector-toggle-panel" class="html-injector-button menu_button">显示面板</button>
        `;
        document.body.appendChild(edgeControls);
        // 创建拖拽点
        const dragDots = edgeControls.querySelector('.drag-dots');
        for (let i = 0; i < 3; i++) {
            const column = document.createElement('div');
            column.style.display = 'flex';
            column.style.flexDirection = 'column';
            column.style.justifyContent = 'space-between';
            column.style.height = '15px'; // 调整高度以适应三个点
            for (let j = 0; j < 2; j++) {
                const dot = document.createElement('div');
                dot.style.width = '4px';
                dot.style.height = '4px';
                dot.style.borderRadius = '50%';
                dot.style.backgroundColor = 'var(--smart-theme-body-color)';
                column.appendChild(dot);
            }
            dragDots.appendChild(column);
        }
        const toggleEdgeControlsButton = document.createElement('button');
        toggleEdgeControlsButton.id = 'toggle-edge-controls';
        toggleEdgeControlsButton.textContent = '>>';
        toggleEdgeControlsButton.style.cssText = `
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            background-color: var(--SmartThemeBlurTintColor, rgba(22, 11, 18, 0.73));
            color: var(--SmartThemeBodyColor, rgba(220, 220, 210, 1));
            border: 1px solid var(--SmartThemeBorderColor, rgba(217, 90, 157, 0.5));
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            padding: 5px;
            user-select: none;
            font-size: 12px;
            height: 60px;
        `;
        edgeControls.appendChild(toggleEdgeControlsButton);
        updateEdgeControlsPosition(savedPosition);
        updateEdgeControlsDisplay();
    }
    
    // ---------------------------------------- 事件监听器 ----------------------------------------
    function addEventListeners() {
        addSettingsPanelListeners();
        addEdgeControlsListeners();
        addGlobalListeners();
        document.getElementsByName('display-mode').forEach(radio => {
            radio.addEventListener('change', handleDisplayModeChange);
        });
    }
    function addSettingsPanelListeners() {
        document.getElementById('activation-mode').addEventListener('change', handleActivationModeChange);
        document.getElementById('custom-start-floor').addEventListener('change', handleCustomStartFloorChange);
        document.getElementById('custom-end-floor').addEventListener('change', handleCustomEndFloorChange);
        document.getElementById('last-n-floors').addEventListener('change', handleLastNFloorsChange);
        document.getElementsByName('display-mode').forEach(radio => {
            radio.addEventListener('change', handleDisplayModeChange);
        });
        document.getElementById('html-injector-close-settings').addEventListener('click', toggleSettingsPanel);
    }
    function addEdgeControlsListeners() {
        document.getElementById('edge-injection-toggle').addEventListener('change', handleToggleChange);
        document.getElementById('html-injector-toggle-panel').addEventListener('click', toggleSettingsPanel);
        document.getElementById('toggle-edge-controls').addEventListener('click', toggleEdgeControls);
        addDragFunctionality();
    }
    function addGlobalListeners() {
        window.addEventListener('message', handleMessage);
        window.addEventListener('resize', handleResize);
        window.matchMedia('(prefers-color-scheme: dark)').addListener(updateAllIframesTheme);
    }
    function addDragFunctionality() {
        const dragHandle = document.getElementById('html-injector-drag-handle');
        const edgeControls = document.getElementById('html-injector-edge-controls');
        let isDragging = false;
        let startY, startTop;
        function handleDragStart(e) {
            isDragging = true;
            startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            startTop = edgeControls.offsetTop;
            e.preventDefault();
        }
        function handleDragMove(e) {
            if (!isDragging) return;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            let newTop = startTop + (clientY - startY);
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - edgeControls.offsetHeight));
            edgeControls.style.top = newTop + 'px';
        }
        function handleDragEnd() {
            isDragging = false;
        }
        dragHandle.addEventListener('mousedown', handleDragStart);
        dragHandle.addEventListener('touchstart', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
    }

    // ---------------------------------------- 观察器和定时器 ----------------------------------------
    function startObservers() {
        const observer = new MutationObserver(handleDOMMutations);
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(checkLastMesTextChange, 2000);
    }
    // ---------------------------------------- 核心功能函数 ----------------------------------------
    function injectHtmlCode(specificMesText = null) {
        try {
            let mesTextElements = specificMesText ? [specificMesText] : Array.from(document.getElementsByClassName('mes_text'));
            let targetElements;
            switch (activationMode) {
                case 'first':
                    targetElements = mesTextElements.slice(0, 1);
                    break;
                case 'last':
                    targetElements = mesTextElements.slice(-1);
                    break;
                case 'lastN':
                    targetElements = mesTextElements.slice(-customEndFloor);
                    break;
                case 'custom': {
                    const start = customStartFloor - 1;
                    const end = customEndFloor === -1 ? undefined : customEndFloor;
                    targetElements = mesTextElements.slice(start, end);
                    break;
                }
                default: // 'all'
                    targetElements = mesTextElements;
            }
            for (const mesText of targetElements) {
                const codeElements = mesText.getElementsByTagName('code');
                for (const codeElement of codeElements) {
                    let htmlContent = codeElement.innerText.trim();
                    if (htmlContent.startsWith('<') && htmlContent.endsWith('>')) {
                        const iframe = document.createElement('iframe');
                        iframe.style.width = '100%';
                        iframe.style.border = 'none';
                        iframe.style.marginTop = '10px';
                        iframe.srcdoc = `
<html>
    <head>
        <style>
            /* 自定义样式 */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.5);
            }
            [data-theme="dark"] ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
            }
            [data-theme="dark"] ::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
            }
            [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            .container[data-theme="light"] {
                --bg-color: rgba(240, 240, 255, 0.1);
                --text-color: #1e1e1e;
                --border-color: rgba(139,226,115,0.3);
                --nav-bg-color: rgba(240,240,255,0.4);
            }
            .container[data-theme="dark"] {
                --bg-color: rgba(40, 40, 40, 0.2);
                --text-color: #e0e0e0;
                --border-color: rgba(74,74,74,0.3);
                --nav-bg-color: rgba(30,30,30,0.4);
            }
            .container {
                background-color: var(--bg-color);
                color: var(--text-color);
            }
            .container .left-nav {
                background-color: var(--nav-bg-color);
            }
            .container .button, .container .left-nav .section {
                border: 1px solid var(--border-color);
            }
        </style>
    </head>
    <body>
        <div class="theme-content">
            ${htmlContent}
        </div>
        <script>
            window.addEventListener('load', function() {
                window.parent.postMessage('loaded', '*');
                const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                function handleThemeChange(e) {
                    document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                    window.parent.postMessage({type: 'themeChange', theme: e.matches ? 'dark' : 'light'}, '*');
                }
                darkModeMediaQuery.addListener(handleThemeChange);
                handleThemeChange(darkModeMediaQuery);
                document.querySelectorAll('.qr-button').forEach(button => {
                    button.addEventListener('click', function() {
                        const buttonName = this.textContent.trim();
                        window.parent.postMessage({type: 'buttonClick', name: buttonName}, '*');
                    });
                });
                document.querySelectorAll('.st-text').forEach(textarea => {
                    textarea.addEventListener('input', function() {
                        window.parent.postMessage({type: 'textInput', text: this.value}, '*');
                    });
                    textarea.addEventListener('change', function() {
                        window.parent.postMessage({type: 'textInput', text: this.value}, '*');
                    });
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                                window.parent.postMessage({type: 'textInput', text: textarea.value}, '*');
                            }
                        });
                    });
                    observer.observe(textarea, { attributes: true });
                });
                document.querySelectorAll('.st-send-button').forEach(button => {
                    button.addEventListener('click', function() {
                        window.parent.postMessage({type: 'sendClick'}, '*');
                    });
                });
            });
            window.addEventListener('message', function(event) {
                if (event.data.type === 'themeChange') {
                    document.body.setAttribute('data-theme', event.data.theme);
                }
            });
        </script>
    </body>
</html>
                        `;
                        if (displayMode === 2) {
                            const details = document.createElement('details');
                            const summary = document.createElement('summary');
                            summary.textContent = '[原代码]';
                            details.appendChild(summary);
                            codeElement.parentNode.insertBefore(details, codeElement);
                            details.appendChild(codeElement);
                        } else if (displayMode === 3) {
                            codeElement.style.display = 'none';
                        }
                        codeElement.parentNode.insertBefore(iframe, codeElement.nextSibling);
                        iframe.onload = function () {
                            adjustIframeHeight(iframe);
                            setTimeout(() => adjustIframeHeight(iframe), 500);
                        };
                        if (iframe.contentWindow) {
                            const resizeObserver = new ResizeObserver(() => adjustIframeHeight(iframe));
                            resizeObserver.observe(iframe.contentWindow.document.body);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('HTML注入失败:', error);
        }
    }
    function removeInjectedIframes() {
        const iframes = document.querySelectorAll('.mes_text iframe');
        iframes.forEach(iframe => iframe.remove());
        const codeElements = document.querySelectorAll('.mes_text code');
        codeElements.forEach(code => {
            code.style.display = '';
            const details = code.closest('details');
            if (details) {
                details.parentNode.insertBefore(code, details);
                details.remove();
            }
        });
    }
    // ---------------------------------------- 辅助函数 ----------------------------------------
    function adjustIframeHeight(iframe) {
        try {
            if (iframe.contentWindow.document.body) {
                const height = iframe.contentWindow.document.documentElement.scrollHeight;
                iframe.style.height = (height + 5) + 'px';
            }
        } catch (error) {
            console.error('调整iframe高度失败:', error);
        }
    }
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function updateAllIframesTheme() {
        const iframes = document.querySelectorAll('.mes_text iframe');
        iframes.forEach(iframe => {
            try {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'themeChange', theme: getSystemTheme() }, '*');
                }
            } catch (error) {
                console.error('更新iframe主题失败:', error);
            }
        });
    }
    function updateEdgeControlsPosition(position) {
        if (!edgeControls) return;
        switch (position) {
            case 'top-right':
                edgeControls.style.top = '20vh';
                edgeControls.style.transform = 'none';
                break;
            case 'right-three-quarters':
                edgeControls.style.top = '75vh';
                edgeControls.style.transform = 'none';
                break;
            case 'right-middle':
                edgeControls.style.top = '50%';
                edgeControls.style.transform = 'translateY(-50%)';
                break;
        }
        edgeControls.style.right = isEdgeControlsCollapsed ? '-100px' : '0';
        GM_setValue('edgeControlsPosition', position);
    }
    function updateEdgeControlsDisplay() {
        if (!edgeControls) return;
        edgeControls.style.right = isEdgeControlsCollapsed ? '-100px' : '0';
        const toggleButton = document.getElementById('toggle-edge-controls');
        if (toggleButton) {
            toggleButton.textContent = isEdgeControlsCollapsed ? '<<' : '>>';
        }
    }   
    function toggleSettingsPanel() {
        const isVisible = settingsPanel.style.display === 'block';
        settingsPanel.style.display = isVisible ? 'none' : 'block';
        document.getElementById('html-injector-toggle-panel').textContent = isVisible ? '显示面板' : '隐藏面板';
    }
    function toggleEdgeControls() {
        isEdgeControlsCollapsed = !isEdgeControlsCollapsed;
        GM_setValue('isEdgeControlsCollapsed', isEdgeControlsCollapsed);
        updateEdgeControlsDisplay();
    }
    function handleResize() {
        updateEdgeControlsPosition(savedPosition);
    }
    function handleActivationModeChange() {
        const customSettings = document.getElementById('custom-floor-settings');
        const lastNSettings = document.getElementById('last-n-settings');
        customSettings.style.display = this.value === 'custom' ? 'block' : 'none';
        lastNSettings.style.display = this.value === 'lastN' ? 'block' : 'none';
        activationMode = this.value;
        GM_setValue('activationMode', activationMode);
        if (isInjectionEnabled) {
            removeInjectedIframes();
            injectHtmlCode();
        }
    }
    function handleCustomStartFloorChange() {
        customStartFloor = parseInt(this.value);
        GM_setValue('customStartFloor', customStartFloor);
        if (isInjectionEnabled) {
            removeInjectedIframes();
            injectHtmlCode();
        }
    }
    function handleCustomEndFloorChange() {
        customEndFloor = parseInt(this.value);
        GM_setValue('customEndFloor', customEndFloor);
        if (isInjectionEnabled) {
            removeInjectedIframes();
            injectHtmlCode();
        }
    }
    function handleLastNFloorsChange() {
        customEndFloor = parseInt(this.value);
        GM_setValue('customEndFloor', customEndFloor);
        if (isInjectionEnabled) {
            removeInjectedIframes();
            injectHtmlCode();
        }
    }
    function handleDisplayModeChange(event) {
        displayMode = parseInt(event.target.value);
        GM_setValue('displayMode', displayMode);
        if (isInjectionEnabled) {
            removeInjectedIframes();
            injectHtmlCode();
        }
    }
    function handleToggleChange(e) {
        isInjectionEnabled = e.target.checked;
        document.getElementById('edge-injection-toggle').checked = isInjectionEnabled;
        if (isInjectionEnabled) {
            injectHtmlCode();
        } else {
            removeInjectedIframes();
        }
    }
    function handleMessage(event) {
        try {
            if (event.data === 'loaded') {
                const iframes = document.querySelectorAll('.mes_text iframe');
                iframes.forEach(iframe => {
                    if (iframe.contentWindow === event.source) {
                        adjustIframeHeight(iframe);
                    }
                });
            } else if (event.data.type === 'buttonClick') {
                const buttonName = event.data.name;
                jQuery('.qr--button.menu_button').each(function () {
                    if (jQuery(this).find('.qr--button-label').text().trim() === buttonName) {
                        jQuery(this).click();
                        return false;
                    }
                });
            } else if (event.data.type === 'textInput') {
                const sendTextarea = document.getElementById('send_textarea');
                if (sendTextarea) {
                    sendTextarea.value = event.data.text;
                    sendTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    sendTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else if (event.data.type === 'sendClick') {
                const sendButton = document.getElementById('send_but');
                if (sendButton) {
                    sendButton.click();
                }
            }
        } catch (error) {
            console.error('处理消息失败:', error);
        }
    }
    function handleDOMMutations(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.classList.contains('mes_text') || node.querySelector('.mes_text'))) {
                        if (isInjectionEnabled) {
                            injectHtmlCode();
                        }
                        break;
                    }
                }
            }
        }
    }
    function checkLastMesTextChange() {
        const mesTextElements = document.getElementsByClassName('mes_text');
        if (mesTextElements.length > 0) {
            const lastMesText = mesTextElements[mesTextElements.length - 1];
            const codeElement = lastMesText.querySelector('code');
            if (codeElement) {
                const currentContent = codeElement.innerText.trim();
                const injectedIframe = lastMesText.querySelector('iframe');
                if (currentContent !== lastMesTextContent || (isInjectionEnabled && !injectedIframe)) {
                    lastMesTextContent = currentContent;
                    if (isInjectionEnabled) {
                        if (injectedIframe) {
                            injectedIframe.remove();
                        }
                        injectHtmlCode(lastMesText);
                        const newIframe = lastMesText.querySelector('iframe');
                        if (newIframe) {
                            newIframe.onload = function () {
                                const currentTheme = getSystemTheme();
                                newIframe.contentWindow.postMessage({ type: 'themeChange', theme: currentTheme }, '*');
                            };
                        }
                    }
                }
            } else {
                if (lastMesTextContent !== '') {
                    lastMesTextContent = '';
                    const injectedIframe = lastMesText.querySelector('iframe');
                    if (injectedIframe) {
                        injectedIframe.remove();
                    }
                }
            }
        }
    }
    // ---------------------------------------- 样式函数 ----------------------------------------
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 通用变量 */
            :root {
                --smart-theme-blur-tint: var(--SmartThemeBlurTintColor, rgba(22, 11, 18, 0.73));
                --smart-theme-body-color: var(--SmartThemeBodyColor, rgba(220, 220, 210, 1));
                --smart-theme-border-color: var(--SmartThemeBorderColor, rgba(217, 90, 157, 0.5));
                --smart-theme-button-bg: var(--SmartThemeButtonBG, rgba(74, 74, 74, 0.5));
                --smart-theme-button-hover-bg: var(--SmartThemeButtonHoverBG, rgba(90, 90, 90, 0.7));
                --smart-theme-blur-strength: var(--SmartThemeBlurStrength, 6px);
            }
            /* 边缘控制面板样式 */
            #html-injector-edge-controls {
                position: fixed;
                right: -80px;
                top: 20vh;
                transition: right 0.3s ease-in-out;
                background-color: var(--smart-theme-blur-tint);
                border: 1px solid var(--smart-theme-border-color);
                border-radius: 10px 0 0 10px;
                padding: 10px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100px;
                color: var(--smart-theme-body-color);
                backdrop-filter: blur(var(--smart-theme-blur-strength));
            }
            /* 开关样式 */
            #html-injector-edge-controls .html-injector-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            #html-injector-edge-controls .html-injector-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            #html-injector-edge-controls .html-injector-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(128, 128, 128, 0.3);
                transition: .2s;
                border-radius: 24px;
            }
            #html-injector-edge-controls .html-injector-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: var(--smart-theme-body-color);
                transition: .2s;
                border-radius: 50%;
            }
            #html-injector-edge-controls .html-injector-switch input:checked + .html-injector-slider {
                background-color: var(--smart-theme-border-color);
            }
            #html-injector-edge-controls .html-injector-switch input:checked + .html-injector-slider:before {
                transform: translateX(26px);
            }
            /* 按钮样式 */
            #html-injector-edge-controls .html-injector-button {
                font-size: 14px;
                padding: 5px 10px;
                margin-top: 10px;
                width: 100%;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                background-color: var(--smart-theme-button-bg);
                color: var(--smart-theme-body-color);
                border: 1px solid var(--smart-theme-border-color);
                border-radius: 5px;
                transition: background-color 0.3s, color 0.3s;
            }
            #html-injector-edge-controls .html-injector-button:hover {
                background-color: var(--smart-theme-button-hover-bg);
            }
            /* 拖拽句柄样式 */
            #html-injector-edge-controls #html-injector-drag-handle {
                width: 100%;
                height: 20px;
                background-color: var(--smart-theme-border-color);
                cursor: ns-resize;
                margin-bottom: 10px;
                border-radius: 5px 5px 0 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #html-injector-edge-controls #html-injector-drag-handle .drag-dots {
                display: flex;
                justify-content: space-between;
                width: 20px;
                height: 15px;
            }
            #html-injector-edge-controls #html-injector-drag-handle .drag-dots > div {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            #html-injector-edge-controls #html-injector-drag-handle .drag-dots > div > div {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: var(--smart-theme-body-color);
            }
            #html-injector-edge-controls #html-injector-drag-handle:hover .drag-dots > div > div {
                background-color: var(--smart-theme-button-hover-bg);
            }
            
            /* 设置面板样式 */
            #html-injector-settings {
                position: fixed;
                top: 3vh;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 800px;
                height: auto;
                max-height: 90vh;
                background-color: var(--smart-theme-blur-tint);
                border: 1px solid var(--smart-theme-border-color);
                border-radius: 10px;
                padding: 20px;
                z-index: 10000;
                color: var(--smart-theme-body-color);
                backdrop-filter: blur(10px);
                display: flex;
                flex-direction: column;
                overflow-y: auto;
            }
            #html-injector-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--smart-theme-border-color);
            }
            #html-injector-close-settings {
                cursor: pointer;
                font-size: 24px;
            }
            #settings-content {
                flex-grow: 1;
                overflow-y: auto;
                padding-right: 10px;
                margin-top: 15px;
                max-height: calc(85vh - 150px);
            }
            .settings-footer {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid var(--smart-theme-border-color);
            }
            /* 滚动条样式 */
            #settings-content::-webkit-scrollbar {
                width: 8px;
            }
            #settings-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
            }
            #settings-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }
            #settings-content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            /* 表单元素样式 */
            #html-injector-settings #settings-content label {
                display: block;
                margin: 10px 0;
                color: var(--smart-theme-body-color);
            }
            #html-injector-settings #settings-content input[type="radio"] {
                margin-right: 5px;
            }
            #html-injector-settings #settings-content input[type="number"],
            #html-injector-settings #activation-mode,
            #html-injector-settings .theme-element {
                background-color: var(--smart-theme-blur-tint);
                color: var(--smart-theme-body-color);
                border: 1px solid var(--smart-theme-border-color);
                padding: 5px;
                border-radius: 3px;
            }
            #html-injector-settings #settings-content input[type="number"] {
                width: 50px;
                margin: 0 5px;
            }
            #html-injector-settings #settings-content input[type="number"]:focus,
            #html-injector-settings #activation-mode:focus,
            #html-injector-settings .theme-element:focus {
                outline: none;
                border-color: #0e639c;
            }
            #html-injector-settings .theme-element option {
                background-color: var(--smart-theme-blur-tint);
            }
            /* 其他样式 */
            #html-injector-settings .settings-section {
                margin-bottom: 15px;
            }
            #html-injector-settings .settings-subtitle {
                font-size: 14px;
                margin: 0 0 5px 0;
                color: var(--smart-theme-body-color);
            }
            #html-injector-settings .settings-option {
                display: block;
                margin: 5px 0;
                font-size: 13px;
            }
            #html-injector-settings .settings-select {
                width: 100%;
                margin-bottom: 5px;
            }
            #html-injector-settings .settings-subsection {
                margin-top: 5px;
                padding-left: 10px;
            }
            #html-injector-settings .settings-note {
                font-size: 12px;
                color: #858585;
                margin: 2px 0;
            }
            #html-injector-settings .settings-footer {
                font-size: 12px;
                color: #858585;
                margin-top: 15px;
            }
            #html-injector-settings .code-example {
                background-color: var(--smart-theme-blur-tint);
                padding: 10px;
                border-radius: 3px;
                overflow-x: auto;
                font-size: 12px;
                color: var(--smart-theme-body-color);
            }
            /* 响应式设计 */
            @media (max-width: 1000px) {
                #html-injector-settings {
                    max-width: none;
                    height: 50vh;
                    max-height: none;
                }
                #settings-content {
                    max-height: calc(80vh - 180px);
                }
                #html-injector-edge-controls {
                    font-size: 10px;
                    min-width: 100px;
                }
                #html-injector-edge-controls button {
                    font-size: 12px;
                    padding: 6px 10px;
                }
                #html-injector-edge-controls .html-injector-switch {
                    width: 50px;
                    height: 28px;
                }
                #html-injector-edge-controls .html-injector-slider:before {
                    height: 20px;
                    width: 20px;
                }
                #html-injector-edge-controls .html-injector-switch input:checked + .html-injector-slider:before {
                    transform: translateX(22px);
                }
            }
        `;
        document.head.appendChild(style);
    
    }
    // ---------------------------------------- 初始化调用 ----------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();
