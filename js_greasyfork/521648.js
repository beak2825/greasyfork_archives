// ==UserScript==
// @name         customer-info-filler.user
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  customer-info.user
// @author       Senpou
// @match        https://muratec.cybozu.cn/k/1/* 
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/521648/customer-info-filleruser.user.js
// @updateURL https://update.greasyfork.org/scripts/521648/customer-info-filleruser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 客户数据结构
    let customers = GM_getValue('customers', []);

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* 主窗口样式 */
        .customer-popup {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: #fff;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            width: 240px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 12px;
            border: 1px solid #eee;
        }

        /* 主窗口标题栏 */
        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #eee;
        }

        .popup-header h3 {
            margin: 0;
            font-size: 13px;
            color: #333;
            font-weight: 500;
        }

        /* 操作按钮组 */
        .popup-actions {
            display: flex;
            gap: 2px;
        }

        .action-btn {
            padding: 2px 6px;
            font-size: 11px;
            color: #666;
            background: transparent;
            border: none;
            cursor: pointer;
            border-radius: 3px;
        }

        .action-btn:hover {
            background: #f5f5f5;
        }

        /* 客户列表 */
        .customer-list {
            max-height: 300px;
            overflow-y: auto;
        }

        .customer-item {
            padding: 5px 8px;
            cursor: pointer;
            border-radius: 4px;
            margin-bottom: 2px;
            color: #333;
            background: #f9f9f9;
        }

        .customer-item:hover {
            background: #f0f0f0;
        }

        /* 快捷键提示 */
        .shortcut-tips {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 10px;
            text-align: center;
        }

        /* 新建客户窗口 */
        .form-popup {
            width: 260px;
            height: 180px;
            background: #fff;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            border: 1px solid #eee;
            position: fixed;
        }

        /* 一行式表单 */
        .form-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            height: 26px;
        }

        .form-row label {
            width: 70px;
            font-size: 12px;
            color: #666;
            flex-shrink: 0;
        }

        .form-row input,
        .form-row textarea {
            flex: 1;
            height: 26px;
            padding: 0 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            background: #fff;
        }

        .form-row textarea {
            padding-top: 4px;
        }

        /* 按钮区域 */
        .form-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            justify-content: flex-end;
        }

        .form-actions button {
            width: 60px;
            height: 26px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
        }

        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 3px;
        }

        /* 错误提示样式 */
        .error-tip {
            color: #ff4d4f;
            font-size: 11px;
            margin-top: 2px;
            margin-left: 70px;
        }

        /* 输入框错误状态 */
        .form-row input.error {
            border-color: #ff4d4f;
        }

        /* 没有空行时的提示样式 */
        .no-empty-row {
            color: #ff4d4f;
            font-size: 12px;
            padding: 4px 8px;
            background: #fff2f0;
            border-radius: 4px;
            margin-bottom: 8px;
            display: none;
        }

        /* 设置按钮样式 */
        .settings-btn {
            font-size: 11px;
            color: #666;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 4px;
        }

        .settings-btn:hover {
            background: #f5f5f5;
        }

        /* 设置输入框样式 */
        .emergency-contact-input {
            width: 120px;
            height: 24px;
            padding: 0 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            margin: 0 4px;
        }
    `;
    document.head.appendChild(style);

    // 自动填写紧急联系人
    function fillEmergencyContact() {
        // 从存储中获取保存的紧急联系人
        const savedContact = GM_getValue('emergencyContact', '');
        
        const emergencyContactInput = document.evaluate(
            '/html/body/div[9]/div/div/div/div/div/div[2]/div[8]/div[2]/div[1]/div/input',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        
        if (emergencyContactInput) {
            emergencyContactInput.focus();
            emergencyContactInput.value = savedContact;
            emergencyContactInput.dispatchEvent(new Event('input', { bubbles: true }));
            emergencyContactInput.dispatchEvent(new Event('change', { bubbles: true }));
            emergencyContactInput.dispatchEvent(new Event('blur', { bubbles: true }));
        }
    }

    // 点击搜索按钮
    function clickSearch() {
        const searchButton = document.evaluate(
            '/html/body/div[9]/div/div/div/div/div/div[2]/div[8]/div[2]/div[1]/button[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        
        if (searchButton) {
            searchButton.click();
        }
    }

    // 填写客户信息
    function fillCustomerInfo(customer) {
        // 获取所有行的输入框
        const rows = [];
        let rowIndex = 1;
        let foundEmptyRow = false;

        // 寻找第一个空的输入行
        while (!foundEmptyRow && rowIndex <= 10) { // 最多检查10行
            const rowXPath = rowIndex === 1 ? 'tr' : `tr[${rowIndex}]`;
            const fields = {
                name: `/html/body/div[9]/div/div/div/div/div/div[5]/table/tbody/${rowXPath}/td[6]/div/div[1]/div/input`,
                contact: `/html/body/div[9]/div/div/div/div/div/div[5]/table/tbody/${rowXPath}/td[7]/div/div[1]/div/input`,
                note: `/html/body/div[9]/div/div/div/div/div/div[5]/table/tbody/${rowXPath}/td[9]/div/div[1]/div/input`
            };

            const nameInput = document.evaluate(
                fields.name,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (nameInput) {
                // 如果这一行的名称输入框是空的，就在这一行填写
                if (!nameInput.value.trim()) {
                    foundEmptyRow = true;
                    fillRow(fields, customer);
                    break;
                }
            } else {
                // 如果找不到这一行，说明已经到达最后一行
                break;
            }
            rowIndex++;
        }

        // 如果没有找到空行，在客户列表上方显示提示
        if (!foundEmptyRow) {
            const listContainer = document.querySelector('.customer-list');
            const existingTip = document.querySelector('.no-empty-row');
            
            if (!existingTip) {
                const tip = document.createElement('div');
                tip.className = 'no-empty-row';
                tip.textContent = '没有可用的空行，请增加行数';
                listContainer.insertAdjacentElement('beforebegin', tip);
                tip.style.display = 'block';
                
                // 3秒后自动隐藏提示
                setTimeout(() => {
                    tip.style.opacity = '0';
                    tip.style.transition = 'opacity 0.3s';
                    setTimeout(() => tip.remove(), 300);
                }, 3000);
            }
        }
    }

    // 填单行数据的辅助函数
    function fillRow(fields, customer) {
        for (const [key, xpath] of Object.entries(fields)) {
            const element = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (element) {
                // 聚焦输入框
                element.focus();
                
                // 直接设置input的value
                element.value = customer[key];
                
                // 触发必要的事件
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                element.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        }
    }

    // 添加快捷键处理函数
    function setupShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt + Q 显示客户列表
            if (e.altKey && e.key === 'q') {
                e.preventDefault();
                showCustomerPopup();
            }
            // Alt + N 添加新客户
            if (e.altKey && e.key === 'n') {
                e.preventDefault();
                addNewCustomer();
            }
            // Alt + X 关闭主窗口
            if (e.altKey && e.key === 'x') {
                e.preventDefault();
                const popup = document.querySelector('.customer-popup:not(.form-popup)');
                if (popup) popup.remove();
            }
        });
    }

    // 显示客户选择弹窗
    function showCustomerPopup() {
        const popup = document.createElement('div');
        popup.className = 'customer-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h3>客户列表</h3>
                <div class="popup-actions">
                    <button class="action-btn" id="settings-btn" title="设置">⚙</button>
                    <button class="action-btn" id="add-customer" title="新建">+</button>
                    <button class="action-btn" id="import-customers" title="导入">↓</button>
                    <button class="action-btn" id="export-customers" title="导出">↑</button>
                    <button class="action-btn close-btn" title="关闭">×</button>
                </div>
            </div>
            <div class="customer-list">
                ${customers.map((customer, index) => `
                    <div class="customer-item" data-index="${index}">
                        ${customer.name}
                    </div>
                `).join('')}
            </div>
            <div class="shortcut-tips">
                Alt+Q 显示列表 · Alt+N 新建 · Alt+X 关闭
            </div>
        `;

        document.body.appendChild(popup);
        makeDraggable(popup);

        // 绑定事件
        popup.querySelector('.close-btn').onclick = () => popup.remove();
        
        popup.querySelectorAll('.customer-item').forEach(item => {
            item.onclick = () => {
                const customer = customers[item.dataset.index];
                fillCustomerInfo(customer);
            };
        });

        // 添加新客户
        popup.querySelector('#add-customer').onclick = addNewCustomer;
        
        // 导入导出功能
        popup.querySelector('#import-customers').onclick = importCustomers;
        popup.querySelector('#export-customers').onclick = exportCustomers;

        // 添加设置按钮事件
        popup.querySelector('#settings-btn').onclick = showEmergencyContactSetting;
    }

    // 添新客户
    function addNewCustomer() {
        const mainPopup = document.querySelector('.customer-popup:not(.form-popup)');
        const formPopup = document.createElement('div');
        
        // 一次性设置所有样式和类名
        formPopup.className = 'customer-popup form-popup';
        
        if (mainPopup) {
            const rect = mainPopup.getBoundingClientRect();
            Object.assign(formPopup.style, {
                position: 'fixed',
                top: `${rect.top + 30}px`,
                right: `${window.innerWidth - rect.right}px`,
                transform: 'none',
                opacity: '1'
            });
        }

        // 设置HTML内容
        formPopup.innerHTML = `
            <div class="form-row">
                <label>客户名称：</label>
                <input type="text" id="customer-name" placeholder="请输入" autocomplete="off">
            </div>
            <div class="form-row">
                <label>联系方式：</label>
                <input type="text" id="customer-contact" placeholder="请输入" autocomplete="off">
            </div>
            <div class="form-row">
                <label>备注信息：</label>
                <input type="text" id="customer-note" placeholder="请输入">
            </div>
            <div class="form-actions">
                <button class="btn-cancel" id="cancel-add">取消</button>
                <button class="btn-save" id="confirm-add">保存</button>
            </div>
        `;

        // 先添加到DOM
        document.body.appendChild(formPopup);

        // 添加ESC键监听，只处理form-popup
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                const formPopups = document.querySelectorAll('.form-popup');
                if (formPopups.length > 0) {
                    formPopups[formPopups.length - 1].remove();
                    document.removeEventListener('keydown', handleEsc);
                }
            }
        };
        document.addEventListener('keydown', handleEsc);

        // 绑定事件
        formPopup.querySelector('.close-btn').onclick = () => {
            formPopup.remove();
            document.removeEventListener('keydown', handleEsc);
        };
        
        formPopup.querySelector('#cancel-add').onclick = () => {
            formPopup.remove();
            document.removeEventListener('keydown', handleEsc);
        };
        
        formPopup.querySelector('#confirm-add').onclick = () => {
            const nameInput = document.querySelector('#customer-name');
            const errorTip = document.querySelector('.error-tip');
            
            // 移除之前的错误提示和样式
            if (errorTip) errorTip.remove();
            nameInput.classList.remove('error');

            const customer = {
                name: nameInput.value.trim(),
                contact: document.querySelector('#customer-contact').value.trim(),
                note: document.querySelector('#customer-note').value.trim()
            };

            if (!customer.name) {
                // 添加错误样式
                nameInput.classList.add('error');
                
                // 添加错误提示
                const tip = document.createElement('div');
                tip.className = 'error-tip';
                tip.textContent = '请输入客户名称';
                nameInput.parentNode.insertAdjacentElement('afterend', tip);
                
                // 聚焦到输入框
                nameInput.focus();
                return;
            }

            customers.push(customer);
            GM_setValue('customers', customers);
            formPopup.remove();
            document.removeEventListener('keydown', handleEsc);
            showCustomerPopup();
        };

        // 聚焦到第一个输入��
        setTimeout(() => {
            document.querySelector('#customer-name').focus();
        }, 100);
    }

    // 导出客户信息
    function exportCustomers() {
        const data = JSON.stringify(customers, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 导入客户信息
    function importCustomers() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const importedCustomers = JSON.parse(event.target.result);
                    customers = importedCustomers;
                    GM_setValue('customers', customers);
                    showCustomerPopup(); // 刷新显示
                } catch (error) {
                    alert('导入失败：文件格式错误');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // 初��化
    function init() {
        // 从存储中获取上次的窗口位置
        const lastPosition = GM_getValue('lastPosition', null);
        
        setupShortcuts();
        fillEmergencyContact();
        setTimeout(clickSearch, 500);
        
        setTimeout(() => {
            showCustomerPopup();
            if (lastPosition) {
                const popup = document.querySelector('.customer-popup');
                popup.style.top = lastPosition.top + 'px';
                popup.style.right = lastPosition.right + 'px';
                popup.style.transform = 'none';
            }
        }, 1000);
    }

    // 添加菜单命令
    GM_registerMenuCommand('显示客户列表', showCustomerPopup);
    GM_registerMenuCommand('添加新客户', addNewCustomer);

    // 启动插件
    init();

    // 添加拖动功能的函数
    function makeDraggable(popup) {
        const header = popup.querySelector('.popup-header, h3');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || e.target.parentNode === header) {
                isDragging = true;
                popup.classList.add('dragging');
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, popup);
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                isDragging = false;
                popup.classList.remove('dragging');
                // 直接设置最终位置
                const rect = popup.getBoundingClientRect();
                popup.style.top = rect.top + 'px';
                popup.style.right = (window.innerWidth - rect.right) + 'px';
                popup.style.transform = 'none';
                xOffset = 0;
                yOffset = 0;
            }
        }

        function setTranslate(xPos, yPos, el) {
            // 直接设置位置而不是使用transform
            const rect = el.getBoundingClientRect();
            el.style.top = (rect.top + yPos) + 'px';
            el.style.left = (rect.left + xPos) + 'px';
            el.style.transform = 'none';
        }
    }

    // 添加窗口位置保存功能
    function savePopupPosition() {
        const popup = document.querySelector('.customer-popup:not(.form-popup)');
        if (popup) {
            const rect = popup.getBoundingClientRect();
            GM_setValue('lastPosition', {
                top: rect.top,
                right: window.innerWidth - rect.right
            });
        }
    }

    // 在窗口关闭时保存位置
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-btn')) {
            savePopupPosition();
        }
    });

    // 添加设置紧急联系人的功能
    function showEmergencyContactSetting() {
        const currentContact = GM_getValue('emergencyContact', '15184631987');
        const settingRow = document.createElement('div');
        settingRow.style.marginBottom = '10px';
        settingRow.innerHTML = `
            <div style="display: flex; align-items: center;">
                <label style="font-size: 12px; color: #666;">紧急联系人：</label>
                <input type="text" class="emergency-contact-input" value="${currentContact}" placeholder="请输入手机号">
                <button class="settings-btn" id="save-contact">保存</button>
            </div>
        `;

        // 在客户列表前插入设置行
        const listContainer = document.querySelector('.customer-list');
        listContainer.insertAdjacentElement('beforebegin', settingRow);

        // 保存设置
        settingRow.querySelector('#save-contact').onclick = () => {
            const newContact = settingRow.querySelector('.emergency-contact-input').value.trim();
            if (newContact && /^\d{11}$/.test(newContact)) {
                GM_setValue('emergencyContact', newContact);
                settingRow.remove();
                fillEmergencyContact(); // 立即应用新设置
            } else {
                settingRow.querySelector('.emergency-contact-input').style.borderColor = '#ff4d4f';
            }
        };
    }
})(); 