// ==UserScript==
// @name         象视自动同步V1.98版
// @namespace    http://tampermonkey.net/
// @version      1.98
// @description  优化同步功能，增加提取
// @author       志哥超哥开饭啦
// @match        *://vr.xhj.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534783/%E8%B1%A1%E8%A7%86%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5V198%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/534783/%E8%B1%A1%E8%A7%86%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5V198%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：指定创建按钮的框架URL规则    
    const TARGET_FRAME_URLS = [
        'https://vr.xhj.com/houseadmin/house/index.html', // 实际运行框架URL
    ];

    const BUTTON_ID = 'auto-sync-button-v5';
    const SETTINGS_BUTTON_ID = 'auto-sync-settings-v5';
    const CUSTOM_SYNC_BUTTON_ID = 'custom-sync-button-v1';
    const EXTRACT_BUTTON_ID = 'extractBtn';
    let isRunning = false;
    let observer = null;

    // 判断当前是否为顶级窗口
    function isTopWindow() {
        return window === window.top;
    }

    // 判断当前是否在目标框架中
    function isInTargetFrame() {
        // 如果配置为空且是顶级窗口，返回true
        if (TARGET_FRAME_URLS.length === 0 && isTopWindow()) return true;
        
        // 检查当前框架URL是否匹配目标规则
        const frameUrl = window.location.href;
        return TARGET_FRAME_URLS.some(urlPattern => 
            frameUrl.includes(urlPattern)
        );
    }

    // 清理所有自动同步按钮
    function cleanupButtons() {
        document.querySelectorAll(`#${BUTTON_ID}, #${SETTINGS_BUTTON_ID}, #${CUSTOM_SYNC_BUTTON_ID}, #${EXTRACT_BUTTON_ID}, #filterTime`).forEach(btn => btn.remove());
    }

    // 检查是否已存在按钮
    function hasButtons() {
        return document.getElementById(BUTTON_ID) !== null;
    }

    // 创建标准按钮
    function createButton(id, text, top, backgroundColor, clickHandler) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.cssText = `
            position: fixed;
            top: ${top}px;
            right: 10px;
            z-index: 999999;
            padding: 8px 16px;
            background: ${backgroundColor};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
            min-width: 140px;
        `;
        button.addEventListener('click', clickHandler);
        document.body.appendChild(button);
        return button;
    }

    // 只在目标框架中创建按钮
    function initButtons() {
        if (!isInTargetFrame()) return;
        
        cleanupButtons();
        
        // 创建主按钮
        createButton(BUTTON_ID, '开始自动同步', 10, '#4CAF50', clickSyncButtons);
        
        // 创建设置按钮
        createButton(SETTINGS_BUTTON_ID, '跳转并指定90', 50, '#2196F3', openSettings);
        
        // 创建按需同步按钮
        createButton(CUSTOM_SYNC_BUTTON_ID, '按需同步', 90, '#FF5722', customSyncProcess);
        
        // 创建数据提取区域
        initExtractSection();
    }

    // 优化后的同步按钮查找函数
    function findSyncButtons() {
        const buttons = new Set();
        
        // 使用更精确的XPath选择器，只选择可见的、包含"同步"文本的按钮元素
        const xpath = "//button[contains(text(),'同步') or contains(@value,'同步')] | //a[contains(text(),'同步') or contains(@value,'同步')] | //input[contains(@value,'同步')]";
        const elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < elements.snapshotLength; i++) {
            const element = elements.snapshotItem(i);
            
            // 更严格的过滤条件
            if (!element.id?.startsWith('auto-sync-button') && 
                isClickable(element) && 
                isVisible(element) &&
                isInValidContainer(element)) { // 新增容器验证
                buttons.add(element);
            }
        }
        
        console.log(`找到 ${buttons.size} 个同步按钮`);
        return Array.from(buttons);
    }

    // 检查元素是否在有效容器中
    function isInValidContainer(element) {
        // 检查元素是否在表格行或其他有效容器中
        let parent = element.parentElement;
        for (let i = 0; i < 5 && parent; i++) {
            if (parent.tagName === 'TR' || 
                parent.classList.contains('layui-table') || 
                parent.classList.contains('content') || 
                parent.classList.contains('main')) {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    }

    function isVisible(element) {
        return!!(element.offsetWidth || element.offsetHeight || element.getClientRects().length) &&
            window.getComputedStyle(element).visibility!== 'hidden' &&
            window.getComputedStyle(element).display!== 'none';
    }

    function isClickable(element) {
        const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT'];
        return clickableTags.includes(element.tagName) ||
            element.onclick!= null ||
            element.getAttribute('role') === 'button' ||
            window.getComputedStyle(element).cursor === 'pointer';
    }

    function updateButtonStatus(buttonId, text, isProcessing = false) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        button.textContent = text;
        button.style.backgroundColor = isProcessing? '#ff9800' : 
                                      buttonId === BUTTON_ID? '#4CAF50' : 
                                      buttonId === SETTINGS_BUTTON_ID? '#2196F3' : '#FF5722';
    }

    async function clickSyncButtons(e) {
        e.preventDefault();
        if (isRunning) return;
        isRunning = true;

        const buttons = findSyncButtons();
        let currentCount = 0;

        if (buttons.length === 0) {
            updateButtonStatus(BUTTON_ID, '未找到同步按钮');
            setTimeout(() => updateButtonStatus(BUTTON_ID, '开始自动同步'), 2000);
            isRunning = false;
            return;
        }

        for (const button of buttons) {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // 高亮显示当前处理的按钮
                highlightElement(button);
                
                button.click();
                currentCount++;
                updateButtonStatus(BUTTON_ID, `正在同步(${currentCount}/${buttons.length})`, true);
            } catch (error) {
                console.error('点击按钮时发生错误:', error);
                updateButtonStatus(BUTTON_ID, `同步出错(${currentCount}/${buttons.length})`);
                await delay(1000);
            }
        }

        updateButtonStatus(BUTTON_ID, `完成同步 ${currentCount} 个`, true);
        setTimeout(() => {
            updateButtonStatus(BUTTON_ID, '开始自动同步');
            isRunning = false;
        }, 2000);
    }

    // 高亮显示元素
    function highlightElement(element) {
        const originalStyle = element.style.cssText;
        element.style.cssText += '; box-shadow: 0 0 0 3px red; transition: box-shadow 0.3s;';
        setTimeout(() => {
            element.style.cssText = originalStyle;
        }, 500);
    }

    // 等待指定毫秒数的函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 等待元素出现的函数，添加超时处理
    async function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element not found: ${selector}`));
                    return;
                }
                
                setTimeout(checkElement, 100);
            };
            
            checkElement();
        });
    }
     // 跳转指定状态设置一页90功能
    async function openSettings() {
        try {
var inputElement = document.querySelector("#key");
    
    // 将输入框的值设置为空字符串
    inputElement.value = '';
            //  激活标签
            const tabIcon = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > div > i");
            tabIcon.click();
            await delay(200);
            
            const orderTab = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > dl > dd:nth-child(5)");// 选择已接单
            orderTab.click();
            await delay(300);
            
            const searchButton = await waitForElement("#search");// 点击搜索
            searchButton.click();
            await delay(4000); // 等待搜索结果加载

            // 设置下拉框值并触发事件
            const select = await waitForElement("[id^='layui-laypage'] > span > select");
            select.value = "90";
            
            // 创建并触发change事件
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
            
            updateButtonStatus(SETTINGS_BUTTON_ID, "操作完成");
            setTimeout(() => updateButtonStatus(SETTINGS_BUTTON_ID, "跳转并指定90"), 2000);
        } catch (error) {
            console.error("自动化操作失败:", error);
            updateButtonStatus(SETTINGS_BUTTON_ID, "操作失败");
            setTimeout(() => updateButtonStatus(SETTINGS_BUTTON_ID, "跳转并指定90"), 2000);
        }
    }

    // 按需同步功能
    async function customSyncProcess() {
        try {
            updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, "正在处理...", true);
            
            // 激活标签
            try {
                const activateTag = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > div ");
                activateTag.click();
                await delay(200);
            } catch (error) {
                console.error('激活标签时出错:', error);
                updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, '激活标签出错');
                setTimeout(() => updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, "按需同步"), 1000);
                return;
            }
            
            // 确保状态合法
            try {
                const statusButton = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > dl > dd.layui-select-tips");
                statusButton.click();
                await delay(2000); // 延迟2秒
            } catch (error) {
                console.error('确保状态合法时出错:', error);
                updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, '确保状态合法出错');
                setTimeout(() => updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, "按需同步"), 1000);
                return;
            }
            
            // 读取剪切板内容
            const clipboardText = await navigator.clipboard.readText();
            
            // 按换行符分割成数组
            const items = clipboardText.split('\n').filter(item => item.trim()!== '');
            
            if (items.length === 0) {
                updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, "剪切板为空");
                setTimeout(() => updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, "按需同步"), 2000);
                return;
            }
            
            // 处理每个项目
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, `处理中 ${i+1}/${items.length}: ${item}`, true);
                
                // 写入到第一步的输入框
                const keyInput = document.querySelector("#key");
                if (keyInput) {
                    keyInput.value = item;
                    
                    // 触发输入事件
                    const event = new Event('input', { bubbles: true });
                    keyInput.dispatchEvent(event);
                    
                    // 第一步写入后延迟300毫秒
                    await delay(300);
                    
                    // 点击搜索按钮
                    const searchButton = document.querySelector("#search");
                    if (searchButton) {
                        searchButton.click();
                        
                        // 搜索后延迟2000毫秒
                        await delay(2000);
                        
                       // 先使用CSS选择器定位到元素
                       const syncButton = document.querySelector('a[lay-event="synchronous"]');
                        

                        if (syncButton && syncButton.textContent === '同步'){
   
                           // 高亮显示按钮
                           highlightElement(syncButton);
                            
                            syncButton.click();
                            
                            // 同步后延迟1秒再执行下一个项目
                            await delay(1000);
                        } else {
                            console.log(`未找到项目 ${item} 的同步按钮`);
                            updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, `未找到 ${item} 的同步按钮`);
                            await delay(1000);
                        }
                    }
                }
            }
            
            updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, `成功处理 ${items.length} 个项目`);
            setTimeout(() => updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, "按需同步"), 2000);
        } catch (error) {
            console.error('处理剪切板内容时出错:', error);
            updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, `出错: ${error.message}`);
            setTimeout(() => updateButtonStatus(CUSTOM_SYNC_BUTTON_ID, "按需同步"), 1000);
        }
    }

    // 数据提取功能
 function initExtractSection() {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 130px;
        right: 10px;
        z-index: 999999;
        background: white;
        padding: 4px; /* 容器内边距 */
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex; /* 弹性布局 */
        flex-direction: column; /* 垂直排列（默认row，改为column） */
        align-items: center; /* 子元素水平居中（使按钮和输入框居中对齐） */
        gap: 4px; /* 垂直间距 */
    `;

    // 先创建按钮（在上方）
    const extractBtn = document.createElement('button');
    extractBtn.id = EXTRACT_BUTTON_ID;
    extractBtn.textContent = '提取数据';
    extractBtn.style.cssText = `
        padding: 4px 12px;
        background: #165DFF;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        white-space: nowrap; /* 防止按钮文字换行 */
        width: 100%; /* 按钮宽度继承容器宽度（即输入框宽度） */
    `;

    // 再创建时间输入框（在下方）
    const timeInput = document.createElement('input');
    timeInput.type = 'datetime-local';
    timeInput.id = 'filterTime';
    timeInput.value = new Date().toISOString().slice(0, 16);
    timeInput.style.cssText = `
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap; /* 防止时间文字换行 */
    `;

    container.appendChild(extractBtn); // 先添加按钮（在上方）
    container.appendChild(timeInput); // 再添加输入框（在下方）
    document.body.appendChild(container);

    extractBtn.addEventListener('click', handleExtract);
}

    // 提取表格数据功能
    function handleExtract() {
        try {
            const tbody = document.querySelector('body > div.admin-main.layui-anim.layui-anim-upbit > div > div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody');
            if (!tbody) {
                alert('错误：未找到目标表格！请检查选择器是否正确。');
                return;
            }
            // 遍历行并提取数据
            const filterTime = new Date(document.getElementById('filterTime').value);
            const rows = tbody.rows;
            let data = [];
            
            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].cells;
                // 验证单元格数量（至少6列）
                if (cells.length < 6) {
                    console.warn(`第 ${i+1} 行单元格不足，跳过`);
                    continue;
                }
                // 提取第6列时间并验证
                const timeText = cells[5].textContent.trim();
                const rowTime = new Date(timeText.replace(' ', 'T'));
                
                if (isNaN(rowTime.getTime())) {
                    console.error(`第 ${i+1} 行时间格式无效：${timeText}`);
                    continue;
                }
                // 时间筛选
                if (rowTime <= filterTime) continue;
                // 按顺序提取第4列、第2列、第3列、第5列（索引3、1、2、4）
                const col4 = cells[3].textContent.trim();
                const col2 = cells[1].textContent.trim();
                const col3 = cells[2].textContent.trim();
                const col5 = cells[4].textContent.trim();
                data.push(`${col4}\t${col2}\t${col5}\t${col3}`);
            }
            
            if (data.length > 0) {
                if (typeof GM_setClipboard === 'function') {
                    GM_setClipboard(data.join('\n'));
                    alert(`已复制 ${data.length} 行数据到剪贴板`);
                } else {
                    alert('错误：GM_setClipboard 不可用，请确保脚本有相应权限');
                }
            } else {
                alert('没有找到符合条件的数据');
            }
        } catch (error) {
            console.error('提取数据时出错:', error);
            alert(`提取数据出错: ${error.message}`);
        }
    }

    // 清理资源
    function cleanup() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        cleanupButtons();
    }

    // 主初始化函数，添加延迟确保框架加载完成
    function initialize() {
        // 确保在页面完全加载后执行
        if (document.readyState !== 'complete') {
            window.addEventListener('load', initialize);
            return;
        }
        
        // 清理之前的实例
        cleanup();
        
        setTimeout(() => {
            if (isInTargetFrame()) {
                initButtons(); // 创建3个主按钮
                
                // 监视DOM变化，确保只有一个按钮
                observer = new MutationObserver((mutations) => {
                    if (!isInTargetFrame()) return;
                    
                    // 如果发现多个按钮或没有按钮，重新初始化
                    const buttonCount = document.querySelectorAll(`#${BUTTON_ID}, #${SETTINGS_BUTTON_ID}, #${CUSTOM_SYNC_BUTTON_ID}`).length;
                    if (buttonCount!== 3) {
                        initButtons();
                    }
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 500); // 延迟500ms初始化，等待页面加载
    }

    // 添加页面卸载时的清理
    window.addEventListener('beforeunload', cleanup);

    // 立即执行初始化
    initialize();
})();