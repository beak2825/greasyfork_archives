// ==UserScript==
// @name         智能文书系统助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  表格导出、缴款发票跳转下载、案件调查报告数据导入。
// @author       kevin_young
// @match        https://wjjmzk.wsjkw.zj.gov.cn/xnrh-znws-web/*
// @match        https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001999695/reserved/index.html*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522581/%E6%99%BA%E8%83%BD%E6%96%87%E4%B9%A6%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522581/%E6%99%BA%E8%83%BD%E6%96%87%E4%B9%A6%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//# 变更日志
//## v1.0 - 2025年1月27日
//- 新增功能：批量导入调查总结
//## v0.5 - 2024年12月20日
//- 新增功能：自动填充缴款凭证号与校验码并查询及下载图片。
//- 优化：改进了用户界面，增加了延迟执行查询操作以确保首次提交成功。
//- 其他：调整了代码结构，提升了可读性和维护性。

//## v0.3 - 2024年11月2日
//- 初始发布版本，提供了基础的统计表格下载功能。

(function () {
    'use strict';

    // ========================
    // 全局变量与常量
    // ========================
    const VERSION = '1.0';

    if (window.self !== window.top) {
        console.log('脚本在嵌套页面中运行，跳过执行');
        return;
    }
    // ========================
    // 主初始化逻辑
    // ========================
    function mainInit() {
        console.log(`智能文书系统助手 v${VERSION} 已启动`);

        if (window.location.href.startsWith('https://wjjmzk.wsjkw.zj.gov.cn')) {
            // 初始化表格导出功能
            initExportTableFeature();

            // 初始化 JSON 数据导入功能
            initJSONImportFeature();
            // 监听查看缴纳详情按钮
            setupDetailButtonListener();
        }

        // 初始化缴款发票跳转下载功能
        if (window.location.href.startsWith('https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001999695/reserved/index.html')) {
            console.log('正在初始化支付凭证功能...');
            initPaymentSlipFeatureLogic()
        } else {
            console.log('当前页面不需要初始化支付凭证功能');
        }
    }

    // ========================
    // 功能初始化函数
    // ========================
    function initExportTableFeature() {
        createExportButton();
    }

    function initJSONImportFeature() {
            addImportButton();
    }


    // ========================
    // 公共工具函数
    // ========================
    /**
     * 创建一个按钮并添加到页面中
     * @param {string} text - 按钮显示的文本
     * @param {function} onClick - 按钮点击时的回调函数
     * @param {object} styleOptions - 按钮的样式配置
     * @returns {HTMLElement} - 创建的按钮元素
     */
    function isTargetPageForJSONImport() {
        // 检查当前页面是否为目标页面（用于 JSON 数据导入）
        const targetUrlPattern = /https:\/\/wjjmzk\.wsjkw\.zj\.gov\.cn\/xnrh-znws-web\/#\/caseManagement\/inProgress\/form\?code=130.*/;
        const targetUrlPatternWithHash = /https:\/\/wjjmzk\.wsjkw\.zj\.gov\.cn\/xnrh-znws-web\/\?#\/caseManagement\/inProgress\/form\?code=130.*/;
        return targetUrlPattern.test(window.location.href) || targetUrlPatternWithHash.test(window.location.href);
    }
    function createButton(text, onClick, referenceButton, styleOptions = {}) {
        // 创建按钮元素
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            position: ${styleOptions.position || 'fixed'};
            background-color: ${styleOptions.backgroundColor || '#3d69cb'};
            color: ${styleOptions.color || 'white'};
            border: none;
            padding: ${styleOptions.padding || '10px 20px'};
            cursor: ${styleOptions.cursor || 'pointer'};
            font-size: ${styleOptions.fontSize || '14px'};
            border-radius: 5px;
        `;


        // 绑定点击事件
        button.addEventListener('click', onClick);

        // 如果提供了参考按钮，则将新按钮放置在参考按钮附近
        if (referenceButton) {
            const referenceRect = referenceButton.getBoundingClientRect();
            const offset = styleOptions.offset || { x: 10, y: 0 }; // 默认偏移量

            // 计算新按钮的位置
            button.style.top = `${referenceRect.top + window.scrollY + offset.y}px`;
            button.style.left = `${referenceRect.right + window.scrollX + offset.x}px`;
            // 继承参考按钮的 z-index
            const referenceZIndex = window.getComputedStyle(referenceButton).zIndex;
            if (referenceZIndex !== 'auto') {
                button.style.zIndex = referenceZIndex;
            } else {
                button.style.zIndex = 'auto'; // 如果参考按钮没有 z-index，则设置为 auto
            }
        } else {
            // 如果没有提供参考按钮，则使用默认位置
            button.style.position = 'fixed';
            button.style.top = styleOptions.top || '10px';
            button.style.left = styleOptions.left || 'auto';
            button.style.right = styleOptions.right || 'auto';
            button.style.zIndex = styleOptions.zIndex || '1000';
        }

        // 将按钮添加到页面中
        document.body.appendChild(button);
        return button;
    }
    function simulateInput(input, value) {
        // 模拟输入框输入
        if (!input || !(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
            console.error('目标元素不是输入框或文本域');
            return;
        }

        input.value = value;
        ['input', 'change'].forEach(eventType => {
            input.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        console.log(`已输入值：${value}`);
    }
    function waitForElement(selector, container = document, timeout = 5000) {
        // 等待页面中的某个元素加载完成
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = container.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`未找到元素：${selector}`));
                }
            }, 100);
        });
    }
    function findButtonByText(text, container = document) {
        // 查找所有按钮元素
        const buttons = Array.from(container.querySelectorAll('button'));
        // 根据文本内容匹配按钮（忽略前后空格）
        const targetButton = buttons.find(button =>
                                          button.textContent.trim().includes(text)
                                         );
        return targetButton || null;
    }
    function simulateRealClick(element) {
        // 模拟真实点击事件
        if (!element) {
            console.error('目标元素未找到');
            return;
        }

        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window }));
        });

        console.log('已模拟真实点击事件');
    }

    async function clickButtonUntilCondition(button, conditionFn, maxClicks = 20, interval = 1000) {
        // 重复点击按钮，直到满足特定条件
        let clickCount = 0;
        while (clickCount < maxClicks) {
            if (conditionFn()) {
                console.log('条件已满足，停止点击');
                return;
            }

            button.click();
            clickCount++;
            console.log(`点击按钮，当前点击次数：${clickCount}`);

            await new Promise(resolve => setTimeout(resolve, interval));
        }

        throw new Error(`点击按钮 "${button.textContent.trim()}" 超过 ${maxClicks} 次，未达到目标条件`);
    }

    async function selectDropdownOption(selectInput, optionText) {
        // 选择下拉菜单中的选项
        console.log(`开始选择选项：${optionText}`);

        selectInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        simulateRealClick(selectInput);

        const dropdown = await waitForElement('.el-select-dropdown:not([style*="display: none"])');
        if (!dropdown) throw new Error('未找到下拉菜单');

        await new Promise(resolve => setTimeout(resolve, 1000));

        const options = dropdown.querySelectorAll('.el-select-dropdown__item');
        const targetOption = Array.from(options).find(option => option.textContent.trim() === optionText);
        if (!targetOption) throw new Error(`未找到选项：${optionText}`);

        simulateRealClick(targetOption);
        console.log(`成功选择选项：${optionText}`);

        simulateRealClick(document.body);
    }

    async function setDate(dateInput, targetDate) {
        // 设置日期选择器的值
        if (!dateInput || !targetDate) {
            console.error('日期输入框或目标日期未提供');
            return;
        }

        const vm = findVueRoot(dateInput);
        if (!vm) {
            console.error('未找到与日期输入框关联的 Vue 实例');
            return;
        }

        if (vm.$refs.reference) {
            if (typeof vm.emitInput === 'function') {
                vm.emitInput(targetDate);
                console.log('通过 vm.emitInput 设置日期成功。');
            } else {
                console.error('vm.emitInput 不是一个函数');
            }
        } else if (vm.$refs.input) {
            vm.$refs.input.value = targetDate;
            vm.$refs.input.dispatchEvent(new Event('focus', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            vm.$refs.input.dispatchEvent(new Event('input', { bubbles: true }));
            vm.$refs.input.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('通过 vm.$refs.input 设置日期成功。');
        } else {
            console.error('未找到与日期输入框关联的 $refs.input 或 $refs.reference');
            console.error('当前 vm.$refs 内容:', vm.$refs);
        }
        simulateRealClick(document.body);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    function inputTextByLabel(labelText, inputValue) {
        // 根据标签文本找到输入框并输入值
        const label = Array.from(document.querySelectorAll('label.el-form-item__label'))
        .find(label => label.textContent.includes(labelText));

        if (label) {
            const inputBox = label.nextElementSibling.querySelector('textarea.el-textarea__inner');

            if (inputBox) {
                // 在输入框中输入内容
                simulateInput(inputBox, inputValue) ;
                console.log(`在标签 "${labelText}" 的输入框中输入成功！`);
            } else {
                console.error(`未找到标签 "${labelText}" 对应的输入框`);
            }
        } else {
            console.error(`未找到包含文本 "${labelText}" 的标签`);
        }
    }

    function findVueRoot(node) {
        // 查找与节点关联的 Vue 实例
        if (!node || node.nodeType !== 1) return null;
        return node.__vue__ || findVueRoot(node.parentNode);
    }

    function getSiblingElements(element) {
        // 获取元素的兄弟元素
        if (!element || !element.parentNode) return [];
        return Array.from(element.parentNode.children).filter(child => child !== element);
    }

    function getFirstSibling(element) {
        // 获取元素的第一个兄弟元素
        const siblings = getSiblingElements(element);
        return siblings.length > 0 ? siblings[0] : null;
    }

    function countElTableRowsInFirstSibling(tipElement) {
        // 计算表格中的行数
        const firstSibling = getFirstSibling(tipElement.parentElement);
        if (!firstSibling) return 0;

        const bodyWrapper = firstSibling.querySelector('.el-table__body-wrapper');
        if (!bodyWrapper) return 0;

        const rows = bodyWrapper.querySelectorAll('tbody tr.el-table__row');
        return rows.length;
    }

    function inputEvidenceProof(tipElement, proofText) {
        // 输入证据证明内容
        if (!tipElement || !proofText) {
            console.error('tipElement 或 proofText 未提供');
            return;
        }

        const siblingElements = getSiblingElements(tipElement.parentElement);
        const textarea = siblingElements
            .map(sibling => sibling.querySelector('textarea.el-textarea__inner[placeholder="请输入证据证明"]'))
            .find(el => el !== null);

        if (!textarea) {
            console.error('未找到 placeholder 为 "请输入证据证明" 的 textarea 元素');
            return;
        }

        simulateInput(textarea, proofText);
        console.log('已输入证据证明内容：', proofText);
    }

    async function inputTextIntoTableRows(tipElement, rowDataList) {
        // 将数据输入到表格的每一行中
        console.log('开始输入表格数据...');

        const firstSibling = getFirstSibling(tipElement.parentElement);
        if (!firstSibling) throw new Error('未找到目标表格');

        const bodyWrapper = firstSibling.querySelector('.el-table__body-wrapper');
        if (!bodyWrapper) throw new Error('未找到表格内容区域');

        const rows = bodyWrapper.querySelectorAll('tbody tr.el-table__row');
        if (rows.length === 0) throw new Error('未找到表格行');

        for (let index = 0; index < rows.length && index < rowDataList.length; index++) {
            const row = rows[index];
            const rowData = rowDataList[index] || {};

            console.log(`正在处理第 ${index + 1} 行...`);

            const inputs = [
                { selector: 'input[placeholder="证据名称"]', value: rowData.evidenceName },
                { selector: 'input[placeholder="数量"]', value: rowData.quantity },
                { selector: 'input[placeholder="取证地点"]', value: rowData.location },
                { selector: 'input[placeholder="证据描述"]', value: rowData.description },
                { selector: 'input[placeholder="取证人"]', value: rowData.collector }
            ];

            inputs.forEach(({ selector, value }) => {
                const input = row.querySelector(selector);
                if (input && value) simulateInput(input, value);
            });

            if (rowData.evidenceType) {
                const evidenceTypeSelect = row.querySelector('.el-select input[placeholder="-证据类型-"]');
                if (evidenceTypeSelect) {
                    await selectDropdownOption(evidenceTypeSelect, rowData.evidenceType);
                }
            }

            if (rowData.collectionDate) {
                const collectionDateInput = row.querySelector('.el-date-editor.el-input.el-input--mini .el-input__inner');
                if (collectionDateInput) {
                    await setDate(collectionDateInput, rowData.collectionDate);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (rowDataList[0]?.evidenceProof) {
            inputEvidenceProof(tipElement, rowDataList[0].evidenceProof);
        }
        //输入案情摘要
        if (rowDataList[0]?.caseSummary) {
            inputTextByLabel('案情摘要', rowDataList[0]?.caseSummary);
        }
        //输入调查过程
        if (rowDataList[0]?.caseProcess) {
            inputTextByLabel('案件调查过程', rowDataList[0]?.caseProcess);
        }
        //输入违法事实
        if (rowDataList[0]?.caseFacts) {
            inputTextByLabel('现已查明', rowDataList[0]?.caseFacts);
        }

        console.log('表格数据输入完成。');
    }

    async function clickAddButtonUntilCondition(tipElement, targetRowCount, maxClicks = 20) {
        // 点击“新增”按钮，直到表格行数达到目标值
        const addButton = tipElement.parentElement.querySelector('button.el-button--primary');
        if (!addButton) throw new Error('新增按钮未找到');

        await clickButtonUntilCondition(
            addButton,
            () => countElTableRowsInFirstSibling(tipElement) >= targetRowCount,
            maxClicks
        );
    }

    async function clickAddGroupButtonUntilCondition(targetTipCount, groupDataList) {
        const addGroupButton = findButtonByText('添加证据组');
        if (!addGroupButton) throw new Error('添加证据组按钮未找到');

        await clickButtonUntilCondition(
            addGroupButton,
            () => Array.from(document.querySelectorAll('p.tip')).filter(tip => tip.textContent.includes('相关证据')).length >= targetTipCount,
            10
        );

        const tipElements = Array.from(document.querySelectorAll('p.tip')).filter(tip => tip.textContent.includes('相关证据'));
        for (let i = 0; i < tipElements.length; i++) {
            const tipElement = tipElements[i];
            const rowDataList = groupDataList[i] || [];
            const targetRowCount = rowDataList.length;

            console.log(`正在处理第 ${i + 1} 组 .tip 元素...`);
            try {
                await clickAddButtonUntilCondition(tipElement, targetRowCount);
                await inputTextIntoTableRows(tipElement, rowDataList);
            } catch (error) {
                console.error(`处理第 ${i + 1} 组 .tip 元素时出错：`, error);
            }
        }
    }

    // ========================
    // 表格导出功能
    // ========================
    function createExportButton() {
        // 创建表格导出按钮
        createButton('表格导出',exportTableToExcel,null, {
            backgroundColor: '#3d69cb',
            right: '55%', // 放置在右上角
        });
    }

    function exportTableToExcel() {
        // 导出表格数据为 Excel 文件
        // 获取表格元素
        const table = document.querySelector('.el-table__body-wrapper table');
        if (!table) {
            alert('没有找到表格！');
            return;
        }

        // 提取表头
        const headers = [];
        const headerRow = document.querySelector('.el-table__header-wrapper .el-table__header tr');
        if (headerRow) {
            headerRow.querySelectorAll('th').forEach(th => {
                const cell = th.querySelector('.cell');
                if (cell) {
                    headers.push(cell.textContent.trim());
                } else {
                    headers.push(''); // 如果没有找到 .cell 元素，添加空字符串
                }
            });
        } else {
            alert('没有找到表头行！');
            return;
        }

        // 提取数据行
        const data = [];
        table.querySelectorAll('tbody tr').forEach(tr => {
            const row = [];
            tr.querySelectorAll('td').forEach(td => {
                const cell = td.querySelector('.cell');
                if (cell) {
                    row.push(cell.textContent.trim());
                } else {
                    row.push(''); // 如果没有找到 .cell 元素，添加空字符串
                }
            });
            data.push(row);
        });

        // 创建工作簿
        const wsData = [headers, ...data];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // 生成Excel文件
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // 创建Blob对象，并生成URL
        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        // 创建隐藏的可下载链接
        const a = document.createElement('a');
        a.href = url;
        a.download = '导出表格.xlsx'; // 设置文件名
        a.style.display = 'none';
        document.body.appendChild(a);

        // 触发点击
        a.click();

        // 然后移除
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    function s2ab(s) {
        // 将二进制字符串转换为 ArrayBuffer
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    // ========================
    // JSON 数据导入功能
    // ========================
    function addImportButton() {
        // 创建导入 JSON 数据按钮
        createButton('导入调查总结数据', handleImport,null, {
            backgroundColor: '#3d6bcf',
            left: '55%', // 放置在左上角
        });
    }

    function handleImport() {
        // 处理 JSON 数据导入
        if (!isTargetPageForJSONImport()) {
            alert('请到案件调查终结界面输入！');
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const jsonData = e.target.result;
                        const groupDataList = JSON.parse(jsonData);
                        console.log('解析后的 JSON 数据：', groupDataList);
                        await clickAddGroupButtonUntilCondition(groupDataList.length, groupDataList);
                        alert('数据导入成功！');
                    } catch (error) {
                        console.error('导入 JSON 数据时出错：', error);
                        alert('导入 JSON 数据失败，请检查文件格式是否正确。');
                    }
                };
                reader.readAsText(file);
            }
        });
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    // ========================
    // 缴款发票跳转下载功能
    // ========================
    function initPaymentSlipFeatureLogic() {
        // 初始化缴款发票跳转下载功能

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector('button.el-button.el-button--primary')) {
                        const queryButton = node.querySelector('button.el-button.el-button--primary');
                        if (queryButton && queryButton.querySelector('span').textContent.trim() === '查询') {
                            //createPaymentSlipButton();
                            createButton('缴款发票下载', handlePaymentSlip,queryButton, {
                                backgroundColor: '#FFA500', // 橙色背景
                                top: '50px', // 放置在导出按钮下方
                                right: '10px',
                            });
                            observer.disconnect(); // 停止观察
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupDetailButtonListener() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector('.el-link--inner')) {
                        const detailLinks = Array.from(node.querySelectorAll('.el-link--inner'))
                            .filter(span => span.textContent.includes('查看缴纳详情'));
                        detailLinks.forEach(link => {
                            link.closest('.el-link').addEventListener('click', () => {
                                setTimeout(addCopyAndOpenQueryPageButton, 1000);
                            });
                        });
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function addCopyAndOpenQueryPageButton() {
        const popupContainer = document.querySelector('.el-dialog__body');
        if (!popupContainer) {
            console.error('未能找到弹出窗口容器');
            return;
        }

        // 使用提供的HTML结构查找缴款凭证号和校验码
        const voucherIdLabel = Array.from(popupContainer.querySelectorAll('label.el-form-item__label'))
            .find(label => label.textContent.trim() === '缴款凭证号');
        const verificationCodeLabel = Array.from(popupContainer.querySelectorAll('label.el-form-item__label'))
            .find(label => label.textContent.trim() === '校验码');

        let voucherId, verificationCode;

        if (voucherIdLabel && verificationCodeLabel) {
            voucherId = voucherIdLabel.parentElement.querySelector('.el-form-item__content').textContent.trim();
            verificationCode = verificationCodeLabel.parentElement.querySelector('.el-form-item__content').textContent.trim();
        } else {
            console.error('未能找到缴款凭证号或校验码');
            return;
        }

        const button = createButton('复制信息并查询', () => {
            navigator.clipboard.writeText(`缴款凭证号: ${voucherId}\n校验码: ${verificationCode}`);
            window.open('https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001999695/reserved/index.html#/query-pay-order', '_blank');
        },null, {
            backgroundColor: '#3d69cb',
            top: '70%',
            left: '50%',
            transform: 'translateX(-50%)'
        });

        popupContainer.appendChild(button);
    }

    async function handlePaymentSlip() {
    // 处理缴款发票下载逻辑
        try {
            // 1. 从剪贴板读取数据
            const clipboardText = await navigator.clipboard.readText();
            const [voucherLine, codeLine] = clipboardText.split('\n').map(line => line.trim());
            const voucherId = voucherLine.split(': ')[1];
            const verificationCode = codeLine.split(': ')[1];

            if (!voucherId || !verificationCode) {
                alert('剪贴板内容格式不正确，请确保包含缴款凭证号和校验码');
                return;
            }

            // 2. 填充输入框
            const voucherInput = document.querySelector('input[placeholder="请输入电子缴款凭证上的17位凭证号"]');
            const codeInput = document.querySelector('input[placeholder="请输入电子缴款凭证上的校验码"]');
            if (!voucherInput || !codeInput) {
                alert('未找到输入框，请确保在正确的页面操作');
                return;
            }

            simulateInput(voucherInput, voucherId);
            simulateInput(codeInput, verificationCode);

            // 3. 触发查询
            const queryButton = Array.from(document.querySelectorAll('button.el-button--primary'))
    .find(button => button.querySelector('span')?.textContent.includes('查询'));
            if (!queryButton) {
                alert('未找到查询按钮');
                return;
            }

            // 4. 模拟真实点击并等待结果
            simulateRealClick(queryButton);
            waitForPageLoadAndClickTargetTD()

        } catch (error) {
            console.error('缴款发票下载失败:', error);
            alert(`操作失败: ${error.message}`);
        }

    }

    function waitForPageLoadAndClickTargetTD() {
        // 等待页面加载并点击目标元素
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector('td[colspan="2"][style="border: none;"]')) {
                        const targetTd = node.querySelector('td[colspan="2"][style="border: none;"]');
                        if (targetTd && targetTd.textContent.includes('浙江省非税收入一般缴款书（电子）')) {
                            targetTd.click();
                            observer.disconnect(); // 停止观察
                            handleModalAndDownloadImage();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleModalAndDownloadImage() {
    // 处理模态对话框并下载图片
        const imgElement = document.querySelector('body > div.app > div > div.acontent > div > div:nth-child(3) > div > div > div > div.el-dialog__body > div > div > img');

        if (imgElement) {
            console.log('找到图片元素，准备下载...', imgElement.src);
            downloadImage(imgElement.src);
        } else {
            console.log('未找到图片元素，等待一段时间后再次检查...');
            setTimeout(handleModalAndDownloadImage, 1000); // 每隔1秒检查一次
        }
    }

    function downloadImage(imageSrc) {
        // 下载图片
        const img = new Image();
        img.onload = function() {
            console.log('图片加载完成，开始下载...');
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = 'zhejiang_payment_slip.png'; // 设置下载文件名

            // 添加到DOM中以确保浏览器支持下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 下载完成后移除链接
            console.log('图片下载完成');
        };
        img.onerror = function() {
            console.error('图片加载失败');
        };
        img.src = imageSrc;
    }

    // ========================
    // 启动脚本
    // ========================
    mainInit();
})();