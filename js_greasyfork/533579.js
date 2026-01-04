// ==UserScript==
// @name         车辆调度RMP提取信息提取
// @namespace    车辆调度RMP提取信息提取
// @version      2.3
// @description  从 H3C 车辆管理系统子页面提取信息，美化展示并优化复制功能，仅复制内容。信息框显示在左侧，并应用车型映射规则。
// @author       steve
// @match        https://rmp.h3c.com/vehicle/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      GPL-3.0 License

// @downloadURL https://update.greasyfork.org/scripts/533579/%E8%BD%A6%E8%BE%86%E8%B0%83%E5%BA%A6RMP%E6%8F%90%E5%8F%96%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533579/%E8%BD%A6%E8%BE%86%E8%B0%83%E5%BA%A6RMP%E6%8F%90%E5%8F%96%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 样式定义 ---
    GM_addStyle(`
        /* 触发按钮样式 - 移到左上角 */
        #trigger-extract-button {
            position: fixed;
            top: 15px;
            left: 20px; /* 定位到左侧 */
            z-index: 10000;
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px 18px;
            cursor: pointer;
            border-radius: 20px;
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            font-size: 14px;
            font-weight: 500;
            font-family: 'Microsoft YaHei', sans-serif;
        }
        #trigger-extract-button:hover {
            background-color: #0056b3;
            box-shadow: 0 6px 12px rgba(0, 123, 255, 0.4);
            transform: scale(1.05);
        }

        /* 信息展示容器样式 - 移到左侧，触发按钮下方 */
        #info-extract-container {
            position: fixed !important;
            top: 70px !important; /* 确保在按钮下方 */
            left: 20px !important; /* 定位到左侧 */
            /* right: auto !important; */ /* 确保 right 不生效 */
            width: 480px;
            max-height: 85vh;
            background-color: #ffffff !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 10px !important;
            padding: 25px !important;
            z-index: 10001 !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            overflow-y: auto;
            color: #333 !important;
            opacity: 0;
            transform: translateY(-15px) scale(0.98);
            transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        #info-extract-container.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        #info-extract-container h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #007bff;
            font-size: 18px;
            font-weight: 600;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            text-align: center;
        }
        #info-extract-container table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 25px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
        }
        #info-extract-container table th,
        #info-extract-container table td {
            border-bottom: 1px solid #e0e0e0 !important;
            border-right: 1px solid #e0e0e0 !important; /* 可以保留右边框，让表格线更清晰 */
            padding: 10px 14px !important;
            text-align: left;
            word-wrap: break-word;
            font-size: 14px;
            vertical-align: middle;
        }
        #info-extract-container table tr:last-child td {
            border-bottom: none !important;
        }
        #info-extract-container table th:last-child,
        #info-extract-container table td:last-child {
            border-right: none !important; /* 最后一列无右边框 */
        }
        #info-extract-container table th {
            background-color: #f8f9fa !important;
            font-weight: 600;
            color: #495057;
            white-space: nowrap;
        }
        #info-extract-container .control-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 15px;
        }
        #info-extract-container button {
            padding: 9px 20px !important;
            cursor: pointer;
            border: none;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-weight: 500;
            transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease !important;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
        }
        #info-extract-container button:hover {
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
             transform: translateY(-1px);
        }
        #info-extract-container button:active {
            transform: translateY(0px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        .copy-button {
            background-color: #28a745 !important;
            color: white !important;
        }
        .copy-button:hover {
            background-color: #218838 !important;
        }
        .copy-button.copied {
             background-color: #17a2b8 !important;
             transition: background-color 0.1s ease;
        }
        .close-container-button {
            background-color: #6c757d !important;
            color: white !important;
        }
        .close-container-button:hover {
            background-color: #5a6268 !important;
        }
    `);

    // --- 创建触发按钮 ---
    const triggerButton = document.createElement('button');
    triggerButton.id = 'trigger-extract-button';
    triggerButton.textContent = '提取信息';
    document.body.appendChild(triggerButton);

    // --- 按钮点击事件处理 ---
    triggerButton.addEventListener('click', function () {
        const info = extractInformation();
        const existingContainer = document.getElementById('info-extract-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        const container = createInfoContainer(info);
        document.body.appendChild(container);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                container.classList.add('show');
            });
        });
    });

    // --- 辅助：车型名称映射 ---
    function mapVehicleType(originalType) {
        if (!originalType) return ''; // 处理空字符串或 null/undefined

        const type = originalType.trim(); // 去除首尾空格

        if (type === '普通考斯特') {
            return '考斯特';
        } else if (type === '16座豪华考斯特' || type === '11座豪华考斯特') {
            return '豪华考斯特';
        }
        // 如果有其他需要映射的车型，可以在这里添加 else if 条件
        // else if (type === '某种其他车') {
        //     return '映射后的名称';
        // }

        return type; // 如果没有匹配的规则，返回原始（处理过的）类型
    }

    // --- 核心：信息提取逻辑 ---
    function extractInformation() {
        const info = {};
        const labelsToKeys = {
            '用车开始时间：': 'startTime',
            '接待专员：': 'bookingPersonRaw',
            '需求车型：': 'chexingRaw', // 提取原始车型名称
            '客户人数：': 'customerCount',
            '行程安排：': 'schedule',
            '驾驶员：': 'driverRaw',
            '车牌：': 'licensePlate',
            '客户单位：': 'customerUnit'
        };

        const findContentByLabel = (labelText) => {
            const selectors = [
                { label: '.detail-label', value: (el) => el.nextElementSibling },
                { label: '.ant-descriptions-item-label', value: (el) => el.parentElement?.querySelector('.ant-descriptions-item-content') }
            ];
            for (const { label: labelSelector, value: findValueElement } of selectors) {
                const labelElements = document.querySelectorAll(labelSelector);
                for (const labelElement of labelElements) {
                    if (labelElement.textContent?.replace(/[:：\s]/g, '') === labelText.replace(/[:：\s]/g, '')) {
                        const valueElement = findValueElement(labelElement);
                        if (valueElement) {
                            return valueElement.textContent?.trim() ?? '';
                        }
                    }
                }
            }
            return '';
        };

        for (const label in labelsToKeys) {
            info[labelsToKeys[label]] = findContentByLabel(label);
        }

        // --- 数据处理与格式化 ---
        const finalInfo = {};

        // 处理日期
        if (info.startTime) {
            try {
                const dateStr = info.startTime.replace(/-/g, '/');
                const startDate = new Date(dateStr);
                if (!isNaN(startDate.getTime())) {
                    finalInfo['月份'] = `${startDate.getMonth() + 1}月`;
                    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
                    const day = startDate.getDate().toString().padStart(2, '0');
                    finalInfo['用车日期'] = `${month}/${day}`;
                } else {
                     console.warn("无法解析日期:", info.startTime);
                     finalInfo['月份'] = '日期无效';
                     finalInfo['用车日期'] = '日期无效';
                }
            } catch (e) {
                console.error("日期解析时发生错误:", e);
                finalInfo['月份'] = '解析错误';
                finalInfo['用车日期'] = '解析错误';
            }
        } else {
            finalInfo['月份'] = '';
            finalInfo['用车日期'] = '';
        }

        // 处理名字
        const getName = (rawText) => rawText ? rawText.split(/[/（(]/)[0].trim() : '';
        finalInfo['预定人'] = getName(info.bookingPersonRaw);
        finalInfo['司机'] = getName(info.driverRaw);

        // 处理车型 (应用映射规则)
        const originalChexing = info.chexingRaw ? info.chexingRaw.split('/')[0].trim() : ''; // 获取原始车型名称的第一部分
        finalInfo['车型'] = mapVehicleType(originalChexing); // <--- 应用映射函数

        // 其他字段
        finalInfo['客户级别'] = '';
        finalInfo['客户人数'] = info.customerCount || '';
        finalInfo['具体行程'] = info.schedule || '';
        finalInfo['行程（分摊）'] = '';
        finalInfo['车牌'] = info.licensePlate || '';
        finalInfo['来客单位'] = info.customerUnit || '';

        // 定义最终显示顺序
        const displayOrder = ['月份', '用车日期', '预定人', '车型', '客户级别', '客户人数', '具体行程', '行程（分摊）', '司机', '车牌', '来客单位'];

        const orderedFinalInfo = {};
        displayOrder.forEach(key => {
            orderedFinalInfo[key] = finalInfo[key] ?? '';
        });

        return orderedFinalInfo;
    }

    // --- 辅助：创建信息展示容器和表格 ---
    function createInfoContainer(info) {
        const container = document.createElement('div');
        container.id = 'info-extract-container';

        const title = document.createElement('h3');
        title.textContent = '提取的车辆信息';
        container.appendChild(title);

        let tableHTML = '<table><thead><tr>';
        const headers = Object.keys(info);
        headers.forEach(header => {
            tableHTML += `<th>${escapeHtml(header)}</th>`;
        });
        tableHTML += '</tr></thead><tbody><tr>';
        headers.forEach(header => {
            const escapedContent = escapeHtml(info[header]);
            tableHTML += `<td>${escapedContent}</td>`;
        });
        tableHTML += '</tr></tbody></table>';
        container.innerHTML += tableHTML;

        const controlButtons = document.createElement('div');
        controlButtons.className = 'control-buttons';

        // --- 创建复制按钮 ---
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '复制内容 (Excel)';
        copyButton.title = '点击复制表格内容（不含表头），适合粘贴到 Excel';

        copyButton.addEventListener('click', function () {
            const table = container.querySelector('table');
            const dataRow = table?.tBodies?.[0]?.rows?.[0];

            if (!dataRow) {
                alert('错误：无法找到需要复制的数据行！');
                console.error("未能定位到表格的 tbody 或数据行。");
                return;
            }

            const cells = dataRow.cells;
            let textToCopy = '';
            for (let i = 0; i < cells.length; i++) {
                const cellText = cells[i].textContent?.trim().replace(/\n+/g, ' ') ?? '';
                textToCopy += cellText;
                if (i < cells.length - 1) {
                    textToCopy += '\t';
                }
            }

            let copySuccess = false;
            if (typeof GM_setClipboard === 'function') {
                 try {
                     GM_setClipboard(textToCopy, 'text');
                     copySuccess = true;
                 } catch (err) { console.error("GM_setClipboard 失败:", err); }
            }

            if (!copySuccess && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copySuccess = true;
                    showCopyFeedback(copyButton, true);
                }).catch(err => {
                    console.error('使用 Navigator API 复制失败: ', err);
                    if (!fallbackCopyTextToClipboard(textToCopy)) {
                         alert('复制失败！请检查浏览器权限或手动复制。\n错误: ' + err.message);
                    } else {
                        copySuccess = true;
                        showCopyFeedback(copyButton, true, '(备选)');
                    }
                });
                 return;
            } else if (!copySuccess) {
                 if (fallbackCopyTextToClipboard(textToCopy)) {
                     copySuccess = true;
                     showCopyFeedback(copyButton, true, '(备选)');
                 }
            }

            if (copySuccess && !(navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && ! (typeof GM_setClipboard === 'function'))) {
                 showCopyFeedback(copyButton, true);
            } else if (!copySuccess && !(navigator.clipboard && typeof navigator.clipboard.writeText === 'function')) {
                alert('抱歉，所有复制方法都失败了，请尝试手动复制。');
            }
        });
        controlButtons.appendChild(copyButton);

        // --- 创建关闭按钮 ---
        const closeButton = document.createElement('button');
        closeButton.className = 'close-container-button';
        closeButton.textContent = '关闭';
        closeButton.title = '关闭此信息框';

        closeButton.addEventListener('click', function () {
            container.style.opacity = '0';
            container.style.transform = 'translateY(-15px) scale(0.98)';
            container.addEventListener('transitionend', () => container.remove(), { once: true });
        });
        controlButtons.appendChild(closeButton);

        container.appendChild(controlButtons);
        return container;
    }

    // --- 辅助：显示复制反馈信息 ---
    function showCopyFeedback(button, success, suffix = '') {
        if (success) {
            const originalText = '复制内容 (Excel)';
            button.textContent = `已复制! ${suffix}`.trim();
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 1500);
        }
    }

    // --- 辅助：备选的复制函数 (使用 document.execCommand) ---
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        let successful = false;
        try {
            successful = document.execCommand('copy');
            if (!successful) console.warn('备选复制方法 (execCommand) 返回 false。');
        } catch (err) {
            console.error('备选复制方法 (execCommand) 失败: ', err);
            successful = false;
        } finally {
            document.body.removeChild(textArea);
        }
        return successful;
    }

    // --- 辅助：HTML 转义函数 ---
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return unsafe === null || unsafe === undefined ? '' : String(unsafe);
        }
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }

})();