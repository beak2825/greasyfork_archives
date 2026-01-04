// ==UserScript==
// @name         HuggingFace镜像链接提取器
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  在HuggingFace页面提取下载链接，同时显示原始链接和hf-mirror.com镜像链接。v1.3.3: 彻底修复搜索高亮间距问题，改用精确匹配和渐变背景
// @author       AI Assistant
// @match        https://huggingface.co/*
// @match        https://hf-mirror.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huggingface.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541818/HuggingFace%E9%95%9C%E5%83%8F%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541818/HuggingFace%E9%95%9C%E5%83%8F%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .hf-extractor-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        .hf-extractor-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .hf-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
        }
        .hf-modal-content {
            background: white;
            border-radius: 15px;
            padding: 20px;
            max-width: 95vw;
            max-height: 95vh;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            min-width: 800px;
            display: flex;
            flex-direction: column;
        }
        .hf-header {
            text-align: center;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .hf-stats {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 15px;
            font-weight: bold;
            font-size: 14px;
        }
        .hf-buttons {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .hf-sort-buttons {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
            justify-content: center;
        }
        .hf-search-container {
            margin-bottom: 15px;
            position: relative;
        }
        .hf-search-input {
            width: 100%;
            padding: 10px 40px 10px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s ease;
            box-sizing: border-box;
            color: #2c3e50 !important;
            background: #ffffff !important;
        }
        .hf-search-input:focus {
            border-color: #3498db;
            box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
        }
        .hf-search-input::placeholder {
            color: #7f8c8d !important;
        }
        .hf-search-clear {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #999;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        .hf-search-clear:hover {
            background: #f0f0f0;
            color: #666;
        }
        .hf-search-stats {
            font-size: 12px;
            color: #2c3e50 !important;
            text-align: center;
            margin-top: 5px;
            font-weight: 500;
        }
        .hf-highlight {
            background: linear-gradient(to bottom, transparent 0%, transparent 20%, #ffeb3b 20%, #ffeb3b 80%, transparent 80%, transparent 100%) !important;
            color: inherit !important;
            font-weight: 600 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            font-size: inherit !important;
            font-family: inherit !important;
            display: inline !important;
            line-height: inherit !important;
            letter-spacing: inherit !important;
            word-spacing: inherit !important;
            text-decoration: none !important;
            vertical-align: baseline !important;
            box-shadow: none !important;
            outline: none !important;
            text-shadow: none !important;
            position: relative !important;
        }

        /* 针对黑暗模式的额外优化 */
        @media (prefers-color-scheme: dark) {
            .hf-modal-content {
                background: #ffffff !important;
                color: #2c3e50 !important;
            }
            .hf-link-item {
                background: #f8f9fa !important;
                color: #2c3e50 !important;
            }
            .hf-link-row {
                background: #ffffff !important;
                color: #2c3e50 !important;
            }
        }
        .hf-sort-btn {
            padding: 5px 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            background: white;
            transition: all 0.2s ease;
        }
        .hf-sort-btn:hover {
            background: #f0f0f0;
        }
        .hf-sort-btn.active {
            background: #3498db;
            color: white;
            border-color: #3498db;
        }
        .hf-links-wrapper {
            flex: 1;
            overflow-y: auto;
            max-height: calc(95vh - 300px);
        }
        .hf-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 100px;
            font-size: 13px;
        }
        .hf-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .hf-btn-close { background: #e74c3c; color: white; }
        .hf-btn-copy-first { background: #3498db; color: white; }
        .hf-btn-copy-all-orig { background: #27ae60; color: white; }
        .hf-btn-copy-all-mirror { background: #f39c12; color: white; }
        .hf-link-item {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
            transition: all 0.2s ease;
        }
        .hf-link-item.main-file {
            border: 2px solid #ff6b6b;
            background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
        }
        .hf-link-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transform: translateY(-1px);
        }
        .hf-file-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .hf-file-name {
            font-weight: bold;
            color: #2c3e50 !important;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
        }
        .hf-file-size {
            font-size: 12px;
            color: #2c3e50 !important;
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 8px;
            font-weight: 500;
        }
        .hf-main-file {
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            padding: 1px 6px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
        }
        .hf-link-row {
            display: flex;
            align-items: center;
            margin-bottom: 2px;
            padding: 4px;
            background: white;
            border-radius: 4px;
        }
        .hf-link-label {
            font-weight: bold;
            min-width: 45px;
            margin-right: 6px;
            font-size: 11px;
            color: #2c3e50 !important;
        }
        .hf-link-url {
            flex: 1;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
            margin-right: 6px;
            color: #2c3e50 !important;
            font-weight: 500;
        }
        .hf-copy-btn {
            padding: 3px 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            transition: all 0.2s ease;
            min-width: 40px;
        }
        .hf-copy-orig { background: #3498db; color: white; }
        .hf-copy-mirror { background: #f39c12; color: white; }
        .hf-copy-btn:hover { opacity: 0.8; }
        .hf-more-info {
            text-align: center;
            padding: 15px;
            color: #7f8c8d;
            font-style: italic;
            background: #ecf0f1;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);

    // 创建提取按钮
    const extractBtn = document.createElement('button');
    extractBtn.className = 'hf-extractor-btn';
    extractBtn.innerHTML = '🔗<br>提取';
    document.body.appendChild(extractBtn);

    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'hf-modal';
    modal.innerHTML = `
        <div class="hf-modal-content">
            <div class="hf-header">
                <h2>🚀 HuggingFace 下载链接提取器</h2>
                <p>同时提供原始链接和镜像链接</p>
            </div>
            <div class="hf-stats" id="hf-stats"></div>
            <div class="hf-buttons">
                <button class="hf-btn hf-btn-close" id="hf-close">❌ 关闭</button>
                <button class="hf-btn hf-btn-copy-first" id="hf-copy-first">📋 复制第一个</button>
                <button class="hf-btn hf-btn-copy-all-orig" id="hf-copy-all-orig">📄 复制全部原始</button>
                <button class="hf-btn hf-btn-copy-all-mirror" id="hf-copy-all-mirror">🚀 复制全部镜像</button>
            </div>
            <div class="hf-search-container">
                <input type="text" class="hf-search-input" id="hf-search-input" placeholder="🔍 输入文件名进行模糊搜索...">
                <button class="hf-search-clear" id="hf-search-clear" title="清除搜索">✕</button>
                <div class="hf-search-stats" id="hf-search-stats"></div>
            </div>
            <div class="hf-sort-buttons">
                <button class="hf-sort-btn active" data-sort="default">🏷️ 默认排序</button>
                <button class="hf-sort-btn" data-sort="name">📝 按名称</button>
                <button class="hf-sort-btn" data-sort="size">📊 按大小</button>
                <button class="hf-sort-btn" data-sort="type">📁 按类型</button>
            </div>
            <div class="hf-links-wrapper">
                <div id="hf-links-container"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // 清理文件名，移除查询参数
    function cleanFileName(fileName) {
        return fileName.replace(/\?.*$/, '');
    }

    // 判断是否为主要文件
    function isMainFile(fileName) {
        const mainFilePatterns = [
            /^README\.md$/i,
            /^config\.json$/i,
            /^model\.safetensors$/i,
            /^pytorch_model\.bin$/i,
            /^model\.onnx$/i,
            /^tokenizer\.json$/i,
            /^tokenizer_config\.json$/i,
            /^vocab\.txt$/i,
            /^merges\.txt$/i,
            /\.py$/i,
            /^requirements\.txt$/i,
            /^setup\.py$/i,
            /^__init__\.py$/i,
            /^Dockerfile$/i,
            /^\.dockerignore$/i
        ];

        return mainFilePatterns.some(pattern => pattern.test(fileName));
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '未知';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    // 从元素中提取文件大小 - 针对HuggingFace页面优化
    function extractFileSize(element) {
        let sizeText = '';
        const fileName = element.getAttribute('download') || element.textContent.trim();

        console.log(`🔍 开始提取文件大小: ${fileName}`);

        // 方法1: 查找HuggingFace特定的文件列表结构
        let currentElement = element;
        for (let level = 0; level < 6; level++) {
            if (!currentElement) break;

            // 在当前层级查找所有文本元素
            const allElements = currentElement.querySelectorAll('*');
            for (const el of allElements) {
                const text = el.textContent.trim();

                // 精确匹配文件大小格式 (如: "459 Bytes", "1 kB", "2.68 kB")
                const sizeMatch = text.match(/^(\d+(?:\.\d+)?)\s*(Bytes?|kB|KB|MB|GB)$/i);
                if (sizeMatch) {
                    sizeText = sizeMatch[0];
                    console.log(`✅ 在层级 ${level} 找到精确文件大小: ${sizeText}`);
                    break;
                }

                // 也匹配包含文件大小的文本
                const sizeInText = text.match(/(\d+(?:\.\d+)?)\s*(Bytes?|kB|KB|MB|GB)\b/i);
                if (sizeInText && text.length < 50) { // 避免匹配到很长的文本
                    sizeText = sizeInText[0];
                    console.log(`✅ 在层级 ${level} 找到文件大小: ${sizeText}`);
                    break;
                }
            }

            if (sizeText) break;
            currentElement = currentElement.parentElement;
        }

        // 方法2: 查找同一行的其他元素
        if (!sizeText) {
            const parentRow = element.closest('li') || element.closest('tr') || element.closest('div');
            if (parentRow) {
                const rowText = parentRow.textContent;
                const sizeMatch = rowText.match(/(\d+(?:\.\d+)?)\s*(Bytes?|kB|KB|MB|GB)\b/i);
                if (sizeMatch) {
                    sizeText = sizeMatch[0];
                    console.log(`✅ 在同一行找到文件大小: ${sizeText}`);
                }
            }
        }

        // 方法3: 全局搜索与文件名相关的大小信息
        if (!sizeText && fileName) {
            console.log(`🔍 全局搜索文件: ${fileName}`);

            // 查找页面中所有可能包含文件大小的元素
            const allTextElements = document.querySelectorAll('span, div, td, li, p');
            for (const el of allTextElements) {
                const text = el.textContent.trim();

                // 检查是否包含文件名和大小信息
                if (text.includes(fileName) || el.closest('*').textContent.includes(fileName)) {
                    const sizeMatch = text.match(/(\d+(?:\.\d+)?)\s*(Bytes?|kB|KB|MB|GB)\b/i);
                    if (sizeMatch) {
                        sizeText = sizeMatch[0];
                        console.log(`✅ 全局搜索找到文件大小: ${sizeText}`);
                        break;
                    }
                }
            }
        }

        // 方法4: 查找相邻元素
        if (!sizeText && element.parentElement) {
            const siblings = Array.from(element.parentElement.children);
            for (const sibling of siblings) {
                const text = sibling.textContent.trim();
                const sizeMatch = text.match(/^(\d+(?:\.\d+)?)\s*(Bytes?|kB|KB|MB|GB)$/i);
                if (sizeMatch) {
                    sizeText = sizeMatch[0];
                    console.log(`✅ 在兄弟元素找到文件大小: ${sizeText}`);
                    break;
                }
            }
        }

        const result = sizeText || '未知';
        console.log(`📊 文件 ${fileName} 最终大小: ${result}`);
        return result;
    }

    // 解析文件大小为字节数（用于排序）
    function parseSizeToBytes(sizeStr) {
        if (!sizeStr || sizeStr === '未知') return 0;

        // 支持更多格式的匹配
        const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|kB|bytes|Bytes)\b/i);
        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        const multipliers = {
            'B': 1,
            'BYTES': 1,
            'KB': 1024,
            'kB': 1024,  // 小写k
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024
        };

        return value * (multipliers[unit] || 1);
    }

    // 全局变量存储当前排序方式和搜索状态
    let currentSortType = 'default';
    let allLinks = [];
    let filteredLinks = [];
    let currentSearchTerm = '';

    // 提取链接函数
    function extractLinks() {
        const links = [];
        const elements = document.querySelectorAll('a[download][href]');

        console.log(`🔍 找到 ${elements.length} 个下载链接`);

        elements.forEach((element, index) => {
            const href = element.getAttribute('href');
            if (href) {
                const originalLink = href.startsWith('http') ? href : 'https://huggingface.co' + href;
                const mirrorLink = originalLink.replace('huggingface.co', 'hf-mirror.com');
                const rawFileName = href.split('/').pop() || 'unknown';
                const fileName = cleanFileName(rawFileName);
                const isMain = isMainFile(fileName);
                const fileSize = extractFileSize(element);
                const fileSizeBytes = parseSizeToBytes(fileSize);

                console.log(`📁 文件 ${index + 1}: ${fileName}, 大小: ${fileSize}, 字节: ${fileSizeBytes}`);

                links.push({
                    original: originalLink,
                    mirror: mirrorLink,
                    fileName: fileName,
                    isMainFile: isMain,
                    fileSize: fileSize,
                    fileSizeBytes: fileSizeBytes
                });
            }
        });

        allLinks = links;
        filteredLinks = links;
        return sortLinks(links, 'default');
    }

    // 排序函数
    function sortLinks(links, sortType) {
        const sorted = [...links];

        switch (sortType) {
            case 'name':
                return sorted.sort((a, b) => a.fileName.localeCompare(b.fileName));
            case 'size':
                return sorted.sort((a, b) => b.fileSizeBytes - a.fileSizeBytes);
            case 'type':
                return sorted.sort((a, b) => {
                    const extA = a.fileName.split('.').pop().toLowerCase();
                    const extB = b.fileName.split('.').pop().toLowerCase();
                    return extA.localeCompare(extB);
                });
            case 'default':
            default:
                return sorted.sort((a, b) => {
                    if (a.isMainFile && !b.isMainFile) return -1;
                    if (!a.isMainFile && b.isMainFile) return 1;
                    return a.fileName.localeCompare(b.fileName);
                });
        }
    }

    // 模糊搜索功能
    function fuzzySearch(links, searchTerm) {
        if (!searchTerm.trim()) {
            return links;
        }

        const term = searchTerm.toLowerCase().trim();

        return links.filter(link => {
            const fileName = link.fileName.toLowerCase();

            // 精确匹配
            if (fileName.includes(term)) {
                return true;
            }

            // 模糊匹配：检查搜索词的每个字符是否按顺序出现在文件名中
            let termIndex = 0;
            for (let i = 0; i < fileName.length && termIndex < term.length; i++) {
                if (fileName[i] === term[termIndex]) {
                    termIndex++;
                }
            }

            return termIndex === term.length;
        });
    }

    // 高亮搜索结果 - 使用更温和的高亮方式
    function highlightSearchTerm(text, searchTerm) {
        if (!searchTerm.trim()) {
            return text;
        }

        const term = searchTerm.trim().toLowerCase();
        const lowerText = text.toLowerCase();

        // 只进行精确匹配高亮，避免模糊匹配造成的间距问题
        const exactIndex = lowerText.indexOf(term);
        if (exactIndex !== -1) {
            const before = text.substring(0, exactIndex);
            const match = text.substring(exactIndex, exactIndex + term.length);
            const after = text.substring(exactIndex + term.length);
            return before + '<span class="hf-highlight">' + match + '</span>' + after;
        }

        // 如果没有精确匹配，就不高亮，保持原始文本
        return text;
    }

    // 更新搜索统计
    function updateSearchStats(filteredCount, totalCount, searchTerm) {
        const statsElement = document.getElementById('hf-search-stats');
        if (searchTerm.trim()) {
            statsElement.textContent = `找到 ${filteredCount} / ${totalCount} 个文件`;
            statsElement.style.display = 'block';
        } else {
            statsElement.style.display = 'none';
        }
    }

    // 执行搜索和显示
    function performSearch() {
        const searchTerm = document.getElementById('hf-search-input').value;
        currentSearchTerm = searchTerm;

        // 先搜索，再排序
        filteredLinks = fuzzySearch(allLinks, searchTerm);
        const sortedLinks = sortLinks(filteredLinks, currentSortType);

        // 更新统计信息
        updateSearchStats(filteredLinks.length, allLinks.length, searchTerm);

        // 显示结果
        displayLinks(sortedLinks, searchTerm);
    }

    // 复制到剪贴板
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = '✅ 已复制!';
            button.style.background = '#27ae60';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 1500);
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    }

    // 显示链接
    function displayLinks(links, searchTerm = '') {
        const container = document.getElementById('hf-links-container');
        const stats = document.getElementById('hf-stats');

        const mainFileCount = links.filter(link => link.isMainFile).length;
        const totalSize = links.reduce((sum, link) => sum + link.fileSizeBytes, 0);
        const totalSizeStr = formatFileSize(totalSize);

        const statsText = mainFileCount > 0
            ? `📊 共 <strong>${links.length}</strong> 个文件，其中 <strong>${mainFileCount}</strong> 个主要文件，总大小: <strong>${totalSizeStr}</strong>`
            : `📊 共 <strong>${links.length}</strong> 个文件，总大小: <strong>${totalSizeStr}</strong>`;

        stats.innerHTML = statsText;

        if (links.length === 0) {
            container.innerHTML = '<div class="hf-more-info">❌ 未找到任何下载链接</div>';
            return;
        }

        let html = '';

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const mainFileClass = link.isMainFile ? ' main-file' : '';
            const fileIcon = link.isMainFile ? '⭐' : '📁';
            const mainFileTag = link.isMainFile ? '<span class="hf-main-file">主要</span>' : '';
            const highlightedFileName = highlightSearchTerm(link.fileName, searchTerm);

            html += `
                <div class="hf-link-item${mainFileClass}">
                    <div class="hf-file-header">
                        <div class="hf-file-name">
                            ${fileIcon} ${highlightedFileName}
                            ${mainFileTag}
                        </div>
                        <div class="hf-file-size">${link.fileSize}</div>
                    </div>
                    <div class="hf-link-row">
                        <span class="hf-link-label" style="color: #3498db;">🔗</span>
                        <span class="hf-link-url">${link.original}</span>
                        <button class="hf-copy-btn hf-copy-orig" onclick="copyToClipboard('${link.original}', this)">复制</button>
                    </div>
                    <div class="hf-link-row">
                        <span class="hf-link-label" style="color: #f39c12;">🚀</span>
                        <span class="hf-link-url">${link.mirror}</span>
                        <button class="hf-copy-btn hf-copy-mirror" onclick="copyToClipboard('${link.mirror}', this)">复制</button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // 事件监听
    extractBtn.addEventListener('click', () => {
        const links = extractLinks();
        displayLinks(links);
        modal.style.display = 'flex';

        // 更新按钮事件
        document.getElementById('hf-close').onclick = () => {
            modal.style.display = 'none';
        };

        document.getElementById('hf-copy-first').onclick = () => {
            if (filteredLinks.length > 0) {
                const currentLinks = sortLinks(filteredLinks, currentSortType);
                copyToClipboard(currentLinks[0].original, document.getElementById('hf-copy-first'));
            }
        };

        document.getElementById('hf-copy-all-orig').onclick = () => {
            const currentLinks = currentSearchTerm ? filteredLinks : allLinks;
            const allOriginal = currentLinks.map(link => link.original).join('\n');
            copyToClipboard(allOriginal, document.getElementById('hf-copy-all-orig'));
        };

        document.getElementById('hf-copy-all-mirror').onclick = () => {
            const currentLinks = currentSearchTerm ? filteredLinks : allLinks;
            const allMirror = currentLinks.map(link => link.mirror).join('\n');
            copyToClipboard(allMirror, document.getElementById('hf-copy-all-mirror'));
        };

        // 排序按钮事件
        document.querySelectorAll('.hf-sort-btn').forEach(btn => {
            btn.onclick = () => {
                const sortType = btn.getAttribute('data-sort');
                currentSortType = sortType;

                // 更新按钮状态
                document.querySelectorAll('.hf-sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 重新排序并显示
                const sortedLinks = sortLinks(filteredLinks, sortType);
                displayLinks(sortedLinks, currentSearchTerm);
            };
        });

        // 搜索功能事件监听
        const searchInput = document.getElementById('hf-search-input');
        const searchClear = document.getElementById('hf-search-clear');

        // 实时搜索
        searchInput.addEventListener('input', performSearch);

        // 清除搜索
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchTerm = '';
            filteredLinks = allLinks;
            updateSearchStats(0, 0, '');
            const sortedLinks = sortLinks(filteredLinks, currentSortType);
            displayLinks(sortedLinks);
            searchInput.focus();
        });

        // 键盘快捷键
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                currentSearchTerm = '';
                filteredLinks = allLinks;
                updateSearchStats(0, 0, '');
                const sortedLinks = sortLinks(filteredLinks, currentSortType);
                displayLinks(sortedLinks);
            }
        });
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 全局函数供内联事件使用
    window.copyToClipboard = copyToClipboard;

    // 测试文件大小提取功能
    window.testFileSizeExtraction = function() {
        console.log('🧪 开始测试文件大小提取...');
        const downloadLinks = document.querySelectorAll('a[download][href]');
        console.log(`找到 ${downloadLinks.length} 个下载链接`);

        downloadLinks.forEach((link, index) => {
            const fileName = link.getAttribute('download') || link.textContent.trim();
            const fileSize = extractFileSize(link);
            console.log(`${index + 1}. ${fileName} -> ${fileSize}`);
        });

        console.log('🧪 测试完成！');
    };

    console.log('🚀 HuggingFace镜像链接提取器v1.3.3已加载');
    console.log('💡 在控制台运行 testFileSizeExtraction() 来测试文件大小提取');
    console.log('🔍 新功能：支持模糊搜索，可以快速过滤文件列表');
    console.log('🌙 优化：修复黑暗模式下的字体可读性问题');
    console.log('✨ 修复：彻底解决搜索高亮影响文件名间距的问题');
})();
