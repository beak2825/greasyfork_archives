// ==UserScript==
// @name         VPS续期提醒
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  VPS续期提醒工具，支持自定义提醒周期和单个VPS续期。比如hax.co.id、woiden.id等
// @author       Gally
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT  // <--- 添加许可证声明
// @downloadURL https://update.greasyfork.org/scripts/537827/VPS%E7%BB%AD%E6%9C%9F%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/537827/VPS%E7%BB%AD%E6%9C%9F%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前窗口是否是弹出窗口或iframe
    function isPopupOrIframe() {
        // 检查是否在iframe中
        if (window.top !== window.self) {
            return true;
        }
        
        // 检查是否是弹出窗口（通常尺寸较小）
        if (window.innerWidth < 800 || window.innerHeight < 600) {
            return true;
        }
        
        // 检查是否有opener（由其他窗口打开）
        if (window.opener && window.opener !== window) {
            return true;
        }
        
        return false;
    }
    
    // 如果是弹出窗口或iframe，不运行脚本
    if (isPopupOrIframe()) {
        return;
    }

    // 添加样式
    GM_addStyle(`
        #vps-reminder-container {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 340px;
            background-color: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            padding: 20px;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: none;
            transition: all 0.3s ease;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
        }
        #vps-reminder-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #333;
            display: flex;
            align-items: center;
        }
        #vps-reminder-title:before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>');
            background-size: contain;
        }
        #vps-reminder-content {
            margin-bottom: 18px;
            color: #555;
            max-height: 240px;
            overflow-y: auto;
            padding-right: 5px;
        }
        #vps-reminder-content::-webkit-scrollbar {
            width: 5px;
        }
        #vps-reminder-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 5px;
        }
        #vps-reminder-content::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 5px;
        }
        .vps-item {
            margin-bottom: 12px;
            padding: 12px 15px;
            border-radius: 8px;
            position: relative;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            border-left: 4px solid #4285F4;
            background-color: rgba(240, 240, 240, 0.3);
        }
        .vps-item:last-child {
            margin-bottom: 0;
        }
        .vps-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .vps-item-expired {
            border-left: 4px solid #EA4335;
            background-color: rgba(234, 67, 53, 0.08);
        }
        .vps-item-warning {
            border-left: 4px solid #FBBC05;
            background-color: rgba(251, 188, 5, 0.08);
        }
        .vps-item-notice {
            border-left: 4px solid #4285F4;
            background-color: rgba(66, 133, 244, 0.08);
        }
        .vps-item-normal {
            border-left: 4px solid #34A853;
            background-color: rgba(52, 168, 83, 0.08);
        }
        .vps-item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            font-size: 15px;
        }
        .vps-item-date {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
        }
        .vps-item-status {
            font-size: 13px;
            font-weight: 500;
        }
        .vps-status-expired {
            color: #EA4335;
        }
        .vps-status-warning {
            color: #FBBC05;
        }
        .vps-status-notice {
            color: #4285F4;
        }
        .vps-status-normal {
            color: #34A853;
        }
        .vps-item-renew {
            position: absolute;
            right: 12px;
            top: 12px;
            padding: 5px 10px;
            background-color: #4285F4;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        .vps-item-renew:hover {
            background-color: #3367D6;
            transform: scale(1.05);
        }
        #vps-reminder-buttons {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
        }
        #vps-reminder-renew-all, #vps-reminder-settings, #vps-reminder-dismiss {
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
            font-size: 13px;
        }
        #vps-reminder-renew-all {
            background-color: #4285F4;
            color: white;
        }
        #vps-reminder-renew-all:hover {
            background-color: #3367D6;
        }
        #vps-reminder-settings {
            background-color: rgba(240, 240, 240, 0.5);
            color: #333;
        }
        #vps-reminder-settings:hover {
            background-color: rgba(220, 220, 220, 0.7);
        }
        #vps-reminder-dismiss {
            background-color: rgba(240, 240, 240, 0.5);
            color: #333;
            flex: 1;
            margin-top: 10px;
            text-align: center;
        }
        #vps-reminder-dismiss:hover {
            background-color: rgba(220, 220, 220, 0.7);
        }
        #vps-settings-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            background-color: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 25px;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: none;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
        }
        #vps-settings-container::-webkit-scrollbar {
            width: 6px;
        }
        #vps-settings-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        #vps-settings-container::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 6px;
        }
        #vps-settings-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            color: #333;
        }
        .vps-settings-item {
            margin-bottom: 20px;
            position: relative;
            padding: 15px;
            border-radius: 8px;
            background-color: rgba(240, 240, 240, 0.3);
            transition: all 0.2s ease;
        }
        .vps-settings-item:hover {
            background-color: rgba(240, 240, 240, 0.5);
        }
        .vps-settings-item label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #444;
        }
        .vps-settings-item input, .vps-settings-item select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 6px;
            font-family: inherit;
            transition: all 0.2s ease;
            background-color: white;
        }
        .vps-settings-item input:focus, .vps-settings-item select:focus {
            outline: none;
            border-color: #4285F4;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
        }
        .vps-delete-btn {
            position: absolute;
            right: 15px;
            top: 15px;
            background-color: #EA4335;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }
        .vps-delete-btn:hover {
            background-color: #D62516;
        }
        #vps-settings-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        #vps-settings-save {
            padding: 10px 18px;
            background-color: #4285F4;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        #vps-settings-save:hover {
            background-color: #3367D6;
        }
        #vps-settings-cancel {
            padding: 10px 18px;
            background-color: rgba(240, 240, 240, 0.5);
            color: #333;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        #vps-settings-cancel:hover {
            background-color: rgba(220, 220, 220, 0.7);
        }
        #vps-add-new {
            padding: 10px 18px;
            background-color: #34A853;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 15px;
            width: 100%;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #vps-add-new:hover {
            background-color: #2E8B57;
        }
        #vps-add-new:before {
            content: '+';
            margin-right: 8px;
            font-size: 16px;
            font-weight: bold;
        }
    `);

    // 默认VPS数据
    const defaultVpsData = [
        { id: 1, name: 'VPS 1', cycle: 3, nextDate: '', needRemind: false },
        { id: 2, name: 'VPS 2', cycle: 3, nextDate: '', needRemind: false },
        { id: 3, name: 'VPS 3', cycle: 3, nextDate: '', needRemind: false },
        { id: 4, name: 'VPS 4', cycle: 3, nextDate: '', needRemind: false },
        { id: 5, name: 'VPS 5', cycle: 30, nextDate: '', needRemind: false }
    ];

    // 获取VPS数据
    let vpsData = GM_getValue('vpsData', defaultVpsData);
    
    // 用于记录今天是否已经关闭过提醒
    let dismissedForToday = false;
    
    // 检查是否已经今天不再提醒
    function checkDismissedForToday() {
        const dismissedData = GM_getValue('dismissedForToday', null);
        if (dismissedData) {
            const today = formatDate(new Date());
            if (dismissedData.date === today) {
                dismissedForToday = true;
                return true;
            }
        }
        return false;
    }

    // 创建提醒容器
    function createReminderContainer() {
        const container = document.createElement('div');
        container.id = 'vps-reminder-container';
        
        const title = document.createElement('div');
        title.id = 'vps-reminder-title';
        title.textContent = 'VPS续期提醒';
        
        const content = document.createElement('div');
        content.id = 'vps-reminder-content';
        
        const buttons = document.createElement('div');
        buttons.id = 'vps-reminder-buttons';
        
        const renewAllButton = document.createElement('button');
        renewAllButton.id = 'vps-reminder-renew-all';
        renewAllButton.textContent = '全部已续期';
        renewAllButton.addEventListener('click', handleRenewAll);
        
        const settingsButton = document.createElement('button');
        settingsButton.id = 'vps-reminder-settings';
        settingsButton.textContent = '设置';
        settingsButton.addEventListener('click', showSettings);
        
        const dismissButton = document.createElement('button');
        dismissButton.id = 'vps-reminder-dismiss';
        dismissButton.textContent = '今天不再提醒';
        dismissButton.addEventListener('click', dismissForToday);
        
        buttons.appendChild(renewAllButton);
        buttons.appendChild(settingsButton);
        buttons.appendChild(dismissButton);
        
        container.appendChild(title);
        container.appendChild(content);
        container.appendChild(buttons);
        
        document.body.appendChild(container);
    }

    // 创建设置容器
    function createSettingsContainer() {
        const container = document.createElement('div');
        container.id = 'vps-settings-container';
        
        const title = document.createElement('div');
        title.id = 'vps-settings-title';
        title.textContent = 'VPS提醒设置';
        
        container.appendChild(title);
        
        const settingsContent = document.createElement('div');
        settingsContent.id = 'vps-settings-content';
        container.appendChild(settingsContent);
        
        // 创建添加新VPS按钮
        const addNewButton = document.createElement('button');
        addNewButton.id = 'vps-add-new';
        addNewButton.textContent = '添加新VPS';
        addNewButton.addEventListener('click', addNewVps);
        container.appendChild(addNewButton);
        
        const buttons = document.createElement('div');
        buttons.id = 'vps-settings-buttons';
        
        const cancelButton = document.createElement('button');
        cancelButton.id = 'vps-settings-cancel';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            document.getElementById('vps-settings-container').style.display = 'none';
        });
        
        const saveButton = document.createElement('button');
        saveButton.id = 'vps-settings-save';
        saveButton.textContent = '保存';
        saveButton.addEventListener('click', saveSettings);
        
        buttons.appendChild(cancelButton);
        buttons.appendChild(saveButton);
        
        container.appendChild(buttons);
        
        document.body.appendChild(container);
        
        // 更新设置内容
        updateSettingsContent();
    }
    
    // 更新设置内容
    function updateSettingsContent() {
        const settingsContent = document.getElementById('vps-settings-content');
        settingsContent.innerHTML = '';
        
        // 为每个VPS创建设置项
        vpsData.forEach(vps => {
            const item = document.createElement('div');
            item.className = 'vps-settings-item';
            item.dataset.id = vps.id;
            
            // 删除按钮
            if (vpsData.length > 1) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'vps-delete-btn';
                deleteBtn.textContent = '删除';
                deleteBtn.addEventListener('click', function() {
                    deleteVps(vps.id);
                });
                item.appendChild(deleteBtn);
            }
            
            const nameLabel = document.createElement('label');
            nameLabel.textContent = `${vps.name} 名称`;
            
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = `vps-name-${vps.id}`;
            nameInput.value = vps.name;
            
            const cycleLabel = document.createElement('label');
            cycleLabel.textContent = `${vps.name} 提醒周期(天)`;
            
            const cycleInput = document.createElement('input');
            cycleInput.type = 'number';
            cycleInput.id = `vps-cycle-${vps.id}`;
            cycleInput.value = vps.cycle;
            cycleInput.min = 1;
            
            const dateLabel = document.createElement('label');
            dateLabel.textContent = `${vps.name} 下次提醒日期`;
            
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.id = `vps-date-${vps.id}`;
            dateInput.value = vps.nextDate || formatDate(new Date());
            
            item.appendChild(nameLabel);
            item.appendChild(nameInput);
            item.appendChild(cycleLabel);
            item.appendChild(cycleInput);
            item.appendChild(dateLabel);
            item.appendChild(dateInput);
            
            settingsContent.appendChild(item);
        });
    }
    
    // 添加新VPS
    function addNewVps() {
        // 生成新ID
        let maxId = 0;
        vpsData.forEach(vps => {
            if (vps.id > maxId) maxId = vps.id;
        });
        
        // 添加新VPS数据
        const newVps = {
            id: maxId + 1,
            name: `VPS ${maxId + 1}`,
            cycle: 3,
            nextDate: formatDate(new Date()),
            needRemind: false
        };
        
        vpsData.push(newVps);
        
        // 更新设置内容
        updateSettingsContent();
    }
    
    // 删除VPS
    function deleteVps(id) {
        vpsData = vpsData.filter(vps => vps.id !== id);
        updateSettingsContent();
    }

    // 显示设置界面
    function showSettings() {
        document.getElementById('vps-settings-container').style.display = 'block';
    }

    // 保存设置
    function saveSettings() {
        const newVpsData = [];
        
        // 获取所有设置项
        const settingsItems = document.querySelectorAll('.vps-settings-item');
        
        settingsItems.forEach(item => {
            const id = parseInt(item.dataset.id);
            const name = document.getElementById(`vps-name-${id}`).value;
            const cycle = parseInt(document.getElementById(`vps-cycle-${id}`).value);
            const nextDate = document.getElementById(`vps-date-${id}`).value;
            
            // 查找原始数据中的needRemind状态
            const originalVps = vpsData.find(vps => vps.id === id);
            const needRemind = originalVps ? originalVps.needRemind : false;
            
            newVpsData.push({
                id,
                name,
                cycle,
                nextDate,
                needRemind
            });
        });
        
        vpsData = newVpsData;
        GM_setValue('vpsData', vpsData);
        document.getElementById('vps-settings-container').style.display = 'none';
        
        // 重新检查提醒
        checkReminders();
    }

    // 格式化日期为YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 解析日期字符串为Date对象
    function parseDate(dateString) {
        return new Date(dateString);
    }

    // 计算两个日期之间的天数差
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
        const diffTime = Math.abs(date2 - date1);
        return Math.floor(diffTime / oneDay);
    }

    // 处理"今天不再提醒"按钮点击
    function dismissForToday() {
        dismissedForToday = true;
        
        // 保存当前日期和状态到存储中
        const today = formatDate(new Date());
        GM_setValue('dismissedForToday', {
            date: today,
            dismissed: true
        });
        
        document.getElementById('vps-reminder-container').style.display = 'none';
    }

    // 检查是否需要提醒
    function checkReminders() {
        // 如果今天已经关闭过提醒，则不再显示
        if (dismissedForToday) {
            return;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let hasRemindersNeedAttention = false; // 是否有VPS需要立即提醒
        let allVpsWithInfo = []; // 所有VPS及其状态信息
        
        // 为所有VPS计算到期状态和剩余天数
        vpsData.forEach(vps => {
            if (!vps.nextDate) {
                vps.nextDate = formatDate(new Date());
            }
            
            const nextDate = parseDate(vps.nextDate);
            nextDate.setHours(0, 0, 0, 0);
            
            // 计算距离到期日期的天数
            const diff = nextDate - today;
            const daysUntil = Math.ceil(diff / (1000 * 60 * 60 * 24));
            
            // 标记需要提醒的VPS
            if (daysUntil <= 0 || daysUntil === 1 || daysUntil === 2) {
                hasRemindersNeedAttention = true;
                vps.needRemind = true;
            } else {
                vps.needRemind = false;
            }
            
            // 将VPS信息和剩余天数添加到数组
            allVpsWithInfo.push({
                ...vps,
                daysUntil: daysUntil
            });
        });
        
        // 按剩余天数排序（升序）
        allVpsWithInfo.sort((a, b) => a.daysUntil - b.daysUntil);
        
        // 如果有需要提醒的VPS，显示所有VPS的信息
        if (hasRemindersNeedAttention) {
            let reminderContent = '';
            
            // 添加所有VPS信息，按剩余天数排序
            allVpsWithInfo.forEach(vps => {
                let statusClass = '';
                let statusText = '';
                let itemClass = '';
                
                // 根据剩余天数设置状态和样式
                if (vps.daysUntil <= 0) {
                    statusClass = 'vps-status-expired';
                    statusText = '即将过期，需要续期';
                    itemClass = 'vps-item-expired';
                } else if (vps.daysUntil === 1) {
                    statusClass = 'vps-status-warning';
                    statusText = '明天到期，需要续期';
                    itemClass = 'vps-item-warning';
                } else if (vps.daysUntil === 2) {
                    statusClass = 'vps-status-notice';
                    statusText = '后天到期，需要续期';
                    itemClass = 'vps-item-notice';
                } else {
                    statusClass = 'vps-status-normal';
                    statusText = `还有 ${vps.daysUntil} 天到期`;
                    itemClass = 'vps-item-normal';
                }
                
                // 根据是否需要提醒设置不透明度
                const opacity = vps.needRemind ? '1' : '0.7';
                
                reminderContent += `<div class="vps-item ${itemClass}" style="opacity: ${opacity}">
                    <div class="vps-item-name">${vps.name}</div>
                    <div class="vps-item-date">下次续期日期: ${vps.nextDate}</div>
                    <div class="vps-item-status ${statusClass}">${statusText}</div>
                    ${vps.needRemind ? `<button class="vps-item-renew" data-id="${vps.id}">我已续期</button>` : ''}
                </div>`;
            });
            
            document.getElementById('vps-reminder-content').innerHTML = reminderContent;
            document.getElementById('vps-reminder-container').style.display = 'block';
            
            // 为每个单独的续期按钮添加事件
            document.querySelectorAll('.vps-item-renew').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleRenewSingle(parseInt(this.dataset.id));
                });
            });
        }
        
        // 更新存储的数据
        GM_setValue('vpsData', vpsData);
    }

    // 处理单个VPS续期
    function handleRenewSingle(id) {
        vpsData.forEach(vps => {
            if (vps.id === id && vps.needRemind) {
                // 使用原到期日期计算新的提醒日期，而不是当前日期
                const originalDate = parseDate(vps.nextDate);
                const newDate = new Date(originalDate);
                newDate.setDate(originalDate.getDate() + vps.cycle);
                vps.nextDate = formatDate(newDate);
                vps.needRemind = false;
            }
        });
        
        // 更新存储的数据
        GM_setValue('vpsData', vpsData);
        
        // 重新检查是否还有需要提醒的VPS
        checkReminders();
    }

    // 处理全部已续期按钮点击
    function handleRenewAll() {
        vpsData.forEach(vps => {
            if (vps.needRemind) {
                // 使用原到期日期计算新的提醒日期，而不是当前日期
                const originalDate = parseDate(vps.nextDate);
                const newDate = new Date(originalDate);
                newDate.setDate(originalDate.getDate() + vps.cycle);
                vps.nextDate = formatDate(newDate);
                vps.needRemind = false;
            }
        });
        
        // 更新存储的数据
        GM_setValue('vpsData', vpsData);
        
        // 隐藏提醒
        document.getElementById('vps-reminder-container').style.display = 'none';
    }

    // 初始化
    function init() {
        createReminderContainer();
        createSettingsContainer();
        
        // 检查是否已设置"今天不再提醒"
        checkDismissedForToday();
        
        // 如果是首次使用，显示设置界面
        if (!GM_getValue('initialized', false)) {
            showSettings();
            GM_setValue('initialized', true);
        } else {
            // 检查是否需要提醒
            checkReminders();
        }
    }

    // 等待页面加载完成后初始化
    window.addEventListener('load', init);
})(); 
