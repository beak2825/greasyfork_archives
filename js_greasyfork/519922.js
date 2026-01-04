// ==UserScript==
// @name 天使之路
// @version 1.1.11
// @description 下注助手，增加超时检查功能
// @author veip007
// @license LGPL-2.0-or-later
// @match http*://*/htm_data/*/23/*
// @match http*://*/htm_mob/*/23/*
// @match http*://*/thread0806.php?fid=*
// @grant none
// @namespace https://greasyfork.org/users/13363
// @downloadURL https://update.greasyfork.org/scripts/519922/%E5%A4%A9%E4%BD%BF%E4%B9%8B%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/519922/%E5%A4%A9%E4%BD%BF%E4%B9%8B%E8%B7%AF.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 新增：处理下注截止时间
    function processDeadlines() {
        const regex = /下注截止时间：(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/g;
        const textContent = document.body.textContent;
        const deadlines = [];
        let match;
        while ((match = regex.exec(textContent)) !== null) {
            const deadlineStr = match[1];
            const deadline = new Date(deadlineStr.replace(' ', 'T') + ':00');
            deadline.setMinutes(deadline.getMinutes() + 4); // 加4分钟缓冲
            deadlines.push(deadline);
        }
        return deadlines;
    }

    // 新增：检查是否超时
    function checkTimeout(deadlines) {
        const now = new Date();
        return deadlines.some(d => now > d);
    }

    // 创建并添加按钮到页面左下角
    function createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '10px';
        buttonContainer.style.left = '10px';
        buttonContainer.style.zIndex = '999';
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '设置';
        const randomBtn = document.createElement('button');
        randomBtn.textContent = '随机';
        const highBtn = document.createElement('button');
        highBtn.textContent = '高赔';
        const lowBtn = document.createElement('button');
        lowBtn.textContent = '低赔';
        const extractBtn = document.createElement('button');
        extractBtn.textContent = '显示提取内容';
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制';
        extractBtn.style.display = 'none';
        buttonContainer.appendChild(settingsBtn);
        buttonContainer.appendChild(randomBtn);
        buttonContainer.appendChild(highBtn);
        buttonContainer.appendChild(lowBtn);
        buttonContainer.appendChild(extractBtn);
        buttonContainer.appendChild(copyBtn);
        document.body.appendChild(buttonContainer);
        return {
            settingsBtn,
            randomBtn,
            highBtn,
            lowBtn,
            extractBtn,
            copyBtn
        };
    }

    // 提取页面中楼主发布的表格信息（通用函数，处理不同页面结构）
    function extractTableInfo() {
        const postContent = document.querySelector('.tpc_content');
        if (!postContent) {
            console.error('未找到楼主发布的内容');
            return;
        }
        const table = postContent.querySelector('table');
        if (!table) {
            console.error('未找到表格元素');
            return;
        }
        const rows = table.querySelectorAll('tr');
        const headerRow = rows[0];
        const headerCells = headerRow.querySelectorAll('td');
        const hasDrawColumn = Array.from(headerCells).some(cell => cell.textContent.includes('平局'));
        const dataRows = Array.from(rows).slice(1);
        const tableData = [];
        dataRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            if (hasDrawColumn) {
                rowData.push(cells[1].textContent.trim(), cells[2].textContent.trim(), cells[3].textContent.trim());
            } else {
                rowData.push(cells[1].textContent.trim(), cells[3].textContent.trim());
            }
            tableData.push(rowData);
        });
        console.log('提取的表格数据:', tableData);
        return tableData;
    }

    // 根据赔率比较获取对应结果（高赔、低赔），赔率相同时随机返回，考虑第三列平局情况参与计算
    function getResultByOdds(tableData, isHighOdds) {
        const result = [];
        tableData.forEach(data => {
            const homeOdds = parseFloat(data[0].match(/\[([\d.]+)\]/)[1]);
            const awayOdds = parseFloat(data[1].match(/\[([\d.]+)\]/)[1]);
            const drawOdds = 1;
            if (homeOdds * drawOdds > awayOdds * drawOdds) {
                result.push(isHighOdds ? data[0] : data[1]);
            } else if (homeOdds * drawOdds < awayOdds * drawOdds) {
                result.push(isHighOdds ? data[1] : data[0]);
            } else {
                result.push(Math.random() < 0.5 ? data[0] : data[1]);
            }
        });
        return result;
    }

    // 生成随机选择的结果（修改为随机选择多组不同队伍，处理多页面数据）
    function getRandomResult(tableData) {
        const result = [];
        const numResultsNeeded = tableData.length;
        for (let i = 0; i < numResultsNeeded; i++) {
            const data = tableData[i];
            const randomSelection = Math.random() < 0.5 ? 0 : 1;
            result.push(data[randomSelection]);
        }
        return result;
    }

    // 显示输出结果到左上角，点击新按钮时清除上一次结果
    function displayResult(result, prefix, betPoints) {
        const existingResultDiv = document.querySelector('.result-display');
        if (existingResultDiv) {
            existingResultDiv.remove();
        }
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-display';
        resultDiv.style.position = 'fixed';
        resultDiv.style.top = '10px';
        resultDiv.style.left = '10px';
        resultDiv.style.zIndex = '999';
        resultDiv.style.backgroundColor = 'white';
        resultDiv.style.padding = '20px';
        resultDiv.style.border = '1px solid gray';
        let output = '';
        if (prefix) {
            output += `${prefix}<br>`;
        }
        for (let i = 0; i < result.length; i++) {
            output += `${i + 1}.下注球隊：${result[i]}<br>`;
        }
        output += `下注点数：${betPoints}`;
        resultDiv.innerHTML = output;
        document.body.appendChild(resultDiv);
        return resultDiv;
    }

    // 创建设置弹窗
    function createSettingsPopup() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.border = '1px solid gray';
        popup.style.zIndex = '9999';
        const prefixCheckbox = document.createElement('input');
        prefixCheckbox.type = 'checkbox';
        const prefixLabel = document.createElement('label');
        prefixLabel.textContent = '启用前缀';
        const prefixInput = document.createElement('input');
        prefixInput.value = '队名：';
        const betPointsCheckbox = document.createElement('input');
        betPointsCheckbox.type = 'checkbox';
        betPointsCheckbox.checked = true; // 设置默认勾选状态
        const betPointsLabel = document.createElement('label');
        betPointsLabel.textContent = '启用下注点数';
        const betPointsInput = document.createElement('input');
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        popup.appendChild(prefixCheckbox);
        popup.appendChild(prefixLabel);
        popup.appendChild(prefixInput);
        popup.appendChild(document.createElement('br'));
        popup.appendChild(betPointsCheckbox);
        popup.appendChild(betPointsLabel);
        popup.appendChild(betPointsInput);
        popup.appendChild(document.createElement('br'));
        popup.appendChild(saveBtn);
        popup.appendChild(closeBtn);
        closeBtn.addEventListener('click', () => {
            popup.remove();
            settingsPopup = null;
        });
        return {
            popup,
            prefixCheckbox,
            prefixInput,
            betPointsCheckbox,
            betPointsInput,
            saveBtn,
            closeBtn
        };
    }

    // 从本地存储读取设置参数
    function loadSettings() {
        const savedSettings = localStorage.getItem('scriptSettings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
        return { prefix: '队名：无码大爷威武霸气', betPoints: '40', prefixEnabled: false, betPointsEnabled: true };
    }

    // 保存设置参数到本地存储
    function saveSettings(prefix, betPoints, prefixEnabled, betPointsEnabled) {
        const settings = { prefix, betPoints, prefixEnabled, betPointsEnabled };
        localStorage.setItem('scriptSettings', JSON.stringify(settings));
    }

    // 初始化
    let settings = loadSettings();
    let settingsPopup;
    const {
        settingsBtn,
        highBtn,
        lowBtn,
        extractBtn,
        copyBtn,
        randomBtn
    } = createButtons();

    // 新增：设置按钮事件
    settingsBtn.addEventListener('click', () => {
        if (settingsPopup) {
            settingsPopup.popup.remove();
            settingsPopup = null;
        }
        const { popup, prefixCheckbox, prefixInput, betPointsCheckbox, betPointsInput, saveBtn, closeBtn } = createSettingsPopup();
        settingsPopup = {
            popup,
            prefixCheckbox,
            prefixInput,
            betPointsCheckbox,
            betPointsInput,
            saveBtn,
            closeBtn
        };

        // 初始化输入框
        prefixInput.value = settings.prefix;
        betPointsInput.value = settings.betPoints;
        prefixCheckbox.checked = settings.prefixEnabled;
        betPointsCheckbox.checked = settings.betPointsEnabled;

        // 保存按钮事件
        saveBtn.addEventListener('click', () => {
            const newPrefix = prefixInput.value;
            const newBetPoints = betPointsInput.value;
            const newPrefixEnabled = prefixCheckbox.checked;
            const newBetPointsEnabled = betPointsCheckbox.checked;

            saveSettings(newPrefix, newBetPoints, newPrefixEnabled, newBetPointsEnabled);
            settings = loadSettings(); // 更新全局设置
            popup.remove();
            settingsPopup = null;
        });

        document.body.appendChild(popup);
    });

    // 新增：通用超时检查函数
    function checkAndExecute(callback) {
        const deadlines = processDeadlines();
        if (checkTimeout(deadlines)) {
            alert('当前已超时，无法下注');
            return false;
        }
        callback();
        return true;
    }

    // 修改随机按钮事件
    randomBtn.addEventListener('click', () => {
        if (!checkAndExecute(() => {
            const tableData = extractTableInfo();
            if (tableData) {
                const result = getRandomResult(tableData);
                const resultDiv = displayResult(result, settings.prefixEnabled ? settings.prefix : '', settings.betPointsEnabled ? settings.betPoints : '');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(resultDiv.innerText);
                });
            }
        })) return;
    });

    // 修改高赔按钮事件
    highBtn.addEventListener('click', () => {
        if (!checkAndExecute(() => {
            const tableData = extractTableInfo();
            if (tableData) {
                const result = getResultByOdds(tableData, true);
                const resultDiv = displayResult(result, settings.prefixEnabled ? settings.prefix : '', settings.betPointsEnabled ? settings.betPoints : '');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(resultDiv.innerText);
                });
            }
        })) return;
    });

    // 修改低赔按钮事件
    lowBtn.addEventListener('click', () => {
        if (!checkAndExecute(() => {
            const tableData = extractTableInfo();
            if (tableData) {
                const result = getResultByOdds(tableData, false);
                const resultDiv = displayResult(result, settings.prefixEnabled ? settings.prefix : '', settings.betPointsEnabled ? settings.betPoints : '');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(resultDiv.innerText);
                });
            }
        })) return;
    });

    // 修改F9按键事件
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F9') {
            if (!checkAndExecute(() => {
                const tableData = extractTableInfo();
                if (tableData) {
                    const result = getRandomResult(tableData);
                    const resultDiv = displayResult(result, settings.prefixEnabled ? settings.prefix : '', settings.betPointsEnabled ? settings.betPoints : '');
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(resultDiv.innerText);
                    });
                }
            })) return;
        }
    });


    // 获取当前时间
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    document.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return;

        const timeText = cells[2].textContent.trim();
        const firstCell = cells[0];

        // 分钟处理
        if (timeText.includes('分鐘')) {
            firstCell.textContent = '今天';
            firstCell.style.color = '#659B28';
            return;
        }

        // 刚刚处理
        if (timeText.includes('剛剛')) {
            firstCell.textContent = '今天';
            firstCell.style.color = '#659B28';
            return;
        }

        // 小时处理
        if (timeText.includes('小時')) {
            const hours = parseInt(timeText.match(/(\d+)\s*小時/)[1]);
            const postDate = new Date(now.getTime() - hours * 3600000);

            if (postDate >= todayStart) {
                firstCell.textContent = '今天';
                firstCell.style.color = '#659B28';
            }
            return;
        }

        // 1天前处理
        //if (timeText === '1 天前') {
        if (timeText.includes('1  天前')) {
            const yesterdayStart = new Date(todayStart.getTime() - 86400000);
            const postDate = new Date(now.getTime() - 86400000);

            if (postDate >= yesterdayStart && postDate < todayStart) {
                firstCell.textContent = '昨天';
                firstCell.style.color = '#FFA500';
            }
        }
    });

    // 修改后的样式函数
    function adjustStyles(element) {
        element.style.padding = '3px 5px';      // 保留内边距
        element.style.borderRadius = '3px';     // 保留圆角
        // 移除了 font-weight 设置
    }

    document.querySelectorAll('td:first-child').forEach(adjustStyles);

})();