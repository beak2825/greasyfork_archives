// ==UserScript==
// @name         Proboost Amazon 商品提取
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取 Proboost 产品中亚马逊产品列表数据
// @author       Richard Ren
// @match        https://proboost.microdata-inc.com/amazon/productList
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528011/Proboost%20Amazon%20%E5%95%86%E5%93%81%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/528011/Proboost%20Amazon%20%E5%95%86%E5%93%81%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '50%';
    buttonContainer.style.right = '20px';
    buttonContainer.style.transform = 'translateY(-50%)';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.padding = '12px';
    buttonContainer.style.backgroundColor = '#ffffff';
    buttonContainer.style.borderRadius = '8px';
    buttonContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    buttonContainer.style.cursor = 'grab';
    document.body.appendChild(buttonContainer);

    // 创建按钮
    const extractButton = createButton('提取', handleExtract);
    const nextPageButton = createButton('下一页', handleNextPage);
    const showButton = createButton('展示', handleShow);
    const clearButton = createButton('清空', handleClear);

    // 添加按钮到容器
    buttonContainer.appendChild(extractButton);
    buttonContainer.appendChild(nextPageButton);
    buttonContainer.appendChild(showButton);
    buttonContainer.appendChild(clearButton);

    // 收起按钮（类似关闭按钮）
    const collapseButton = document.createElement('button');
    collapseButton.textContent = '×';
    collapseButton.style.position = 'absolute';
    collapseButton.style.top = '-10px'; // 调整位置，避免重叠
    collapseButton.style.right = '-10px'; // 调整位置，避免重叠
    collapseButton.style.padding = '4px 8px';
    collapseButton.style.backgroundColor = 'transparent';
    collapseButton.style.color = '#000';
    collapseButton.style.border = 'none';
    collapseButton.style.borderRadius = '50%';
    collapseButton.style.cursor = 'pointer';
    collapseButton.style.fontSize = '16px';
    collapseButton.style.transition = 'background-color 0.2s ease';
    collapseButton.addEventListener('mouseenter', () => {
        collapseButton.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });
    collapseButton.addEventListener('mouseleave', () => {
        collapseButton.style.backgroundColor = 'transparent';
    });
    collapseButton.addEventListener('click', handleCollapse);
    buttonContainer.appendChild(collapseButton);

    // 展开按钮
    const expandButton = createButton('展开', handleExpand);
    expandButton.style.position = 'fixed';
    expandButton.style.right = '0';
    expandButton.style.transform = 'translateY(-50%)';
    expandButton.style.top = '50%';
    expandButton.style.display = 'none'; // 默认隐藏
    expandButton.style.zIndex = '1001'; // 确保在最上层
    document.body.appendChild(expandButton);

    // 加载存储的位置信息
    const savedPosition = JSON.parse(GM_getValue('buttonPosition', 'null'));
    if (savedPosition) {
        buttonContainer.style.top = `${savedPosition.top}px`;
        buttonContainer.style.right = `${savedPosition.right}px`;
    }

    // 标志位，用于控制是否展开
    let isCollapsed = false;

    // 每秒检查URL并控制按钮的显示/隐藏
    setInterval(() => {
        const isCorrectUrl = window.location.href === 'https://proboost.microdata-inc.com/amazon/productList';
        if (!isCollapsed && isCorrectUrl) {
            buttonContainer.style.display = 'flex';
        } else {
            buttonContainer.style.display = 'none';
        }
        expandButton.style.display = isCorrectUrl && isCollapsed ? 'block' : 'none';
    }, 1000);

    // 拖动功能
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    buttonContainer.addEventListener('mousedown', (e) => {
        if (e.target === buttonContainer) {
            isDragging = true;
            offsetX = e.clientX - buttonContainer.getBoundingClientRect().left;
            offsetY = e.clientY - buttonContainer.getBoundingClientRect().top;
            buttonContainer.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // 确保按钮容器不超出视口
            const maxX = window.innerWidth - buttonContainer.offsetWidth;
            const maxY = window.innerHeight - buttonContainer.offsetHeight;

            buttonContainer.style.left = `${Math.min(Math.max(newX, 0), maxX)}px`;
            buttonContainer.style.top = `${Math.min(Math.max(newY, 0), maxY)}px`;
            buttonContainer.style.right = 'unset'; // 取消右侧定位
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            buttonContainer.style.cursor = 'grab';

            // 保存位置信息
            const rect = buttonContainer.getBoundingClientRect();
            GM_setValue('buttonPosition', JSON.stringify({
                top: rect.top,
                right: window.innerWidth - rect.right
            }));
        }
    });

    // 收起功能
    function handleCollapse() {
        isCollapsed = true;
        const rect = buttonContainer.getBoundingClientRect();
        buttonContainer.style.display = 'none';

        expandButton.style.right = `${window.innerWidth - rect.right}px`;
        expandButton.style.top = `${rect.top + rect.height / 2}px`;
        expandButton.style.display = 'block';
    }

    // 展开功能
    function handleExpand() {
        isCollapsed = false;
        expandButton.style.display = 'none';
        buttonContainer.style.display = 'flex';
    }

    // 显示悬浮提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '8px 16px';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '1002';
        toast.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    }

    // 复制数据
    function handleCopy() {
        const data = JSON.parse(GM_getValue('extractedData', '[]'));
        const tsvData = convertToTSV(data);
        navigator.clipboard.writeText(tsvData).then(() => {
            showToast('复制成功');
        });
    }

    // 创建按钮函数
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#0078D4';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Segoe UI, system-ui';
        button.style.fontSize = '14px';
        button.style.transition = 'background-color 0.2s ease';
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#106EBE';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#0078D4';
        });
        button.addEventListener('click', onClick);
        return button;
    }

    // 提取数据，跳过带有`aria-hidden="true"`的元素
    function handleExtract() {
        const existingData = JSON.parse(GM_getValue('extractedData', '[]'));
        const newData = [];

        const rows = document.evaluate('//*[@id="root"]/div/div[2]/div[2]/main/div[1]/div[3]/div/div/div/div/div[2]/div/div/div/div/div/table/tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < rows.snapshotLength; i++) {
            const row = rows.snapshotItem(i);
            if (row.getAttribute('aria-hidden') === 'true') continue;

            const rowData = {
                '商品图片': document.evaluate('.//td[1]/div/div/img', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.src,
                '商品名称': document.evaluate('.//td[2]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                'ASIN': document.evaluate('.//td[3]', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '一级类目': document.evaluate('.//td[5]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '二级类目': document.evaluate('.//td[6]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '三级类目': document.evaluate('.//td[7]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '四级类目': document.evaluate('.//td[8]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '五级类目': document.evaluate('.//td[9]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '六级类目': document.evaluate('.//td[10]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '品牌': document.evaluate('.//td[11]/div', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '上架时间': document.evaluate('.//td[12]', row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent,
                '月销量': extractMultiLineText('.//td[13]', row),
                '月销售额（$）': extractMultiLineText('.//td[14]', row),
                '价格（$）': extractMultiLineText('.//td[16]', row)
            };

            if (!existingData.some(item => item.ASIN === rowData.ASIN)) {
                newData.push(rowData);
            }
        }

        const updatedData = [...existingData, ...newData];
        GM_setValue('extractedData', JSON.stringify(updatedData));
        extractButton.textContent = '提取成功';
        setTimeout(() => {
            extractButton.textContent = '提取';
        }, 2000);

    }

    // 提取多行文本数据
    function extractMultiLineText(xpath, row) {
        const divs = document.evaluate(`${xpath}/div`, row, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let result = '';
        let node = divs.iterateNext();
        while (node) {
            result += node.textContent + '\n';
            node = divs.iterateNext();
        }
        return result.trim();
    }

    // 下一页
    function handleNextPage() {
        const nextPageButton = document.evaluate('//*[@id="root"]/div/div[2]/div[2]/main/div[1]/div[3]/div/div/div/div/div[2]/div/div/ul/li[10]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (nextPageButton) {
            nextPageButton.click();
        }
    }

    // 展示弹窗
    let modal, overlay;

    function handleShow() {
        const data = JSON.parse(GM_getValue('extractedData', '[]'));

        // 创建遮罩层
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1000';
        document.body.appendChild(overlay);

        // 创建模态窗口
        modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#ffffff';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
        modal.style.zIndex = '1001';
        modal.style.width = '90%';
        modal.style.height = '90%';
        modal.style.overflow = 'hidden';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.fontFamily = 'Segoe UI, system-ui';

        // 标题栏
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '16px';
        header.style.backgroundColor = '#f8f9fa';
        header.style.borderBottom = '1px solid #e9ecef';

        const title = document.createElement('div');
        title.textContent = '提取数据';
        title.style.fontSize = '18px';
        title.style.fontWeight = '600';

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', handleCloseModal);

        header.appendChild(title);
        header.appendChild(closeButton);
        modal.appendChild(header);

        // 表格容器
        const tableContainer = document.createElement('div');
        tableContainer.style.flex = '1';
        tableContainer.style.overflow = 'auto';
        tableContainer.style.padding = '16px';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        if (data.length > 0) {
            const headers = ['序号', ...Object.keys(data[0])];
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                th.style.padding = '12px';
                th.style.backgroundColor = '#f8f9fa';
                th.style.borderBottom = '2px solid #e9ecef';
                th.style.textAlign = 'left';
                if (header === '商品名称') {
                    th.style.width = '150px';
                } else {
                    th.style.width = 'auto'; // 其他列自适应宽度
                }
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            data.forEach((rowData, index) => {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    if (header === '序号') {
                        td.textContent = index + 1;
                    } else if (header === '商品图片') {
                        const img = document.createElement('img');
                        img.src = rowData[header];
                        img.style.width = '50px';
                        img.style.height = '50px';
                        img.style.objectFit = 'contain';
                        td.appendChild(img);
                    } else if (header === '商品名称') {
                        const nameContainer = document.createElement('div');
                        nameContainer.style.width = '150px';
                        nameContainer.style.whiteSpace = 'normal';
                        nameContainer.style.overflow = 'hidden';
                        nameContainer.style.display = '-webkit-box';
                        nameContainer.style.webkitLineClamp = '3';
                        nameContainer.style.webkitBoxOrient = 'vertical';
                        nameContainer.textContent = rowData[header];

                        const tooltip = document.createElement('div');
                        tooltip.style.position = 'fixed'; // 使用 fixed 避免闪烁
                        tooltip.style.backgroundColor = '#333';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '8px';
                        tooltip.style.borderRadius = '4px';
                        tooltip.style.zIndex = '1002';
                        tooltip.style.display = 'none';
                        tooltip.textContent = rowData[header];

                        nameContainer.addEventListener('mouseenter', (e) => {
                            tooltip.style.left = `${e.clientX + 10}px`;
                            tooltip.style.top = `${e.clientY + 10}px`;
                            tooltip.style.display = 'block';
                        });
                        nameContainer.addEventListener('mouseleave', () => {
                            tooltip.style.display = 'none';
                        });

                        document.body.appendChild(tooltip);
                        td.appendChild(nameContainer);
                    } else {
                        td.textContent = rowData[header];
                    }
                    td.style.padding = '12px';
                    td.style.borderBottom = '1px solid #e9ecef';
                    td.style.textAlign = 'left';
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
        }

        tableContainer.appendChild(table);
        modal.appendChild(tableContainer);

        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制数据';
        copyButton.style.position = 'fixed';
        copyButton.style.bottom = '20px';
        copyButton.style.right = '20px';
        copyButton.style.padding = '10px 20px';
        copyButton.style.backgroundColor = '#0078D4';
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.addEventListener('click', handleCopy);
        modal.appendChild(copyButton);

        document.body.appendChild(modal);

        // 监听 ESC 键
        document.addEventListener('keydown', handleEscapeKey);
        // 监听外部点击
        overlay.addEventListener('click', handleCloseModal);
    }

    // 关闭弹窗
    function handleCloseModal() {
        if (modal && overlay) {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEscapeKey);
            overlay.removeEventListener('click', handleCloseModal);
        }
    }

    // 处理 ESC 键
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            handleCloseModal();
        }
    }

    // 将数据转换为 TSV 格式
    function convertToTSV(data) {
        const headers = ['序号', ...Object.keys(data[0])].join('\t');
        const rows = data.map((row, index) => {
            const values = Object.values(row).map(value => {
                if (typeof value === 'string') {
                    // 处理换行符
                    return value.replace(/\n/g, ' ');
                }
                return value;
            });
            return [index + 1, ...values].join('\t');
        });
        return [headers, ...rows].join('\n');
    }

    // 清空数据
    function handleClear() {
        GM_setValue('extractedData', '[]');
        showToast('清除成功');
    }
})();
