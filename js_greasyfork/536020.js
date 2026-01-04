// ==UserScript==
// @name         AI绘画提示词助手
// @namespace    http://tampermonkey.net/   
// @version      0.2.7
// @description  为AI绘画网站(jimeng/vido/doubao)和Google AI Studio/Gemini添加快捷提示词按钮，/n全选和删除的方法需要优化。
// @author       cjwn via cursor
// @match        *://jimeng.jianying.com/*
// @match        *://*.vidu.cn/*
// @match        *://*.doubao.com/*
// @match        *://aistudio.google.com/*
// @match        *://gemini.google.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license GPL 
// @downloadURL https://update.greasyfork.org/scripts/536020/AI%E7%BB%98%E7%94%BB%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536020/AI%E7%BB%98%E7%94%BB%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认提示词配置
    const DEFAULT_PROMPTS = {
        '画面比例 9:16': '比例 「9:16」,',
        '赛博朋克风格': 'cyberpunk style, neon lights, futuristic city, dark atmosphere,',
        '写实风格': 'photorealistic, highly detailed, 8k,',
        '动漫风格': 'anime style, cel shading, vibrant colors,'
    };

    // 从存储中获取提示词，如果没有则使用默认值
    let prompts = GM_getValue('aiPrompts', DEFAULT_PROMPTS);

    // 添加样式
    GM_addStyle(`
        .prompt-helper-container {
            position: fixed;
            right: 20px;
            top: 20px;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            cursor: move;
            user-select: none;
        }
        .prompt-helper-header {
            padding: 5px;
            margin: -10px -10px 10px -10px;
            background: #f5f5f5;
            border-radius: 8px 8px 0 0;
            border-bottom: 1px solid #ddd;
            cursor: move;
            text-align: center;
            font-weight: bold;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .prompt-helper-header:after {
            content: '▼';
            margin-left: 5px;
            font-size: 12px;
            transition: transform 0.3s ease;
        }
        .prompt-helper-container.collapsed .prompt-helper-header:after {
            transform: rotate(-90deg);
        }
        .prompt-helper-content {
            max-height: 500px;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }
        .prompt-helper-container.collapsed .prompt-helper-content {
            max-height: 0;
            margin-top: 0;
            margin-bottom: 0;
            padding-top: 0;
            padding-bottom: 0;
            opacity: 0;
        }
        .prompt-helper-container.collapsed {
            padding-bottom: 0;
        }
        .prompt-button {
            display: block;
            margin: 5px 0;
            padding: 8px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .prompt-button:hover {
            background: #45a049;
        }
        .settings-button {
            background: #2196F3;
            margin-top: 10px;
        }
        .settings-button:hover {
            background: #1976D2;
        }
        .utility-button {
            margin-top: 5px;
        }
        .save-text-button {
            background: #FF9800;
        }
        .save-text-button:hover {
            background: #F57C00;
        }
        .clear-button {
            background: #f44336;
        }
        .clear-button:hover {
            background: #d32f2f;
        }
    `);

    // 查找输入框
    function findInputElement() {
        const inputSelectors = [
            'div[data-slate-node="element"]',
            'textarea',
            'input[type="text"]',
            '.prompt-input',
            '[contenteditable="true"]',
            'ms-autosize-textarea textarea', // Google AI Studio
            '.textarea', // Google AI Studio 特殊类
            '.ql-editor', // Gemini
            '.text-input-field_textarea .ql-editor', // Gemini 特殊类
            '.rich-textarea .ql-editor' // Gemini 另一个特殊类
        ];

        for (const selector of inputSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('找到匹配的选择器:', selector);
                return element;
            }
        }
        
        console.log('未找到匹配的输入框元素');
        return null;
    }

    // 获取输入框当前内容
    function getInputContent(inputElement) {
        if (!inputElement) return '';
        
        // 处理 Gemini 的特殊输入框
        if (inputElement.classList.contains('ql-editor')) {
            return inputElement.textContent.trim();
        }
        
        if (inputElement.tagName.toLowerCase() === 'textarea' || inputElement.tagName.toLowerCase() === 'input') {
            return inputElement.value;
        } else {
            return inputElement.textContent;
        }
    }

    // 设置输入框内容
    function setInputContent(targetElement, content) {
        if (!targetElement) return;
        
        // 先触发点击和焦点事件
        try {
            targetElement.click();
            targetElement.focus();
        } catch (e) {
            console.error('触发焦点事件失败:', e);
        }

        // 处理 Gemini 的特殊输入框
        if (window.location.href.includes('gemini.google.com')) {
            if (targetElement.classList.contains('ql-editor')) {
                // 清空现有内容
                targetElement.innerHTML = '';
                
                // 创建段落并添加内容
                const p = document.createElement('p');
                p.textContent = content;
                targetElement.appendChild(p);
                
                // 触发输入事件
                const inputEvent = new InputEvent('input', { 
                    bubbles: true,
                    cancelable: true 
                });
                targetElement.dispatchEvent(inputEvent);
                
                return;
            }
        }

        // 处理Google AI Studio的特殊输入框
        if (window.location.href.includes('aistudio.google.com')) {
            if (targetElement.tagName.toLowerCase() === 'textarea') {
                targetElement.value = content;
                
                // 触发输入事件
                const inputEvent = new Event('input', { bubbles: true });
                targetElement.dispatchEvent(inputEvent);
                
                // 触发键盘事件
                const keyEvent = new KeyboardEvent('keydown', {
                    key: 'a',
                    code: 'KeyA',
                    bubbles: true,
                    cancelable: true
                });
                targetElement.dispatchEvent(keyEvent);
                return;
            }
        }

        // 针对 Slate 编辑器的处理
        if (targetElement) {
            try {
                // 触发 beforeinput 事件
                const beforeInput = new InputEvent('beforeinput', {
                    inputType: 'insertText',
                    data: content,
                    bubbles: true,
                    cancelable: true
                });
                targetElement.dispatchEvent(beforeInput);
            } catch (e) {
                console.error('Slate编辑器处理失败:', e);
            }
        }
        
        // 处理普通 textarea/input
        if (targetElement.tagName.toLowerCase() === 'textarea' || targetElement.tagName.toLowerCase() === 'input') {
            try {
                // 使用 Object.getOwnPropertyDescriptor 方法设置值
                const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
                const nativeInputValueSetter = descriptor.set;
                nativeInputValueSetter.call(targetElement, content);

                // 触发必要的事件
                const events = [
                    new Event('input', { bubbles: true }),
                    new InputEvent('input', {
                        inputType: 'insertText',
                        data: content,
                        bubbles: true,
                        cancelable: true,
                        isComposing: false
                    }),
                    new Event('change', { bubbles: true })
                ];

                events.forEach(event => targetElement.dispatchEvent(event));
            } catch (e) {
                console.error('设置输入框内容时出错:', e);
                // 降级方案
                targetElement.value = content;
                targetElement.dispatchEvent(new Event('input', { bubbles: true }));
                targetElement.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }

    // 插入提示词到输入框
    function insertPrompt(prompt) {
        const inputElement = findInputElement();
        console.log("Found input:", inputElement)
        if (inputElement) {
            const currentContent = getInputContent(inputElement);
            console.log("Found content:", currentContent)
            const newContent = currentContent ? `${currentContent}, ${prompt}` : prompt;
            setInputContent(inputElement, newContent);
        }
    }

    // 清空输入框
    function clearInput() {
        const inputElement = findInputElement();
        if (!inputElement) return;
        
        // 处理 Gemini 的特殊输入框
        if (window.location.href.includes('gemini.google.com')) {
            if (inputElement.classList.contains('ql-editor')) {
                inputElement.innerHTML = '<p><br></p>';
                
                // 触发输入事件
                const inputEvent = new InputEvent('input', { 
                    bubbles: true,
                    cancelable: true 
                });
                inputElement.dispatchEvent(inputEvent);
                
                return;
            }
        }
        
        const editorElement = document.querySelector('[data-slate-editor]');
        if (editorElement) {
            editorElement.focus();
            setTimeout(() => {
                document.execCommand('selectAll');
            }, 10);
            setTimeout(() => {
                // 2. 模拟删除键
                const deleteKey = new KeyboardEvent('keydown', {
                    key: 'Backspace',
                    code: 'Backspace',
                    bubbles: true,
                    cancelable: true
                });

                // 3. 触发删除事件序列
                const beforeInput = new InputEvent('beforeinput', {
                    inputType: 'deleteContentBackward',
                    bubbles: true,
                    cancelable: true
                });
                
                const input = new InputEvent('input', {
                    inputType: 'deleteContentBackward',
                    bubbles: true,
                    cancelable: true
                });
                
                // 4. 按顺序触发事件
                editorElement.dispatchEvent(beforeInput);
                // editorElement.dispatchEvent(deleteKey);
                // editorElement.dispatchEvent(input);
                
                // 5. 触发键盘抬起事件
                const keyup = new KeyboardEvent('keyup', {
                    key: 'Backspace',
                    code: 'Backspace',
                    bubbles: true,
                    cancelable: true
                });
                // editorElement.dispatchEvent(keyup);

                // 6. 触发 selectionchange 事件
                document.dispatchEvent(new Event('selectionchange', {
                    bubbles: true,
                    cancelable: true
                }));

                console.log('已尝试通过键盘事件清空内容');
            }, 50); // 50ms 的延迟
        } else {
            if (inputElement) {
                setInputContent(inputElement, '');
                if (inputElement.tagName.toLowerCase() === 'textarea' || inputElement.tagName.toLowerCase() === 'input') {
                    inputElement.value = '';
                } else {
                    inputElement.textContent = '';
                }
                // 触发输入事件
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }

    // 保存当前文本框内容为新提示词
    function saveCurrentText() {
        const inputElement = findInputElement();
        if (!inputElement) return;
        console.log('找到输入框元素:', inputElement);
        const currentContent = getInputContent(inputElement);
        console.log('当前内容:', currentContent);
        if (!currentContent) return;

        const settingsHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 20px rgba(0,0,0,0.2);
                        width: 300px; z-index: 10000;">
                <h3 style="margin-top: 0;">保存当前内容</h3>
                <input type="text" id="promptLabel" placeholder="输入提示词标签" 
                       style="width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box;">
                <div style="text-align: right; margin-top: 15px;">
                    <button id="saveCurrent" style="padding: 8px 15px; background: #4CAF50; color: white; 
                                                  border: none; border-radius: 4px; cursor: pointer;">保存</button>
                    <button id="cancelSave" style="padding: 8px 15px; background: #f44336; color: white; 
                                                 border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">取消</button>
                </div>
            </div>
        `;

        const saveContainer = document.createElement('div');
        saveContainer.innerHTML = settingsHTML;
        document.body.appendChild(saveContainer);

        document.getElementById('saveCurrent').onclick = () => {
            const label = document.getElementById('promptLabel').value;
            if (label) {
                prompts[label] = currentContent;
                GM_setValue('aiPrompts', prompts);
                document.body.removeChild(saveContainer);
                // 重新创建按钮以显示新添加的提示词
                document.querySelector('.prompt-helper-container').remove();
                createPromptButtons();
            }
        };

        document.getElementById('cancelSave').onclick = () => {
            document.body.removeChild(saveContainer);
        };
    }

    // 创建提示词按钮容器
    function createPromptButtons() {
        const container = document.createElement('div');
        container.className = 'prompt-helper-container';

        // 添加拖动头部
        const header = document.createElement('div');
        header.className = 'prompt-helper-header';
        header.textContent = '提示词助手';
        container.appendChild(header);

        // 创建内容容器
        const content = document.createElement('div');
        content.className = 'prompt-helper-content';
        container.appendChild(content);

        // 添加提示词按钮
        Object.entries(prompts).forEach(([label, prompt]) => {
            const button = document.createElement('button');
            button.className = 'prompt-button';
            button.textContent = label;
            button.onclick = () => insertPrompt(prompt);
            content.appendChild(button);
        });

        // 添加保存当前文本按钮
        const saveTextButton = document.createElement('button');
        saveTextButton.className = 'prompt-button utility-button save-text-button';
        saveTextButton.textContent = '保存当前文本';
        saveTextButton.onclick = saveCurrentText;
        content.appendChild(saveTextButton);

        // 添加清空按钮
        const clearButton = document.createElement('button');
        clearButton.className = 'prompt-button utility-button clear-button';
        clearButton.textContent = '清空文本';
        clearButton.onclick = clearInput;
        content.appendChild(clearButton);

        // 添加设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.className = 'prompt-button settings-button';
        settingsButton.textContent = '编辑提示词';
        settingsButton.onclick = showSettings;
        content.appendChild(settingsButton);

        document.body.appendChild(container);

        // 添加折叠功能
        let lastClickTime = 0;
        let isDragging = false;

        header.addEventListener('mousedown', (e) => {
            lastClickTime = Date.now();
            dragStart(e);
        });

        header.addEventListener('mouseup', (e) => {
            const clickDuration = Date.now() - lastClickTime;
            if (clickDuration < 200 && !isDragging) {
                // 短按被认为是点击，触发折叠
                container.classList.toggle('collapsed');
            }
            dragEnd(e);
        });

        // 添加拖拽功能
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        function dragStart(e) {
            if (e.type === "mousedown") {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            isDragging = false;
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (e.buttons === 1 && e.target === header) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                container.style.transform = `translate(${currentX}px, ${currentY}px)`;
                isDragging = true;
            }
        }

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }

    // 显示设置对话框
    function showSettings() {
        const settingsHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 20px rgba(0,0,0,0.2);
                        max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; z-index: 10000;">
                <h2 style="margin-top: 0;">编辑提示词</h2>
                <div id="promptsList"></div>
                <button id="addNewPrompt" style="margin: 10px 0; padding: 8px 15px; background: #4CAF50; color: white; 
                                                border: none; border-radius: 4px; cursor: pointer;">
                    添加新提示词
                </button>
                <div style="text-align: right; margin-top: 15px;">
                    <button id="saveSettings" style="padding: 8px 15px; background: #2196F3; color: white; 
                                                   border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
                        保存
                    </button>
                    <button id="closeSettings" style="padding: 8px 15px; background: #f44336; color: white; 
                                                    border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
                        关闭
                    </button>
                </div>
            </div>
        `;

        const settingsContainer = document.createElement('div');
        settingsContainer.innerHTML = settingsHTML;
        document.body.appendChild(settingsContainer);

        const promptsList = document.getElementById('promptsList');

        // 渲染提示词列表
        function renderPromptsList() {
            promptsList.innerHTML = '';
            Object.entries(prompts).forEach(([label, prompt]) => {
                const promptDiv = document.createElement('div');
                promptDiv.style.margin = '10px 0';
                promptDiv.innerHTML = `
                    <input type="text" value="${label}" placeholder="标签" style="width: 30%; margin-right: 10px; padding: 5px;">
                    <input type="text" value="${prompt}" placeholder="提示词" style="width: 50%; margin-right: 10px; padding: 5px;">
                    <button class="delete-prompt" style="padding: 5px 10px; background: #f44336; color: white; 
                                                       border: none; border-radius: 4px; cursor: pointer;">删除</button>
                `;
                promptsList.appendChild(promptDiv);
            });
        }

        renderPromptsList();

        // 添加新提示词
        document.getElementById('addNewPrompt').onclick = () => {
            const promptDiv = document.createElement('div');
            promptDiv.style.margin = '10px 0';
            promptDiv.innerHTML = `
                <input type="text" placeholder="标签" style="width: 30%; margin-right: 10px; padding: 5px;">
                <input type="text" placeholder="提示词" style="width: 50%; margin-right: 10px; padding: 5px;">
                <button class="delete-prompt" style="padding: 5px 10px; background: #f44336; color: white; 
                                                   border: none; border-radius: 4px; cursor: pointer;">删除</button>
            `;
            promptsList.appendChild(promptDiv);
        };

        // 保存设置
        document.getElementById('saveSettings').onclick = () => {
            const newPrompts = {};
            promptsList.querySelectorAll('div').forEach(div => {
                const inputs = div.querySelectorAll('input');
                if (inputs[0].value && inputs[1].value) {
                    newPrompts[inputs[0].value] = inputs[1].value;
                }
            });
            prompts = newPrompts;
            GM_setValue('aiPrompts', prompts);
            document.body.removeChild(settingsContainer);
            // 重新创建按钮
            document.querySelector('.prompt-helper-container').remove();
            createPromptButtons();
        };

        // 关闭设置
        document.getElementById('closeSettings').onclick = () => {
            document.body.removeChild(settingsContainer);
        };

        // 删除提示词
        promptsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-prompt')) {
                e.target.parentElement.remove();
            }
        });
    }

    // 等待页面加载完成后初始化
    window.addEventListener('load', createPromptButtons);
})(); 