// ==UserScript==
// @license MIT
// @name         我的可排序右侧模板库 (最终版 - 移动端优化)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  在网页右侧显示可排序、可调整大小、可变列数的模板列表，并支持点击标题插入、按钮复制、导入导出。兼容最严格的CSP/Trusted Types策略。响应式设计，适配移动端。
// @author       YourName
// @match        https://aistudio.google.com/prompts/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541624/%E6%88%91%E7%9A%84%E5%8F%AF%E6%8E%92%E5%BA%8F%E5%8F%B3%E4%BE%A7%E6%A8%A1%E6%9D%BF%E5%BA%93%20%28%E6%9C%80%E7%BB%88%E7%89%88%20-%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541624/%E6%88%91%E7%9A%84%E5%8F%AF%E6%8E%92%E5%BA%8F%E5%8F%B3%E4%BE%A7%E6%A8%A1%E6%9D%BF%E5%BA%93%20%28%E6%9C%80%E7%BB%88%E7%89%88%20-%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const TEMPLATES_KEY = 'myHtmlTemplatesV2';
    const CONFIG_KEY = 'myTemplateConfigV2';
    const PROMPT_TEXTAREA_SELECTOR = 'textarea[aria-label="Start typing a prompt"]';
    const SIDEBAR_ID = 'my-template-sidebar-container';
    // MODIFICATION: Added a breakpoint for mobile view
    const MOBILE_BREAKPOINT = 768;

    // --- 默认配置 ---
    const defaultConfig = {
        width: 380,
        previewHeight: 60,
        isCollapsed: false,
        columns: 1,
    };
    let currentConfig = { ...defaultConfig };


    // --- 内部状态变量 ---
    let templates = [];
    let editingTemplateId = null;
    let draggedElement = null;

    // --- UI 元素引用 ---
    let sidebar, templateListContainer, noTemplatesMessage, templateNameInput,
        templateContentInput, addTemplateBtn, formButtonsDiv, formMessage,
        importExportDiv, settingsDiv, previewHeightInput;

    // MODIFICATION: New function to check for mobile view
    function isMobileView() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // --- 使用 GM_addStyle 注入所有样式 ---
    GM_addStyle(`
        /* --- Base Desktop Styles --- */
        #${SIDEBAR_ID} {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: fixed; top: 0; right: 0; height: 100%; background-color: #f8f8f8;
            border-left: 1px solid #ddd; box-shadow: -2px 0 8px rgba(0,0,0,0.1); z-index: 9999;
            transition: transform 0.3s ease-in-out; overflow: hidden;
            color: #333; box-sizing: border-box; display: flex; flex-direction: column;
        }
        #${SIDEBAR_ID}.collapsed { transform: translateX(100%); }
        #${SIDEBAR_ID}-toggle-btn {
            position: fixed;
            top: 10px;
            right: 0; /* JS will set this for desktop */
            width: 30px;
            height: 30px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            font-size: 1.2em;
            line-height: 30px;
            text-align: center;
            box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
            z-index: 10000;
            transition: right 0.3s ease-in-out, top 0.3s ease-in-out, background-color 0.3s ease-in-out;
        }
        #${SIDEBAR_ID}-resize-handle {
            position: absolute; top: 0; left: 0; width: 8px; height: 100%;
            cursor: ew-resize; z-index: 10001;
        }

        /* --- Common Inner Styles (no changes needed here) --- */
        #${SIDEBAR_ID} #my-template-main-content { flex-grow: 1; overflow-y: auto; padding: 20px 15px; }
        #${SIDEBAR_ID} h1, #${SIDEBAR_ID} h2 { color: #2c3e50; text-align: center; margin-bottom: 20px; font-size: 1.2em; }
        #${SIDEBAR_ID} h2 { font-size: 1.1em; margin-top: 25px; }
        #${SIDEBAR_ID} #my-template-list-container { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; min-height: 50px; border: 2px dashed transparent; transition: border-color 0.2s ease; padding: 5px; }
        #${SIDEBAR_ID} #my-template-list-container.drag-over-list { border-color: #3498db; }
        #${SIDEBAR_ID} #my-template-list-container.columns-1 .my-template-card { width: 100%; }
        #${SIDEBAR_ID} #my-template-list-container.columns-2 .my-template-card { width: calc(50% - 8px); }
        #${SIDEBAR_ID} #my-template-list-container.columns-3 .my-template-card { width: calc(33.333% - 10px); }
        #${SIDEBAR_ID} .my-template-card { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); padding: 15px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease; }
        #${SIDEBAR_ID} .my-template-card h3 { margin-top: 0; margin-bottom: 10px; color: #3498db; font-size: 1.1em; word-break: break-word; cursor: pointer; }
        #${SIDEBAR_ID} .my-template-card h3:hover { text-decoration: underline; }
        #${SIDEBAR_ID} .my-template-card.dragging { opacity: 0.4; border: 2px dashed #007bff; }
        #${SIDEBAR_ID} .my-template-card.drag-over-top { border-top: 3px solid #3498db; }
        #${SIDEBAR_ID} .my-template-card.drag-over-bottom { border-bottom: 3px solid #3498db; }
        #${SIDEBAR_ID} .my-template-preview { background-color: #f9f9f9; border: 1px solid #eee; padding: 8px; margin-bottom: 10px; overflow: auto; font-size: 0.85em; color: #555; line-height: 1.3; word-break: break-all; resize: vertical; }
        #${SIDEBAR_ID} .my-template-card-actions { display: flex; justify-content: flex-end; gap: 5px; margin-top: auto; }
        #${SIDEBAR_ID} .my-template-copy-btn, #${SIDEBAR_ID} .my-template-edit-btn, #${SIDEBAR_ID} .my-template-delete-btn { color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 0.9em; transition: background-color 0.2s ease; min-width: 30px; text-align: center; }
        #${SIDEBAR_ID} .my-template-copy-btn { background-color: #28a745; } #${SIDEBAR_ID} .my-template-copy-btn:hover { background-color: #218838; }
        #${SIDEBAR_ID} .my-template-edit-btn { background-color: #007bff; } #${SIDEBAR_ID} .my-template-edit-btn:hover { background-color: #0056b3; }
        #${SIDEBAR_ID} .my-template-delete-btn { background-color: #dc3545; } #${SIDEBAR_ID} .my-template-delete-btn:hover { background-color: #c82333; }
        #${SIDEBAR_ID} #my-template-add-form { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); padding: 20px; margin: 0 auto; }
        #${SIDEBAR_ID} #my-template-add-form label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; font-size: 0.9em; }
        #${SIDEBAR_ID} #my-template-add-form input[type="text"], #${SIDEBAR_ID} #my-template-add-form textarea { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9em; box-sizing: border-box; }
        #${SIDEBAR_ID} #my-template-add-form textarea { min-height: 100px; resize: vertical; }
        #${SIDEBAR_ID} .my-template-form-buttons { display: flex; gap: 8px; justify-content: flex-end; }
        #${SIDEBAR_ID} #my-template-add-btn, #${SIDEBAR_ID} #my-template-cancel-edit-btn { color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 0.9em; transition: background-color 0.2s ease; }
        #${SIDEBAR_ID} #my-template-add-btn { background-color: #007bff; } #${SIDEBAR_ID} #my-template-add-btn:hover { background-color: #0056b3; }
        #${SIDEBAR_ID} #my-template-cancel-edit-btn { background-color: #6c757d; } #${SIDEBAR_ID} #my-template-cancel-edit-btn:hover { background-color: #5a6268; }
        #${SIDEBAR_ID} .my-template-message { margin-top: 10px; padding: 8px; border-radius: 5px; font-weight: bold; text-align: center; font-size: 0.85em; }
        #${SIDEBAR_ID} .my-template-message.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        #${SIDEBAR_ID} .my-template-message.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        #${SIDEBAR_ID} #my-template-no-templates-message { width: 100%; font-size: 0.9em; color: #777; text-align: center; padding: 10px 0; }
        #${SIDEBAR_ID} #my-template-import-export-div { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        #${SIDEBAR_ID} .import-export-btn, #${SIDEBAR_ID} .column-btn { background-color: #5bc0de; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 0.9em; transition: background-color 0.2s ease; }
        #${SIDEBAR_ID} .import-export-btn:hover, #${SIDEBAR_ID} .column-btn:hover { background-color: #31b0d5; }
        #${SIDEBAR_ID} .column-btn.active { background-color: #31b0d5; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
        #${SIDEBAR_ID} #my-template-import-file-input { display: none; }
        #${SIDEBAR_ID} #my-template-settings-div { margin-top: 10px; padding: 10px 0; }
        #${SIDEBAR_ID} .setting-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 0.9em; }
        #${SIDEBAR_ID} .setting-item label { margin-right: 10px; }
        #${SIDEBAR_ID} .setting-item input[type="number"] { width: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; text-align: right; }
        #${SIDEBAR_ID} .setting-item .button-group { display: flex; gap: 5px; }

        /* MODIFICATION: Added responsive styles for mobile */
        @media (max-width: ${MOBILE_BREAKPOINT}px) {
            #${SIDEBAR_ID} {
                /* Override position to fit in the red box area */
                top: 65px;      /* Approx. height of the top header. Adjust if needed. */
                bottom: 75px;   /* Approx. height of the bottom input area. Adjust if needed. */
                height: auto;   /* Let top and bottom define the height */
                width: 100%;    /* Take full width */
                border-left: none;
                transform: translateX(100%); /* Start hidden off-screen */
            }

            /* On mobile, 'collapsed' means it's hidden */
            #${SIDEBAR_ID}.collapsed {
                transform: translateX(100%);
            }

            /* When not collapsed, it slides into view */
            #${SIDEBAR_ID}:not(.collapsed) {
                transform: translateX(0);
            }

            #${SIDEBAR_ID}-toggle-btn {
                /* Move button to be part of the top header icons */
                top: 12px;
                right: 48px; /* Position next to existing icons */
                border-radius: 50%; /* Make it circular to match other icons */
                width: 36px;
                height: 36px;
                line-height: 36px;
                background-color: #444; /* A more subtle color for the header */
            }

            /* Hide the resize handle completely on mobile */
            #${SIDEBAR_ID}-resize-handle {
                display: none;
            }
        }
    `);

    function initializeSidebar() {
        sidebar = document.createElement('div');
        sidebar.id = SIDEBAR_ID;
        document.body.appendChild(sidebar);

        const toggleBtn = document.createElement('button');
        toggleBtn.id = `${SIDEBAR_ID}-toggle-btn`;
        document.body.appendChild(toggleBtn);

        const resizeHandle = document.createElement('div');
        resizeHandle.id = `${SIDEBAR_ID}-resize-handle`;
        sidebar.appendChild(resizeHandle);

        const mainContent = document.createElement('div');
        mainContent.id = 'my-template-main-content';
        sidebar.appendChild(mainContent);

        templateListContainer = document.createElement('div'); templateListContainer.id = 'my-template-list-container'; mainContent.appendChild(templateListContainer);
        noTemplatesMessage = document.createElement('p'); noTemplatesMessage.id = 'my-template-no-templates-message'; noTemplatesMessage.style.display = 'none'; noTemplatesMessage.textContent = '还没有模板，快来添加一个吧！'; templateListContainer.appendChild(noTemplatesMessage);
        const h2_add = document.createElement('h2'); h2_add.textContent = '新增/编辑模板'; mainContent.appendChild(h2_add);
        const addForm = document.createElement('div'); addForm.id = 'my-template-add-form'; mainContent.appendChild(addForm);
        const labelName = document.createElement('label'); labelName.setAttribute('for', 'template-name-input'); labelName.textContent = '模板名称:'; addForm.appendChild(labelName);
        templateNameInput = document.createElement('input'); templateNameInput.type = 'text'; templateNameInput.id = 'template-name-input'; templateNameInput.placeholder = '例如：通用邮件模板'; templateNameInput.required = true; addForm.appendChild(templateNameInput);
        const labelContent = document.createElement('label'); labelContent.setAttribute('for', 'template-content-input'); labelContent.textContent = '模板内容 (HTML/文本):'; addForm.appendChild(labelContent);
        templateContentInput = document.createElement('textarea'); templateContentInput.id = 'template-content-input'; templateContentInput.placeholder = '输入你的HTML或文本内容';templateContentInput.value = "(OOC:\n \n)"; templateContentInput.required = true; addForm.appendChild(templateContentInput);
        formButtonsDiv = document.createElement('div'); formButtonsDiv.className = 'my-template-form-buttons'; addForm.appendChild(formButtonsDiv);
        addTemplateBtn = document.createElement('button'); addTemplateBtn.id = 'my-template-add-btn'; addTemplateBtn.textContent = '添加模板'; formButtonsDiv.appendChild(addTemplateBtn);
        formMessage = document.createElement('div'); formMessage.id = 'form-message'; formMessage.className = 'my-template-message'; formMessage.style.display = 'none'; addForm.appendChild(formMessage);
        importExportDiv = document.createElement('div'); importExportDiv.id = 'my-template-import-export-div'; addForm.appendChild(importExportDiv);
        const exportBtn = document.createElement('button'); exportBtn.className = 'import-export-btn'; exportBtn.textContent = '导出模板'; importExportDiv.appendChild(exportBtn);
        const importBtn = document.createElement('button'); importBtn.className = 'import-export-btn'; importBtn.textContent = '导入模板'; importExportDiv.appendChild(importBtn);
        const importFileInput = document.createElement('input'); importFileInput.type = 'file'; importFileInput.id = 'my-template-import-file-input'; importFileInput.accept = '.json,application/json'; importExportDiv.appendChild(importFileInput);
        settingsDiv = document.createElement('div'); settingsDiv.id = 'my-template-settings-div'; addForm.appendChild(settingsDiv);
        const heightSettingItem = document.createElement('div'); heightSettingItem.className = 'setting-item';
        const heightLabel = document.createElement('label'); heightLabel.setAttribute('for', 'my-template-preview-height-input'); heightLabel.textContent = '预览区高度 (px):';
        previewHeightInput = document.createElement('input'); previewHeightInput.type = 'number'; previewHeightInput.id = 'my-template-preview-height-input'; previewHeightInput.min = '30'; previewHeightInput.step = '10';
        heightSettingItem.appendChild(heightLabel); heightSettingItem.appendChild(previewHeightInput); settingsDiv.appendChild(heightSettingItem);
        const columnSettingItem = document.createElement('div'); columnSettingItem.className = 'setting-item';
        const columnLabel = document.createElement('label'); columnLabel.textContent = '列数:';
        const columnBtnGroup = document.createElement('div'); columnBtnGroup.className = 'button-group';
        [1, 2, 3].forEach(num => {
            const btn = document.createElement('button'); btn.className = 'column-btn'; btn.textContent = num; btn.dataset.columns = num; columnBtnGroup.appendChild(btn);
        });
        columnSettingItem.appendChild(columnLabel); columnSettingItem.appendChild(columnBtnGroup); settingsDiv.appendChild(columnSettingItem);

        bindEvents();
        applyConfig();
    }

    function loadConfig() {
        const storedConfig = GM_getValue(CONFIG_KEY, JSON.stringify(defaultConfig));
        try {
            currentConfig = { ...defaultConfig, ...JSON.parse(storedConfig) };
        } catch(e) {
            currentConfig = { ...defaultConfig };
        }
    }

    function saveConfig() {
        GM_setValue(CONFIG_KEY, JSON.stringify(currentConfig));
    }

    // MODIFICATION: applyConfig is now aware of mobile view
    function applyConfig() {
        const toggleBtn = document.getElementById(`${SIDEBAR_ID}-toggle-btn`);

        // Reset styles that might conflict between views
        sidebar.style.width = '';
        toggleBtn.style.right = '';

        if (isMobileView()) {
            // Mobile: CSS handles positioning. We just toggle the class.
            if (currentConfig.isCollapsed) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        } else {
            // Desktop: JS handles positioning.
            sidebar.style.width = `${currentConfig.width}px`;
            if (currentConfig.isCollapsed) {
                sidebar.classList.add('collapsed');
                toggleBtn.style.right = '0px';
            } else {
                sidebar.classList.remove('collapsed');
                toggleBtn.style.right = `${currentConfig.width}px`;
            }
        }

        // Shared logic
        toggleBtn.textContent = currentConfig.isCollapsed ? '▶' : '◀';
        previewHeightInput.value = currentConfig.previewHeight;
        updatePreviewHeightStyle(currentConfig.previewHeight);
        applyColumnStyle(currentConfig.columns);
    }

    function updatePreviewHeightStyle(height) {
        let styleTag = document.getElementById('my-template-preview-height-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'my-template-preview-height-style';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = `#${SIDEBAR_ID} .my-template-preview { height: ${height}px; }`;
    }

    function applyColumnStyle(num) {
        templateListContainer.classList.remove('columns-1', 'columns-2', 'columns-3');
        templateListContainer.classList.add(`columns-${num}`);
        document.querySelectorAll(`#${SIDEBAR_ID} .column-btn`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.columns == num);
        });
    }

    // MODIFICATION: bindEvents now handles mobile vs desktop
    function bindEvents() {
        const toggleBtn = document.getElementById(`${SIDEBAR_ID}-toggle-btn`);
        const resizeHandle = document.getElementById(`${SIDEBAR_ID}-resize-handle`);
        const exportBtn = document.querySelector(`#${SIDEBAR_ID} .import-export-btn:nth-child(1)`);
        const importBtn = document.querySelector(`#${SIDEBAR_ID} .import-export-btn:nth-child(2)`);
        const importFileInput = document.getElementById('my-template-import-file-input');

        toggleBtn.addEventListener('click', () => {
            currentConfig.isCollapsed = !currentConfig.isCollapsed;
            // The applyConfig function now correctly handles the visual change
            applyConfig();
            saveConfig();
        });

        // Only add the resize handle listener on desktop
        if (!isMobileView()) {
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = sidebar.offsetWidth;
                const onMouseMove = (moveEvent) => {
                    const newWidth = startWidth - (moveEvent.clientX - startX);
                    if (newWidth > 250 && newWidth < window.innerWidth - 50) {
                        currentConfig.width = newWidth; // Live update config
                        sidebar.style.width = `${newWidth}px`;
                        if (!currentConfig.isCollapsed) {
                            toggleBtn.style.right = `${newWidth}px`;
                        }
                    }
                };
                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    // Save the final width
                    saveConfig();
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        previewHeightInput.addEventListener('change', (e) => {
            const newHeight = parseInt(e.target.value, 10);
            if (newHeight >= 30) {
                currentConfig.previewHeight = newHeight;
                updatePreviewHeightStyle(newHeight);
                saveConfig();
            }
        });

        document.querySelectorAll(`#${SIDEBAR_ID} .column-btn`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.dataset.columns, 10);
                currentConfig.columns = num;
                applyColumnStyle(num);
                saveConfig();
            });
        });

        addTemplateBtn.addEventListener('click', saveOrUpdateTemplate);
        exportBtn.addEventListener('click', handleExport);
        importBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', handleImport);

        templateListContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'H3') insertTemplateContent(event);
            else if (target.classList.contains('my-template-copy-btn')) copyToClipboardOnly(event);
            else if (target.classList.contains('my-template-edit-btn')) editTemplate(event);
            else if (target.classList.contains('my-template-delete-btn')) deleteTemplate(event);
        });

        templateListContainer.addEventListener('dragstart', handleDragStart);
        templateListContainer.addEventListener('dragover', handleDragOver);
        templateListContainer.addEventListener('dragleave', handleDragLeave);
        templateListContainer.addEventListener('drop', handleDrop);
        templateListContainer.addEventListener('dragend', handleDragEnd);
    }

    // --- 主执行逻辑 ---
    window.addEventListener('load', () => {
        loadConfig();
        initializeSidebar();
        loadTemplates();
        // MODIFICATION: Add a listener to re-apply styles when resizing between mobile/desktop
        window.addEventListener('resize', applyConfig);
    });

    // --- 数据处理和UI渲染函数 (No changes needed below this line) ---

    function copyToClipboardOnly(event) {
        const button = event.target;
        const card = button.closest('.my-template-card');
        const templateToCopy = templates.find(t => t.id === card.dataset.id);
        if (templateToCopy) {
            GM_setClipboard(templateToCopy.content);
            button.textContent = '已复制!';
            button.style.backgroundColor = '#5cb85c';
            setTimeout(() => {
                button.textContent = '复'; // 恢复为单个汉字
                button.style.backgroundColor = '';
            }, 1500);
        }
    }

    async function insertTemplateContent(event) {
        const title = event.target;
        const card = title.closest('.my-template-card');
        const templateToCopy = templates.find(t => t.id === card.dataset.id);
        if (templateToCopy) {
            try {
                const targetTextarea = document.querySelector(PROMPT_TEXTAREA_SELECTOR);
                if (targetTextarea) {
                    const originalColor = title.style.color;
                    title.style.color = '#28a745';
                    targetTextarea.value += templateToCopy.content + "\n";
                    targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    targetTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                    targetTextarea.focus();
                    targetTextarea.selectionStart = targetTextarea.selectionEnd = targetTextarea.value.length;
                    setTimeout(() => { title.style.color = originalColor; }, 1000);
                } else {
                    console.warn(`Target textarea not found with selector: ${PROMPT_TEXTAREA_SELECTOR}`);
                    alert('未能找到目标输入框，内容已复制到剪贴板。');
                    GM_setClipboard(templateToCopy.content);
                }
            } catch (err) {
                console.error('Insert failed:', err);
                alert('插入失败，请查看控制台。');
            }
        }
    }

    function renderTemplates() {
        while (templateListContainer.firstChild) {
            templateListContainer.removeChild(templateListContainer.firstChild);
        }
        if (templates.length === 0) {
            templateListContainer.appendChild(noTemplatesMessage);
            noTemplatesMessage.style.display = 'block';
            templateListContainer.classList.add('drag-over-list');
            return;
        }
        noTemplatesMessage.style.display = 'none';
        templateListContainer.classList.remove('drag-over-list');
        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'my-template-card';
            card.dataset.id = template.id;
            card.draggable = true;
            const h3 = document.createElement('h3');
            h3.textContent = template.name;
            card.appendChild(h3);
            const previewDiv = document.createElement('div');
            previewDiv.className = 'my-template-preview';
            const previewText = template.content.replace(/<[^>]*>/g, '').slice(0, 200).trim(); // 预览更多字符
            previewDiv.textContent = previewText + (template.content.length > 200 ? '...' : '');
            card.appendChild(previewDiv);
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'my-template-card-actions';
            card.appendChild(actionsDiv);
            const copyBtn = document.createElement('button');
            copyBtn.className = 'my-template-copy-btn';
            copyBtn.textContent = '复'; // 修改按钮文字
            actionsDiv.appendChild(copyBtn);
            const editBtn = document.createElement('button');
            editBtn.className = 'my-template-edit-btn';
            editBtn.textContent = '编'; // 修改按钮文字
            actionsDiv.appendChild(editBtn);
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'my-template-delete-btn';
            deleteBtn.textContent = '删'; // 修改按钮文字
            actionsDiv.appendChild(deleteBtn);
            templateListContainer.appendChild(card);
        });
    }

    function showMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = `my-template-message ${type}`;
        formMessage.style.display = 'block';
        setTimeout(() => { formMessage.style.display = 'none'; }, 3000);
    }

    function clearEditState() {
        templateNameInput.value = '';
        templateContentInput.value = "(OOC:\n \n)";
        addTemplateBtn.textContent = '添加模板';
        editingTemplateId = null;
        const cancelBtn = document.getElementById('my-template-cancel-edit-btn');
        if (cancelBtn) cancelBtn.remove();
        formMessage.style.display = 'none';
    }

    function loadTemplates() {
        const storedTemplates = GM_getValue(TEMPLATES_KEY, '[]');
        try { templates = JSON.parse(storedTemplates); }
        catch (e) { console.error("Error parsing templates:", e); templates = []; }
        renderTemplates();
    }

    function saveTemplates() {
        GM_setValue(TEMPLATES_KEY, JSON.stringify(templates));
    }

    function saveOrUpdateTemplate() {
        const name = templateNameInput.value.trim();
        const content = templateContentInput.value.trim();
        if (!name || !content) { showMessage('模板名称和内容不能为空！', 'error'); return; }
        if (editingTemplateId) {
            const index = templates.findIndex(t => t.id === editingTemplateId);
            if (index !== -1) { templates[index].name = name; templates[index].content = content; showMessage('模板更新成功！', 'success'); }
        } else {
            templates.push({ id: Date.now().toString(), name: name, content: content });
            showMessage('模板添加成功！', 'success');
        }
        saveTemplates();
        renderTemplates();
        clearEditState();
    }

    function editTemplate(event) {
        const card = event.target.closest('.my-template-card');
        const templateToEdit = templates.find(t => t.id === card.dataset.id);
        if (templateToEdit) {
            templateNameInput.value = templateToEdit.name;
            templateContentInput.value = templateToEdit.content;
            addTemplateBtn.textContent = '更新模板';
            editingTemplateId = templateToEdit.id;
            let cancelBtn = document.getElementById('my-template-cancel-edit-btn');
            if (!cancelBtn) {
                cancelBtn = document.createElement('button');
                cancelBtn.id = 'my-template-cancel-edit-btn';
                cancelBtn.textContent = '取消编辑';
                cancelBtn.onclick = clearEditState;
                formButtonsDiv.appendChild(cancelBtn);
            }
            templateNameInput.focus();
            templateNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function deleteTemplate(event) {
        const card = event.target.closest('.my-template-card');
        if (confirm('确定要删除这个模板吗？')) {
            templates = templates.filter(t => t.id !== card.dataset.id);
            saveTemplates();
            renderTemplates();
            showMessage('模板删除成功！', 'success');
            if (editingTemplateId === card.dataset.id) clearEditState();
        }
    }

    function handleExport() {
        if (templates.length === 0) { showMessage('没有模板可以导出。', 'error'); return; }
        const dataStr = JSON.stringify({ templates: templates, config: currentConfig }, null, 4);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_templates_with_config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('模板和配置已导出！', 'success');
    }

    function handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedJSON = JSON.parse(e.target.result);
                let importedData;
                if (Array.isArray(importedJSON)) {
                    importedData = importedJSON;
                } else if (importedJSON.templates && Array.isArray(importedJSON.templates)) {
                    importedData = importedJSON.templates;
                    if (importedJSON.config) {
                        currentConfig = { ...defaultConfig, ...importedJSON.config };
                        saveConfig();
                        applyConfig();
                    }
                } else { throw new Error('JSON文件格式不正确。'); }
                const isValid = importedData.every(item => 'id' in item && 'name' in item && 'content' in item);
                if (!isValid) throw new Error('JSON文件内容不符合模板结构。');
                const confirmation = confirm('导入成功！\n\n点击 "确定" 追加到现有模板，\n点击 "取消" 将覆盖现有模板。');
                if (confirmation) {
                    templates = [...templates, ...importedData];
                    const uniqueIds = new Set();
                    templates = templates.filter(item => { const isDuplicate = uniqueIds.has(item.id); uniqueIds.add(item.id); return !isDuplicate; });
                    showMessage('模板已追加！', 'success');
                } else {
                    templates = importedData;
                    showMessage('模板已覆盖！', 'success');
                }
                saveTemplates();
                renderTemplates();
            } catch (error) {
                showMessage(`导入失败: ${error.message}`, 'error');
                console.error("Import error:", error);
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.my-template-card:not(.dragging)')];
        return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - (box.top + box.height / 2); if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; } }, { offset: -Infinity, element: null }).element;
    }
    function handleDragStart(e) { if (e.target.closest('.my-template-card')) { draggedElement = e.target.closest('.my-template-card'); draggedElement.classList.add('dragging'); } }
    function handleDragOver(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(templateListContainer, e.clientY);
        [...templateListContainer.children].forEach(c => c.classList.remove('drag-over-top', 'drag-over-bottom'));
        if (afterElement == null) { if (templateListContainer.lastChild && templateListContainer.lastChild.classList && templateListContainer.lastChild !== draggedElement) { templateListContainer.lastChild.classList.add('drag-over-bottom'); } } else { if (afterElement !== draggedElement) afterElement.classList.add('drag-over-top'); }
    }
    function handleDragLeave() { [...templateListContainer.children].forEach(c => c.classList.remove('drag-over-top', 'drag-over-bottom')); }
    function handleDrop(e) {
        e.preventDefault();
        if (!draggedElement) return;
        const afterElement = getDragAfterElement(templateListContainer, e.clientY);
        const draggedId = draggedElement.dataset.id;
        const fromIndex = templates.findIndex(t => t.id === draggedId);
        if (fromIndex === -1) return;
        let toIndex;
        if (afterElement == null) { toIndex = templates.length; } else { toIndex = templates.findIndex(t => t.id === afterElement.dataset.id); }
        const item = templates.splice(fromIndex, 1)[0];
        templates.splice(toIndex, 0, item);
        saveTemplates();
        renderTemplates();
    }
    function handleDragEnd() { if (draggedElement) draggedElement.classList.remove('dragging'); handleDragLeave(); }
})();