// ==UserScript==
// @name         体育馆自动预约
// @namespace    http://tampermonkey.net/
// @version      1.0.22
// @description  自动预约江苏大学体育馆场地
// @author       rxlxr
// @match        https://webvpn.ujs.edu.cn/http/77726476706e69737468656265737421f7ee4cd2323a7b1e7b0c9ce29b5b/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531333/%E4%BD%93%E8%82%B2%E9%A6%86%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/531333/%E4%BD%93%E8%82%B2%E9%A6%86%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.right = '10px';
    controlPanel.style.padding = '15px';
    controlPanel.style.backgroundColor = '#ffffff';
    controlPanel.style.border = '1px solid #ddd';
    controlPanel.style.borderRadius = '8px';
    controlPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    controlPanel.style.zIndex = '9999';
    controlPanel.style.width = '300px';

    // 添加场地优先级设置
    const priorityDiv = document.createElement('div');
    priorityDiv.style.marginBottom = '10px';
    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = '优先场地：';
    priorityLabel.style.display = 'block';
    priorityLabel.style.marginBottom = '5px';
    const prioritySelect = document.createElement('select');
    prioritySelect.style.width = '100%';
    prioritySelect.style.marginBottom = '10px';
    prioritySelect.style.padding = '5px';
    prioritySelect.style.borderRadius = '4px';
    prioritySelect.style.border = '1px solid #ddd';
    const areas = document.querySelectorAll('.office-time-item.area_');
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area.getAttribute('area-id');
        option.textContent = area.textContent.trim();
        prioritySelect.appendChild(option);
    });
    priorityDiv.appendChild(priorityLabel);
    priorityDiv.appendChild(prioritySelect);
    controlPanel.appendChild(priorityDiv);

    // 添加时段优先级设置
    const timeSlotPriorityDiv = document.createElement('div');
    timeSlotPriorityDiv.style.marginBottom = '10px';
    const timeSlotPriorityLabel = document.createElement('label');
    timeSlotPriorityLabel.textContent = '优先时段：';
    timeSlotPriorityLabel.style.display = 'block';
    timeSlotPriorityLabel.style.marginBottom = '5px';
    const timeSlotPrioritySelect = document.createElement('select');
    timeSlotPrioritySelect.style.width = '100%';
    timeSlotPrioritySelect.style.marginBottom = '10px';
    timeSlotPrioritySelect.style.padding = '5px';
    timeSlotPrioritySelect.style.borderRadius = '4px';
    timeSlotPrioritySelect.style.border = '1px solid #ddd';
    const timeSlots = document.querySelectorAll('.office-time-item.timeslot_:not(.disable)');
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.getAttribute('data-id');
        option.textContent = slot.textContent.trim();
        timeSlotPrioritySelect.appendChild(option);
    });
    timeSlotPriorityDiv.appendChild(timeSlotPriorityLabel);
    timeSlotPriorityDiv.appendChild(timeSlotPrioritySelect);
    controlPanel.appendChild(timeSlotPriorityDiv);

    // 添加标题
    const title = document.createElement('h3');
    title.textContent = '场地预约助手';
    title.style.margin = '0 0 10px 0';
    title.style.color = '#333';
    controlPanel.appendChild(title);

    // 添加状态显示区域
    const statusDiv = document.createElement('div');
    statusDiv.style.marginBottom = '10px';
    statusDiv.style.padding = '10px';
    statusDiv.style.backgroundColor = '#f5f5f5';
    statusDiv.style.borderRadius = '4px';
    statusDiv.style.fontSize = '14px';
    controlPanel.appendChild(statusDiv);

    // 添加进度条
    const progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.height = '4px';
    progressBar.style.backgroundColor = '#eee';
    progressBar.style.borderRadius = '2px';
    progressBar.style.marginBottom = '10px';
    const progressIndicator = document.createElement('div');
    progressIndicator.style.width = '0%';
    progressIndicator.style.height = '100%';
    progressIndicator.style.backgroundColor = '#4CAF50';
    progressIndicator.style.borderRadius = '2px';
    progressIndicator.style.transition = 'width 0.3s';
    progressBar.appendChild(progressIndicator);
    controlPanel.appendChild(progressBar);

    // 添加预约按钮
    const bookButton = document.createElement('button');
    bookButton.textContent = '开始预约';
    bookButton.style.backgroundColor = '#4CAF50';
    bookButton.style.color = 'white';
    bookButton.style.border = 'none';
    bookButton.style.padding = '8px 16px';
    bookButton.style.borderRadius = '4px';
    bookButton.style.cursor = 'pointer';
    bookButton.style.width = '100%';
    bookButton.style.fontSize = '14px';
    bookButton.onclick = startBooking;
    controlPanel.appendChild(bookButton);

    document.body.appendChild(controlPanel);

    let isBooking = false;

    function updateStatus(message, progress = 0) {
        statusDiv.textContent = message;
        progressIndicator.style.width = `${progress}%`;
    }

    function scheduleBooking() {
        main();
    }

    // 获取场地和时间段信息
    async function getVenueInfo() {
        try {
            // 从URL中获取item_id
            const urlParams = new URLSearchParams(window.location.search);
            const itemId = urlParams.get('item_id');
            if (!itemId) {
                throw new Error('无法从URL获取item_id');
            }

            // 获取选中的日期
            const selectedDate = document.querySelector('.office-time-item.time_.checked');
            if (!selectedDate) {
                throw new Error('请先选择预约日期');
            }
            const dateTime = selectedDate.getAttribute('data-id');

            const areas = document.querySelectorAll('.office-time-item.area_');
            const availableSlots = [];
            const priorityAreaId = prioritySelect.value;
            const priorityTimeSlotId = timeSlotPrioritySelect.value;

            // 遍历所有场地
            areas.forEach(area => {
                const areaId = area.getAttribute('area-id');
                const isChecked = area.classList.contains('checked');
                if (!isChecked) return;

                // 获取该场地下的所有时间段
                const areaTimeSlots = document.querySelectorAll(`.office-time-item.timeslot_[area-id="${areaId}"]:not(.disable):not(.booked):not(.past)`);
                
                areaTimeSlots.forEach(slot => {
                    // 检查时间段是否可用
                    if (slot.classList.contains('disable') || 
                        slot.classList.contains('booked') || 
                        slot.classList.contains('past')) {
                        return;
                    }

                    const slotId = slot.getAttribute('data-id');
                    const isPriorityArea = areaId === priorityAreaId;
                    const isPriorityTimeSlot = slotId === priorityTimeSlotId;

                    availableSlots.push({
                        areaId: areaId,
                        dataId: slotId,
                        time: slot.textContent.trim(),
                        itemId: itemId,
                        dateTime: dateTime,
                        isPriority: isPriorityTimeSlot,
                        isPriorityArea: isPriorityArea,
                        // 添加优先级分数用于排序
                        priorityScore: (isPriorityArea ? 2 : 0) + (isPriorityTimeSlot ? 1 : 0)
                    });
                });
            });

            // 根据优先级分数排序
            availableSlots.sort((a, b) => b.priorityScore - a.priorityScore);

            // 对availableSlots进行排序，优先级：优先场地的优先时段 > 其他场地的优先时段 > 优先场地的其他时段 > 其他场地的其他时段
            availableSlots.sort((a, b) => {
                if (a.isPriority && a.isPriorityArea && (!b.isPriority || !b.isPriorityArea)) return -1;
                if (b.isPriority && b.isPriorityArea && (!a.isPriority || !a.isPriorityArea)) return 1;
                if (a.isPriority && !a.isPriorityArea && !b.isPriority) return -1;
                if (b.isPriority && !b.isPriorityArea && !a.isPriority) return 1;
                if (a.isPriorityArea && !b.isPriorityArea) return -1;
                if (b.isPriorityArea && !a.isPriorityArea) return 1;
                return 0;
            });
            
            return availableSlots;
        } catch (error) {
            console.error('获取场地信息失败:', error);
            updateStatus('获取场地信息失败');
            return [];
        }
    }

    // 发送预约请求
    async function sendBookingRequest(slot) {
        try {
            const data = {
                data_id: slot.dataId,
                item_id: slot.itemId,
                area_id: slot.areaId,
                date_time: slot.dateTime
            };
            
            const response = await fetch('/index.php/index/item/check.html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: new URLSearchParams(data)
            });

            const result = await response.json();
            if (result.code === '1') {
                updateStatus(`预约成功：${result.msg}`);
                return true;
            } else if (result.code === '2') {
                updateStatus(`重复预约：${result.msg}，订单号：${result.order_num}`);
                return false;
            } else {
                updateStatus(`预约失败：${result.msg}`);
                return false;
            }
        } catch (error) {
            console.error('发送预约请求失败:', error);
            updateStatus('发送预约请求失败');
            return false;
        }
    }

    // 主要逻辑
    async function main() {
        if (!isBooking) return;

        updateStatus('正在检查可用场地和时间段...', 20);
        const availableSlots = await getVenueInfo();

        if (availableSlots.length === 0) {
            updateStatus('未找到任何可用时间段，请刷新页面重试', 0);
            isBooking = false;
            bookButton.textContent = '开始预约';
            bookButton.style.backgroundColor = '#4CAF50';
            return;
        }

        updateStatus('发现可用时间段，正在尝试预约...', 40);
        let foundAvailable = false;

        for (const slot of availableSlots) {
            if (!isBooking) break;

            updateStatus(`正在预约 ${slot.time} 的场地...`, 60);
            const success = await sendBookingRequest(slot);
            if (success) {
                updateStatus('预约成功！', 100);
                isBooking = false;
                bookButton.textContent = '开始预约';
                bookButton.style.backgroundColor = '#4CAF50';
                foundAvailable = true;
                break;
            }
        }

        if (!foundAvailable && isBooking) {
            updateStatus('暂无可用时间段，继续查询中...', 40);
            setTimeout(main, 500); // 每秒检查一次，提高抢场地成功率
        }
    }

    // 开始预约函数
    function startBooking() {
        if (isBooking) {
            isBooking = false;
            bookButton.textContent = '开始预约';
            bookButton.style.backgroundColor = '#4CAF50';
            updateStatus('已停止预约', 0);
        } else {
            isBooking = true;
            bookButton.textContent = '停止预约';
            bookButton.style.backgroundColor = '#f44336';
            updateStatus('开始预约流程...', 10);
            scheduleBooking();
        }
    }
})();
