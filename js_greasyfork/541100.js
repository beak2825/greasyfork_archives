// ==UserScript==
// @name         图片链接提取与PDF导出通用版
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  可自定义父元素选择器，提取指定元素内的图片链接并导出为PDF
// @author       TedLife
// @homepageURL  https://tedlife.com/
// @license MIT
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @resource     pdfCSS https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/541100/%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E4%B8%8EPDF%E5%AF%BC%E5%87%BA%E9%80%9A%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/541100/%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E4%B8%8EPDF%E5%AF%BC%E5%87%BA%E9%80%9A%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 默认配置
    const defaultConfig = {
        selector: '.EaCvy',
        selectorType: 'class' // 'class', 'id', 'custom'
    };
    
    // 获取或设置配置
    function getConfig() {
        const saved = GM_getValue('imgExtractorConfig', null);
        return saved ? JSON.parse(saved) : defaultConfig;
    }
    
    function saveConfig(config) {
        GM_setValue('imgExtractorConfig', JSON.stringify(config));
    }
    
    // 当前配置
    let currentConfig = getConfig();
    
    // 添加PDF生成所需的Bootstrap样式
    const pdfCSS = GM_getResourceText('pdfCSS');
    GM_addStyle(`
        /* 浮动按钮样式 */
        #pdf-extractor-btn {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 9999;
            padding: 12px 20px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 6px 20px rgba(37, 117, 252, 0.5);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #pdf-extractor-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 117, 252, 0.7);
        }
        
        #pdf-extractor-btn:active {
            transform: translateY(1px);
        }
        
        #pdf-extractor-btn .spinner {
            display: none;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* 结果面板样式 */
        #pdf-extractor-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9998;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 20px;
            width: 400px;
            max-height: 70vh;
            overflow: auto;
            display: none;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        #pdf-extractor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        #pdf-extractor-title {
            margin: 0;
            color: #2c3e50;
            font-size: 1.4rem;
        }
        
        #pdf-extractor-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #777;
            padding: 0 10px;
        }
        
        .image-result-item {
            display: flex;
            padding: 12px;
            border-bottom: 1px solid #f1f1f1;
            transition: background 0.2s;
        }
        
        .image-result-item:hover {
            background: #f9f9ff;
        }
        
        .image-preview {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 15px;
            border: 1px solid #eee;
            background: #f8f8f8;
        }
        
        .image-details {
            flex: 1;
            overflow: hidden;
        }
        
        .image-url {
            display: block;
            word-break: break-all;
            font-size: 0.85rem;
            color: #3498db;
            text-decoration: none;
            margin-bottom: 8px;
        }
        
        .image-url:hover {
            text-decoration: underline;
        }
        
        .image-actions {
            display: flex;
            gap: 8px;
        }
        
        .action-btn {
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            cursor: pointer;
            border: none;
            background: #f1f5ff;
            color: #2575fc;
            transition: all 0.2s;
        }
        
        .action-btn:hover {
            background: #e1ebff;
            transform: translateY(-1px);
        }
        
        .action-btn.copy {
            background: #e8f7f0;
            color: #27ae60;
        }
        
        .action-btn.copy:hover {
            background: #d1f2e5;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .image-count {
            font-weight: bold;
            color: #2c3e50;
        }
        
        #generate-pdf-btn {
            padding: 10px 20px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #generate-pdf-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }
        
        #generate-pdf-btn .spinner {
            display: none;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }
        
        .no-images {
            text-align: center;
            padding: 30px 0;
            color: #777;
        }
        
        .no-images i {
            font-size: 3rem;
            color: #e0e0e0;
            margin-bottom: 15px;
            display: block;
        }
        
        /* 加载动画 */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            display: none;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
            margin-bottom: 20px;
        }
        
        .loading-text {
            font-size: 1.2rem;
            color: #2c3e50;
            font-weight: 500;
        }
        
        .progress-container {
            width: 300px;
            max-width: 80%;
            background: #f1f1f1;
            border-radius: 10px;
            margin-top: 20px;
            overflow: hidden;
        }
        
        .progress-bar {
            height: 20px;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 10px;
            width: 0%;
            transition: width 0.3s ease;
        }
        
        /* 设置面板样式 */
        #pdf-settings-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 30px;
            width: 500px;
            max-width: 90vw;
            display: none;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        #pdf-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
        }
        
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .settings-title {
            margin: 0;
            color: #2c3e50;
            font-size: 1.5rem;
        }
        
        .settings-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #777;
            padding: 0 10px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .form-input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e1e8ed;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #2575fc;
        }
        
        .form-select {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e1e8ed;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
        }
        
        .form-help {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        
        .settings-buttons {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .btn-save {
            padding: 12px 25px;
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
        }
        
        .btn-cancel {
            padding: 12px 25px;
            background: #f8f9fa;
            color: #6c757d;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .btn-cancel:hover {
            background: #e9ecef;
            border-color: #dee2e6;
        }
        
        .btn-settings {
            position: fixed;
            bottom: 140px;
            right: 20px;
            z-index: 9999;
            padding: 10px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
            transition: all 0.3s ease;
        }
        
        .btn-settings:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
        }
    `);
    
    // 创建UI元素
    const container = document.createElement('div');
    container.id = 'pdf-extractor-container';
    container.innerHTML = `
        <div id="pdf-extractor-header">
            <h3 id="pdf-extractor-title">图片链接提取结果</h3>
            <button id="pdf-extractor-close">×</button>
        </div>
        <div id="image-link-results"></div>
        <div class="summary-row">
            <div class="image-count">找到 <span id="image-count">0</span> 张图片</div>
            <button id="generate-pdf-btn">
                <span class="spinner"></span>
                导出为PDF
            </button>
        </div>
    `;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'pdf-extractor-btn';
    toggleBtn.innerHTML = `
        <span class="spinner"></span>
        <span class="btn-text">提取图片链接</span>
    `;
    
    // 创建设置按钮
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'btn-settings';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = '设置选择器';
    
    // 创建设置面板
    const settingsOverlay = document.createElement('div');
    settingsOverlay.id = 'pdf-settings-overlay';
    
    const settingsContainer = document.createElement('div');
    settingsContainer.id = 'pdf-settings-container';
    settingsContainer.innerHTML = `
        <div class="settings-header">
            <h3 class="settings-title">选择器设置</h3>
            <button class="settings-close">×</button>
        </div>
        <form id="settings-form">
            <div class="form-group">
                <label class="form-label">选择器类型</label>
                <select class="form-select" id="selector-type">
                    <option value="class">CSS类名 (class)</option>
                    <option value="id">元素ID</option>
                    <option value="custom">自定义选择器</option>
                </select>
                <div class="form-help">选择要匹配的元素类型</div>
            </div>
            <div class="form-group">
                <label class="form-label">选择器值</label>
                <input type="text" class="form-input" id="selector-value" placeholder="例如：EaCvy">
                <div class="form-help" id="selector-help">输入CSS类名（不包含点号）</div>
            </div>
            <div class="form-group">
                <label class="form-label">预览选择器</label>
                <input type="text" class="form-input" id="selector-preview" readonly>
                <div class="form-help">这是最终使用的CSS选择器</div>
            </div>
            <div class="settings-buttons">
                <button type="button" class="btn-cancel">取消</button>
                <button type="submit" class="btn-save">保存设置</button>
            </div>
        </form>
    `;
    
    // 创建加载覆盖层
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">正在生成PDF文件，请稍候...</div>
        <div class="progress-container">
            <div class="progress-bar" id="pdf-progress-bar"></div>
        </div>
        <div id="progress-text">0%</div>
    `;
    
    // 添加到文档
    document.body.appendChild(container);
    document.body.appendChild(toggleBtn);
    document.body.appendChild(settingsBtn);
    document.body.appendChild(settingsOverlay);
    document.body.appendChild(settingsContainer);
    document.body.appendChild(loadingOverlay);
    
    // 设置面板相关函数
    function updateSelectorPreview() {
        const type = document.getElementById('selector-type').value;
        const value = document.getElementById('selector-value').value.trim();
        const preview = document.getElementById('selector-preview');
        const help = document.getElementById('selector-help');
        
        if (!value) {
            preview.value = '';
            return;
        }
        
        switch (type) {
            case 'class':
                preview.value = `.${value} img`;
                help.textContent = '输入CSS类名（不包含点号）';
                break;
            case 'id':
                preview.value = `#${value} img`;
                help.textContent = '输入元素ID（不包含井号）';
                break;
            case 'custom':
                preview.value = `${value} img`;
                help.textContent = '输入完整的CSS选择器';
                break;
        }
    }
    
    function loadSettingsToForm() {
        const config = getConfig();
        document.getElementById('selector-type').value = config.selectorType;
        
        // 从选择器中提取值
        let value = '';
        if (config.selectorType === 'class' && config.selector.startsWith('.')) {
            value = config.selector.replace(/\s+img$/, '').substring(1);
        } else if (config.selectorType === 'id' && config.selector.startsWith('#')) {
            value = config.selector.replace(/\s+img$/, '').substring(1);
        } else if (config.selectorType === 'custom') {
            value = config.selector.replace(/\s+img$/, '');
        }
        
        document.getElementById('selector-value').value = value;
        updateSelectorPreview();
    }
    
    function showSettings() {
        loadSettingsToForm();
        settingsOverlay.style.display = 'block';
        settingsContainer.style.display = 'block';
    }
    
    function hideSettings() {
        settingsOverlay.style.display = 'none';
        settingsContainer.style.display = 'none';
    }
    
    // 事件处理
    toggleBtn.addEventListener('click', function() {
        extractImageLinks();
        container.style.display = container.style.display === 'block' ? 'none' : 'block';
        toggleBtn.querySelector('.btn-text').textContent = 
            container.style.display === 'block' ? '隐藏结果' : '提取图片链接';
    });
    
    document.getElementById('pdf-extractor-close').addEventListener('click', function() {
        container.style.display = 'none';
        toggleBtn.querySelector('.btn-text').textContent = '提取图片链接';
    });
    
    document.getElementById('generate-pdf-btn').addEventListener('click', generatePDF);
    
    // 设置面板事件处理
    settingsBtn.addEventListener('click', showSettings);
    
    settingsOverlay.addEventListener('click', hideSettings);
    
    settingsContainer.addEventListener('click', function(e) {
        e.stopPropagation(); // 防止点击面板内容时关闭
    });
    
    document.querySelector('.settings-close').addEventListener('click', hideSettings);
    
    document.querySelector('.btn-cancel').addEventListener('click', hideSettings);
    
    // 选择器类型和值变化时更新预览
    document.getElementById('selector-type').addEventListener('change', updateSelectorPreview);
    document.getElementById('selector-value').addEventListener('input', updateSelectorPreview);
    
    // 设置表单提交
    document.getElementById('settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('selector-type').value;
        const value = document.getElementById('selector-value').value.trim();
        
        if (!value) {
            GM_notification({
                title: '设置错误',
                text: '请输入选择器值',
                timeout: 3000
            });
            return;
        }
        
        let selector;
        switch (type) {
            case 'class':
                selector = `.${value}`;
                break;
            case 'id':
                selector = `#${value}`;
                break;
            case 'custom':
                selector = value;
                break;
        }
        
        // 测试选择器是否有效
        try {
            document.querySelectorAll(`${selector} img`);
        } catch (error) {
            GM_notification({
                title: '选择器错误',
                text: '无效的CSS选择器，请检查语法',
                timeout: 3000
            });
            return;
        }
        
        // 保存配置
        currentConfig = {
            selector: selector,
            selectorType: type
        };
        saveConfig(currentConfig);
        
        hideSettings();
        
        GM_notification({
            title: '设置已保存',
            text: `选择器已更新为: ${selector} img`,
            timeout: 3000
        });
     });
     
     // 初始化设置面板显示
     setTimeout(() => {
         loadSettingsToForm();
     }, 100);
     
     // 提取图片链接函数
    function extractImageLinks() {
        const config = getConfig();
        const selector = `${config.selector} img`;
        const elements = document.querySelectorAll(selector);
        const resultsContainer = document.getElementById('image-link-results');
        const countElement = document.getElementById('image-count');
        
        resultsContainer.innerHTML = '';
        
        if (elements.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-images">
                    <div>🖼️</div>
                    <p>没有找到符合条件的图片</p>
                    <p>当前选择器: <code>${selector}</code></p>
                    <p>点击右下角的⚙️按钮可以修改选择器设置</p>
                </div>
            `;
            countElement.textContent = '0';
            return;
        }
        
        const fragment = document.createDocumentFragment();
        let validImageCount = 0;
        
        elements.forEach(img => {
            // 优先获取data-src（用于懒加载），没有则使用src
            const src = img.dataset.src || img.src;
            
            if (!src) return;
            validImageCount++;
            
            const item = document.createElement('div');
            item.className = 'image-result-item';
            
            const imgPreview = document.createElement('img');
            imgPreview.className = 'image-preview';
            imgPreview.src = src;
            imgPreview.onerror = function() {
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
            };
            
            const details = document.createElement('div');
            details.className = 'image-details';
            
            const url = document.createElement('a');
            url.className = 'image-url';
            url.href = src;
            url.textContent = src;
            url.target = '_blank';
            
            const actions = document.createElement('div');
            actions.className = 'image-actions';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'action-btn copy';
            copyBtn.textContent = '复制链接';
            
            copyBtn.addEventListener('click', () => {
                GM_setClipboard(src);
                GM_notification({
                    text: '图片链接已复制到剪贴板',
                    timeout: 2000
                });
            });
            
            actions.appendChild(copyBtn);
            details.appendChild(url);
            details.appendChild(actions);
            item.appendChild(imgPreview);
            item.appendChild(details);
            fragment.appendChild(item);
        });
        
        resultsContainer.appendChild(fragment);
        countElement.textContent = validImageCount;
        
        // 显示通知
        if (validImageCount > 0) {
            GM_notification({
                title: '图片链接提取完成',
                text: `成功提取了 ${validImageCount} 张图片的链接`,
                timeout: 3000
            });
        }
    }
    
    // 生成PDF函数（优化版）
    function generatePDF() {
        const btn = document.getElementById('generate-pdf-btn');
        const btnSpinner = btn.querySelector('.spinner');
        const config = getConfig();
        const selector = `${config.selector} img`;
        const images = Array.from(document.querySelectorAll(selector));
        const validImages = images.filter(img => img.dataset.src || img.src);
        
        if (validImages.length === 0) {
            GM_notification({
                title: '生成PDF失败',
                text: '没有找到可用的图片',
                timeout: 3000
            });
            return;
        }
        
        // 显示加载状态
        loadingOverlay.style.display = 'flex';
        btnSpinner.style.display = 'inline-block';
        btn.disabled = true;
        
        // 获取进度元素
        const progressBar = document.getElementById('pdf-progress-bar');
        const progressText = document.querySelector('#progress-text');
        
        // 创建PDF文档
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 存储所有图片的Base64数据
        const imageDataPromises = [];
        let processedCount = 0;
        
        // 获取所有图片的Base64数据
        validImages.forEach(img => {
            const src = img.dataset.src || img.src;
            const promise = new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: src,
                    responseType: "blob",
                    onload: function(response) {
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            processedCount++;
                            const progress = Math.round((processedCount / validImages.length) * 100);
                            progressBar.style.width = `${progress}%`;
                            progressText.textContent = `${progress}%`;
                            
                            resolve({
                                data: reader.result,
                                width: img.naturalWidth || img.width,
                                height: img.naturalHeight || img.height
                            });
                        };
                        reader.readAsDataURL(response.response);
                    },
                    onerror: function() {
                        processedCount++;
                        resolve(null); // 忽略加载失败的图片
                    }
                });
            });
            imageDataPromises.push(promise);
        });
        
        // 等待所有图片加载完成
        Promise.all(imageDataPromises).then(imageDataArray => {
            // 过滤掉加载失败的图片
            const validImageData = imageDataArray.filter(data => data !== null);
            
            if (validImageData.length === 0) {
                loadingOverlay.style.display = 'none';
                btnSpinner.style.display = 'none';
                btn.disabled = false;
                GM_notification({
                    title: '生成PDF失败',
                    text: '所有图片加载失败',
                    timeout: 3000
                });
                return;
            }
            
            // 添加图片到PDF
            validImageData.forEach((imageData, index) => {
                const imgWidth = imageData.width;
                const imgHeight = imageData.height;
                
                // 计算图片在PDF中的尺寸（保持比例）
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                
                // 计算缩放比例（保留5%的边距）
                const margin = pageWidth * 0.05;
                const maxWidth = pageWidth - (margin * 2);
                const maxHeight = pageHeight - (margin * 2);
                
                let widthRatio = maxWidth / imgWidth;
                let heightRatio = maxHeight / imgHeight;
                let ratio = Math.min(widthRatio, heightRatio);
                
                const scaledWidth = imgWidth * ratio;
                const scaledHeight = imgHeight * ratio;
                
                // 计算居中位置
                const x = (pageWidth - scaledWidth) / 2;
                const y = (pageHeight - scaledHeight) / 2;
                
                // 添加新页面（第一页除外）
                if (index > 0) {
                    doc.addPage();
                }
                
                // 添加图片（不添加任何文字）
                doc.addImage(
                    imageData.data,
                    'JPEG',
                    x,
                    y,
                    scaledWidth,
                    scaledHeight
                );
            });
            
            // 保存PDF
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            doc.save(`extracted-images-${timestamp}.pdf`);
            
            // 隐藏加载状态
            loadingOverlay.style.display = 'none';
            btnSpinner.style.display = 'none';
            btn.disabled = false;
            
            GM_notification({
                title: 'PDF导出成功',
                text: `已导出 ${validImageData.length} 张图片`,
                timeout: 3000
            });
        });
    }
})();