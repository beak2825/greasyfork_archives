// ==UserScript==
// @name         智能内容提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  智能提取网页内容，支持表格、列表、文章等多种格式导出
// @author       Trae AI Assistant
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543396/%E6%99%BA%E8%83%BD%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543396/%E6%99%BA%E8%83%BD%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 内容提取器类
    class ContentExtractor {
        constructor() {
            this.extractedData = [];
            this.currentMode = 'auto';
            this.selectedElements = [];
            this.isSelecting = false;
            this.init();
        }

        init() {
            this.createFloatingButton();
            this.createExtractionPanel();
            this.bindEvents();
        }

        // 创建悬浮按钮
        createFloatingButton() {
            const button = document.createElement('div');
            button.id = 'content-extractor-btn';
            button.innerHTML = '📊';
            button.title = '内容提取器';
            
            GM_addStyle(`
                #content-extractor-btn {
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 9999;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                }
                
                #content-extractor-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(0,0,0,0.3);
                }
                
                #content-extractor-btn.active {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                }
            `);
            
            document.body.appendChild(button);
            this.floatingBtn = button;
        }

        // 创建提取面板
        createExtractionPanel() {
            const panel = document.createElement('div');
            panel.id = 'extraction-panel';
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>📊 内容提取器</h3>
                    <button id="panel-close">×</button>
                </div>
                <div class="panel-content">
                    <div class="mode-selector">
                        <label>提取模式:</label>
                        <select id="extraction-mode">
                            <option value="auto">智能识别</option>
                            <option value="table">表格数据</option>
                            <option value="list">列表数据</option>
                            <option value="article">文章内容</option>
                            <option value="image">图片链接</option>
                            <option value="link">超链接</option>
                            <option value="custom">自定义选择</option>
                        </select>
                    </div>
                    
                    <div class="extraction-options">
                        <label>
                            <input type="checkbox" id="include-headers" checked> 包含标题行
                        </label>
                        <label>
                            <input type="checkbox" id="clean-data" checked> 清理数据
                        </label>
                        <label>
                            <input type="checkbox" id="preserve-links"> 保留链接
                        </label>
                    </div>
                    
                    <div class="action-buttons">
                        <button id="start-extraction" class="primary-btn">开始提取</button>
                        <button id="preview-data" class="secondary-btn">预览数据</button>
                        <button id="clear-selection" class="warning-btn">清除选择</button>
                    </div>
                    
                    <div class="extraction-status">
                        <div id="status-text">准备就绪</div>
                        <div id="data-count">已提取: 0 项</div>
                    </div>
                </div>
                
                <div class="export-section">
                    <h4>导出选项</h4>
                    <div class="export-buttons">
                        <button id="export-json">JSON</button>
                        <button id="export-csv">CSV</button>
                        <button id="export-excel">Excel</button>
                        <button id="export-txt">TXT</button>
                        <button id="export-markdown">Markdown</button>
                    </div>
                </div>
                
                <div class="preview-section" id="preview-section" style="display: none;">
                    <h4>数据预览</h4>
                    <div class="preview-container" id="preview-container"></div>
                </div>
            `;

            GM_addStyle(`
                #extraction-panel {
                    position: fixed;
                    top: 50%;
                    right: 20px;
                    transform: translateY(-50%);
                    width: 350px;
                    max-height: 80vh;
                    background: white;
                    border: 1px solid #e1e8ed;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    display: none;
                    overflow-y: auto;
                }
                
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px 12px 0 0;
                }
                
                .panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                #panel-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                }
                
                #panel-close:hover {
                    background: rgba(255,255,255,0.2);
                }
                
                .panel-content {
                    padding: 20px;
                }
                
                .mode-selector {
                    margin-bottom: 16px;
                }
                
                .mode-selector label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #2d3748;
                }
                
                .mode-selector select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #cbd5e0;
                    border-radius: 6px;
                    background: white;
                    font-size: 14px;
                    outline: none;
                }
                
                .extraction-options {
                    margin-bottom: 20px;
                    padding: 12px;
                    background: #f7fafc;
                    border-radius: 6px;
                }
                
                .extraction-options label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 14px;
                    color: #4a5568;
                    cursor: pointer;
                }
                
                .extraction-options input[type="checkbox"] {
                    margin-right: 8px;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }
                
                .action-buttons button {
                    flex: 1;
                    padding: 10px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                .primary-btn {
                    background: #4299e1;
                    color: white;
                }
                
                .primary-btn:hover {
                    background: #3182ce;
                }
                
                .secondary-btn {
                    background: #718096;
                    color: white;
                }
                
                .secondary-btn:hover {
                    background: #2d3748;
                }
                
                .warning-btn {
                    background: #f56565;
                    color: white;
                }
                
                .warning-btn:hover {
                    background: #e53e3e;
                }
                
                .extraction-status {
                    padding: 12px;
                    background: #edf2f7;
                    border-radius: 6px;
                    font-size: 13px;
                }
                
                #status-text {
                    color: #4a5568;
                    margin-bottom: 4px;
                }
                
                #data-count {
                    color: #2b6cb0;
                    font-weight: 500;
                }
                
                .export-section {
                    border-top: 1px solid #e2e8f0;
                    padding: 16px 20px;
                }
                
                .export-section h4 {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    color: #2d3748;
                }
                
                .export-buttons {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                }
                
                .export-buttons button {
                    flex: 1;
                    padding: 6px 10px;
                    border: 1px solid #cbd5e0;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    color: #4a5568;
                    transition: all 0.2s;
                }
                
                .export-buttons button:hover {
                    background: #f7fafc;
                    border-color: #a0aec0;
                }
                
                .preview-section {
                    border-top: 1px solid #e2e8f0;
                    padding: 16px 20px;
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .preview-section h4 {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    color: #2d3748;
                }
                
                .preview-container {
                    background: #f7fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 12px;
                    font-size: 12px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                
                .highlight-element {
                    outline: 2px solid #4299e1 !important;
                    background: rgba(66, 153, 225, 0.1) !important;
                    cursor: pointer !important;
                }
                
                .selected-element {
                    outline: 2px solid #48bb78 !important;
                    background: rgba(72, 187, 120, 0.2) !important;
                }
            `);

            document.body.appendChild(panel);
            this.panel = panel;
        }

        // 绑定事件
        bindEvents() {
            // 悬浮按钮点击事件
            this.floatingBtn.addEventListener('click', () => {
                this.togglePanel();
            });

            // 面板关闭按钮
            document.getElementById('panel-close').addEventListener('click', () => {
                this.hidePanel();
            });

            // 开始提取按钮
            document.getElementById('start-extraction').addEventListener('click', () => {
                this.startExtraction();
            });

            // 预览数据按钮
            document.getElementById('preview-data').addEventListener('click', () => {
                this.previewData();
            });

            // 清除选择按钮
            document.getElementById('clear-selection').addEventListener('click', () => {
                this.clearSelection();
            });

            // 导出按钮事件
            document.getElementById('export-json').addEventListener('click', () => this.exportData('json'));
            document.getElementById('export-csv').addEventListener('click', () => this.exportData('csv'));
            document.getElementById('export-excel').addEventListener('click', () => this.exportData('excel'));
            document.getElementById('export-txt').addEventListener('click', () => this.exportData('txt'));
            document.getElementById('export-markdown').addEventListener('click', () => this.exportData('markdown'));
        }

        // 切换面板显示
        togglePanel() {
            if (this.panel.style.display === 'none' || !this.panel.style.display) {
                this.showPanel();
            } else {
                this.hidePanel();
            }
        }

        // 显示面板
        showPanel() {
            this.panel.style.display = 'block';
            this.floatingBtn.classList.add('active');
        }

        // 隐藏面板
        hidePanel() {
            this.panel.style.display = 'none';
            this.floatingBtn.classList.remove('active');
            this.stopCustomSelection();
        }

        // 智能识别页面内容类型
        detectContentType() {
            const tables = document.querySelectorAll('table');
            const lists = document.querySelectorAll('ul, ol');
            const articles = document.querySelectorAll('article, .article, .content, .post');
            
            if (tables.length > 0) return 'table';
            if (lists.length > 0) return 'list'; 
            if (articles.length > 0) return 'article';
            return 'custom';
        }

        // 提取表格数据
        extractTableData() {
            const tables = document.querySelectorAll('table');
            const data = [];
            
            tables.forEach((table, tableIndex) => {
                const tableData = {
                    tableIndex: tableIndex + 1,
                    headers: [],
                    rows: []
                };
                
                // 提取表头
                const headers = table.querySelectorAll('thead th, tr:first-child th, tr:first-child td');
                if (headers.length > 0) {
                    tableData.headers = Array.from(headers).map(th => this.cleanText(th.textContent));
                }
                
                // 提取数据行
                const rows = table.querySelectorAll('tbody tr, tr');
                rows.forEach((row, rowIndex) => {
                    if (rowIndex === 0 && headers.length > 0) return; // 跳过表头行
                    
                    const cells = row.querySelectorAll('td, th');
                    if (cells.length > 0) {
                        const rowData = Array.from(cells).map(cell => ({
                            text: this.cleanText(cell.textContent),
                            html: cell.innerHTML,
                            links: this.extractLinks(cell)
                        }));
                        tableData.rows.push(rowData);
                    }
                });
                
                if (tableData.rows.length > 0) {
                    data.push(tableData);
                }
            });
            
            return data;
        }

        // 提取列表数据
        extractListData() {
            const lists = document.querySelectorAll('ul, ol');
            const data = [];
            
            lists.forEach((list, listIndex) => {
                const listData = {
                    listIndex: listIndex + 1,
                    type: list.tagName.toLowerCase(),
                    items: []
                };
                
                const items = list.querySelectorAll('li');
                items.forEach(item => {
                    listData.items.push({
                        text: this.cleanText(item.textContent),
                        html: item.innerHTML,
                        links: this.extractLinks(item)
                    });
                });
                
                if (listData.items.length > 0) {
                    data.push(listData);
                }
            });
            
            return data;
        }

        // 提取文章内容
        extractArticleData() {
            const selectors = [
                'article',
                '.article',
                '.content',
                '.post',
                '.entry-content',
                '.post-content',
                'main',
                '[role="main"]'
            ];
            
            let article = null;
            for (const selector of selectors) {
                article = document.querySelector(selector);
                if (article) break;
            }
            
            if (!article) {
                // 尝试智能识别主要内容区域
                const contentElements = document.querySelectorAll('div, section');
                let maxTextLength = 0;
                
                contentElements.forEach(el => {
                    const textLength = el.textContent.length;
                    if (textLength > maxTextLength) {
                        maxTextLength = textLength;
                        article = el;
                    }
                });
            }
            
            if (!article) return [];
            
            const data = {
                title: this.extractTitle(),
                content: this.cleanText(article.textContent),
                paragraphs: [],
                headings: [],
                links: this.extractLinks(article),
                images: this.extractImages(article)
            };
            
            // 提取段落
            const paragraphs = article.querySelectorAll('p');
            data.paragraphs = Array.from(paragraphs).map(p => this.cleanText(p.textContent)).filter(text => text.length > 0);
            
            // 提取标题
            const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
            data.headings = Array.from(headings).map(h => ({
                level: parseInt(h.tagName.charAt(1)),
                text: this.cleanText(h.textContent)
            }));
            
            return [data];
        }

        // 提取所有图片
        extractAllImages() {
            const images = document.querySelectorAll('img[src]');
            return Array.from(images).map((img, index) => ({
                index: index + 1,
                src: img.src,
                alt: img.alt || '',
                title: img.title || '',
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height
            }));
        }

        // 提取所有链接
        extractAllLinks() {
            const links = document.querySelectorAll('a[href]');
            return Array.from(links).map((link, index) => ({
                index: index + 1,
                text: this.cleanText(link.textContent),
                url: link.href,
                title: link.title || '',
                target: link.target || ''
            }));
        }

        // 开始自定义选择
        startCustomSelection() {
            this.isSelecting = true;
            this.selectedElements = [];
            document.getElementById('status-text').textContent = '请点击要提取的元素...';
            
            // 添加鼠标事件监听
            document.addEventListener('mouseover', this.handleMouseOver.bind(this));
            document.addEventListener('mouseout', this.handleMouseOut.bind(this));
            document.addEventListener('click', this.handleElementClick.bind(this));
        }

        // 停止自定义选择
        stopCustomSelection() {
            this.isSelecting = false;
            document.removeEventListener('mouseover', this.handleMouseOver.bind(this));
            document.removeEventListener('mouseout', this.handleMouseOut.bind(this));
            document.removeEventListener('click', this.handleElementClick.bind(this));
            
            // 清除高亮
            document.querySelectorAll('.highlight-element').forEach(el => {
                el.classList.remove('highlight-element');
            });
        }

        // 鼠标悬停事件
        handleMouseOver(e) {
            if (!this.isSelecting) return;
            if (this.panel.contains(e.target) || this.floatingBtn.contains(e.target)) return;
            
            e.target.classList.add('highlight-element');
        }

        // 鼠标离开事件
        handleMouseOut(e) {
            if (!this.isSelecting) return;
            if (this.panel.contains(e.target) || this.floatingBtn.contains(e.target)) return;
            
            e.target.classList.remove('highlight-element');
        }

        // 元素点击事件
        handleElementClick(e) {
            if (!this.isSelecting) return;
            if (this.panel.contains(e.target) || this.floatingBtn.contains(e.target)) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            if (e.target.classList.contains('selected-element')) {
                e.target.classList.remove('selected-element');
                this.selectedElements = this.selectedElements.filter(el => el !== e.target);
            } else {
                e.target.classList.add('selected-element');
                this.selectedElements.push(e.target);
            }
            
            document.getElementById('data-count').textContent = `已选择: ${this.selectedElements.length} 个元素`;
        }

        // 提取页面标题
        extractTitle() {
            return document.title || 
                   document.querySelector('h1')?.textContent || 
                   document.querySelector('.title')?.textContent || 
                   '未知标题';
        }

        // 提取链接
        extractLinks(element) {
            const links = element.querySelectorAll('a[href]');
            return Array.from(links).map(link => ({
                text: this.cleanText(link.textContent),
                url: link.href,
                title: link.title
            }));
        }

        // 提取图片
        extractImages(element) {
            const images = element.querySelectorAll('img[src]');
            return Array.from(images).map(img => ({
                src: img.src,
                alt: img.alt,
                title: img.title,
                width: img.width,
                height: img.height
            }));
        }

        // 清理文本
        cleanText(text) {
            if (!text) return '';
            return text.replace(/\s+/g, ' ').trim();
        }

        // 根据类型提取
        extractByType(type) {
            switch (type) {
                case 'table': return this.extractTableData();
                case 'list': return this.extractListData();
                case 'article': return this.extractArticleData();
                case 'image': return this.extractAllImages();
                case 'link': return this.extractAllLinks();
                default: return [];
            }
        }

        // 提取自定义选择的元素
        extractCustomData() {
            return this.selectedElements.map((element, index) => ({
                index: index + 1,
                tagName: element.tagName.toLowerCase(),
                text: this.cleanText(element.textContent),
                html: element.innerHTML,
                links: this.extractLinks(element),
                images: this.extractImages(element)
            }));
        }

        // 开始提取
        startExtraction() {
            const mode = document.getElementById('extraction-mode').value;
            const statusText = document.getElementById('status-text');
            const dataCount = document.getElementById('data-count');
            
            statusText.textContent = '正在提取...';
            
            let extractedData = [];
            
            try {
                switch (mode) {
                    case 'auto':
                        const detectedType = this.detectContentType();
                        extractedData = this.extractByType(detectedType);
                        break;
                    case 'table':
                        extractedData = this.extractTableData();
                        break;
                    case 'list':
                        extractedData = this.extractListData();
                        break;
                    case 'article':
                        extractedData = this.extractArticleData();
                        break;
                    case 'image':
                        extractedData = this.extractAllImages();
                        break;
                    case 'link':
                        extractedData = this.extractAllLinks();
                        break;
                    case 'custom':
                        if (this.selectedElements.length === 0) {
                            this.startCustomSelection();
                            return;
                        } else {
                            extractedData = this.extractCustomData();
                            this.stopCustomSelection();
                        }
                        break;
                }
                
                this.extractedData = extractedData;
                statusText.textContent = '提取完成';
                dataCount.textContent = `已提取: ${this.getDataItemCount()} 项`;
                
            } catch (error) {
                statusText.textContent = '提取失败: ' + error.message;
                console.error('Content extraction error:', error);
            }
        }

        // 获取数据项数量
        getDataItemCount() {
            if (!this.extractedData || this.extractedData.length === 0) return 0;
            
            let count = 0;
            this.extractedData.forEach(item => {
                if (item.rows) {
                    count += item.rows.length;
                } else if (item.items) {
                    count += item.items.length;
                } else if (item.paragraphs) {
                    count += item.paragraphs.length;
                } else {
                    count += 1;
                }
            });
            
            return count;
        }

        // 预览数据
        previewData() {
            const previewSection = document.getElementById('preview-section');
            const previewContainer = document.getElementById('preview-container');
            
            if (!this.extractedData || this.extractedData.length === 0) {
                previewContainer.textContent = '暂无数据，请先提取内容';
            } else {
                previewContainer.textContent = JSON.stringify(this.extractedData, null, 2);
            }
            
            previewSection.style.display = 'block';
        }

        // 清除选择
        clearSelection() {
            this.selectedElements.forEach(el => {
                el.classList.remove('selected-element');
            });
            this.selectedElements = [];
            this.extractedData = [];
            this.stopCustomSelection();
            
            document.getElementById('status-text').textContent = '准备就绪';
            document.getElementById('data-count').textContent = '已提取: 0 项';
            document.getElementById('preview-section').style.display = 'none';
        }

        // 导出数据
        exportData(format) {
            if (!this.extractedData || this.extractedData.length === 0) {
                alert('暂无数据可导出，请先提取内容');
                return;
            }
            
            let content = '';
            let filename = `extracted_data_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
            
            switch (format) {
                case 'json':
                    content = JSON.stringify(this.extractedData, null, 2);
                    filename += '.json';
                    break;
                    
                case 'csv':
                    content = this.convertToCSV(this.extractedData);
                    filename += '.csv';
                    break;
                    
                case 'excel':
                    content = this.convertToExcel(this.extractedData);
                    filename += '.xlsx';
                    break;
                    
                case 'txt':
                    content = this.convertToText(this.extractedData);
                    filename += '.txt';
                    break;
                    
                case 'markdown':
                    content = this.convertToMarkdown(this.extractedData);
                    filename += '.md';
                    break;
            }
            
            this.downloadFile(content, filename);
        }

        // 转换为CSV格式
        convertToCSV(data) {
            const rows = [];
            
            data.forEach(item => {
                if (item.rows && item.headers) {
                    // 表格数据
                    if (item.headers.length > 0) {
                        rows.push(item.headers.join(','));
                    }
                    item.rows.forEach(row => {
                        const csvRow = row.map(cell => `"${cell.text.replace(/"/g, '""')}"`);
                        rows.push(csvRow.join(','));
                    });
                } else if (item.items) {
                    // 列表数据
                    rows.push('项目');
                    item.items.forEach(listItem => {
                        rows.push(`"${listItem.text.replace(/"/g, '""')}"`);
                    });
                } else if (item.paragraphs) {
                    // 文章数据
                    rows.push('段落');
                    item.paragraphs.forEach(paragraph => {
                        rows.push(`"${paragraph.replace(/"/g, '""')}"`);
                    });
                } else {
                    // 其他数据
                    const keys = Object.keys(item);
                    if (rows.length === 0) {
                        rows.push(keys.join(','));
                    }
                    const values = keys.map(key => `"${String(item[key]).replace(/"/g, '""')}"`);
                    rows.push(values.join(','));
                }
            });
            
            return rows.join('\n');
        }

        // 转换为Excel格式（简化版，实际生成CSV格式）
        convertToExcel(data) {
            // 由于浏览器环境限制，这里生成CSV格式，用户可以用Excel打开
            return this.convertToCSV(data);
        }

        // 转换为文本格式
        convertToText(data) {
            const lines = [];
            lines.push('网页内容提取结果');
            lines.push('='.repeat(50));
            lines.push(`提取时间: ${new Date().toLocaleString()}`);
            lines.push(`页面标题: ${document.title}`);
            lines.push(`页面URL: ${window.location.href}`);
            lines.push('');

            data.forEach((item, index) => {
                lines.push(`【数据块 ${index + 1}】`);
                
                if (item.rows && item.headers) {
                    // 表格数据
                    lines.push(`类型: 表格数据`);
                    if (item.headers.length > 0) {
                        lines.push(`表头: ${item.headers.join(' | ')}`);
                    }
                    lines.push(`数据行数: ${item.rows.length}`);
                    lines.push('');
                    
                    item.rows.forEach((row, rowIndex) => {
                        const rowText = row.map(cell => cell.text).join(' | ');
                        lines.push(`${rowIndex + 1}. ${rowText}`);
                    });
                    
                } else if (item.items) {
                    // 列表数据
                    lines.push(`类型: ${item.type.toUpperCase()}列表`);
                    lines.push(`项目数: ${item.items.length}`);
                    lines.push('');
                    
                    item.items.forEach((listItem, itemIndex) => {
                        lines.push(`${itemIndex + 1}. ${listItem.text}`);
                    });
                    
                } else if (item.title && item.paragraphs) {
                    // 文章数据
                    lines.push(`类型: 文章内容`);
                    lines.push(`标题: ${item.title}`);
                    lines.push(`段落数: ${item.paragraphs.length}`);
                    lines.push(`链接数: ${item.links.length}`);
                    lines.push(`图片数: ${item.images.length}`);
                    lines.push('');
                    
                    if (item.headings.length > 0) {
                        lines.push('文章结构:');
                        item.headings.forEach(heading => {
                            const indent = '  '.repeat(heading.level - 1);
                            lines.push(`${indent}- ${heading.text}`);
                        });
                        lines.push('');
                    }
                    
                    lines.push('内容:');
                    item.paragraphs.forEach((paragraph, pIndex) => {
                        lines.push(`${pIndex + 1}. ${paragraph}`);
                        lines.push('');
                    });
                    
                } else if (item.src) {
                    // 图片数据
                    lines.push(`类型: 图片`);
                    lines.push(`链接: ${item.src}`);
                    lines.push(`描述: ${item.alt || '无'}`);
                    lines.push(`尺寸: ${item.width}x${item.height}`);
                    
                } else if (item.url) {
                    // 链接数据
                    lines.push(`类型: 超链接`);
                    lines.push(`文本: ${item.text}`);
                    lines.push(`链接: ${item.url}`);
                    lines.push(`标题: ${item.title || '无'}`);
                    
                } else {
                    // 自定义数据
                    lines.push(`类型: 自定义元素`);
                    lines.push(`标签: ${item.tagName}`);
                    lines.push(`内容: ${item.text}`);
                }
                
                lines.push('');
                lines.push('-'.repeat(30));
                lines.push('');
            });

            return lines.join('\n');
        }

        // 转换为Markdown格式
        convertToMarkdown(data) {
            const lines = [];
            lines.push('# 网页内容提取结果\n');
            lines.push(`**提取时间:** ${new Date().toLocaleString()}`);
            lines.push(`**页面标题:** ${document.title}`);
            lines.push(`**页面URL:** ${window.location.href}\n`);

            data.forEach((item, index) => {
                lines.push(`## 数据块 ${index + 1}\n`);
                
                if (item.rows && item.headers) {
                    // 表格数据
                    lines.push('**类型:** 表格数据\n');
                    
                    if (item.headers.length > 0) {
                        // Markdown表格格式
                        lines.push(`| ${item.headers.join(' | ')} |`);
                        lines.push(`| ${item.headers.map(() => '---').join(' | ')} |`);
                        
                        item.rows.forEach(row => {
                            const rowText = row.map(cell => cell.text.replace(/\|/g, '\\|')).join(' | ');
                            lines.push(`| ${rowText} |`);
                        });
                        lines.push('');
                    }
                    
                } else if (item.items) {
                    // 列表数据
                    lines.push(`**类型:** ${item.type.toUpperCase()}列表\n`);
                    
                    item.items.forEach((listItem, itemIndex) => {
                        if (item.type === 'ol') {
                            lines.push(`${itemIndex + 1}. ${listItem.text}`);
                        } else {
                            lines.push(`- ${listItem.text}`);
                        }
                    });
                    lines.push('');
                    
                } else if (item.title && item.paragraphs) {
                    // 文章数据
                    lines.push('**类型:** 文章内容\n');
                    lines.push(`**标题:** ${item.title}\n`);
                    
                    if (item.headings.length > 0) {
                        lines.push('### 文章结构\n');
                        item.headings.forEach(heading => {
                            const prefix = '#'.repeat(heading.level + 2);
                            lines.push(`${prefix} ${heading.text}`);
                        });
                        lines.push('');
                    }
                    
                    lines.push('### 内容\n');
                    item.paragraphs.forEach(paragraph => {
                        lines.push(paragraph + '\n');
                    });
                    
                    if (item.links.length > 0) {
                        lines.push('### 相关链接\n');
                        item.links.forEach(link => {
                            lines.push(`- [${link.text}](${link.url})`);
                        });
                        lines.push('');
                    }
                    
                } else if (item.src) {
                    // 图片数据
                    lines.push('**类型:** 图片\n');
                    lines.push(`![${item.alt}](${item.src})`);
                    lines.push(`- **描述:** ${item.alt || '无'}`);
                    lines.push(`- **尺寸:** ${item.width}x${item.height}\n`);
                    
                } else if (item.url) {
                    // 链接数据
                    lines.push('**类型:** 超链接\n');
                    lines.push(`[${item.text}](${item.url})`);
                    if (item.title) lines.push(`- **标题:** ${item.title}`);
                    lines.push('');
                    
                } else {
                    // 自定义数据
                    lines.push('**类型:** 自定义元素\n');
                    lines.push(`- **标签:** \`${item.tagName}\``);
                    lines.push(`- **内容:** ${item.text}\n`);
                }
                
                lines.push('---\n');
            });

            return lines.join('\n');
        }

        // 下载文件
        downloadFile(content, filename) {
            try {
                // 使用GM_download如果可用
                if (typeof GM_download !== 'undefined') {
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    GM_download(url, filename);
                    URL.revokeObjectURL(url);
                } else {
                    // 降级到标准下载方法
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                
                document.getElementById('status-text').textContent = '导出成功！';
                setTimeout(() => {
                    document.getElementById('status-text').textContent = '准备就绪';
                }, 2000);
                
            } catch (error) {
                console.error('Download error:', error);
                document.getElementById('status-text').textContent = '导出失败：' + error.message;
            }
        }

        // 保存设置到本地存储
        saveSettings() {
            const settings = {
                mode: document.getElementById('extraction-mode').value,
                includeHeaders: document.getElementById('include-headers').checked,
                cleanData: document.getElementById('clean-data').checked,
                preserveLinks: document.getElementById('preserve-links').checked
            };
            
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('extractor_settings', JSON.stringify(settings));
            } else {
                localStorage.setItem('extractor_settings', JSON.stringify(settings));
            }
        }

        // 从本地存储加载设置
        loadSettings() {
            let settings = null;
            
            try {
                if (typeof GM_getValue !== 'undefined') {
                    const saved = GM_getValue('extractor_settings', null);
                    if (saved) settings = JSON.parse(saved);
                } else {
                    const saved = localStorage.getItem('extractor_settings');
                    if (saved) settings = JSON.parse(saved);
                }
                
                if (settings) {
                    document.getElementById('extraction-mode').value = settings.mode || 'auto';
                    document.getElementById('include-headers').checked = settings.includeHeaders !== false;
                    document.getElementById('clean-data').checked = settings.cleanData !== false;
                    document.getElementById('preserve-links').checked = settings.preserveLinks || false;
                }
            } catch (error) {
                console.warn('Failed to load settings:', error);
            }
        }

        // 初始化完成后加载设置
        initComplete() {
            this.loadSettings();
            
            // 监听设置变化并自动保存
            const settingsElements = [
                'extraction-mode',
                'include-headers', 
                'clean-data',
                'preserve-links'
            ];
            
            settingsElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', () => {
                        this.saveSettings();
                    });
                }
            });
        }
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const extractor = new ContentExtractor();
            setTimeout(() => extractor.initComplete(), 100);
        });
    } else {
        const extractor = new ContentExtractor();
        setTimeout(() => extractor.initComplete(), 100);
    }

})();