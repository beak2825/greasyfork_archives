// ==UserScript==
// @name         商品信息匹配工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  支持可拖动窗口和位置记忆的匹配工具
// @author       Richard Ren
// @match        *://*.shop.tangbuy.cn/product/product*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524490/%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E5%8C%B9%E9%85%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/524490/%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E5%8C%B9%E9%85%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        .custom-modal {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        }

        .custom-button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .custom-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
        }

        .data-table th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #e9ecef;
            color: #495057;
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            color: #212529;
        }

        .data-table tr:hover td {
            background: #f1f3f5;
        }

        .match-card {
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.2s ease;
        }

        .match-card:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .toast-message {
            background: #343a40;
            color: #fff;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* 修复后的标题栏样式 */
        .match-drag-header {
            cursor: move;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 12px 12px 0 0;
            border-bottom: 1px solid #e9ecef;
            user-select: none;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .match-drag-header h3 {
            margin: 0;
            font-size: 18px;
            color: #1e293b;
            font-weight: 600;
        }

        .match-drag-header .close-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            line-height: 1;
            transition: color 0.2s;
        }

        .match-drag-header .close-button:hover {
            color: #ef4444;
        }
    `);

    // 存储键名常量
    const POSITION_KEY = 'match_window_position';

    // 检查当前 URL 是否是 addoredit 页面
    const isAddOrEditPage = window.location.href.includes('/product/product/addoredit?id=');

    // 主操作按钮
    const mainButton = document.createElement('button');
    mainButton.className = 'custom-button';
    mainButton.textContent = '批量信息输入';
    Object.assign(mainButton.style, {
        position: 'fixed',
        top: '50%',
        right: '32px',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff',
        fontSize: '16px'
    });
    document.body.appendChild(mainButton);

    // 创建主弹出窗口
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    Object.assign(modal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        padding: '24px',
        zIndex: 1001,
        display: 'none',
        overflowY: 'auto'
    });
    document.body.appendChild(modal);

    // 标题
    const title = document.createElement('h2');
    title.textContent = '批量数据输入';
    title.style.margin = '0 0 20px 0';
    title.style.color = '#1e293b';
    title.style.fontSize = '20px';
    modal.appendChild(title);

    // 信息输入框
    const textarea = document.createElement('textarea');
    textarea.placeholder = '请粘贴从 Excel 复制的数据（第一行为表头）...\n例如：商品名称\t价格\t链接\n示例商品\t100\thttps://...';
    Object.assign(textarea.style, {
        width: '100%',
        height: '200px',
        padding: '12px',
        marginBottom: '20px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        resize: 'vertical',
        fontSize: '14px'
    });
    modal.appendChild(textarea);

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '12px';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '16px';

    // 清空按钮
    const clearButton = createButton('清空', '#f8f9fa', '#495057', () => {
        textarea.value = '';
        table.innerHTML = '';
        GM_setValue('parsedData', null);
        showToast('数据已清空！');
    });

    // 解析按钮
    const parseButton = createButton('解析数据', '#4f46e5', '#fff', () => {
        const data = textarea.value.trim();
        if (!data) return showToast('请输入数据！');

        const rows = data.split('\n');
        if (rows.length < 2) return showToast('至少需要两行数据！');

        const headers = rows[0].split('\t');
        const tableData = rows.slice(1).map(row => row.split('\t'));
        showHeaderSelectionModal(headers, tableData);
    });

    // 关闭按钮
    const closeButton = createButton('关闭窗口', '#ef4444', '#fff', () => {
        modal.style.display = 'none';
    });

    buttonContainer.append(clearButton, parseButton, closeButton);
    modal.appendChild(buttonContainer);

    // 解析结果表格
    const table = document.createElement('table');
    table.className = 'data-table';
    modal.appendChild(table);

    // 显示/隐藏主弹出窗口
    mainButton.addEventListener('click', () => (modal.style.display = 'block'));

    // 创建通用按钮函数
    function createButton(text, bgColor, color, onClick) {
        const btn = document.createElement('button');
        btn.className = 'custom-button';
        btn.textContent = text;
        Object.assign(btn.style, {
            background: bgColor,
            color: color,
            minWidth: '120px'
        });
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 显示表头选择窗口
    function showHeaderSelectionModal(headers, tableData) {
        const selectionModal = document.createElement('div');
        selectionModal.className = 'custom-modal';
        Object.assign(selectionModal.style, {
            width: '480px',
            padding: '24px'
        });

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = '请选择包含商品链接的列';
        modalTitle.style.margin = '0 0 20px 0';
        selectionModal.appendChild(modalTitle);

        headers.forEach((header, index) => {
            const headerItem = document.createElement('div');
            headerItem.style.display = 'flex';
            headerItem.style.alignItems = 'center';
            headerItem.style.justifyContent = 'space-between';
            headerItem.style.padding = '12px';
            headerItem.style.marginBottom = '8px';
            headerItem.style.background = '#f8fafc';
            headerItem.style.borderRadius = '8px';

            const headerText = document.createElement('span');
            headerText.textContent = header;
            headerText.style.fontWeight = '500';

            const selectButton = createButton('选择此列', '#4f46e5', '#fff', () => {
                processLinkColumn(headers, tableData, index);
                selectionModal.remove();
            });

            headerItem.append(headerText, selectButton);
            selectionModal.appendChild(headerItem);
        });

        const closeButton = createButton('关闭', '#e2e8f0', '#64748b', () => selectionModal.remove());
        closeButton.style.marginTop = '16px';
        selectionModal.appendChild(closeButton);

        document.body.appendChild(selectionModal);
        positionCenter(selectionModal);
    }

    // 处理链接列
    function processLinkColumn(headers, tableData, columnIndex) {
        // 在第一列插入商品ID
        headers.unshift('商品ID');
        tableData.forEach(row => {
            const productId = extractProductId(row[columnIndex]);
            row.unshift(productId || ''); // 将商品ID插入到第一列
        });

        renderTable(headers, tableData);
        GM_setValue('parsedData', JSON.stringify({ headers, tableData }));
        showToast('链接解析完成！');
    }

    // 提取商品ID
    function extractProductId(url) {
        try {
            const urlObj = new URL(url);

            // 情况 1：从查询参数中提取 id
            if (urlObj.searchParams.has('id')) {
                return urlObj.searchParams.get('id');
            }

            // 情况 2：从路径中提取数字部分
            const pathMatch = urlObj.pathname.match(/\/(\d+)\.html$/);
            if (pathMatch) {
                return pathMatch[1];
            }

            // 如果都不匹配，返回 null
            return null;
        } catch {
            console.warn('无效的 URL:', url);
            return null;
        }
    }

    // 渲染表格
    function renderTable(headers, tableData) {
        table.innerHTML = '';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        tableData.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }

    // 显示匹配窗口（支持拖动）
    let matchWindow = null;

    function showMatchWindow(linkElement) {
        if (!matchWindow) {
            // 创建匹配窗口
            matchWindow = document.createElement('div');
            matchWindow.className = 'custom-modal';
            Object.assign(matchWindow.style, {
                position: 'fixed',
                width: '400px',
                zIndex: 1003,
                maxHeight: '80vh',
                overflowY: 'auto',
                display: 'none'
            });

            // 标题栏
            const dragHeader = document.createElement('div');
            dragHeader.className = 'match-drag-header';

            // 标题文字
            const title = document.createElement('h3');
            title.textContent = '匹配到的商品信息';
            dragHeader.appendChild(title);

            // 关闭按钮
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '&times;';
            closeButton.addEventListener('click', () => {
                matchWindow.style.display = 'none';
            });
            dragHeader.appendChild(closeButton);

            // 内容容器
            const content = document.createElement('div');
            content.style.padding = '16px';

            matchWindow.append(dragHeader, content);
            document.body.appendChild(matchWindow);

            // 拖动逻辑
            let isDragging = false;
            let startX = 0, startY = 0, initialX = 0, initialY = 0;

            dragHeader.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);

            function startDrag(e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = matchWindow.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                matchWindow.style.transform = 'none';
            }

            function drag(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const newX = Math.max(0, Math.min(window.innerWidth - matchWindow.offsetWidth, initialX + dx));
                const newY = Math.max(0, Math.min(window.innerHeight - matchWindow.offsetHeight, initialY + dy));
                matchWindow.style.left = `${newX}px`;
                matchWindow.style.top = `${newY}px`;
            }

            function endDrag() {
                isDragging = false;
                const rect = matchWindow.getBoundingClientRect();
                GM_setValue(POSITION_KEY, { x: rect.left, y: rect.top });
            }

            // 恢复位置
            const savedPosition = GM_getValue(POSITION_KEY);
            if (savedPosition) {
                matchWindow.style.left = `${savedPosition.x}px`;
                matchWindow.style.top = `${savedPosition.y}px`;
                matchWindow.style.transform = 'none';
            }
        }

        // 填充内容
        const content = matchWindow.querySelector('div:last-child');
        content.innerHTML = '';

        const savedData = GM_getValue('parsedData');
        if (savedData) {
            const { headers, tableData } = JSON.parse(savedData);
            const productId = extractProductId(linkElement.href);

            if (productId) {
                tableData.filter(row => row.includes(productId)).forEach(row => {
                    const card = document.createElement('div');
                    card.className = 'match-card';

                    headers.forEach((header, index) => {
                        const rowDiv = document.createElement('div');
                        rowDiv.style.display = 'flex';
                        rowDiv.style.gap = '8px';
                        rowDiv.style.marginBottom = '8px';

                        const label = document.createElement('span');
                        label.textContent = `${header}:`;
                        label.style.color = '#64748b';
                        label.style.flex = '0 0 100px';

                        const value = document.createElement('span');
                        value.textContent = row[index];
                        value.style.flex = '1';
                        value.style.cursor = 'pointer';
                        value.addEventListener('click', () => {
                            navigator.clipboard.writeText(row[index]);
                            showToast('已复制到剪贴板！');
                        });

                        rowDiv.append(label, value);
                        card.appendChild(rowDiv);
                    });

                    content.appendChild(card);
                });
            }
        }

        // 显示窗口
        matchWindow.style.display = 'block';
    }

    // 显示提示信息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        positionCenter(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 通用居中定位函数
    function positionCenter(element) {
        Object.assign(element.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1002
        });
    }

    // 初始化加载
    window.addEventListener('load', () => {
        const savedData = GM_getValue('parsedData');
        if (savedData) renderTable(...Object.values(JSON.parse(savedData)));
        if (isAddOrEditPage) tryMatchElement();
    });

    // 元素匹配逻辑
    function tryMatchElement() {
        const selector = '#root > div > div > div.container___owPuS > div.container___FfQuj > div.main___GXn08 > div.ant-pro-page-container.css-1htoz2s > div > div > div > form > div:nth-child(2) > div.ant-card-body > div:nth-child(1) > div > div.ant-col.ant-form-item-control.css-1htoz2s > div > div:nth-child(2) > a';

        let attempts = 0;
        const maxAttempts = 60;
        const interval = 1000;

        const intervalId = setInterval(() => {
            const linkElement = document.querySelector(selector);
            if (linkElement) {
                clearInterval(intervalId);
                showMatchWindow(linkElement);
            } else if (++attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('未找到匹配元素');
            }
        }, interval);
    }
})();