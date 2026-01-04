// ==UserScript==
// @name         AI提示词助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AI提示词管理和快速输入工具
// @author       初沐 (https://github.com/chumu)
// @license      MIT
// @match        https://pro.yrai.cc/new
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523718/AI%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523718/AI%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 首先加载xlsx库
    function loadXLSX() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js',
                onload: function(response) {
                    try {
                        // 创建script标签并执行代码
                        const script = document.createElement('script');
                        script.textContent = response.responseText;
                        document.head.appendChild(script);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 等待xlsx库加载完成后初始化UI
    loadXLSX().then(() => {
        // 原有的初始化代码
        createUI();
    }).catch(error => {
        console.error('加载xlsx库失败:', error);
        // 即使加载失败也创建UI，只是Excel功能不可用
        createUI();
    });

    // 添加样式
    GM_addStyle(`
        .prompt-helper {
            position: fixed;
            right: 20px;
            top: 20px;
            background: white;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            width: 380px;
            font-family: Arial, sans-serif;
            transition: transform 0.3s ease;
        }
        .prompt-helper.collapsed {
            transform: translateX(calc(100% + 20px));
        }
        .toggle-button {
            position: fixed;
            right: 20px;
            top: 20px;
            z-index: 9998;
            padding: 8px 15px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .toggle-button:hover {
            background: #357abd;
        }
        .manage-categories {
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 8px;
            display: none;
        }
        .manage-categories.active {
            display: block;
        }
        .category-list {
            margin: 10px 0;
            padding: 5px;
            background: white;
            border: 1px solid #eee;
            border-radius: 6px;
            max-height: 150px;
            overflow-y: auto;
        }
        .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }
        .category-item:last-child {
            border-bottom: none;
        }
        .prompt-helper h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 18px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .prompt-helper h3 .title {
            flex: 1;
        }
        .prompt-helper h3 .buttons {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .prompt-helper h3 button {
            padding: 4px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f5f5f5;
            cursor: pointer;
            font-size: 14px;
            line-height: 1.5;
            transition: all 0.2s;
        }
        .prompt-helper h3 button:hover {
            background: #e5e5e5;
        }
        .prompt-helper button {
            margin: 5px;
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #f5f5f5;
            cursor: pointer;
            transition: all 0.2s;
        }
        .prompt-helper button:hover {
            background: #e5e5e5;
            transform: translateY(-1px);
        }
        .prompt-helper input, .prompt-helper select, .prompt-helper textarea {
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            margin-bottom: 8px;
        }
        .prompt-list {
            margin-top: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        .prompt-item {
            margin: 8px 0;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 8px;
            background: #fafafa;
        }
        .prompt-item:hover {
            border-color: #ddd;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .prompt-content {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
        }
        .prompt-comment {
            font-size: 12px;
            color: #888;
            margin-top: 5px;
            font-style: italic;
        }
        .category-section {
            margin: 15px 0;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 8px;
        }
        .category-title {
            font-weight: bold;
            color: #444;
            margin-bottom: 10px;
        }
        .search-box {
            width: 100%;
            margin-bottom: 15px;
        }
        .controls {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }
        .add-prompt-form {
            display: none;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 8px;
            margin: 10px 0;
        }
        .add-prompt-form.active {
            display: block;
        }
        #addCategory {
            font-size: 12px;
            padding: 4px 8px;
        }
        #newCategory {
            font-size: 12px;
        }
        .import-section {
            margin: 10px 0;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 8px;
            border: 2px dashed #ccc;
            text-align: center;
            transition: all 0.3s;
            overflow: hidden;
        }
        .import-section.collapsed {
            padding: 0;
            height: 0;
            border: none;
            margin: 0;
        }
        .import-section.dragover {
            background: #e9e9e9;
            border-color: #4a90e2;
        }
        .import-toggle {
            display: flex;
            align-items: center;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
            margin-bottom: 10px;
            transition: all 0.3s;
        }
        .import-toggle:hover {
            background: #e8e8e8;
        }
        .import-toggle .arrow {
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #666;
            margin-right: 8px;
            transition: transform 0.3s;
        }
        .import-toggle.collapsed .arrow {
            transform: rotate(-90deg);
        }
        .import-toggle-text {
            color: #666;
            font-size: 14px;
        }
        #fileInput {
            display: none;
        }
        .display-mode-switch {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 10px 0;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 6px;
        }
        .display-mode-switch label {
            font-size: 14px;
            color: #666;
        }
        .prompt-content.simplified {
            max-height: 1.5em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
        .prompt-content.simplified:hover {
            color: #4a90e2;
        }
        .settings-menu {
            display: none;
            position: absolute;
            top: 50px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10001;
            width: 250px;
        }
        .settings-menu.active {
            display: block;
        }
        .settings-menu h4 {
            margin: 0 0 10px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
            color: #333;
        }
        .settings-item {
            margin: 8px 0;
        }
        .settings-item label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            font-size: 14px;
        }
        .settings-item input[type="checkbox"] {
            margin: 0;
        }
        .prompt-item {
            position: relative;
        }
        .prompt-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .prompt-content {
            margin: 5px 0;
            color: #333;
        }
        .prompt-content.simplified {
            max-height: 1.5em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
        .prompt-comment {
            font-size: 12px;
            color: #666;
            font-style: italic;
            margin-top: 3px;
        }
        .prompt-category {
            font-size: 12px;
            color: #4a90e2;
            margin-top: 3px;
        }
        .settings-menu h4 {
            margin: 0 0 10px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
            color: #333;
        }
        .settings-menu .author-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 13px;
            color: #666;
        }
        .settings-menu .author-info p {
            margin: 5px 0;
            line-height: 1.4;
        }
        .settings-menu .author-info a {
            color: #4a90e2;
            text-decoration: none;
        }
        .settings-menu .author-info a:hover {
            text-decoration: underline;
        }
    `);

    // 获取保存的分类
    function getCategories() {
        return JSON.parse(localStorage.getItem('aiPromptCategories') || '["洗稿", "创作", "翻译"]');
    }

    // 保存分类
    function saveCategories(categories) {
        localStorage.setItem('aiPromptCategories', JSON.stringify(categories));
    }

    // 更新分类列表
    function updateCategoryList() {
        const categoryList = document.getElementById('categoryList');
        const categories = getCategories();
        
        categoryList.innerHTML = categories.map(category => `
            <div class="category-item" data-category="${category}">
                <span class="category-name">${category}</span>
                <button class="btn btn-danger" onclick="deleteCategory('${category}')">删除</button>
            </div>
        `).join('');
    }

    // 删除分类
    function deleteCategory(name) {
        if (confirm(`确定要删除分类"${name}"吗？`)) {
            const categories = getCategories();
            const newCategories = categories.filter(c => c !== name);
            saveCategories(newCategories);
            updateCategoryList();
            updateCategorySelectors();
        }
    }

    // 清空表单
    function clearForm() {
        document.getElementById('promptName').value = '';
        document.getElementById('promptContent').value = '';
        document.getElementById('promptComment').value = '';
    }

    // 保存提示词
    function savePrompt(name, content, comment, category) {
        const prompts = JSON.parse(localStorage.getItem('aiPrompts') || '{}');
        prompts[name] = {
            content: content,
            comment: comment || '',
            category: category
        };
        localStorage.setItem('aiPrompts', JSON.stringify(prompts));
    }

    // 删除提示词
    function deletePrompt(name) {
        const prompts = JSON.parse(localStorage.getItem('aiPrompts') || '{}');
        if (prompts[name]) {
            delete prompts[name];
            localStorage.setItem('aiPrompts', JSON.stringify(prompts));
            loadPrompts();
            showToast('提示词已删除');
        }
    }

    // 复制提示词内容
    function copyPromptContent(content) {
        // 确保content不为空
        if (!content) {
            console.error('复制内容为空');
            return;
        }

        // 使用 navigator.clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(content).then(() => {
                showToast('复制成功');
            }).catch((err) => {
                console.error('Clipboard API failed:', err);
                fallbackCopy(content);
            });
        } else {
            fallbackCopy(content);
        }
    }

    // 回退的复制方法
    function fallbackCopy(content) {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            showToast('复制成功');
        } catch (err) {
            console.error('复制失败:', err);
            showToast('复制失败');
        }

        document.body.removeChild(textarea);
    }

    // 显示提示信息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 2000);
    }

    // 获取显示设置
    function getDisplaySettings() {
        return JSON.parse(localStorage.getItem('promptDisplaySettings') || JSON.stringify({
            showName: true,
            showContent: true,
            showComment: true,
            showCategory: true,
            isSimplified: false
        }));
    }

    // 保存显示设置
    function saveDisplaySettings(settings) {
        localStorage.setItem('promptDisplaySettings', JSON.stringify(settings));
    }

    // 加载提示词
    function loadPrompts(searchTerm = '') {
        const promptList = document.getElementById('promptList');
        const prompts = JSON.parse(localStorage.getItem('aiPrompts') || '{}');
        const selectedCategory = document.getElementById('categorySelect').value;
        const settings = getDisplaySettings();
        
        promptList.innerHTML = '';
        
        // 按分类组织提示词
        const categorizedPrompts = {};
        
        Object.entries(prompts).forEach(([name, data]) => {
            if (searchTerm && 
                !name.toLowerCase().includes(searchTerm.toLowerCase()) && 
                !data.content.toLowerCase().includes(searchTerm.toLowerCase())) {
                return;
            }
            
            if (selectedCategory !== 'all' && data.category !== selectedCategory) {
                return;
            }

            if (!categorizedPrompts[data.category]) {
                categorizedPrompts[data.category] = [];
            }
            categorizedPrompts[data.category].push({name, ...data});
        });

        Object.entries(categorizedPrompts).forEach(([category, items]) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            categorySection.innerHTML = `<div class="category-title">${category}</div>`;

            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'prompt-item';
                
                // 根据设置显示内容
                if (settings.showName) {
                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'prompt-name';
                    nameDiv.textContent = item.name;
                    div.appendChild(nameDiv);
                }
                
                if (settings.showContent) {
                    const contentDiv = document.createElement('div');
                    contentDiv.className = `prompt-content ${settings.isSimplified ? 'simplified' : ''}`;
                    contentDiv.textContent = item.content;
                    if (settings.isSimplified) {
                        contentDiv.title = item.content;
                        contentDiv.addEventListener('click', function() {
                            this.classList.toggle('simplified');
                        });
                    }
                    div.appendChild(contentDiv);
                }
                
                if (settings.showComment && item.comment) {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'prompt-comment';
                    commentDiv.textContent = `注释: ${item.comment}`;
                    div.appendChild(commentDiv);
                }

                if (settings.showCategory) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'prompt-category';
                    categoryDiv.textContent = `分类: ${item.category}`;
                    div.appendChild(categoryDiv);
                }
                
                // 创建按钮容器
                const buttonDiv = document.createElement('div');
                buttonDiv.style.textAlign = 'right';
                
                // 创建复制按钮
                const copyButton = document.createElement('button');
                copyButton.textContent = '复制';
                copyButton.dataset.content = item.content;
                copyButton.addEventListener('click', function() {
                    copyPromptContent(this.dataset.content);
                });
                
                // 创建删除按钮
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.dataset.name = item.name;
                deleteButton.addEventListener('click', function() {
                    deletePrompt(this.dataset.name);
                });
                
                buttonDiv.appendChild(copyButton);
                buttonDiv.appendChild(deleteButton);
                div.appendChild(buttonDiv);
                
                categorySection.appendChild(div);
            });

            promptList.appendChild(categorySection);
        });
    }

    // 初始化事件
    function initEvents() {
        // 搜索功能
        document.getElementById('searchPrompt').addEventListener('input', function(e) {
            loadPrompts(e.target.value);
        });

        // 分类筛选
        document.getElementById('categorySelect').addEventListener('change', function() {
            loadPrompts(document.getElementById('searchPrompt').value);
        });

        // 新增提示词表单显示/隐藏
        document.getElementById('addNewPrompt').addEventListener('click', function() {
            document.getElementById('addPromptForm').classList.add('active');
        });

        document.getElementById('cancelPrompt').addEventListener('click', function() {
            document.getElementById('addPromptForm').classList.remove('active');
            clearForm();
        });

        // 保存提示词
        document.getElementById('savePrompt').addEventListener('click', function() {
            const name = document.getElementById('promptName').value;
            const content = document.getElementById('promptContent').value;
            const comment = document.getElementById('promptComment').value;
            const category = document.getElementById('promptCategory').value;

            if (name && content) {
                savePrompt(name, content, comment, category);
                clearForm();
                document.getElementById('addPromptForm').classList.remove('active');
                loadPrompts();
            }
        });

        // 管理分类按钮
        document.getElementById('manageCategories').addEventListener('click', function() {
            document.getElementById('manageCategoriesForm').classList.toggle('active');
        });

        // 添加新分类
        document.getElementById('addCategory').addEventListener('click', function() {
            const newCategoryInput = document.getElementById('newCategory');
            const newCategory = newCategoryInput.value.trim();
            
            if (newCategory && !getCategories().includes(newCategory)) {
                const categories = getCategories();
                categories.push(newCategory);
                saveCategories(categories);
                
                updateCategorySelectors();
                updateCategoryList();
                newCategoryInput.value = '';
            }
        });

        // 窗口控制
        document.getElementById('toggleHelper').addEventListener('click', function() {
            const helper = document.querySelector('.prompt-helper');
            const toggleButton = document.querySelector('.toggle-button');
            helper.classList.toggle('collapsed');
            toggleButton.style.display = helper.classList.contains('collapsed') ? 'block' : 'none';
        });

        // 为promptList添加事件委托
        document.getElementById('promptList').addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                if (e.target.textContent === '复制') {
                    copyPromptContent(decodeURIComponent(e.target.getAttribute('data-content')));
                } else if (e.target.textContent === '删除') {
                    deletePrompt(decodeURIComponent(e.target.getAttribute('data-name')));
                }
            }
        });

        // 导入文件按钮点击事件
        document.getElementById('importBtn').addEventListener('click', function() {
            document.getElementById('fileInput').click();
        });

        // 文件选择变化事件
        document.getElementById('fileInput').addEventListener('change', handleFileImport);

        // 下载模板按钮点击事件
        document.getElementById('downloadTemplate').addEventListener('click', downloadTemplate);

        // 添加拖拽相关事件
        const importSection = document.querySelector('.import-section');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            importSection.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            importSection.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            importSection.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            importSection.classList.add('dragover');
        }

        function unhighlight(e) {
            importSection.classList.remove('dragover');
        }

        importSection.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) {
                handleFileImport({ target: { files: [files[0]] } });
            }
        }

        // 设置按钮点击事件
        document.getElementById('settingsBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('settingsMenu').classList.toggle('active');
        });

        // 点击其他地方关闭设置菜单
        document.addEventListener('click', function(e) {
            const settingsMenu = document.getElementById('settingsMenu');
            if (!settingsMenu.contains(e.target) && e.target.id !== 'settingsBtn') {
                settingsMenu.classList.remove('active');
            }
        });

        // 设置选项变化事件
        ['showName', 'showContent', 'showComment', 'showCategory', 'isSimplified'].forEach(id => {
            document.getElementById(id).addEventListener('change', function() {
                const settings = getDisplaySettings();
                settings[id] = this.checked;
                saveDisplaySettings(settings);
                loadPrompts(document.getElementById('searchPrompt').value);
            });
        });

        // 导入区域显示/隐藏
        document.getElementById('importToggle').addEventListener('click', function() {
            const importSection = document.getElementById('importSection');
            const importToggle = document.getElementById('importToggle');
            importSection.classList.toggle('collapsed');
            importToggle.classList.toggle('collapsed');
        });
    }

    // 更新分类选择器
    function updateCategorySelectors() {
        const categories = getCategories();
        const selectors = document.querySelectorAll('#categorySelect, #promptCategory');
        
        selectors.forEach(selector => {
            const currentValue = selector.value;
            selector.innerHTML = selector.id === 'categorySelect' ? 
                '<option value="all">所有分类</option>' : '';
            
            categories.forEach(category => {
                selector.innerHTML += `<option value="${category}">${category}</option>`;
            });
            
            if (currentValue && categories.includes(currentValue)) {
                selector.value = currentValue;
            }
        });
    }

    // 下载Excel模板
    function downloadTemplate() {
        const template = [
            ['名称', '内容', '注释', '分类'],
            ['示例1', '这是一个示例提示词', '这是注释', '创作'],
            ['示例2', '这是另一个示例', '可选的注释', '洗稿']
        ];

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(template);
        XLSX.utils.book_append_sheet(wb, ws, "提示词");

        // 生成Excel文件并下载
        XLSX.writeFile(wb, '提示词模板.xlsx');
    }

    // 处理导入的文件
    function handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // 处理Excel文件
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // 转换为数组格式
                    const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                    
                    if (rows.length < 2) {
                        showToast('Excel文件内容为空');
                        return;
                    }

                    const prompts = JSON.parse(localStorage.getItem('aiPrompts') || '{}');
                    let importCount = 0;

                    // 跳过标题行
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        if (!row || row.length === 0) continue;

                        const [name, content, comment, category] = row;
                        if (name && content) {
                            prompts[name] = {
                                content: content,
                                comment: comment || '',
                                category: category || '其他'
                            };
                            importCount++;
                        }
                    }

                    localStorage.setItem('aiPrompts', JSON.stringify(prompts));
                    showToast(`成功导入 ${importCount} 个提示词`);
                    loadPrompts();
                } catch (err) {
                    console.error('Excel解析失败:', err);
                    showToast('Excel文件格式错误，请检查格式是否正确');
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (fileExtension === 'csv') {
            // 处理CSV文件的现有代码
            handleCSVImport(file);
        } else {
            showToast('不支持的文件格式，请使用.xlsx、.xls或.csv格式');
        }
    }

    // 处理CSV文件导入
    function handleCSVImport(file) {
        // 尝试不同的编码
        function tryReadFile(encoding) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const text = e.target.result;
                        // 检查是否包含乱码字符
                        if (text.includes('�')) {
                            reject('encoding_error');
                            return;
                        }
                        resolve(text);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = reject;
                reader.readAsText(file, encoding);
            });
        }

        // 按顺序尝试不同的编码
        const encodings = ['UTF-8', 'GBK', 'GB2312', 'BIG5'];
        let currentEncodingIndex = 0;

        function tryNextEncoding() {
            if (currentEncodingIndex >= encodings.length) {
                showToast('无法正确读取文件，请确保文件编码正确');
                return;
            }

            const currentEncoding = encodings[currentEncodingIndex];
            tryReadFile(currentEncoding)
                .then(text => {
                    try {
                        // 处理 BOM 标记
                        const content = text.replace(/^\uFEFF/, '');
                        const rows = content.split(/\r?\n/);
                        const prompts = JSON.parse(localStorage.getItem('aiPrompts') || '{}');
                        let importCount = 0;

                        // 跳过标题行
                        for (let i = 1; i < rows.length; i++) {
                            const row = rows[i].trim();
                            if (!row) continue;

                            // 使用更可靠的CSV解析方式
                            let columns = [];
                            let currentColumn = '';
                            let inQuotes = false;

                            // 手动解析CSV，处理引号内的逗号
                            for (let j = 0; j < row.length; j++) {
                                const char = row[j];
                                if (char === '"') {
                                    inQuotes = !inQuotes;
                                } else if (char === ',' && !inQuotes) {
                                    columns.push(currentColumn.trim());
                                    currentColumn = '';
                                } else {
                                    currentColumn += char;
                                }
                            }
                            columns.push(currentColumn.trim());

                            // 清理引号
                            columns = columns.map(col => col.replace(/^["']|["']$/g, ''));

                            if (columns.length >= 2) {
                                const [name, content, comment, category] = columns;
                                if (name && content) {
                                    prompts[name] = {
                                        content: content,
                                        comment: comment || '',
                                        category: category || '其他'
                                    };
                                    importCount++;
                                }
                            }
                        }

                        localStorage.setItem('aiPrompts', JSON.stringify(prompts));
                        showToast(`成功导入 ${importCount} 个提示词`);
                        loadPrompts();
                    } catch (err) {
                        console.error('解析失败:', err);
                        showToast('文件格式错误，请检查CSV格式是否正确');
                    }
                })
                .catch(err => {
                    if (err === 'encoding_error') {
                        currentEncodingIndex++;
                        tryNextEncoding();
                    } else {
                        console.error('导入失败:', err);
                        showToast('导入失败，请检查文件格式');
                    }
                });
        }

        tryNextEncoding();
    }

    // 创建UI
    function createUI() {
        // 添加切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = '提示词助手';
        toggleButton.onclick = function() {
            const helper = document.querySelector('.prompt-helper');
            helper.classList.toggle('collapsed');
            this.style.display = helper.classList.contains('collapsed') ? 'block' : 'none';
        };
        document.body.appendChild(toggleButton);

        const container = document.createElement('div');
        container.className = 'prompt-helper';
        container.innerHTML = `
            <h3>
                <span class="title">AI提示词助手</span>
                <div class="buttons">
                    <button id="settingsBtn">设置</button>
                    <button id="toggleHelper">收起</button>
                </div>
            </h3>
            <div class="settings-menu" id="settingsMenu">
                <h4>显示设置</h4>
                <div class="settings-item">
                    <label>
                        <input type="checkbox" id="showName" ${getDisplaySettings().showName ? 'checked' : ''}>
                        显示名称
                    </label>
                </div>
                <div class="settings-item">
                    <label>
                        <input type="checkbox" id="showContent" ${getDisplaySettings().showContent ? 'checked' : ''}>
                        显示内容
                    </label>
                </div>
                <div class="settings-item">
                    <label>
                        <input type="checkbox" id="showComment" ${getDisplaySettings().showComment ? 'checked' : ''}>
                        显示注释
                    </label>
                </div>
                <div class="settings-item">
                    <label>
                        <input type="checkbox" id="showCategory" ${getDisplaySettings().showCategory ? 'checked' : ''}>
                        显示分类
                    </label>
                </div>
                <div class="settings-item">
                    <label>
                        <input type="checkbox" id="isSimplified" ${getDisplaySettings().isSimplified ? 'checked' : ''}>
                        简化显示（点击展开）
                    </label>
                </div>
                <div class="author-info">
                    <p>作者：初沐</p>
                    <p>联系方式：<a href="mailto:1501942742@qq.com">1501942742@qq.com</a></p>
                    <p>如有问题或建议，欢迎反馈</p>
                </div>
            </div>
            <div class="import-toggle" id="importToggle">
                <div class="arrow"></div>
                <span class="import-toggle-text">导入提示词</span>
            </div>
            <div class="import-section collapsed" id="importSection">
                <p>拖拽文件到此处或点击下方按钮导入</p>
                <input type="file" id="fileInput" accept=".csv,.xlsx,.xls">
                <button id="importBtn">导入提示词</button>
                <button id="downloadTemplate">下载模板</button>
            </div>
            <input type="text" id="searchPrompt" class="search-box" placeholder="搜索提示词...">
            <div class="controls">
                <select id="categorySelect" style="flex: 1">
                    <option value="all">所有分类</option>
                    ${getCategories().map(category => `<option value="${category}">${category}</option>`).join('')}
                </select>
                <button id="addNewPrompt">新增提示词</button>
                <button id="manageCategories">分类管理</button>
            </div>
            <div id="manageCategoriesForm" class="manage-categories">
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <input type="text" id="newCategory" placeholder="输入新分类名称" style="flex: 1">
                    <button id="addCategory">添加分类</button>
                </div>
                <div class="category-list" id="categoryList"></div>
            </div>
            <div id="addPromptForm" class="add-prompt-form">
                <input type="text" id="promptName" placeholder="提示词名称" style="width: 100%">
                <textarea id="promptContent" placeholder="提示词内容" style="width: 100%; height: 80px; margin: 8px 0"></textarea>
                <textarea id="promptComment" placeholder="注释（可选）" style="width: 100%; height: 40px"></textarea>
                <select id="promptCategory" style="width: 100%; margin: 8px 0">
                    <option value="洗稿">洗稿</option>
                    <option value="创作">创作</option>
                    <option value="翻译">翻译</option>
                    <option value="其他">其他</option>
                </select>
                <div style="text-align: right">
                    <button id="cancelPrompt">取消</button>
                    <button id="savePrompt">保存</button>
                </div>
            </div>
            <div class="prompt-list" id="promptList"></div>
        `;
        document.body.appendChild(container);

        // 初始化事件
        initEvents();
        loadPrompts();
        updateCategoryList();
    }

    // 初始化
    createUI();
})(); 