// ==UserScript==
// @name         Auto Webpage2Word-Bali
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      Bali
// @description  在网页右侧显示可拖拽按钮，点击后全自动将整个网页完整内容保存为Word文件，特别优化表格格式保持
// @author       Bali
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546467/Auto%20Webpage2Word-Bali.user.js
// @updateURL https://update.greasyfork.org/scripts/546467/Auto%20Webpage2Word-Bali.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let dragStartY = 0;
    let buttonStartY = 0;

    // 创建Word保存按钮
    function createWordButton() {
        const button = document.createElement('div');
        button.id = 'word-save-button';
        button.innerHTML = '📝<br>Word';

        // 从localStorage获取保存的位置，默认50%
        const savedTop = localStorage.getItem('word-button-top') || '50%';

        // 按钮样式
        button.style.cssText = `
            position: fixed;
            top: ${savedTop};
            right: 80px;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: grab;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
            font-family: Arial, sans-serif;
        `;

        // 鼠标悬停效果
        button.addEventListener('mouseenter', function() {
            if (!isDragging) {
                this.style.transform = 'translateY(-50%) scale(1.1)';
                this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (!isDragging) {
                this.style.transform = 'translateY(-50%) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            }
        });

        // 拖拽功能
        button.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDragging = true;
            dragStartY = e.clientY;
            buttonStartY = parseInt(this.style.top) || window.innerHeight / 2;

            this.style.cursor = 'grabbing';
            this.style.transform = 'translateY(-50%) scale(0.95)';
            this.style.transition = 'none';

            // 添加全局鼠标事件监听
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        function handleMouseMove(e) {
            if (!isDragging) return;

            const deltaY = e.clientY - dragStartY;
            let newTop = buttonStartY + deltaY;

            // 限制按钮在窗口范围内
            const minTop = 30; // 按钮半径
            const maxTop = window.innerHeight - 30;
            newTop = Math.max(minTop, Math.min(maxTop, newTop));

            button.style.top = newTop + 'px';
        }

        function handleMouseUp(e) {
            if (!isDragging) return;

            const dragDistance = Math.abs(e.clientY - dragStartY);

            // 如果拖拽距离很小，视为点击事件
            if (dragDistance < 5) {
                // 恢复样式并触发Word生成
                button.style.cursor = 'grab';
                button.style.transform = 'translateY(-50%) scale(1)';
                button.style.transition = 'all 0.3s ease';

                // 延迟执行Word生成，确保样式恢复
                setTimeout(() => {
                    generateWord();
                }, 100);
            } else {
                // 保存新位置到localStorage
                const currentTop = button.style.top;
                const topPercent = (parseInt(currentTop) / window.innerHeight * 100).toFixed(1) + '%';
                localStorage.setItem('word-button-top', topPercent);

                button.style.cursor = 'grab';
                button.style.transform = 'translateY(-50%) scale(1)';
                button.style.transition = 'all 0.3s ease';
            }

            isDragging = false;

            // 移除全局事件监听
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return button;
    }

    // 生成文件名（年月日时分秒格式）
    function generateFileName() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // 获取页面标题（用于文件名前缀）
    function getPageTitle() {
        let title = document.title || 'webpage';
        // 清理文件名中的非法字符
        title = title.replace(/[<>:"/\\|?*]/g, '_');
        // 限制长度
        if (title.length > 50) {
            title = title.substring(0, 50);
        }
        return title;
    }

    // 显示状态提示
    function showStatusMessage(message, type = 'info') {
        const status = document.createElement('div');
        status.id = 'word-status-message';
        status.innerHTML = message;

        const bgColor = type === 'success' ? 'rgba(76, 175, 80, 0.9)' :
                       type === 'error' ? 'rgba(244, 67, 54, 0.9)' :
                       'rgba(33, 150, 243, 0.9)';

        status.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        // 添加动画样式
        if (!document.getElementById('word-animations')) {
            const animations = document.createElement('style');
            animations.id = 'word-animations';
            animations.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(animations);
        }

        document.body.appendChild(status);
        return status;
    }

    // 移除状态提示
    function hideStatusMessage() {
        const status = document.getElementById('word-status-message');
        if (status) {
            status.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => status.remove(), 300);
        }
    }

    // 优化表格格式处理
    function optimizeTableFormat(element) {
        const tables = element.querySelectorAll('table');

        tables.forEach(table => {
            // 确保表格有边框和基本样式
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';
            table.style.margin = '10px 0';
            table.style.border = '1px solid #000';

            // 处理表头
            const headers = table.querySelectorAll('th');
            headers.forEach(th => {
                th.style.border = '1px solid #000';
                th.style.padding = '8px';
                th.style.backgroundColor = '#f2f2f2';
                th.style.fontWeight = 'bold';
                th.style.textAlign = 'center';
            });

            // 处理表格单元格
            const cells = table.querySelectorAll('td');
            cells.forEach(td => {
                td.style.border = '1px solid #000';
                td.style.padding = '8px';
                td.style.verticalAlign = 'top';
                td.style.textAlign = 'left';

                // 处理单元格内的换行
                const text = td.innerHTML;
                if (text.includes('<br>') || text.includes('\n')) {
                    td.innerHTML = text.replace(/<br\s*\/?>/gi, '\n').replace(/\n+/g, '\n');
                }
            });

            // 处理表格标题
            const caption = table.querySelector('caption');
            if (caption) {
                caption.style.fontWeight = 'bold';
                caption.style.textAlign = 'center';
                caption.style.marginBottom = '5px';
            }

            // 确保表格在Word中正确显示
            table.setAttribute('border', '1');
            table.setAttribute('cellpadding', '8');
            table.setAttribute('cellspacing', '0');
        });
    }

    // 处理列表格式
    function optimizeListFormat(element) {
        const lists = element.querySelectorAll('ul, ol');

        lists.forEach(list => {
            list.style.margin = '10px 0';
            list.style.paddingLeft = '20px';

            const items = list.querySelectorAll('li');
            items.forEach(li => {
                li.style.margin = '5px 0';
                li.style.lineHeight = '1.4';
            });
        });
    }

    // 处理图片格式
    function optimizeImageFormat(element) {
        const images = element.querySelectorAll('img');

        images.forEach(img => {
            // 设置图片最大宽度，避免超出页面
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '10px auto';

            // 添加图片说明
            if (img.alt) {
                const caption = document.createElement('p');
                caption.textContent = `图片说明: ${img.alt}`;
                caption.style.textAlign = 'center';
                caption.style.fontSize = '10pt';
                caption.style.color = '#666';
                caption.style.fontStyle = 'italic';
                img.parentNode.insertBefore(caption, img.nextSibling);
            }
        });
    }

    // 处理代码块格式
    function optimizeCodeFormat(element) {
        const codeBlocks = element.querySelectorAll('pre, code');

        codeBlocks.forEach(code => {
            code.style.fontFamily = 'Courier New, monospace';
            code.style.backgroundColor = '#f5f5f5';
            code.style.border = '1px solid #ddd';
            code.style.padding = '10px';
            code.style.margin = '10px 0';
            code.style.borderRadius = '4px';
            code.style.fontSize = '10pt';
            code.style.lineHeight = '1.4';
            code.style.whiteSpace = 'pre-wrap';
            code.style.wordWrap = 'break-word';
        });
    }

    // 提取网页内容并转换为Word格式
    function extractWebContent() {
        // 临时隐藏按钮和状态消息
        const button = document.getElementById('word-save-button');
        const status = document.getElementById('word-status-message');
        if (button) button.style.display = 'none';
        if (status) status.style.display = 'none';

        // 克隆整个body内容
        const clonedBody = document.body.cloneNode(true);

        // 移除脚本生成的元素
        const elementsToRemove = clonedBody.querySelectorAll('#word-save-button, #word-status-message, #word-animations, #pdf-print-button, #pdf-status-message, #pdf-animations');
        elementsToRemove.forEach(el => el.remove());

        // 优化各种格式
        optimizeTableFormat(clonedBody);
        optimizeListFormat(clonedBody);
        optimizeImageFormat(clonedBody);
        optimizeCodeFormat(clonedBody);

        // 获取页面标题
        const pageTitle = document.title || '网页内容';
        const pageUrl = window.location.href;
        const currentDate = new Date().toLocaleString('zh-CN');

        // 构建Word文档内容
        let wordContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office'
                  xmlns:w='urn:schemas-microsoft-com:office:word'
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="utf-8">
                <title>${pageTitle}</title>
                <!--[if gte mso 9]>
                <xml>
                    <w:WordDocument>
                        <w:View>Print</w:View>
                        <w:Zoom>90</w:Zoom>
                        <w:DoNotPromptForConvert/>
                        <w:DoNotShowInsertionsAndDeletions/>
                    </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    @page {
                        margin: 1in;
                        size: A4;
                    }
                    body {
                        font-family: 'Times New Roman', serif;
                        font-size: 12pt;
                        line-height: 1.5;
                        color: #000000;
                        background: white;
                    }
                    .header-info {
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .header-info h1 {
                        color: #2E7D32;
                        margin: 0;
                        font-size: 18pt;
                    }
                    .header-info p {
                        margin: 5px 0;
                        font-size: 10pt;
                        color: #666;
                    }
                    /* 表格样式优化 */
                    table {
                        border-collapse: collapse !important;
                        width: 100% !important;
                        margin: 10px 0 !important;
                        border: 1px solid #000 !important;
                        page-break-inside: avoid;
                    }
                    table, th, td {
                        border: 1px solid #000 !important;
                        mso-border-alt: solid #000 0.5pt;
                    }
                    th {
                        padding: 8px !important;
                        text-align: center !important;
                        background-color: #f2f2f2 !important;
                        font-weight: bold !important;
                        mso-pattern: #f2f2f2 none;
                    }
                    td {
                        padding: 8px !important;
                        text-align: left !important;
                        vertical-align: top !important;
                    }
                    /* 图片样式 */
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                        display: block;
                        margin: 10px auto;
                    }
                    /* 列表样式 */
                    ul, ol {
                        margin: 10px 0;
                        padding-left: 20px;
                    }
                    li {
                        margin: 5px 0;
                        line-height: 1.4;
                    }
                    /* 代码块样式 */
                    pre, code {
                        background-color: #f5f5f5 !important;
                        padding: 10px !important;
                        border-radius: 4px;
                        font-family: 'Courier New', monospace !important;
                        font-size: 10pt;
                        line-height: 1.4;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        border: 1px solid #ddd;
                        margin: 10px 0;
                    }
                    /* 引用块样式 */
                    blockquote {
                        border-left: 4px solid #2E7D32;
                        margin: 10px 0;
                        padding-left: 15px;
                        font-style: italic;
                        background-color: #f9f9f9;
                        padding: 10px 15px;
                    }
                    /* 标题样式 */
                    h1, h2, h3, h4, h5, h6 {
                        page-break-after: avoid;
                        margin-top: 20px;
                        margin-bottom: 10px;
                    }
                    h1 { font-size: 18pt; color: #2E7D32; }
                    h2 { font-size: 16pt; color: #388E3C; }
                    h3 { font-size: 14pt; color: #4CAF50; }
                    h4, h5, h6 { font-size: 12pt; color: #666; }
                </style>
            </head>
            <body>
                <div class="header-info">
                    <h1>${pageTitle}</h1>
                    <p><strong>网址：</strong>${pageUrl}</p>
                    <p><strong>保存时间：</strong>${currentDate}</p>
                </div>
                <div class="content">
                    ${clonedBody.innerHTML}
                </div>
            </body>
            </html>
        `;

        // 恢复按钮显示
        if (button) button.style.display = 'flex';
        if (status) status.style.display = 'block';

        return wordContent;
    }

    // 生成并下载Word文件
    async function generateWordFile() {
        try {
            // 提取网页内容
            const wordContent = extractWebContent();

            // 创建Blob对象
            const blob = new Blob([wordContent], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

            // 生成文件名
            const timestamp = generateFileName();
            const pageTitle = getPageTitle();
            const fileName = `${pageTitle}_${timestamp}.doc`;

            // 创建下载链接
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;

            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 清理URL对象
            URL.revokeObjectURL(link.href);

            return true;
        } catch (error) {
            console.error('Word文件生成失败:', error);
            return false;
        }
    }

    // 主要的Word生成函数
    async function generateWord() {
        const statusMsg = showStatusMessage('🔄 正在生成完整网页Word文档，请稍候...', 'info');

        try {
            // 生成Word文件
            const success = await generateWordFile();

            if (success) {
                hideStatusMessage();
                showStatusMessage('✅ 完整网页Word文档已自动保存到下载文件夹！', 'success');
                setTimeout(hideStatusMessage, 3000);
            } else {
                throw new Error('Word文档生成失败');
            }
        } catch (error) {
            console.error('Word文档生成失败:', error);
            hideStatusMessage();
            showStatusMessage('❌ Word文档生成失败，请重试', 'error');
            setTimeout(hideStatusMessage, 4000);
        }
    }

    // 初始化脚本
    function init() {
        // 检查是否已经存在按钮
        if (document.getElementById('word-save-button')) {
            return;
        }

        // 创建并添加按钮（拖拽和点击功能已内置）
        const wordButton = createWordButton();
        document.body.appendChild(wordButton);

        // 添加键盘快捷键 Ctrl+Shift+W
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'W') {
                e.preventDefault();
                generateWord();
            }
        });

        console.log('完整网页Word自动保存器已加载 - 点击右侧按钮或按 Ctrl+Shift+W 生成完整网页Word文档');
        console.log('按钮支持拖拽：长按鼠标左键可上下移动位置');
        console.log('功能说明：将捕获整个网页的完整内容并转换为Word格式，特别优化表格、图片、代码块等格式');
        console.log('表格优化：自动保持表格结构、边框、对齐方式，确保数据准确性');
    }

    // 等待页面完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 处理动态加载的页面
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();
