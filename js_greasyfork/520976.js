// ==UserScript==
// @name         XPath工具
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  按自定义快捷键显示输入框，提供XPath操作和功能
// @author       Ace
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/520976/XPath%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/520976/XPath%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let toolbar = null;
    let settingsPanel = null;
    let currentElement = null;
    let isModifierPressed = false;
    let originalBackgroundColor = '';
    let isDraggingToolbar = false;
    let isDraggingSettings = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let toolbarX = 0;
    let toolbarY = 0;
    let settingsX = 0;
    let settingsY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const defaultConfig = {
        clearOnClose: true,
        hotkey: "Shift+X",
        highlightColor: "#FFF59D",
        selectModifier: "Shift"
    };

    let config = {
        ...defaultConfig,
        ...GM_getValue("xpath_config", {})
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function highlightElement(element) {
        if (currentElement) {
            currentElement.style.backgroundColor = originalBackgroundColor;
        }
        originalBackgroundColor = getComputedStyle(element).backgroundColor;
        element.style.backgroundColor = config.highlightColor;
        currentElement = element;
    }

    function clearHighlight() {
        if (currentElement) {
            currentElement.style.backgroundColor = originalBackgroundColor;
            currentElement = null;
        }
    }

    function getXPath(element) {
        if (element.id) return `//*[@id="${element.id}"]`;
        if (element === document.body) return '/html/body';

        let ix = 0;
        const siblings = element.parentNode.childNodes;
        for (let sibling of siblings) {
            if (sibling === element) {
                return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }

    function exportConfig() {
        const data = JSON.stringify(config, null, 2);
        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: "xpath_config.json",
            saveAs: true
        });
    }

    function importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const imported = JSON.parse(event.target.result);
                    config = {...config, ...imported};
                    GM_setValue("xpath_config", config);
                    updateSettingsDisplay();
                } catch (error) {
                    alert("配置文件解析失败");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function createSettingsPanel() {
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'xpath-settings';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2c3e50;
            padding: 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            display: none;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            min-width: 300px;
            user-select: none;
        `;

        settingsPanel.innerHTML = `
                <h3 style="margin:0 0 15px 0; border-bottom:1px solid #34495e; padding-bottom:10px; cursor: move;">设置</h3>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="clearOnClose" ${config.clearOnClose ? 'checked' : ''}>
                    关闭时清空输入框
                </label>
            </div>
            <div class="setting-item">
                <label>工具栏快捷键：
                    <input type="text" 
                        id="hotkey" 
                        value="${config.hotkey}" 
                        placeholder="例如：Shift+X"
                        style="color: #333; background: #fff">
                </label>
            </div>
            <div class="setting-item">
                <label>元素选择键：
                    <select id="selectModifier" 
                            style="color: #333; 
                                background: #fff;
                                padding: 4px;
                                border: 1px solid #34495e;
                                border-radius: 4px;">
                        <option value="Shift" ${config.selectModifier === 'Shift' ? 'selected' : ''}>Shift</option>
                        <option value="Ctrl" ${config.selectModifier === 'Ctrl' ? 'selected' : ''}>Ctrl</option>
                        <option value="Alt" ${config.selectModifier === 'Alt' ? 'selected' : ''}>Alt</option>
                    </select>
                </label>
            </div>
            <div class="setting-item">
                <label>高亮颜色：
                    <input type="color" 
                        id="highlightColor" 
                        value="${config.highlightColor}"
                        style="height: 30px;
                                padding: 2px;">
                </label>
            </div>
            <div style="margin-top:15px;">
                <button id="exportConfig" style="padding:6px 12px; background:#3498db; border:none; color:white; border-radius:4px;">导出配置</button>
                <button id="importConfig" style="margin-left:10px; padding:6px 12px; background:#3498db; border:none; color:white; border-radius:4px;">导入配置</button>
            </div>
            <div style="margin-top:20px; text-align:right;">
                <button id="saveSettings" style="padding:8px 16px; background:#27ae60; border:none; color:white; border-radius:4px;">保存</button>
                <button id="closeSettings" style="margin-left:10px; padding:8px 16px; background:#e74c3c; border:none; color:white; border-radius:4px;">取消</button>
            </div>
        `;

        const header = settingsPanel.querySelector('h3');
        header.addEventListener('mousedown', startDragSettings);
        document.addEventListener('mousemove', handleDragSettings);
        document.addEventListener('mouseup', stopDragSettings);

        settingsPanel.querySelector('#saveSettings').addEventListener('click', function(e) {
            e.stopPropagation();
            saveSettings();
        });

        settingsPanel.querySelector('#closeSettings').addEventListener('click', function(e) {
            e.stopPropagation();
            settingsPanel.style.display = 'none';
        });

        settingsPanel.querySelector('#exportConfig').addEventListener('click', exportConfig);
        settingsPanel.querySelector('#importConfig').addEventListener('click', importConfig);

        document.body.appendChild(settingsPanel);
    }

    function updateSettingsDisplay() {
        document.getElementById('clearOnClose').checked = config.clearOnClose;
        document.getElementById('hotkey').value = config.hotkey;
        document.getElementById('selectModifier').value = config.selectModifier;
        document.getElementById('highlightColor').value = config.highlightColor;
    }

    function saveSettings() {
        config.clearOnClose = document.getElementById('clearOnClose').checked;
        config.hotkey = document.getElementById('hotkey').value.trim();
        config.selectModifier = document.getElementById('selectModifier').value;
        config.highlightColor = document.getElementById('highlightColor').value;
        GM_setValue("xpath_config", config);
        setupHotkeyListener();
        settingsPanel.style.display = 'none';
    }

    function startDragSettings(e) {
        isDraggingSettings = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = settingsPanel.getBoundingClientRect();
        settingsX = rect.left;
        settingsY = rect.top;
        settingsPanel.style.transform = 'none';
    }

    function handleDragSettings(e) {
        if (!isDraggingSettings) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        settingsPanel.style.left = `${settingsX + dx}px`;
        settingsPanel.style.top = `${settingsY + dy}px`;
    }

    function stopDragSettings() {
        isDraggingSettings = false;
    }

    function parseHotkey(hotkey) {
        const parts = hotkey.split('+').map(p => p.trim().toLowerCase());
        const modifiers = {
            shift: false,
            ctrl: false,
            alt: false,
            meta: false
        };
        let mainKey = '';

        for (const part of parts) {
            switch (part.toLowerCase()) {
                case 'shift': modifiers.shift = true; break;
                case 'ctrl': modifiers.ctrl = true; break;
                case 'alt': modifiers.alt = true; break;
                case 'meta': modifiers.meta = true; break;
                default: mainKey = part;
            }
        }

        return { modifiers, mainKey };
    }

    function handleHotkey(event) {
        const { modifiers, mainKey } = parseHotkey(config.hotkey);
        
        const matchModifiers = 
            event.shiftKey === modifiers.shift &&
            event.ctrlKey === modifiers.ctrl &&
            event.altKey === modifiers.alt &&
            event.metaKey === modifiers.meta;

        const matchKey = mainKey ? event.key.toLowerCase() === mainKey.toLowerCase() : false;

        if (matchModifiers && matchKey) {
            event.preventDefault();
            showToolbar();
        }
    }

    function createToolbar() {
        if (document.getElementById('xpath-toolbar')) return;

        toolbar = document.createElement('div');
        toolbar.id = 'xpath-toolbar';
        toolbar.style.cssText = `
            position: fixed;
            z-index: 9999;
            background: #2c3e50;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: none;
            min-width: 300px;
            user-select: none;
        `;

        toolbar.innerHTML = `
            <div style="position:relative;">
                <div id="toolbarHeader" style="cursor: move; margin-bottom: 10px; padding: 5px; border-radius: 4px; background: #34495e;">
                    XPath工具
                    <button id="settingsBtn" style="float:right; background:none; border:none; color:white; cursor:pointer; padding:0 5px;">⚙</button>
                </div>
                <div style="position:relative; width: 250px;">
                    <input type="text" id="xpath-input" placeholder="输入或生成的XPath" 
                        style="width: 100%;
                               padding: 8px 25px 8px 8px;
                               border: 1px solid #34495e;
                               border-radius: 4px;
                               background: #34495e;
                               color: white;
                               box-sizing: border-box;">
                    <span id="clearInput" 
                        style="position: absolute;
                               right: 8px;
                               top: 50%;
                               transform: translateY(-50%);
                               cursor: pointer;
                               color: #888;
                               padding: 0 5px;
                               background: #34495e;
                               border-radius: 50%;">×</span>
                </div>
                <div style="margin-top:10px;">
                    <button id="deleteBtn" style="padding:6px 12px; background:#e74c3c; border:none; border-radius:4px; color:white; cursor:pointer;">删除元素</button>
                    <label style="margin-left:10px; font-size:0.9em;">
                        <input type="checkbox" id="hideMode"> 隐藏模式
                    </label>
                </div>
            </div>
        `;

        const header = toolbar.querySelector('#toolbarHeader');
        const input = toolbar.querySelector('#xpath-input');
        const deleteBtn = toolbar.querySelector('#deleteBtn');
        const settingsBtn = toolbar.querySelector('#settingsBtn');
        const clearBtn = toolbar.querySelector('#clearInput');

        toolbar.addEventListener('mousedown', e => e.stopPropagation());
        toolbar.addEventListener('click', e => e.stopPropagation());

        header.addEventListener('mousedown', startDragToolbar);
        document.addEventListener('mousemove', handleDragToolbar);
        document.addEventListener('mouseup', stopDragToolbar);

        function startDragToolbar(e) {
            isDraggingToolbar = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = toolbar.getBoundingClientRect();
            toolbarX = rect.left;
            toolbarY = rect.top;
        }

        function handleDragToolbar(e) {
            if (!isDraggingToolbar) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            toolbar.style.left = `${toolbarX + dx}px`;
            toolbar.style.top = `${toolbarY + dy}px`;
        }

        function stopDragToolbar() {
            isDraggingToolbar = false;
        }

        settingsBtn.addEventListener('click', () => {
            settingsPanel.style.display = 'block';
            updateSettingsDisplay();
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            input.focus();
        });

        deleteBtn.addEventListener('click', () => {
            const xpath = input.value;
            if (!xpath) return;

            try {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                if (result.singleNodeValue) {
                    if (toolbar.querySelector('#hideMode').checked) {
                        result.singleNodeValue.style.display = 'none';
                    } else {
                        result.singleNodeValue.remove();
                    }
                    input.value = '';
                }
            } catch (error) {
                alert('无效的XPath表达式');
            }
        });

        document.body.appendChild(toolbar);
    }

    (function init() {
        createToolbar();
        createSettingsPanel();
        setupHotkeyListener();

        document.addEventListener('click', (e) => {
            if (settingsPanel.style.display !== 'block' && 
                !toolbar.contains(e.target) &&
                !isModifierPressed) {
                hideToolbar();
            }

            if (settingsPanel.style.display === 'block' && 
                !settingsPanel.contains(e.target) && 
                !toolbar.contains(e.target)) {
                settingsPanel.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') hideToolbar();
        });

        document.addEventListener('mouseover', (e) => {
            if (isModifierPressed && !toolbar.contains(e.target)) {
                highlightElement(e.target);
            }
        });

        document.addEventListener('click', (e) => {
            if (isModifierPressed && !toolbar.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('xpath-input').value = getXPath(e.target);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === config.selectModifier) isModifierPressed = true;
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === config.selectModifier) {
                isModifierPressed = false;
                clearHighlight();
            }
        });

        GM_registerMenuCommand("XPath工具设置", () => {
            settingsPanel.style.display = 'block';
            updateSettingsDisplay();
        });
    })();

    function setupHotkeyListener() {
        document.removeEventListener('keydown', handleHotkey);
        document.addEventListener('keydown', handleHotkey);
    }

    function showToolbar() {
        toolbar.style.display = 'block';
        toolbar.style.left = `${mouseX}px`;
        toolbar.style.top = `${mouseY}px`;
        document.getElementById('xpath-input').focus();
    }

    function hideToolbar() {
        toolbar.style.display = 'none';
        if (config.clearOnClose) {
            document.getElementById('xpath-input').value = '';
        }
    }
})();