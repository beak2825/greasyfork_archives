// ==UserScript==
// @name         ChatGPT模型调用记录
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  2024-9-18更新，记录并显示ChatGPT各模型的调用情况，清除/显示/编辑/下载/指定日期的调用情况。精确到每个时辰各模型调用情况。
// @author       狐狸的狐狸画
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501092/ChatGPT%E6%A8%A1%E5%9E%8B%E8%B0%83%E7%94%A8%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/501092/ChatGPT%E6%A8%A1%E5%9E%8B%E8%B0%83%E7%94%A8%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const modelVisibilityKey = 'model_visibility'; // 用于存储复选框状态的键
    const modelDisplayOrderKey = 'model_display_order'; // 用于存储勾选顺序的键
    const modelCountKey = 'model_counts'; // 存储全局计数的键
    const placeholderSymbol = '✨'; // 当所有模型未选中时显示的符号
    let selectedDate = new Date().toISOString().split('T')[0]; // 默认选中今天
    let savedFilePath = ''; // 保存文件的路径
    let displayOrder = JSON.parse(localStorage.getItem(modelDisplayOrderKey) || '[]'); // 从 localStorage 加载显示顺序

    // 拦截 fetch 请求以监控模型调用
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (url.includes("/backend-api/conversation") && options && options.method === "POST") {
            try {
                const body = JSON.parse(options.body);
                if (body.model) {
                    updateModelCount(body.model); // 更新模型调用计数
                }
            } catch (e) {
                console.error('解析请求体失败:', e);
            }
        }
        return originalFetch.apply(this, arguments);
    };

    // 更新模型调用计数
    function updateModelCount(model) {
        const counts = JSON.parse(localStorage.getItem(modelCountKey) || '{}');
        counts[model] = (counts[model] || 0) + 1;
        localStorage.setItem(modelCountKey, JSON.stringify(counts));
        updateHourlyCounts(model);
        displayCounts();
    }

    // 更新每小时计数
    function updateHourlyCounts(model) {
        const date = new Date();
        const hours = date.getHours();
        const dayKey = date.toISOString().split('T')[0];
        const hourlyCountKey = `hourly_counts_${dayKey}`;
        const hourlyCounts = JSON.parse(localStorage.getItem(hourlyCountKey) || '{}');

        if (!hourlyCounts[hours]) {
            hourlyCounts[hours] = {};
        }

        hourlyCounts[hours][model] = (hourlyCounts[hours][model] || 0) + 1;
        localStorage.setItem(hourlyCountKey, JSON.stringify(hourlyCounts));
    }

    // 获取某一天每个模型的调用次数
    function getCountsForDate(date) {
        const hourlyCountKey = `hourly_counts_${date}`;
        const hourlyCounts = JSON.parse(localStorage.getItem(hourlyCountKey) || '{}');

        const countsByModel = {};
        for (let hour in hourlyCounts) {
            for (let model in hourlyCounts[hour]) {
                countsByModel[model] = (countsByModel[model] || 0) + hourlyCounts[hour][model];
            }
        }
        return { hourlyCounts, countsByModel };
    }

    // 保存选中日期的数据到文件并下载
    function saveSelectedDataToFile(selectedDates) {
        const allData = {};

        // 遍历选中的日期
        selectedDates.forEach(date => {
            const hourlyCountKey = `hourly_counts_${date}`;
            const hourlyCounts = JSON.parse(localStorage.getItem(hourlyCountKey) || '{}');
            allData[date] = hourlyCounts;
        });

        // 创建合并后的文件
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected_model_usage_data.json`; // 合并后的文件名
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    // 显示日期选择弹窗并处理下载操作
    function showDownloadDateSelection() {
        // 获取所有存储在 localStorage 中的日期
        const availableDates = Object.keys(localStorage).filter(key => key.startsWith('hourly_counts_')).map(key => key.replace('hourly_counts_', ''));

        // 构建弹窗内容
        let popup = document.createElement('div');
        popup.id = 'date-selection-popup';
        Object.assign(popup.style, {
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            backgroundColor: '#fff',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            zIndex: '1002',
            width: '300px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
        });

        let popupContent = `<strong>选择要下载的日期：</strong><br><br>`;
        availableDates.forEach(date => {
            const checked = (date === selectedDate) ? 'checked' : ''; // 默认勾选当天
            popupContent += `
                <div style="margin-bottom: 8px;">
                    <label>
                        <input type="checkbox" class="date-checkbox" data-date="${date}" ${checked}> ${date}
                    </label>
                </div>`;
        });

        popupContent += `
            <div style="margin-top: 15px;">
                <button id="download-selected-data-button" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #4CAF50; color: white; cursor: pointer;">下载所选日期数据</button>
                <button id="cancel-download-button" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #f44336; color: white; cursor: pointer; margin-left: 10px;">取消</button>
            </div>
        `;
        popup.innerHTML = popupContent;
        document.body.appendChild(popup);

        // 添加下载按钮事件处理器
        document.getElementById('download-selected-data-button').onclick = () => {
            const selectedDates = Array.from(document.querySelectorAll('.date-checkbox:checked')).map(checkbox => checkbox.dataset.date);
            if (selectedDates.length > 0) {
                saveSelectedDataToFile(selectedDates);
                document.body.removeChild(popup); // 关闭弹窗
            } else {
                alert('请选择至少一个日期下载数据！');
            }
        };

        // 添加取消按钮事件处理器
        document.getElementById('cancel-download-button').onclick = () => {
            document.body.removeChild(popup); // 关闭弹窗
        };
    }

    // 显示编辑数据面板（全局 + 选中日期）
    function showEditDataPanel() {
        const hourlyCountKey = `hourly_counts_${selectedDate}`;
        const dateData = JSON.parse(localStorage.getItem(hourlyCountKey) || '{}'); // 选中日期数据
        const globalData = JSON.parse(localStorage.getItem(modelCountKey) || '{}'); // 全局数据

        const combinedData = {
            globalCounts: globalData,
            dateCounts: dateData
        };

        const jsonData = JSON.stringify(combinedData, null, 2);

        // 创建编辑面板
        let panel = document.createElement('div');
        panel.id = 'edit-data-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            backgroundColor: '#fff',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            zIndex: '1003',
            width: '500px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
        });

        let panelContent = `
            <strong>编辑 ${selectedDate} 和全局计数的数据：</strong><br><br>
            <textarea id="edit-json-data" style="width: 100%; height: 250px; padding: 10px; font-family: monospace;">${jsonData}</textarea><br><br>
            <button id="save-data-button" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #4CAF50; color: white; cursor: pointer;">保存</button>
            <button id="cancel-edit-button" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #f44336; color: white; cursor: pointer; margin-left: 10px;">取消</button>
        `;
        panel.innerHTML = panelContent;
        document.body.appendChild(panel);

        // 保存数据按钮事件
        document.getElementById('save-data-button').onclick = () => {
            try {
                const editedData = JSON.parse(document.getElementById('edit-json-data').value);

                // 分离全局数据和日期数据
                const newGlobalData = editedData.globalCounts;
                const newDateData = editedData.dateCounts;

                // 保存全局数据
                localStorage.setItem(modelCountKey, JSON.stringify(newGlobalData));
                // 保存选中日期的数据
                localStorage.setItem(hourlyCountKey, JSON.stringify(newDateData));

                alert('数据已保存！');
                document.body.removeChild(panel); // 关闭面板
            } catch (error) {
                alert('JSON 格式错误，请检查并重新输入！');
            }
        };

        // 取消按钮事件
        document.getElementById('cancel-edit-button').onclick = () => {
            document.body.removeChild(panel); // 关闭面板
        };
    }

    // 显示计数，按勾选顺序排列
    function displayCounts() {
        const counts = JSON.parse(localStorage.getItem(modelCountKey) || '{}');
        const visibility = JSON.parse(localStorage.getItem(modelVisibilityKey) || '{}');

        let displayText = '';
        let anyVisible = false;

        // 按照 localStorage 中保存的顺序显示模型
        for (let model of displayOrder) {
            if (visibility[model] !== false && counts[model]) { // 仅显示勾选且有计数的模型
                displayText += `<div style="margin-right: 10px;">${model}: ${counts[model]}</div>`;
                anyVisible = true;
            }
        }

        if (!anyVisible) {
            displayText = `<div style="font-size: 24px; color: rgba(66,66,66,1);">${placeholderSymbol}</div>`; // 显示符号
        }

        let displayDiv = document.getElementById('model-count-display');
        if (!displayDiv) {
            displayDiv = document.createElement('div');
            displayDiv.id = 'model-count-display';
            Object.assign(displayDiv.style, {
                display: 'flex',
                position: 'fixed',
                top: '5px',
                left: '500px',
                backgroundColor: 'rgba(0,0,0,0)',
                color: 'rgba(66,66,66,1)',
                padding: '10px',
                borderRadius: '5px',
                zIndex: '1000',
                fontSize: '14px',
                fontWeight: 'bold',
            });

            document.body.appendChild(displayDiv);
        }
        displayDiv.innerHTML = displayText;
    }

    // 清除选中日期的模型数据，并添加提示
    function clearData() {
        const date = selectedDate;
        const hourlyCountKey = `hourly_counts_${date}`;

        // 显示二次确认提示
        if (confirm(`你确定要清除 ${date} 的所有模型数据吗？此操作不可恢复！`)) {
            localStorage.removeItem(hourlyCountKey); // 仅清除选中的日期的数据
            displayCounts(); // 刷新显示
        }
    }

    // 更新复选框状态并保存顺序到 localStorage
    function updateCheckboxState(model, isChecked) {
        const visibility = JSON.parse(localStorage.getItem(modelVisibilityKey) || '{}');
        visibility[model] = isChecked;
        localStorage.setItem(modelVisibilityKey, JSON.stringify(visibility));

        // 按勾选顺序管理显示顺序，并存储到 localStorage
        if (isChecked) {
            if (!displayOrder.includes(model)) {
                displayOrder.push(model);
                localStorage.setItem(modelDisplayOrderKey, JSON.stringify(displayOrder));
            }
        } else {
            const index = displayOrder.indexOf(model);
            if (index > -1) {
                displayOrder.splice(index, 1);
                localStorage.setItem(modelDisplayOrderKey, JSON.stringify(displayOrder));
            }
        }

        displayCounts(); // 刷新显示
    }

    // 显示右键菜单，包含日期选择、清除数据、下载数据、编辑数据功能
    function showTodayCountsPanel(x, y) {
        const { hourlyCounts, countsByModel } = getCountsForDate(selectedDate);
        let panel = document.getElementById('today-counts-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'today-counts-panel';
            Object.assign(panel.style, {
                position: 'absolute',
                backgroundColor: '#fff',
                color: '#333',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                zIndex: '1001',
                fontSize: '13px',
                fontWeight: 'bold',
                maxHeight: '400px',
                overflowY: 'auto',
                width: '300px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
            });

            document.body.appendChild(panel);
        }

        let panelContent = `
        <div style="text-align: center; margin-bottom: 10px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100%;">
                <strong style="font-size: 16px; margin-right: 10px;">模型计数：</strong>
                <input type="date" id="date-picker" value="${selectedDate}"
                       style="padding: 6px 10px; font-size: 16px; border-radius: 5px; border: none; background-color: #FFFFFF; color: #000000; text-align: center; cursor: pointer; height: auto; line-height: 1;">
            </div>
        </div><br>`;

        for (let model in countsByModel) {
            const visibility = JSON.parse(localStorage.getItem(modelVisibilityKey) || '{}');
            const isChecked = visibility[model] !== false; // 默认勾选
            panelContent += `
                <div style="margin-bottom: 8px;">
                    <label>
                        <input type="checkbox" data-model="${model}" ${isChecked ? 'checked' : ''}> ${model}: ${countsByModel[model]}
                    </label>
                </div>`;
        }

        panelContent += `
            <hr>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <button id="clear-data-button" style="margin: 5px; padding: 10px 20px; width: 100%; border: none; border-radius: 5px; background-color: #f44336; color: white; cursor: pointer;">清除数据</button>
                <button id="download-data-button" style="margin: 5px; padding: 10px 20px; width: 100%; border: none; border-radius: 5px; background-color: #4CAF50; color: white; cursor: pointer;">下载数据</button>
                <button id="edit-data-button" style="margin: 5px; padding: 10px 20px; width: 100%; border: none; border-radius: 5px; background-color: #2196F3; color: white; cursor: pointer;">编辑数据</button>
            </div>`;
        panel.innerHTML = panelContent;

        // 清除选中日期数据，添加确认提示
        document.getElementById('clear-data-button').onclick = () => {
            clearData();
            panel.style.display = 'none';
        };

        document.getElementById('download-data-button').onclick = () => {
            showDownloadDateSelection(); // 弹出日期选择框
            panel.style.display = 'none';
        };

        // 显示编辑数据面板
        document.getElementById('edit-data-button').onclick = () => {
            showEditDataPanel();
            panel.style.display = 'none';
        };

        document.getElementById('date-picker').onchange = (e) => {
            selectedDate = e.target.value;
            showTodayCountsPanel(x, y); // 重新渲染菜单
        };

        // 添加复选框事件监听器
        panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.onchange = (e) => {
                const model = e.target.dataset.model;
                updateCheckboxState(model, e.target.checked);
            };
        });

        const displayDiv = document.getElementById('model-count-display');
        if (displayDiv) {
            const rect = displayDiv.getBoundingClientRect();
            panel.style.top = `${rect.bottom + window.scrollY + 10}px`;
            panel.style.left = `${rect.left + window.scrollX}px`;
        }

        panel.style.display = 'block';
    }

    // 右键点击事件
    window.addEventListener('contextmenu', (e) => {
        const displayDiv = document.getElementById('model-count-display');
        if (displayDiv && displayDiv.contains(e.target)) {
            e.preventDefault();
            showTodayCountsPanel(e.clientX, e.clientY);
        } else {
            const panel = document.getElementById('today-counts-panel');
            if (panel) {
                panel.style.display = 'none';
            }
        }
    });

    // 点击其他地方隐藏面板
    window.addEventListener('click', (e) => {
        const panel = document.getElementById('today-counts-panel');
        if (panel && !panel.contains(e.target)) {
            panel.style.display = 'none';
        }
    });

    displayCounts();
})();


