// ==UserScript==
// @name         SteamPY 批量上架激活码助手 (正式版)
// @copyright    2025, Yuxiang ZHANG (https://github.com/jamespaulzhang)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动化批量上架Steam激活码到SteamPY平台，支持精确元素定位和错误恢复
// @author       Yuxiang ZHANG
// @icon         https://steampy.com/img/logo.63413a4f.png
// @match        https://steampy.com/pyUserInfo/sellerCDKey*
// @match        https://steampy.com/pyUserInfo/sellerCDKey/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/540841/SteamPY%20%E6%89%B9%E9%87%8F%E4%B8%8A%E6%9E%B6%E6%BF%80%E6%B4%BB%E7%A0%81%E5%8A%A9%E6%89%8B%20%28%E6%AD%A3%E5%BC%8F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540841/SteamPY%20%E6%89%B9%E9%87%8F%E4%B8%8A%E6%9E%B6%E6%BF%80%E6%B4%BB%E7%A0%81%E5%8A%A9%E6%89%8B%20%28%E6%AD%A3%E5%BC%8F%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        defaultPrice: 10,
        defaultRegion: 'china',
        delayBetweenItems: 2000,
        batchSize: 5,
        maxWaitTime: 15000,
        retryTimes: 3
    };

    // 添加自定义样式
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
        .centered-swal .swal2-popup {
            width: 300px !important;
            max-height: 220px !important;
            padding: 15px !important;
            font-size: 13px !important;
        }
        .centered-swal .swal2-title {
            font-size: 16px !important;
            margin: 0 0 8px 0 !important;
            padding-right: 20px;
        }
        .centered-swal .swal2-html-container {
            margin: 0 0 12px 0 !important;
            max-height: 100px !important;
            overflow-y: auto !important;
            font-size: 13px !important;
        }
        .centered-swal .swal2-actions {
            margin-top: 8px !important;
            padding: 0 !important;
        }
        .centered-swal .swal2-styled {
            margin: 4px !important;
            padding: 5px 10px !important;
            font-size: 13px !important;
        }
        .centered-swal .swal2-icon {
            width: 36px !important;
            height: 36px !important;
            margin: 5px auto 8px !important;
        }
        .centered-swal .swal2-icon .swal2-icon-content {
            font-size: 24px !important;
            line-height: 36px !important;
        }
        .centered-swal .swal2-success-circular-line-left,
        .centered-swal .swal2-success-circular-line-right,
        .centered-swal .swal2-success-fix {
            display: none !important;
        }
        .centered-swal .swal2-success .swal2-success-ring {
            width: 36px !important;
            height: 36px !important;
            border-width: 2px !important;
        }
        .centered-swal .swal2-success [class^="swal2-success-line"] {
            height: 3px !important;
            background-color: #a5dc86 !important;
        }
        .centered-swal .swal2-success .swal2-success-line-tip {
            width: 12px !important;
            left: 6px !important;
            top: 21px !important;
        }
        .centered-swal .swal2-success .swal2-success-line-long {
            width: 20px !important;
            right: 6px !important;
            top: 17px !important;
        }
        .centered-swal .swal2-error .swal2-x-mark {
            position: relative;
            width: 36px;
            height: 36px;
        }
        .centered-swal .swal2-error [class^="swal2-x-mark-line"] {
            height: 3px !important;
            background-color: #f27474 !important;
        }
        .centered-swal .swal2-error .swal2-x-mark-line-left {
            width: 24px !important;
            top: 17px !important;
            left: 6px !important;
            transform: rotate(45deg) !important;
        }
        .centered-swal .swal2-error .swal2-x-mark-line-right {
            width: 24px !important;
            top: 17px !important;
            right: 6px !important;
            transform: rotate(-45deg) !important;
        }
        .centered-swal .swal2-warning .swal2-icon-content {
            font-size: 24px !important;
            line-height: 36px !important;
        }
        .centered-swal .swal2-close {
            top: 10px !important;
            right: 10px !important;
            font-size: 20px !important;
            width: 24px !important;
            height: 24px !important;
        }
        .compact-notification .swal2-popup {
            max-height: 280px !important;
        }
        .compact-notification .swal2-html-container {
            max-height: 180px !important;
        }
    `;
    document.head.appendChild(style);
}

    // 主初始化函数
    async function init() {
        try {
            addCustomStyles(); // 添加自定义样式
            await waitForVueApp();
            createUI();
        } catch (err) {
            console.error('初始化失败:', err);
            showError('加载失败', `无法检测到SteamPY页面元素: ${err.message}`);
        }
    }

    // 等待Vue应用加载
    function waitForVueApp() {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const addButton = findElementByText('button.wh150-rem.ht50-rem.button-detail-bg', '添加CDKey');
                if (addButton) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > config.maxWaitTime) {
                    clearInterval(interval);
                    reject(new Error('等待Vue应用加载超时'));
                }
            }, 300);
        });
    }

    // 创建UI界面
    function createUI() {
        if (document.getElementById('steampyBatchHelperUI')) return;

        // 创建主容器
        const container = document.createElement('div');
        container.id = 'steampyBatchHelperUI';
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            backgroundColor: '#2a475e',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            width: '350px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            overflow: 'hidden'
        });

        // 创建标题栏
        const header = document.createElement('div');
        header.id = 'helperHeader';
        Object.assign(header.style, {
            background: '#1a365d',
            padding: '12px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'move',
            borderBottom: '1px solid #66c0f4'
        });
        container.appendChild(header);

        // 创建标题
        const title = document.createElement('h3');
        title.className = 'ui-title';
        title.textContent = '批量上架助手';
        Object.assign(title.style, {
            color: '#66c0f4',
            fontWeight: 'bold',
            fontSize: '0.3rem',
            margin: '0'
        });
        header.appendChild(title);

        // 创建控制按钮容器
        const controls = document.createElement('div');
        controls.className = 'ui-controls';
        Object.assign(controls.style, {
            display: 'flex',
            gap: '10px'
        });
        header.appendChild(controls);

        // 最小化按钮
        const minimizeBtn = document.createElement('div');
        minimizeBtn.id = 'helperMinimizeBtn';
        minimizeBtn.textContent = '−';
        Object.assign(minimizeBtn.style, {
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            background: '#5cba47',
            transition: 'all 0.2s ease'
        });
        controls.appendChild(minimizeBtn);

        // 关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.id = 'helperCloseBtn';
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            background: '#ff4d4d',
            transition: 'all 0.2s ease'
        });
        controls.appendChild(closeBtn);

        // 创建内容区域
        const content = document.createElement('div');
        content.id = 'helperContent';
        Object.assign(content.style, {
            padding: '15px',
            color: '#c7d5e0'
        });
        container.appendChild(content);

        // 创建文本区域
        const textarea = document.createElement('textarea');
        textarea.id = 'batchDataInput';
        textarea.placeholder = "每行格式: Steam链接|激活码|价格(可选)\n例如:\nhttps://store.steampowered.com/app/730/CSGO/|ABCDE-FGHIJ-KLMNO|50";
        Object.assign(textarea.style, {
            width: '100%',
            height: '150px',
            marginBottom: '10px',
            padding: '8px',
            background: '#1a2a4c',
            border: '1px solid #66c0f4',
            borderRadius: '4px',
            color: '#e0e0e0',
            resize: 'vertical'
        });
        content.appendChild(textarea);

        // 创建按钮组
        const btnGroup = document.createElement('div');
        Object.assign(btnGroup.style, {
            display: 'flex',
            gap: '10px',
            marginBottom: '10px'
        });
        content.appendChild(btnGroup);

        // 粘贴按钮
        const pasteBtn = document.createElement('button');
        pasteBtn.id = 'pasteBtn';
        pasteBtn.textContent = '从剪贴板粘贴';
        Object.assign(pasteBtn.style, {
            flex: '1',
            padding: '8px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: '#1a9fff',
            color: 'white',
            transition: 'all 0.2s ease'
        });
        btnGroup.appendChild(pasteBtn);

        // 清空按钮
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearBtn';
        clearBtn.textContent = '清空';
        Object.assign(clearBtn.style, {
            flex: '1',
            padding: '8px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: '#ff4d4d',
            color: 'white',
            transition: 'all 0.2s ease'
        });
        btnGroup.appendChild(clearBtn);

        // 全球同步复选框
        const globalGroup = document.createElement('div');
        Object.assign(globalGroup.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '15px'
        });
        content.appendChild(globalGroup);

        const globalCheckbox = document.createElement('input');
        globalCheckbox.type = 'checkbox';
        globalCheckbox.id = 'globalRegionCheckbox';
        globalGroup.appendChild(globalCheckbox);

        const globalLabel = document.createElement('label');
        globalLabel.htmlFor = 'globalRegionCheckbox';
        globalLabel.textContent = '在全球区同步进行上架';
        globalGroup.appendChild(globalLabel);

        // 默认价格
        const defaultPriceLabel = document.createElement('label');
        defaultPriceLabel.textContent = '默认价格(如果数据中未指定):';
        Object.assign(defaultPriceLabel.style, {
            display: 'block',
            marginBottom: '5px'
        });
        content.appendChild(defaultPriceLabel);

        const defaultPriceInput = document.createElement('input');
        defaultPriceInput.type = 'number';
        defaultPriceInput.id = 'defaultPrice';
        defaultPriceInput.value = config.defaultPrice;
        Object.assign(defaultPriceInput.style, {
            width: '100%',
            padding: '8px',
            marginBottom: '15px',
            background: '#1a2a4c',
            border: '1px solid #66c0f4',
            borderRadius: '4px',
            color: '#e0e0e0'
        });
        content.appendChild(defaultPriceInput);

        // 操作延迟
        const delayLabel = document.createElement('label');
        delayLabel.textContent = '操作延迟(毫秒):';
        Object.assign(delayLabel.style, {
            display: 'block',
            marginBottom: '5px'
        });
        content.appendChild(delayLabel);

        const delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.id = 'delayBetweenItems';
        delayInput.value = config.delayBetweenItems;
        Object.assign(delayInput.style, {
            width: '100%',
            padding: '8px',
            marginBottom: '15px',
            background: '#1a2a4c',
            border: '1px solid #66c0f4',
            borderRadius: '4px',
            color: '#e0e0e0'
        });
        content.appendChild(delayInput);

        // 批量大小
        const batchLabel = document.createElement('label');
        batchLabel.textContent = '每批处理数量:';
        Object.assign(batchLabel.style, {
            display: 'block',
            marginBottom: '5px'
        });
        content.appendChild(batchLabel);

        const batchInput = document.createElement('input');
        batchInput.type = 'number';
        batchInput.id = 'batchSize';
        batchInput.value = config.batchSize;
        Object.assign(batchInput.style, {
            width: '100%',
            padding: '8px',
            marginBottom: '20px',
            background: '#1a2a4c',
            border: '1px solid #66c0f4',
            borderRadius: '4px',
            color: '#e0e0e0'
        });
        content.appendChild(batchInput);

        // 开始按钮
        const startBtn = document.createElement('button');
        startBtn.id = 'startBtn';
        startBtn.textContent = '开始批量上架';
        Object.assign(startBtn.style, {
            display: 'block',
            width: '100%',
            background: '#5cba47',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        });
        content.appendChild(startBtn);

        // 状态区域
        const statusBox = document.createElement('div');
        statusBox.id = 'batchStatus';
        Object.assign(statusBox.style, {
            marginTop: '15px',
            fontSize: '14px',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
            minHeight: '60px'
        });
        content.appendChild(statusBox);

        // 创建最小化UI
        const minimizedUI = document.createElement('div');
        minimizedUI.id = 'minimizedHelperUI';
        Object.assign(minimizedUI.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            background: '#5cba47',
            borderRadius: '50%',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            transition: 'all 0.3s ease'
        });

        const minimizedText = document.createElement('span');
        minimizedText.textContent = 'S';
        Object.assign(minimizedText.style, {
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
        });
        minimizedUI.appendChild(minimizedText);

        document.body.appendChild(container);
        document.body.appendChild(minimizedUI);

        // 添加拖动功能
        addDragFunctionality(container, header);

        // 添加最小化/展开功能
        setupMinimizeFunctionality(container, minimizedUI);

        // 事件绑定
        pasteBtn.addEventListener('click', pasteFromClipboard);
        clearBtn.addEventListener('click', () => {
            textarea.value = '';
        });
        startBtn.addEventListener('click', startBatchProcess);
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
            minimizedUI.style.display = 'none';
        });
    }

    // 添加拖动功能
    function addDragFunctionality(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算鼠标移动的距离
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 添加最小化/展开功能
    function setupMinimizeFunctionality(mainUI, minimizedUI) {
        const minimizeBtn = document.getElementById('helperMinimizeBtn');

        minimizeBtn.addEventListener('click', () => {
            // 保存位置
            const top = mainUI.style.top;
            const left = mainUI.style.left;

            // 隐藏主UI
            mainUI.style.display = 'none';

            // 显示最小化UI
            minimizedUI.style.display = 'flex';
            minimizedUI.style.top = top;
            minimizedUI.style.left = left;
        });

        minimizedUI.addEventListener('click', () => {
            // 隐藏最小化UI
            minimizedUI.style.display = 'none';

            // 显示主UI
            mainUI.style.display = 'block';
            mainUI.style.top = minimizedUI.style.top;
            mainUI.style.left = minimizedUI.style.left;
        });

        // 添加拖动功能到最小化UI
        addDragFunctionality(minimizedUI, minimizedUI);
    }

    // 核心处理函数
    async function processItem(item, isGlobal, attempt = 1) {
        try {
            console.group(`处理物品 [尝试 ${attempt}]:`, item);

            // 1. 点击添加按钮
            const addButton = await waitForElement('button.wh150-rem.ht50-rem.button-detail-bg', '添加CDKey');
            await safeClick(addButton);
            console.log('已点击添加按钮');

            // 2. 等待模态窗口完全加载
            const visibleModal = await waitForModalReady();
            console.log('可见模态窗口已定位');

            // 3. 在可见模态窗口中输入链接
            const input = await waitForElementWithin(visibleModal, 'input.addCdkIpt');
            await safeType(input, item.url);
            console.log('已输入游戏链接');

            // 4. 在可见模态窗口中点击搜索
            const searchBtn = await waitForElementWithin(visibleModal, 'button.addCDKBtn:not([disabled])');
            await safeClick(searchBtn);
            console.log('已点击搜索按钮');

            // 5. 处理搜索结果
            await processSearchResults(visibleModal, item);

            // 6. 等待表单加载
            console.log("等待1秒，确保表单加载...");
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 7. 填写表单（不再需要区域参数）
            await fillForm(visibleModal, item, isGlobal);

            // 8. 提交
            await submitForm(visibleModal);

            console.groupEnd();
            return { success: true };

        } catch (err) {
            console.groupEnd();
            console.error(`处理失败: ${err.message}`);

            if (attempt >= config.retryTimes) {
                throw new Error(`处理失败: ${err.message}`);
            }

            console.warn(`将在 ${config.delayBetweenItems}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, config.delayBetweenItems));
            return processItem(item, isGlobal, attempt + 1);
        }
    }

    // 处理搜索结果
    async function processSearchResults(visibleModal, item) {
        const gameCardSelector = 'div.flex-row.mt-5.c-point';

        // 1. 在可见模态框中等待游戏卡片加载
        const gameCard = await waitForElementWithin(visibleModal, gameCardSelector, null, 20000);
        if (!gameCard) {
            throw new Error('无法找到游戏卡片');
        }

        // 2. 添加视觉标记以便调试
        gameCard.style.outline = '3px solid blue';
        gameCard.style.boxShadow = '0 0 10px rgba(0,0,255,0.5)';
        console.log('已标记游戏卡片');

        // 3. 点击游戏卡片（确保在可见模态框中）
        await simulateClick(gameCard);
        console.log('已选择游戏');

        // 4. 等待表单加载（检测提交按钮）
        await waitForElement('button.ivu-btn-error.ivu-btn-long', null, 15000);
        console.log('表单已加载');
    }

    // 填写表单 - 修复版本
    async function fillForm(visibleModal, item, isGlobal) {
        try {
            console.log("开始填写表单...");

            // 1. 输入CDKey
            const keyTextarea = await waitForElementWithin(visibleModal, 'textarea.ivu-input');
            keyTextarea.value = item.key;
            keyTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            keyTextarea.dispatchEvent(new Event('change', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('已输入CDKey');

            // 2. 输入价格
            const priceInput = await waitForElementWithin(visibleModal, 'input.ivu-input[type="number"]');
            priceInput.value = item.price.toString();
            priceInput.dispatchEvent(new Event('input', { bubbles: true }));
            priceInput.dispatchEvent(new Event('change', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('已输入价格');

            // 3. 修复全球同步复选框定位 - 新的定位方法
            if (isGlobal) {
                try {
                    // 等待全球同步区域加载
                    await new Promise(resolve => setTimeout(resolve, 800));

                    // 新的定位策略：直接通过文本定位
                    const globalTextElement = await waitForElementWithin(
                        visibleModal,
                        'span',
                        '在全球区同步进行上架',
                        5000
                    );

                    if (globalTextElement) {
                        const globalSection = globalTextElement.closest('div.mt-15.f15');

                        if (globalSection) {
                            const checkbox = globalSection.querySelector('input[type="checkbox"]');

                            if (checkbox) {
                                // 添加视觉反馈
                                globalSection.style.outline = '3px solid #00ff00';
                                globalSection.style.backgroundColor = 'rgba(0,255,0,0.1)';

                                if (!checkbox.checked) {
                                    // 使用更可靠的点击方法
                                    await safeClick(checkbox);
                                    console.log('已勾选全球同步');

                                    // 等待状态更新
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                }
                            } else {
                                console.warn('在全球同步区域内未找到复选框');
                            }
                        } else {
                            console.warn('找不到全球同步区域');
                        }
                    } else {
                        console.warn('找不到包含"在全球区同步进行上架"文本的元素');
                    }
                } catch (err) {
                    console.warn('设置全球同步选项失败，尝试备用方法:', err);

                    // 备用方法：直接通过文本定位
                    const textElement = findElementByText('span', '在全球区同步进行上架', visibleModal);
                    if (textElement) {
                        const parentDiv = textElement.closest('div.mt-15.f15');
                        if (parentDiv) {
                            const checkbox = parentDiv.querySelector('input[type="checkbox"]');
                            if (checkbox && !checkbox.checked) {
                                await safeClick(checkbox);
                                console.log('(备用方法) 已勾选全球同步');
                            }
                        }
                    }
                }
            }

            console.log('表单填写完成');
        } catch (err) {
            console.error('填写表单失败:', err);
            throw new Error(`填写表单失败: ${err.message}`);
        }
    }

    // 新增辅助函数：在指定元素内查找包含文本的元素
    function findElementByText(selector, text, parent = document) {
        const elements = parent.querySelectorAll(selector);
        for (const element of elements) {
            if (element.textContent.includes(text)) {
                return element;
            }
        }
        return null;
    }

    // 提交表单 - 修复版本：处理多模态窗口问题
    async function submitForm(visibleModal) {
        try {
            // 等待提交按钮可点击
            const submitBtn = await waitForElementWithin(visibleModal, 'button.ivu-btn-error.ivu-btn-long');

            // 添加视觉标记
            submitBtn.style.outline = '3px solid yellow';
            submitBtn.style.boxShadow = '0 0 10px rgba(255,255,0,0.5)';

            // 记录当前模态窗口数量
            const currentModalCount = document.querySelectorAll('div.ivu-modal-wrap:not(.ivu-modal-hidden)').length;

            // 点击提交按钮
            await safeClick(submitBtn);
            console.log('已点击提交按钮');

            // 等待新模态窗口出现（确认出售弹窗）
            console.log('等待确认出售弹窗...');
            let confirmModal;
            try {
                // 等待新模态窗口出现（数量增加）
                confirmModal = await waitForNewModal(currentModalCount, 10000);
                console.log('确认出售弹窗已显示');
            } catch (err) {
                console.warn('等待新模态窗口失败，尝试直接查找确认出售弹窗...', err);
                // 备用：直接等待一个包含"注意！！"文本的模态框
                confirmModal = await waitForVisibleElementWithText('div.ivu-modal-wrap:not(.ivu-modal-hidden)', '注意！！', 5000);
            }

            // 添加视觉标记
            confirmModal.style.outline = '3px solid orange';
            confirmModal.style.boxShadow = '0 0 10px rgba(255,165,0,0.5)';

            // 在确认弹窗中找到确认出售按钮 - 使用更精确的选择器
            const confirmButton = await waitForElementWithin(
                confirmModal,
                'button.ivu-btn-info.ivu-btn-long.ivu-btn-large',
                '确认出售'
            );

            if (!confirmButton) {
                throw new Error('无法找到确认出售按钮');
            }

            // 添加视觉标记
            confirmButton.style.outline = '3px solid red';
            confirmButton.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';

            // 点击确认出售按钮
            await safeClick(confirmButton);
            console.log('已点击确认出售按钮');

            // 等待确认弹窗关闭
            await waitForElementDisappear('div.ivu-modal-wrap:not(.ivu-modal-hidden)', 10000);
            console.log('确认出售弹窗已关闭');

        } catch (err) {
            console.error('提交失败:', err);
            throw new Error(`提交失败: ${err.message}`);
        }
    }

    // 新增：等待包含特定文本的可见元素
    function waitForVisibleElementWithText(selector, text, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                try {
                    const elements = document.querySelectorAll(selector);

                    for (const el of elements) {
                        const style = window.getComputedStyle(el);
                        const isVisible = style.display !== 'none' &&
                              style.visibility !== 'hidden' &&
                              style.opacity !== '0' &&
                              el.offsetWidth > 0 &&
                              el.offsetHeight > 0 &&
                              !el.classList.contains('ivu-modal-hidden');

                        // 检查元素是否包含目标文本
                        if (isVisible && el.textContent.includes(text)) {
                            return resolve(el);
                        }
                    }

                    if (Date.now() - startTime >= timeout) {
                        reject(new Error(`等待包含文本的可见元素超时: ${text}`));
                    } else {
                        setTimeout(check, 100);
                    }
                } catch (err) {
                    if (Date.now() - startTime >= timeout) {
                        reject(err);
                    } else {
                        setTimeout(check, 100);
                    }
                }
            };
            check();
        });
    }

    // 新增：等待新模态窗口出现
    function waitForNewModal(baseCount, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                try {
                    const modals = document.querySelectorAll('div.ivu-modal-wrap:not(.ivu-modal-hidden)');
                    if (modals.length > baseCount) {
                        // 返回最后一个模态窗口（最上层的）
                        resolve(modals[modals.length - 1]);
                    } else if (Date.now() - startTime >= timeout) {
                        reject(new Error(`等待新模态窗口超时，当前数量: ${modals.length}, 期望大于: ${baseCount}`));
                    } else {
                        setTimeout(check, 100);
                    }
                } catch (err) {
                    if (Date.now() - startTime >= timeout) {
                        reject(err);
                    } else {
                        setTimeout(check, 100);
                    }
                }
            };
            check();
        });
    }

    // 辅助函数：模拟点击
    async function simulateClick(selectorOrElement) {
        const element = typeof selectorOrElement === 'string'
        ? await waitForElement(selectorOrElement)
        : selectorOrElement;

        element.scrollIntoViewIfNeeded();
        await new Promise(resolve => setTimeout(resolve, 300));

        const rect = element.getBoundingClientRect();
        const mouseEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: rect.left + rect.width/2,
            clientY: rect.top + rect.height/2
        });
        element.dispatchEvent(mouseEvent);

        // 手动触发可能的自定义事件
        const customEvent = new CustomEvent('customClick', { bubbles: true });
        element.dispatchEvent(customEvent);
    }

    // 改进的输入函数
    async function safeType(inputElement, value) {
        // 确保input是有效的输入元素
        if (!(inputElement instanceof HTMLInputElement) && !(inputElement instanceof HTMLTextAreaElement)) {
            throw new Error('safeType: 无效的输入元素');
        }

        // 清空并输入值
        inputElement.value = "";
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 300));

        // 模拟真实输入
        for (const char of value) {
            inputElement.value += char;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // 触发额外事件确保Vue检测
        inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 在父元素内查找子元素 - 修复版本
    function waitForElementWithin(parent, selector, text = null, timeout = 10000) {
        return new Promise((resolve, reject) => {
            // 确保parent是DOM元素
            if (!(parent instanceof Element)) {
                return reject(new Error('parent必须是DOM元素'));
            }

            // 确保selector是字符串
            if (typeof selector !== 'string') {
                return reject(new Error('selector必须是字符串'));
            }

            const startTime = Date.now();
            const check = () => {
                try {
                    const elements = parent.querySelectorAll(selector);
                    let found = null;

                    for (const el of elements) {
                        const style = window.getComputedStyle(el);
                        const isVisible = style.display !== 'none' &&
                              style.visibility !== 'hidden' &&
                              el.offsetWidth > 0 &&
                              el.offsetHeight > 0;

                        if (isVisible && (!text || el.textContent.includes(text))) {
                            found = el;
                            break;
                        }
                    }

                    if (found) {
                        resolve(found);
                    } else if (Date.now() - startTime >= timeout) {
                        reject(new Error(`在父元素内查找元素超时: ${selector}`));
                    } else {
                        setTimeout(check, 100);
                    }
                } catch (err) {
                    if (Date.now() - startTime >= timeout) {
                        reject(err);
                    } else {
                        setTimeout(check, 100);
                    }
                }
            };
            check();
        });
    }

    // 改进的点击函数
    async function safeClick(element) {
        element.scrollIntoViewIfNeeded();
        await new Promise(resolve => setTimeout(resolve, 500));

        // 触发完整点击事件
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 50));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 50));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // 等待操作执行
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 等待模态窗口完全就绪
    async function waitForModalReady() {
        console.log("开始等待可见模态窗口...");

        // 使用更可靠的方法检测模态窗口
        const modal = await waitForVisibleElement('div.ivu-modal-wrap:not(.ivu-modal-hidden)', 10000);

        // 添加视觉标记以便调试
        modal.style.outline = '3px solid green';
        modal.style.boxShadow = '0 0 10px rgba(0,255,0,0.5)';

        return modal;
    }

    // 等待可见元素（非隐藏状态）
    function waitForVisibleElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                try {
                    const elements = document.querySelectorAll(selector);

                    for (const el of elements) {
                        // 增强可见性检查
                        const style = window.getComputedStyle(el);
                        const isVisible =
                              style.display !== 'none' &&
                              style.visibility !== 'hidden' &&
                              style.opacity !== '0' &&
                              el.offsetWidth > 0 &&
                              el.offsetHeight > 0 &&
                              !el.classList.contains('ivu-modal-hidden');

                        if (isVisible) {
                            console.log("找到可见元素!");
                            return resolve(el);
                        }
                    }

                    if (Date.now() - startTime >= timeout) {
                        console.error(`等待可见元素超时: ${selector}`);
                        reject(new Error(`等待可见元素超时: ${selector}`));
                    } else {
                        setTimeout(check, 100);
                    }
                } catch (err) {
                    console.error('可见性检查错误:', err);
                    if (Date.now() - startTime >= timeout) {
                        reject(err);
                    } else {
                        setTimeout(check, 100);
                    }
                }
            };
            check();
        });
    }

    // 等待元素出现
    function waitForElement(selector, text = null, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                try {
                    let element;
                    if (text) {
                        element = findElementByText(selector, text);
                    } else {
                        element = document.querySelector(selector);
                    }

                    if (element) {
                        resolve(element);
                    } else if (Date.now() - startTime >= timeout) {
                        reject(new Error(`等待元素超时: ${selector}`));
                    } else {
                        setTimeout(check, 100);
                    }
                } catch (err) {
                    console.error('元素查找错误:', err);
                    if (Date.now() - startTime >= timeout) {
                        reject(err);
                    } else {
                        setTimeout(check, 100);
                    }
                }
            };
            check();
        });
    }

    // 辅助函数：等待元素消失
    function waitForElementDisappear(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = document.querySelector(selector);
                if (!element || window.getComputedStyle(element).display === 'none') {
                    resolve();
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error(`等待元素消失超时: ${selector}`));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    // 从剪贴板粘贴
    async function pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('batchDataInput').value = text;
            showSuccess('已从剪贴板粘贴数据');
        } catch (err) {
            console.error('剪贴板错误:', err);
            showError('无法访问剪贴板', '请手动粘贴数据');
        }
    }

    // 开始批量处理
    async function startBatchProcess() {
        const ui = {
            input: document.getElementById('batchDataInput'),
            defaultPrice: document.getElementById('defaultPrice'),
            delay: document.getElementById('delayBetweenItems'),
            batchSize: document.getElementById('batchSize'),
            globalCheck: document.getElementById('globalRegionCheckbox'),
            status: document.getElementById('batchStatus')
        };

        // 验证输入
        const items = parseInputData(ui.input.value.trim(), parseFloat(ui.defaultPrice.value));
        if (!items.length) {
            return showError('输入错误', '没有有效的上架数据');
        }

        // 确认对话框
        const confirmation = await Swal.fire({
            title: '确认批量上架?',
            html: `<div style="font-size: 14px;">
               将上架 <b>${items.length}</b> 个激活码<br>
               默认价格: <b>${ui.defaultPrice.value}</b> 元<br>
               每批处理: <b>${ui.batchSize.value}</b> 个
             </div>`,
            icon: 'question',
            showCancelButton: true,
            customClass: {
                popup: 'centered-swal'
            }
        });
        if (!confirmation.isConfirmed) return;

        // 开始处理
        const settings = {
            isGlobal: ui.globalCheck.checked,
            delay: parseInt(ui.delay.value) || config.delayBetweenItems,
            batchSize: parseInt(ui.batchSize.value) || config.batchSize
        };

        await runBatchProcessing(items, settings, ui.status);
    }

    // 解析输入数据
    function parseInputData(data, defaultPrice) {
        return data.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => {
            const [url, key, price, region] = line.split('|').map(part => part.trim());
            return {
                url: url,
                key: key || '',
                price: price ? parseFloat(price) : defaultPrice,
                region: region || config.defaultRegion
            };
        })
            .filter(item => item.url && item.key);
    }

    // 执行批量处理
    async function runBatchProcessing(items, settings, statusElement) {
        let processed = 0, successful = 0, failed = 0;
        const failedItems = [];

        for (let i = 0; i < items.length; i += settings.batchSize) {
            const batch = items.slice(i, i + settings.batchSize);

            for (const item of batch) {
                statusElement.innerHTML = `处理中: ${++processed}/${items.length}<br>
                                        成功: ${successful}, 失败: ${failed}`;

                try {
                    const result = await processItem(item, settings.isGlobal);
                    if (result.success) successful++;
                } catch (err) {
                    failed++;
                    failedItems.push(item);
                    console.error('处理失败:', err);
                    statusElement.innerHTML += `<br><span style="color:red">失败: ${item.url}</span>`;
                }

                if (processed < items.length) {
                    await new Promise(resolve => setTimeout(resolve, settings.delay));
                }
            }

            // 批次间隔
            if (i + settings.batchSize < items.length) {
                statusElement.innerHTML += `<br>已完成一批 ${settings.batchSize} 个, 暂停 5 秒...`;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        // 完成处理
        statusElement.innerHTML += `<br><b>处理完成! 成功: ${successful}, 失败: ${failed}</b>`;
        showCompletion(successful, failed, failedItems);
    }

    // 显示完成通知
    function showCompletion(success, failed, failedItems) {
        let html = `<div style="font-size: 14px;">批量上架完成!<br>成功: <b>${success}</b>, 失败: <b>${failed}</b></div>`;

        if (failed > 0) {
            html += `<div style="margin-top: 10px; max-height: 120px; overflow-y: auto;">`;
            html += `<b>失败项:</b><br>`;
            html += failedItems.slice(0, 5).map(item =>
                                                `• ${item.url.substring(0, 40)}...`).join('<br>');
            if (failedItems.length > 5) html += `<br>...及其他 ${failedItems.length - 5} 项`;
            html += `</div>`;
        }

        Swal.fire({
            title: '完成',
            html: html,
            icon: failed ? 'warning' : 'success',
            customClass: {
                popup: 'centered-swal compact-notification'
            }
        });
    }

    // 工具函数：显示通知
    function showSuccess(text) {
        Swal.fire({
            text,
            icon: 'success',
            timer: 1500,
            customClass: {
                popup: 'centered-swal'
            }
        });
    }

    function showError(title, text) {
        Swal.fire({
            title,
            text,
            icon: 'error',
            customClass: {
                popup: 'centered-swal'
            }
        });
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();

