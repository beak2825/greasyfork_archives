// ==UserScript==
// @name         超星网课UEditor粘贴解除限制
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  通过自定义粘贴功能解除超星网课平台UEditor编辑器的粘贴限制，支持选择目标编辑器、自动递增和批量粘贴
// @author       AI助手
// @match        https://mooc1.chaoxing.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      NONE
// @downloadURL https://update.greasyfork.org/scripts/530208/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BEUEditor%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/530208/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BEUEditor%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加自定义样式
    GM_addStyle(`
        .custom-button {
            position: fixed;
            bottom: 20px;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            color: white;
        }
        #custom-paste-button {
            right: 20px;
            background-color: #4CAF50;
        }
        #custom-paste-button:hover {
            background-color: #45a049;
        }
        #batch-paste-button {
            right: 150px;
            background-color: #2196F3;
        }
        #batch-paste-button:hover {
            background-color: #0b7dda;
        }
        .paste-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 10000;
            justify-content: center;
            align-items: center;
        }
        .paste-container {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            width: 80%;
            max-width: 600px;
            max-height: 80%;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        .paste-textarea {
            width: 100%;
            height: 200px;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
        }
        .batch-paste-textarea {
            height: 300px;
        }
        .paste-buttons {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }
        .paste-button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        .paste-insert {
            background-color: #4CAF50;
            color: white;
        }
        .paste-cancel {
            background-color: #f44336;
            color: white;
        }
        .paste-as-html {
            background-color: #2196F3;
            color: white;
        }
        #editor-selector, #batch-editor-selector {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        #editor-selector h4, #batch-editor-selector h4 {
            margin-top: 0;
            margin-bottom: 10px;
        }
        .editor-controls {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        #editor-index, #batch-start-index {
            width: 60px;
            padding: 5px;
            margin: 0 10px;
            text-align: center;
        }
        .editor-nav-button {
            padding: 5px 10px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .editor-refresh {
            padding: 5px 10px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }
        #auto-increment, #skip-empty-lines {
            margin-left: 15px;
            display: flex;
            align-items: center;
        }
        #auto-increment-checkbox, #skip-empty-lines-checkbox {
            margin-right: 5px;
        }
        #editor-info, #batch-editor-info, #line-count-info {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        #debug-info, #batch-debug-info {
            margin-top: 10px;
            padding: 10px;
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            max-height: 150px;
            overflow-y: auto;
        }
        .editor-preview {
            padding: 5px;
            background-color: #e9e9e9;
            border-radius: 4px;
            margin-top: 5px;
            max-height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
        }
        .success-message {
            color: #4CAF50;
            font-weight: bold;
        }
        .warning-message {
            color: #FF9800;
            font-weight: bold;
        }
        .error-message {
            color: #f44336;
            font-weight: bold;
        }
        .progress-bar-container {
            width: 100%;
            height: 20px;
            background-color: #f1f1f1;
            border-radius: 4px;
            margin-top: 10px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        }
    `);
    
    // 存储上次活动的编辑器元素和选区
    let lastActiveEditor = null;
    let lastRange = null;
    
    // 编辑器列表和当前选择的索引
    let editorElements = [];
    let currentEditorIndex = GM_getValue('currentEditorIndex', 0);
    
    // 自动递增设置
    let autoIncrement = GM_getValue('autoIncrement', true);
    let skipEmptyLines = GM_getValue('skipEmptyLines', false);
    
    // 记录日志
    function log(message, isSuccess = false, container = 'debug-info') {
        console.log(`[粘贴脚本] ${message}`);
        const debugInfo = document.getElementById(container);
        if (debugInfo) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const messageClass = isSuccess ? 'success-message' : '';
            debugInfo.innerHTML += `<span class="${messageClass}">[${timeStr}] ${message}</span><br>`;
            debugInfo.scrollTop = debugInfo.scrollHeight;
        }
    }
    
    // 警告日志
    function logWarning(message, container = 'debug-info') {
        console.warn(`[粘贴脚本] ${message}`);
        const debugInfo = document.getElementById(container);
        if (debugInfo) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            debugInfo.innerHTML += `<span class="warning-message">[${timeStr}] ${message}</span><br>`;
            debugInfo.scrollTop = debugInfo.scrollHeight;
        }
    }
    
    // 错误日志
    function logError(message, container = 'debug-info') {
        console.error(`[粘贴脚本] ${message}`);
        const debugInfo = document.getElementById(container);
        if (debugInfo) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            debugInfo.innerHTML += `<span class="error-message">[${timeStr}] ${message}</span><br>`;
            debugInfo.scrollTop = debugInfo.scrollHeight;
        }
    }
    
    // 查找所有可编辑元素
    function findAllEditableElements() {
        log('开始查找所有可编辑元素...');
        editorElements = [];
        
        // 查找所有可编辑元素
        const elements = document.querySelectorAll('[contenteditable="true"], body.view, iframe');
        
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            
            if (el.tagName === 'IFRAME') {
                try {
                    const iframeDoc = el.contentDocument || el.contentWindow.document;
                    if (iframeDoc && iframeDoc.body) {
                        if (iframeDoc.body.contentEditable === 'true' || iframeDoc.body.classList.contains('view')) {
                            editorElements.push({
                                element: iframeDoc.body,
                                type: 'iframe-body',
                                iframe: el,
                                description: `Iframe: ${el.id || el.name || '无名称'}`
                            });
                        }
                    }
                } catch (err) {
                    log(`访问iframe出错: ${err.message}`);
                }
            } else {
                editorElements.push({
                    element: el,
                    type: 'element',
                    description: `${el.tagName}: ${el.id || el.className || '无标识'}`
                });
            }
        }
        
        // 查找UEditor实例
        if (window.UE && UE.instants) {
            for (let key in UE.instants) {
                const editor = UE.instants[key];
                if (editor && editor.body) {
                    // 检查是否已经添加过
                    let alreadyAdded = false;
                    for (let i = 0; i < editorElements.length; i++) {
                        if (editorElements[i].element === editor.body) {
                            alreadyAdded = true;
                            editorElements[i].description = `UEditor: ${key}`;
                            editorElements[i].ueditor = editor;
                            break;
                        }
                    }
                    
                    if (!alreadyAdded) {
                        editorElements.push({
                            element: editor.body,
                            type: 'ueditor',
                            ueditor: editor,
                            description: `UEditor: ${key}`
                        });
                    }
                }
            }
        }
        
        log(`找到 ${editorElements.length} 个可编辑元素`);
        
        // 确保当前索引在有效范围内
        if (editorElements.length > 0) {
            if (currentEditorIndex >= editorElements.length) {
                currentEditorIndex = 0;
            }
            updateEditorInfo();
        }
        
        return editorElements;
    }
    
    // 更新编辑器信息显示
    function updateEditorInfo() {
        const editorInfo = document.getElementById('editor-info');
        const editorPreview = document.getElementById('editor-preview');
        const editorIndexInput = document.getElementById('editor-index');
        const autoIncrementCheckbox = document.getElementById('auto-increment-checkbox');
        
        if (editorInfo && editorPreview && editorIndexInput) {
            if (editorElements.length > 0 && currentEditorIndex < editorElements.length) {
                const editor = editorElements[currentEditorIndex];
                editorInfo.textContent = `当前选择: ${editor.description} (${currentEditorIndex + 1}/${editorElements.length})`;
                
                // 显示编辑器内容预览
                let previewText = '';
                try {
                    previewText = editor.element.textContent || editor.element.innerText || '';
                    previewText = previewText.trim().substring(0, 100) + (previewText.length > 100 ? '...' : '');
                } catch (err) {
                    previewText = '无法获取预览';
                }
                editorPreview.textContent = `预览: ${previewText}`;
                
                // 更新索引输入框
                editorIndexInput.value = currentEditorIndex + 1;
                
                // 保存当前索引
                GM_setValue('currentEditorIndex', currentEditorIndex);
            } else {
                editorInfo.textContent = '未找到可编辑元素';
                editorPreview.textContent = '';
                editorIndexInput.value = '0';
            }
        }
        
        // 更新自动递增复选框
        if (autoIncrementCheckbox) {
            autoIncrementCheckbox.checked = autoIncrement;
        }
        
        // 更新批量粘贴信息
        updateBatchPasteInfo();
    }
    
    // 更新批量粘贴信息
    function updateBatchPasteInfo() {
        const batchEditorInfo = document.getElementById('batch-editor-info');
        const batchStartIndex = document.getElementById('batch-start-index');
        const skipEmptyLinesCheckbox = document.getElementById('skip-empty-lines-checkbox');
        
        if (batchEditorInfo && batchStartIndex) {
            batchEditorInfo.textContent = `找到 ${editorElements.length} 个可编辑元素`;
            batchStartIndex.value = 1;
        }
        
        if (skipEmptyLinesCheckbox) {
            skipEmptyLinesCheckbox.checked = skipEmptyLines;
        }
        
        // 更新行数信息
        updateLineCount();
    }
    
    // 更新行数信息
    function updateLineCount() {
        const batchTextarea = document.getElementById('batch-paste-textarea');
        const lineCountInfo = document.getElementById('line-count-info');
        
        if (batchTextarea && lineCountInfo) {
            const text = batchTextarea.value;
            const lines = text.split('\n');
            const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
            
            lineCountInfo.textContent = `共 ${lines.length} 行${nonEmptyLines !== lines.length ? `（其中非空行 ${nonEmptyLines} 行）` : ''}`;
        }
    }
    
    // 创建自定义粘贴按钮
    function createPasteButton() {
        log('创建粘贴按钮');
        
        // 创建单个粘贴按钮
        const pasteButton = document.createElement('button');
        pasteButton.id = 'custom-paste-button';
        pasteButton.className = 'custom-button';
        pasteButton.textContent = '粘贴内容';
        pasteButton.addEventListener('click', function() {
            saveCurrentEditorAndRange();
            findAllEditableElements();
            showPasteOverlay();
        });
        document.body.appendChild(pasteButton);
        
        // 创建批量粘贴按钮
        const batchPasteButton = document.createElement('button');
        batchPasteButton.id = 'batch-paste-button';
        batchPasteButton.className = 'custom-button';
        batchPasteButton.textContent = '批量粘贴';
        batchPasteButton.addEventListener('click', function() {
            findAllEditableElements();
            showBatchPasteOverlay();
        });
        document.body.appendChild(batchPasteButton);
        
        // 创建粘贴覆盖层
        const overlay = document.createElement('div');
        overlay.id = 'paste-overlay';
        overlay.className = 'paste-overlay';
        overlay.innerHTML = `
            <div id="paste-container" class="paste-container">
                <h3 style="margin-top:0">粘贴内容</h3>
                
                <div id="editor-selector">
                    <h4>选择目标编辑器</h4>
                    <div class="editor-controls">
                        <button class="editor-nav-button" id="prev-editor">&lt; 上一个</button>
                        <input type="number" id="editor-index" min="1" value="1">
                        <button class="editor-nav-button" id="next-editor">下一个 &gt;</button>
                        <button class="editor-refresh" id="refresh-editors">刷新列表</button>
                        <div id="auto-increment">
                            <input type="checkbox" id="auto-increment-checkbox" checked>
                            <label for="auto-increment-checkbox">粘贴后自动递增</label>
                        </div>
                    </div>
                    <div id="editor-info">未找到可编辑元素</div>
                    <div id="editor-preview" class="editor-preview"></div>
                </div>
                
                <p>请在下方粘贴您的内容：</p>
                <textarea id="paste-textarea" class="paste-textarea" placeholder="在此处粘贴内容..."></textarea>
                
                <div class="paste-buttons">
                    <button class="paste-button paste-insert" id="insert-as-text">插入为文本</button>
                    <button class="paste-button paste-as-html" id="insert-as-html">插入为HTML</button>
                    <button class="paste-button paste-cancel" id="cancel-paste">取消</button>
                </div>
                
                <div id="debug-info"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // 创建批量粘贴覆盖层
        const batchOverlay = document.createElement('div');
        batchOverlay.id = 'batch-paste-overlay';
        batchOverlay.className = 'paste-overlay';
        batchOverlay.innerHTML = `
            <div id="batch-paste-container" class="paste-container">
                <h3 style="margin-top:0">批量粘贴内容</h3>
                
                <div id="batch-editor-selector">
                    <h4>批量粘贴设置</h4>
                    <div class="editor-controls">
                        <label for="batch-start-index">起始编辑器索引:</label>
                        <input type="number" id="batch-start-index" min="1" value="1">
                        <button class="editor-refresh" id="batch-refresh-editors">刷新列表</button>
                        <div id="skip-empty-lines">
                            <input type="checkbox" id="skip-empty-lines-checkbox">
                            <label for="skip-empty-lines-checkbox">跳过空行</label>
                        </div>
                    </div>
                    <div id="batch-editor-info">未找到可编辑元素</div>
                </div>
                
                <p>请在下方粘贴多行内容（每行将填入一个编辑器）：</p>
                <textarea id="batch-paste-textarea" class="paste-textarea batch-paste-textarea" placeholder="在此处粘贴多行内容..."></textarea>
                <div id="line-count-info">共 0 行</div>
                
                <div class="paste-buttons">
                    <button class="paste-button paste-insert" id="batch-insert-as-text">批量插入为文本</button>
                    <button class="paste-button paste-as-html" id="batch-insert-as-html">批量插入为HTML</button>
                    <button class="paste-button paste-cancel" id="batch-cancel-paste">取消</button>
                </div>
                
                <div class="progress-bar-container" id="progress-container" style="display:none;">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                
                <div id="batch-debug-info"></div>
            </div>
        `;
        document.body.appendChild(batchOverlay);
        
        // 添加单个粘贴事件监听器
        document.getElementById('insert-as-text').addEventListener('click', () => insertContent(false));
        document.getElementById('insert-as-html').addEventListener('click', () => insertContent(true));
        document.getElementById('cancel-paste').addEventListener('click', hidePasteOverlay);
        
        // 添加批量粘贴事件监听器
        document.getElementById('batch-insert-as-text').addEventListener('click', () => batchInsertContent(false));
        document.getElementById('batch-insert-as-html').addEventListener('click', () => batchInsertContent(true));
        document.getElementById('batch-cancel-paste').addEventListener('click', hideBatchPasteOverlay);
        
        // 批量粘贴文本框变化事件
        document.getElementById('batch-paste-textarea').addEventListener('input', updateLineCount);
        
        // 编辑器选择器事件
        document.getElementById('prev-editor').addEventListener('click', () => {
            if (editorElements.length > 0) {
                currentEditorIndex = (currentEditorIndex - 1 + editorElements.length) % editorElements.length;
                updateEditorInfo();
            }
        });
        
        document.getElementById('next-editor').addEventListener('click', () => {
            if (editorElements.length > 0) {
                currentEditorIndex = (currentEditorIndex + 1) % editorElements.length;
                updateEditorInfo();
            }
        });
        
        document.getElementById('refresh-editors').addEventListener('click', () => {
            findAllEditableElements();
        });
        
        document.getElementById('batch-refresh-editors').addEventListener('click', () => {
            findAllEditableElements();
        });
        
        document.getElementById('editor-index').addEventListener('change', function() {
            const newIndex = parseInt(this.value) - 1;
            if (!isNaN(newIndex) && newIndex >= 0 && newIndex < editorElements.length) {
                currentEditorIndex = newIndex;
                updateEditorInfo();
            } else {
                // 恢复原值
                this.value = currentEditorIndex + 1;
            }
        });
        
        // 自动递增复选框
        document.getElementById('auto-increment-checkbox').addEventListener('change', function() {
            autoIncrement = this.checked;
            GM_setValue('autoIncrement', autoIncrement);
            log(`自动递增已${autoIncrement ? '启用' : '禁用'}`);
        });
        
        // 跳过空行复选框
        document.getElementById('skip-empty-lines-checkbox').addEventListener('change', function() {
            skipEmptyLines = this.checked;
            GM_setValue('skipEmptyLines', skipEmptyLines);
            log(`跳过空行已${skipEmptyLines ? '启用' : '禁用'}`, false, 'batch-debug-info');
            updateLineCount();
        });
        
        // 点击覆盖层背景关闭
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hidePasteOverlay();
            }
        });
        
        batchOverlay.addEventListener('click', function(e) {
            if (e.target === batchOverlay) {
                hideBatchPasteOverlay();
            }
        });
        
        // 添加快捷键支持
        document.addEventListener('keydown', function(e) {
            // Ctrl+V 或 Command+V
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                // 检查当前焦点是否在编辑器内
                const activeElement = document.activeElement;
                if (activeElement && 
                    (activeElement.classList.contains('view') || 
                     activeElement.contentEditable === 'true' ||
                     activeElement.tagName === 'IFRAME')) {
                    
                    log(`检测到粘贴快捷键，当前活动元素: ${activeElement.tagName}`);
                    
                    // 检查是否在iframe内
                    if (activeElement.tagName === 'IFRAME') {
                        try {
                            const iframeDoc = activeElement.contentDocument || activeElement.contentWindow.document;
                            if (iframeDoc && iframeDoc.body.contentEditable === 'true') {
                                e.preventDefault();
                                e.stopPropagation();
                                saveCurrentEditorAndRange();
                                findAllEditableElements();
                                showPasteOverlay();
                                return false;
                            }
                        } catch (err) {
                            log(`访问iframe出错: ${err.message}`);
                        }
                    } else {
                        e.preventDefault();
                        e.stopPropagation();
                        saveCurrentEditorAndRange();
                        findAllEditableElements();
                        showPasteOverlay();
                        return false;
                    }
                }
            }
        }, true);
        
        log('粘贴按钮创建完成');
        
        // 初始查找所有可编辑元素
        findAllEditableElements();
        
        // 设置自动递增复选框初始状态
        const autoIncrementCheckbox = document.getElementById('auto-increment-checkbox');
        if (autoIncrementCheckbox) {
            autoIncrementCheckbox.checked = autoIncrement;
        }
        
        // 设置跳过空行复选框初始状态
        const skipEmptyLinesCheckbox = document.getElementById('skip-empty-lines-checkbox');
        if (skipEmptyLinesCheckbox) {
            skipEmptyLinesCheckbox.checked = skipEmptyLines;
        }
    }
    
    // 保存当前编辑器和选区
    function saveCurrentEditorAndRange() {
        // 获取当前活动元素
        const activeElement = document.activeElement;
        log(`保存当前编辑器状态，活动元素: ${activeElement ? activeElement.tagName : 'none'}`);
        
        // 检查是否是编辑器
        if (activeElement) {
            if (activeElement.tagName === 'IFRAME') {
                try {
                    const iframeDoc = activeElement.contentDocument || activeElement.contentWindow.document;
                    if (iframeDoc && iframeDoc.body) {
                        lastActiveEditor = iframeDoc.body;
                        
                        // 保存选区
                        const iframeWin = activeElement.contentWindow;
                        if (iframeWin.getSelection) {
                            const sel = iframeWin.getSelection();
                            if (sel.rangeCount > 0) {
                                lastRange = sel.getRangeAt(0);
                                log('已保存iframe内的选区');
                            }
                        }
                    }
                } catch (err) {
                    log(`访问iframe出错: ${err.message}`);
                }
            } else if (activeElement.contentEditable === 'true' || activeElement.classList.contains('view')) {
                lastActiveEditor = activeElement;
                
                // 保存选区
                if (window.getSelection) {
                    const sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        lastRange = sel.getRangeAt(0);
                        log('已保存选区');
                    }
                }
            }
        }
        
        log(`编辑器状态保存${lastActiveEditor ? '成功' : '失败'}`);
    }
    
    // 显示粘贴覆盖层
    function showPasteOverlay() {
        const overlay = document.getElementById('paste-overlay');
        overlay.style.display = 'flex';
        
        // 清空调试信息
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            debugInfo.innerHTML = '';
        }
        
        // 获取剪贴板内容并填充到文本框
        navigator.clipboard.readText()
            .then(text => {
                document.getElementById('paste-textarea').value = text;
                log(`已从剪贴板获取文本，长度: ${text.length}`);
            })
            .catch(err => {
                log(`无法读取剪贴板内容: ${err.message}`);
            });
        
        // 聚焦到文本框
        setTimeout(() => {
            document.getElementById('paste-textarea').focus();
        }, 100);
    }
    
    // 显示批量粘贴覆盖层
    function showBatchPasteOverlay() {
        const overlay = document.getElementById('batch-paste-overlay');
        overlay.style.display = 'flex';
        
        // 清空调试信息
        const debugInfo = document.getElementById('batch-debug-info');
        if (debugInfo) {
            debugInfo.innerHTML = '';
        }
        
        // 隐藏进度条
        document.getElementById('progress-container').style.display = 'none';
        
        // 获取剪贴板内容并填充到文本框
        navigator.clipboard.readText()
            .then(text => {
                document.getElementById('batch-paste-textarea').value = text;
                log(`已从剪贴板获取文本，长度: ${text.length}`, false, 'batch-debug-info');
                updateLineCount();
            })
            .catch(err => {
                log(`无法读取剪贴板内容: ${err.message}`, false, 'batch-debug-info');
            });
        
        // 聚焦到文本框
        setTimeout(() => {
            document.getElementById('batch-paste-textarea').focus();
        }, 100);
    }
    
    // 隐藏粘贴覆盖层
    function hidePasteOverlay() {
        document.getElementById('paste-overlay').style.display = 'none';
    }
    
    // 隐藏批量粘贴覆盖层
    function hideBatchPasteOverlay() {
        document.getElementById('batch-paste-overlay').style.display = 'none';
    }
    
    // 插入内容到编辑器
    function insertContent(asHtml) {
        const content = document.getElementById('paste-textarea').value;
        if (!content) {
            log('没有内容可插入');
            hidePasteOverlay();
            return;
        }
        
        log(`准备插入内容，长度: ${content.length}, 格式: ${asHtml ? 'HTML' : '文本'}`);
        
        // 使用选择的编辑器
        let targetEditor = null;
        
        if (editorElements.length > 0 && currentEditorIndex < editorElements.length) {
            targetEditor = editorElements[currentEditorIndex];
            log(`使用选择的编辑器: ${targetEditor.description}`);
        } else if (lastActiveEditor) {
            // 如果没有选择编辑器，但有上次活动的编辑器，使用它
            targetEditor = {
                element: lastActiveEditor,
                type: 'last-active'
            };
            log(`使用上次活动的编辑器`);
        } else {
            log('未找到可用的编辑器');
            hidePasteOverlay();
            return;
        }
        
        // 尝试多种方法插入内容
        let inserted = false;
        
        // 方法1: 如果是UEditor实例，使用UEditor API
        if (targetEditor.ueditor) {
            log(`尝试使用UEditor API插入内容`);
            try {
                const editor = targetEditor.ueditor;
                editor.focus();
                if (asHtml) {
                    editor.execCommand('inserthtml', content);
                } else {
                    editor.execCommand('inserttext', content);
                }
                inserted = true;
                log('使用UEditor API插入成功', true);
            } catch (err) {
                log(`使用UEditor API插入失败: ${err.message}`);
            }
        }
        
        // 方法2: 使用document.execCommand
        if (!inserted) {
            log('尝试使用document.execCommand插入内容');
            try {
                const element = targetEditor.element;
                
                // 如果是iframe内的元素，需要特殊处理
                if (targetEditor.type === 'iframe-body' && targetEditor.iframe) {
                    try {
                        const iframeWin = targetEditor.iframe.contentWindow;
                        element.focus();
                        
                        // 使用iframe的document.execCommand
                        if (asHtml) {
                            iframeWin.document.execCommand('insertHTML', false, content);
                        } else {
                            iframeWin.document.execCommand('insertText', false, content);
                        }
                        inserted = true;
                        log('使用iframe document.execCommand插入成功', true);
                    } catch (err) {
                        log(`使用iframe document.execCommand插入失败: ${err.message}`);
                    }
                } else {
                    // 普通元素
                    element.focus();
                    if (asHtml) {
                        document.execCommand('insertHTML', false, content);
                    } else {
                        document.execCommand('insertText', false, content);
                    }
                    inserted = true;
                    log('使用document.execCommand插入成功', true);
                }
            } catch (err) {
                log(`使用document.execCommand插入失败: ${err.message}`);
            }
        }
        
        // 方法3: 直接修改innerHTML
        if (!inserted) {
            log('尝试直接修改innerHTML');
            try {
                const element = targetEditor.element;
                
                if (asHtml) {
                    element.innerHTML += content;
                } else {
                    // 创建文本节点
                    const textNode = document.createTextNode(content);
                    element.appendChild(textNode);
                }
                inserted = true;
                log('直接修改innerHTML插入成功', true);
            } catch (err) {
                log(`直接修改innerHTML插入失败: ${err.message}`);
            }
        }
        
        log(`内容插入${inserted ? '成功' : '失败'}`, inserted);
        
        // 如果插入成功且启用了自动递增，将索引加1
        if (inserted && autoIncrement) {
            if (editorElements.length > 0) {
                // 自动递增到下一个编辑器
                currentEditorIndex = (currentEditorIndex + 1) % editorElements.length;
                log(`自动递增到下一个编辑器: ${currentEditorIndex + 1}/${editorElements.length}`, true);
                
                // 保存当前索引
                GM_setValue('currentEditorIndex', currentEditorIndex);
                
                // 更新编辑器信息
                updateEditorInfo();
            }
        }
        
        // 更新编辑器预览
        if (inserted) {
            setTimeout(updateEditorInfo, 500);
        }
        
        hidePasteOverlay();
        
        // 如果插入成功，清空文本框以便下次粘贴
        if (inserted) {
            document.getElementById('paste-textarea').value = '';
        }
    }
    
    // 批量插入内容到多个编辑器
    function batchInsertContent(asHtml) {
        const content = document.getElementById('batch-paste-textarea').value;
        if (!content) {
            log('没有内容可插入', false, 'batch-debug-info');
            return;
        }
        
        // 分割内容为行
        let lines = content.split('\n');
        log(`准备批量插入内容，共 ${lines.length} 行`, false, 'batch-debug-info');
        
        // 显示行数统计
        const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
        log(`其中非空行 ${nonEmptyLines} 行`, false, 'batch-debug-info');
        
        // 获取起始索引
        const startIndexInput = document.getElementById('batch-start-index');
        let startIndex = parseInt(startIndexInput.value) - 1;
        
        if (isNaN(startIndex) || startIndex < 0) {
            startIndex = 0;
            startIndexInput.value = 1;
        }
        
        if (startIndex >= editorElements.length) {
            logWarning(`起始索引超出范围，已调整为 ${editorElements.length}`, 'batch-debug-info');
            startIndex = editorElements.length - 1;
            startIndexInput.value = editorElements.length;
        }
        
        log(`从第 ${startIndex + 1} 个编辑器开始插入`, false, 'batch-debug-info');
        
        // 检查编辑器数量
        if (editorElements.length === 0) {
            logError('未找到可用的编辑器', 'batch-debug-info');
            return;
        }
        
        // 禁用按钮，显示进度条
        const insertAsTextButton = document.getElementById('batch-insert-as-text');
        const insertAsHtmlButton = document.getElementById('batch-insert-as-html');
        const cancelButton = document.getElementById('batch-cancel-paste');
        
        insertAsTextButton.disabled = true;
        insertAsHtmlButton.disabled = true;
        cancelButton.disabled = true;
        
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        
        // 批量插入
        let currentIndex = startIndex;
        let insertedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        // 使用setTimeout进行分批处理，避免浏览器卡死
        function processNextLine(lineIndex) {
            if (lineIndex >= lines.length) {
                // 所有行处理完毕
                log(`批量插入完成，成功: ${insertedCount}, 跳过: ${skippedCount}, 失败: ${errorCount}`, true, 'batch-debug-info');
                
                // 启用按钮
                insertAsTextButton.disabled = false;
                insertAsHtmlButton.disabled = false;
                cancelButton.disabled = false;
                
                return;
            }
            
            // 更新进度条
            const progress = Math.round((lineIndex / lines.length) * 100);
            progressBar.style.width = `${progress}%`;
            
            const line = lines[lineIndex];
            
            // 检查是否跳过空行
            if (skipEmptyLines && line.trim() === '') {
                skippedCount++;
                log(`跳过空行 ${lineIndex + 1}`, false, 'batch-debug-info');
                setTimeout(() => processNextLine(lineIndex + 1), 0);
                return;
            }
            
            // 检查当前索引是否有效
            if (currentIndex >= editorElements.length) {
                logWarning(`编辑器索引 ${currentIndex + 1} 超出范围，剩余 ${lines.length - lineIndex} 行未处理`, 'batch-debug-info');
                
                // 启用按钮
                insertAsTextButton.disabled = false;
                insertAsHtmlButton.disabled = false;
                cancelButton.disabled = false;
                
                return;
            }
            
            // 获取目标编辑器
            const targetEditor = editorElements[currentIndex];
            log(`正在处理第 ${lineIndex + 1} 行，插入到编辑器 ${currentIndex + 1}: ${targetEditor.description}`, false, 'batch-debug-info');
            
            // 尝试插入内容
            let inserted = false;
            
            // 方法1: 如果是UEditor实例，使用UEditor API
            if (targetEditor.ueditor) {
                try {
                    const editor = targetEditor.ueditor;
                    editor.focus();
                    if (asHtml) {
                        editor.execCommand('inserthtml', line);
                    } else {
                        editor.execCommand('inserttext', line);
                    }
                    inserted = true;
                } catch (err) {
                    log(`编辑器 ${currentIndex + 1} 使用UEditor API插入失败: ${err.message}`, false, 'batch-debug-info');
                }
            }
            
            // 方法2: 使用document.execCommand
            if (!inserted) {
                try {
                    const element = targetEditor.element;
                    
                    // 如果是iframe内的元素，需要特殊处理
                    if (targetEditor.type === 'iframe-body' && targetEditor.iframe) {
                        try {
                            const iframeWin = targetEditor.iframe.contentWindow;
                            element.focus();
                            
                            // 使用iframe的document.execCommand
                            if (asHtml) {
                                iframeWin.document.execCommand('insertHTML', false, line);
                            } else {
                                iframeWin.document.execCommand('insertText', false, line);
                            }
                            inserted = true;
                        } catch (err) {
                            log(`编辑器 ${currentIndex + 1} 使用iframe document.execCommand插入失败: ${err.message}`, false, 'batch-debug-info');
                        }
                    } else {
                        // 普通元素
                        element.focus();
                        if (asHtml) {
                            document.execCommand('insertHTML', false, line);
                        } else {
                            document.execCommand('insertText', false, line);
                        }
                        inserted = true;
                    }
                } catch (err) {
                    log(`编辑器 ${currentIndex + 1} 使用document.execCommand插入失败: ${err.message}`, false, 'batch-debug-info');
                }
            }
            
            // 方法3: 直接修改innerHTML
            if (!inserted) {
                try {
                    const element = targetEditor.element;
                    
                    if (asHtml) {
                        element.innerHTML = line;
                    } else {
                        element.textContent = line;
                    }
                    inserted = true;
                } catch (err) {
                    log(`编辑器 ${currentIndex + 1} 直接修改innerHTML插入失败: ${err.message}`, false, 'batch-debug-info');
                }
            }
            
            // 更新计数
            if (inserted) {
                insertedCount++;
                log(`行 ${lineIndex + 1} 插入成功到编辑器 ${currentIndex + 1}`, true, 'batch-debug-info');
            } else {
                errorCount++;
                logError(`行 ${lineIndex + 1} 插入失败到编辑器 ${currentIndex + 1}`, 'batch-debug-info');
            }
            
            // 移动到下一个编辑器
            currentIndex++;
            
            // 处理下一行
            setTimeout(() => processNextLine(lineIndex + 1), 0);
        }
        
        // 开始处理
        processNextLine(0);
    }
    
    // 等待页面加载完成
    window.addEventListener('load', function() {
        log('页面加载完成，准备创建粘贴按钮');
        setTimeout(createPasteButton, 1000);
    });
    
    console.log('超星网课UEditor粘贴解除限制脚本已加载');
})();

    
