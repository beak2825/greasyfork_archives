// ==UserScript==
// @name         游戏盈亏监控
// @namespace    https://greasyfork.org/users/your-id
// @version      2.8.0
// @description  高效监控游戏平台用户盈亏数据，支持自动选择状态和分页，优化大数据处理
// @author       Cisco
// @match        https://*.topcms.org/*
// @icon         https://7777m.topcms.org/favicon.ico
// @license      MIT
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543007/%E6%B8%B8%E6%88%8F%E7%9B%88%E4%BA%8F%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/543007/%E6%B8%B8%E6%88%8F%E7%9B%88%E4%BA%8F%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        checkInterval: 2000,          // 检查间隔(毫秒)
        profitThreshold: null,       // 盈利阈值(>=)
        lossThreshold: null,          // 亏损阈值(<)
        monitoring: false,           // 监控状态
        currentIndex: 0,              // 当前处理索引(反向模式从最后开始)
        columnIndex: 0,               // 当前列索引
        currentPage: 1,               // 当前页码
        totalPages: 1,                // 总页数
        totalItems: 0,                // 总条目数
        itemsPerPage: 10,             // 每页条目数
        batchSize: 1,                 // 每批处理数量
        maxParallel: 1,               // 最大并行数
        activeRequests: 0,            // 活跃请求数
        processedItems: 0,            // 已处理条目数(仅成功计数)
        monitoringDuration: 40,       // 监控时长(分钟)
        lastCheckTime: 0,             // 最后检查时间
        startTime: 0,                 // 开始时间
        panelCollapsed: false,        // 面板是否收起
        profitAlerts: 0,              // 盈利警报数
        lossAlerts: 0,                // 亏损警报数
        reverseMode: true,            // 是否反向模式(从下往上)
        initialLoadDone: false,       // 初始加载完成标志
        isProcessing: false           // 是否正在处理用户
    };

    // 存储对象
    const storage = {
        get: function(key, defaultValue) {
            try {
                if (typeof GM_getValue !== 'undefined') {
                    return GM_getValue(key, defaultValue);
                }
                const value = localStorage.getItem(`monitor_${key}`);
                return value !== null ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error('存储读取错误:', e);
                return defaultValue;
            }
        },
        set: function(key, value) {
            try {
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(key, value);
                } else {
                    localStorage.setItem(`monitor_${key}`, JSON.stringify(value));
                }
            } catch (e) {
                console.error('存储写入错误:', e);
            }
        }
    };

    // 添加样式
    function addStyles() {
        const css = `
        .monitor-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            width: 320px;
            max-height: 90vh;
            overflow-y: auto;
            transition: all 0.3s ease;
        }
        .monitor-panel.collapsed {
            width: 40px;
            height: 40px;
            overflow: hidden;
            padding: 5px;
        }
        .toggle-panel {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            border: none;
            background: #f0f0f0;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            z-index: 10000;
        }
        .toggle-panel:hover {
            background: #e0e0e0;
        }
        .collapsed .panel-content {
            display: none;
        }
        .monitor-header {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .monitor-input-group {
            margin-bottom: 12px;
        }
        .monitor-label {
            display: block;
            margin-bottom: 5px;
            color: #666;
            font-size: 13px;
        }
        .monitor-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .monitor-button {
            width: 100%;
            padding: 10px;
            background: #409EFF;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }
        .monitor-button.stop {
            background: #F56C6C;
        }
        .monitor-stats {
            margin-top: 15px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .monitor-stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .monitor-progress-container {
            margin: 10px 0;
            height: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
        .monitor-progress-bar {
            height: 100%;
            background: linear-gradient(to right, #67C23A, #409EFF);
            transition: width 0.3s;
        }
        .monitor-speed {
            font-size: 11px;
            color: #999;
            text-align: right;
        }
        .monitor-alert-count {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
        }
        .monitor-alert-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
        }
        .profit-badge {
            background: #f0f9eb;
            color: #67C23A;
        }
        .loss-badge {
            background: #fef0f0;
            color: #F56C6C;
        }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // 创建控制面板
    function createControlPanel() {
        addStyles();
        
        const panel = document.createElement('div');
        panel.className = 'monitor-panel';
        panel.id = 'monitorPanel';
        
        // 添加收起/展开按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-panel';
        toggleBtn.innerHTML = '×';
        toggleBtn.title = '收起/展开控制面板';
        toggleBtn.addEventListener('click', togglePanel);
        
        // 面板内容
        const panelContent = document.createElement('div');
        panelContent.className = 'panel-content';
        panelContent.innerHTML = `
            <h3 class="monitor-header">游戏盈亏监控</h3>
            <div class="monitor-input-group">
                <label class="monitor-label">余额阈值(>=)</label>
                <input type="number" id="profitThresholdInput" placeholder="输入正数" class="monitor-input">
            </div>
            <div class="monitor-input-group">
                <label class="monitor-label">余额阈值(<)</label>
                <input type="number" id="lossThresholdInput" placeholder="输入正数" class="monitor-input">
            </div>
            <div class="monitor-input-group">
                <label class="monitor-label">监控时长(分钟)</label>
                <input type="number" id="minutesInput" value="40" min="1" class="monitor-input">
            </div>
            <div class="monitor-input-group">
                <label class="monitor-label">并行数量</label>
                <input type="number" id="parallelInput" value="1" min="1" max="10" class="monitor-input" disabled>
            </div>
            <button id="toggleMonitor" class="monitor-button">开始监控</button>
            
            <div class="monitor-stats">
                <div class="monitor-stat-row">
                    <span>状态:</span>
                    <span id="statusText">未启动</span>
                </div>
                <div class="monitor-stat-row">
                    <span>进度:</span>
                    <span id="currentPosition">0</span>/<span id="totalItems">0</span> 条
                </div>
                <div class="monitor-stat-row">
                    <span>页数:</span>
                    <span id="displayPage">1</span>/<span id="totalPages">1</span>
                </div>
                <div class="monitor-stat-row">
                    <span>速度:</span>
                    <span id="speedText">0 条/分钟</span>
                </div>
                
                <div class="monitor-progress-container">
                    <div id="progressBar" class="monitor-progress-bar" style="width: 0%"></div>
                </div>
                <div class="monitor-speed" id="timeRemaining">此轮预计剩余时间: 计算中...</div>
                
                <div class="monitor-alert-count">
                    <span class="monitor-alert-badge profit-badge">余额超标: <span id="profitAlerts">0</span></span>
                    <span class="monitor-alert-badge loss-badge">余额过低: <span id="lossAlerts">0</span></span>
                </div>
            </div>
        `;

        panel.appendChild(toggleBtn);
        panel.appendChild(panelContent);
        document.body.appendChild(panel);
        
        // 恢复面板状态和设置
        config.panelCollapsed = storage.get('panelCollapsed', false);
        if (config.panelCollapsed) {
            panel.classList.add('collapsed');
            toggleBtn.innerHTML = '≡';
        }
        
        const savedProfit = storage.get('profitThreshold', null);
        const savedLoss = storage.get('lossThreshold', null);
        const savedMinutes = storage.get('monitoringDuration', 40);
        const savedParallel = storage.get('parallelCount', 2);
        config.profitAlerts = storage.get('profitAlerts', 0);
        config.lossAlerts = storage.get('lossAlerts', 0);
        
        if (savedProfit) document.getElementById('profitThresholdInput').value = savedProfit;
        if (savedLoss) document.getElementById('lossThresholdInput').value = savedLoss;
        document.getElementById('minutesInput').value = savedMinutes;
        document.getElementById('parallelInput').value = savedParallel;
        document.getElementById('profitAlerts').textContent = config.profitAlerts;
        document.getElementById('lossAlerts').textContent = config.lossAlerts;
        
        document.getElementById('toggleMonitor').addEventListener('click', toggleMonitoring);
    }

    // 收起/展开面板
    function togglePanel() {
        const panel = document.getElementById('monitorPanel');
        config.panelCollapsed = !panel.classList.contains('collapsed');
        
        if (config.panelCollapsed) {
            panel.classList.add('collapsed');
            this.innerHTML = '≡';
        } else {
            panel.classList.remove('collapsed');
            this.innerHTML = '×';
        }
        
        storage.set('panelCollapsed', config.panelCollapsed);
    }

    // 切换监控状态
    function toggleMonitoring() {
        const profitVal = parseFloat(document.getElementById('profitThresholdInput').value);
        const lossVal = parseFloat(document.getElementById('lossThresholdInput').value);
        const minutes = parseInt(document.getElementById('minutesInput').value) || 40;
        const parallel = parseInt(document.getElementById('parallelInput').value) || 1;

        if (isNaN(profitVal) && isNaN(lossVal)) {
            alert('请至少设置一个阈值');
            return;
        }

        storage.set('profitThreshold', isNaN(profitVal) ? null : profitVal);
        storage.set('lossThreshold', isNaN(lossVal) ? null : Math.abs(lossVal));
        storage.set('monitoringDuration', minutes);
        storage.set('parallelCount', parallel);

        config.profitThreshold = isNaN(profitVal) ? null : profitVal;
        config.lossThreshold = isNaN(lossVal) ? null : Math.abs(lossVal);
        config.monitoringDuration = minutes;
        config.maxParallel = Math.min(Math.max(parallel, 1), 10);
        config.monitoring = !config.monitoring;

        const btn = document.getElementById('toggleMonitor');
        const status = document.getElementById('statusText');

        if (config.monitoring) {
            btn.textContent = '停止监控';
            btn.classList.add('stop');
            let statusMsg = '监控中 (';
            if (config.profitThreshold) statusMsg += `余额>=${config.profitThreshold}`;
            if (config.lossThreshold) statusMsg += `${config.profitThreshold ? ' ' : ''}余额<${config.lossThreshold}`;
            status.textContent = statusMsg + ')';
            
            config.startTime = Date.now();
            config.processedItems = 0;
            config.lastCheckTime = Date.now();
            
            startMonitoring();
        } else {
            btn.textContent = '开始监控';
            btn.classList.remove('stop');
            status.textContent = '已停止';
            
            // 清除所有正在进行的请求和队列
            config.activeRequests = 0;
            config.isProcessing = false;
            
            // 重置计数器
            config.currentIndex = 0;
            config.processedItems = 0;
            
            // 更新UI显示
            document.getElementById('currentPosition').textContent = '0';
            document.getElementById('progressBar').style.width = '0%';
        }
    }

    // 主监控流程，支持反向模式
    function startMonitoring() {
        if (!config.monitoring) {
            console.log('监控未启用，不启动');
            return;
        }
        console.log('启动监控流程...');
        config.startTime = Date.now();
        config.processedItems = 0;
        config.currentIndex = 0;
        config.currentPage = 1; // 重置为第一页开始
        config.initialLoadDone = false;
        config.profitAlerts = 0;
        config.lossAlerts = 0;
        config.isProcessing = false;

        // 先初始化监控设置，完成后跳转到最后一页
        initMonitoring(() => {
            goToLastPage(() => {
                console.log('初始化完成并已跳转到最后一页');
                config.initialLoadDone = true;
                processBatch();
            });
        });
    }

    // 跳转到最后一页函数
    function goToLastPage(callback) {
        console.log('尝试跳转到最后一页，当前页:', config.currentPage, '总页数:', config.totalPages);

        updatePaginationInfo();

        if (config.currentPage === config.totalPages) {
            console.log('已在最后一页');
            waitForTableData(callback);
            return;
        }

        const lastPageNumber = document.querySelector('.el-pager .number:last-child');
        if (lastPageNumber && !lastPageNumber.classList.contains('active')) {
            safeClick(lastPageNumber, () => {
                setTimeout(() => {
                    config.currentPage = config.totalPages;
                    updatePaginationInfo();
                    console.log('点击最后一页按钮后，等待数据刷新...');
                    waitForTableData(callback);
                }, 2000);
            });
            return;
        }

        const nextBtn = document.querySelector('.el-pagination .btn-next:not([disabled])');
        if (nextBtn) {
            let remainingPages = config.totalPages - config.currentPage;
            const clickNext = () => {
                if (remainingPages <= 0) {
                    config.currentPage = config.totalPages;
                    updatePaginationInfo();
                    console.log('已通过下一页按钮到达最后一页');
                    waitForTableData(callback);
                    return;
                }
                safeClick(nextBtn, () => {
                    remainingPages--;
                    config.currentPage++;
                    console.log('点击下一页，剩余:', remainingPages);
                    setTimeout(clickNext, 2500);
                });
            };
            clickNext();
            return;
        }

        console.warn('分页按钮全部失效，直接设置为最后一页');
        config.currentPage = config.totalPages;
        waitForTableData(callback);
    }

    // 安全点击函数（带回调）
    function safeClick(element, callback) {
        if (simulateClick(element)) {
            setTimeout(() => {
                if (callback) callback();
            }, 500);
        } else if (callback) {
            callback();
        }
    }

    // 可靠的模拟点击函数
    function simulateClick(element) {
        if (!element) {
            console.log('模拟点击失败：元素不存在');
            return false;
        }

        // 方法1: 直接调用click方法
        try {
            element.click();
            return true;
        } catch (e) {
            console.log('直接click方法失败，尝试其他方法');
        }

        // 方法2: 创建并派发鼠标事件
        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(mouseDown);

            const mouseUp = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(mouseUp);

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(clickEvent);
            return true;
        } catch (e) {
            console.log('标准MouseEvent创建失败:', e);
        }

        // 方法3: 最简事件
        try {
            const event = document.createEvent('Event');
            event.initEvent('click', true, true);
            element.dispatchEvent(event);
            return true;
        } catch (e) {
            console.log('最简事件创建失败:', e);
        }

        console.log('所有点击模拟方法均失败');
        return false;
    }

    // 选择下拉选项
    function selectDropdownOption(selector, optionText, callback) {
        const dropdown = document.querySelector(selector);
        if (!dropdown) {
            console.log('未找到下拉框:', selector);
            if (callback) callback(false);
            return;
        }

        // 先检查当前是否已经是目标值
        const currentValue = dropdown.querySelector('.el-input__inner')?.value;
        if (currentValue === optionText) {
            if (callback) callback(true);
            return;
        }

        // 点击打开下拉框
        safeClick(dropdown, () => {
            setTimeout(() => {
                // 查找页面中所有可见的下拉菜单
                const allMenus = Array.from(document.querySelectorAll('.el-select-dropdown'));
                const visibleMenus = allMenus.filter(menu => {
                    return !menu.style.display || menu.style.display !== 'none';
                });

                // 查找与当前下拉框关联的菜单
                let targetMenu = null;
                const dropdownRect = dropdown.getBoundingClientRect();

                for (const menu of visibleMenus) {
                    const menuRect = menu.getBoundingClientRect();
                    // 检查菜单是否出现在下拉框附近
                    if (Math.abs(menuRect.left - dropdownRect.left) < 50 && 
                        (Math.abs(menuRect.top - dropdownRect.bottom) < 20 || 
                        Math.abs(menuRect.bottom - dropdownRect.top) < 20)) {
                        targetMenu = menu;
                        break;
                    }
                }

                if (!targetMenu) {
                    console.log('未找到关联的下拉菜单');
                    if (callback) callback(false);
                    return;
                }

                // 查找匹配的选项
                const options = targetMenu.querySelectorAll('.el-select-dropdown__item');
                let optionFound = false;
                
                for (const option of options) {
                    if (option.textContent.trim() === optionText) {
                        // 确保选项可见
                        option.scrollIntoView({ behavior: 'instant', block: 'nearest' });
                        
                        // 点击选项
                        setTimeout(() => {
                            if (simulateClick(option)) {
                                optionFound = true;
                                // 等待下拉框关闭
                                setTimeout(() => {
                                    if (callback) callback(true);
                                }, 800);
                            } else {
                                if (callback) callback(false);
                            }
                        }, 200);
                        break;
                    }
                }
                
                if (!optionFound) {
                    console.log('未找到选项:', optionText);
                    if (callback) callback(false);
                }
            }, 500);
        });
    }

    // 设置每页显示条数
    function setPageSize(size, callback) {
        selectDropdownOption('.el-pagination__sizes .el-select', `${size}条/页`, (success) => {
            if (success) {
                config.itemsPerPage = size;
                // 设置成功后强制重新加载数据
                setTimeout(() => {
                    updatePaginationInfo();
                    if (callback) callback(true);
                }, 1500); // 等待数据重新加载
            } else {
                if (callback) callback(false);
            }
        });
    }

    // 选择订单状态
    function selectOrderStatus(status, callback) {
        selectDropdownOption('.el-select.filter-item', status, callback);
    }

    // 设置时间范围
    function setTimeRange(callback) {
        const now = new Date();
        // 计算开始时间为当前时间减去监控时长 时区需要-8小时
        const startTime = new Date(now.getTime() - (8 * 60 * 60000) - (config.monitoringDuration * 60000));
        const endTime = new Date(now.getTime() - (8 * 60 * 60000));

        const formatTime = (date) => {
            const pad = num => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        console.log('准备设置时间范围:', formatTime(startTime), '至', formatTime(endTime));

        // 1. 确保日期选择器已打开
        const datePicker = document.querySelector('.el-date-editor.el-range-editor');
        if (!datePicker) {
            console.error('未找到日期选择器元素');
            if (callback) callback();
            return;
        }

        // 点击日期选择器以打开面板
        safeClick(datePicker, () => {
            console.log('已点击日期选择器，等待面板打开...');
            
            // 2. 等待面板动画完成
            setTimeout(() => {
                const timeInputs = document.querySelectorAll('.el-range-input');
                if (timeInputs.length < 2) {
                    console.error('未找到时间输入框');
                    if (callback) callback();
                    return;
                }

                // 3. 设置时间值
                const startStr = formatTime(startTime);
                const endStr = formatTime(endTime);
                
                console.log('正在设置时间值:', startStr, endStr);
                
                // 直接设置输入框值并触发事件
                timeInputs[0].value = startStr;
                timeInputs[1].value = endStr;
                
                timeInputs.forEach(input => {
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });

                // 4. 尝试点击确定按钮
                setTimeout(() => {
                    // 查找确定按钮（多种可能的选择器）
                    const confirmBtn = document.querySelector('.el-picker-panel__footer .el-button:not(.el-button--text), ' +
                                    '.el-date-range-picker__footer .el-button:not(.el-button--text)');
                    
                    if (confirmBtn) {
                        console.log('找到确定按钮，正在点击...');
                        safeClick(confirmBtn, () => {
                            console.log('时间范围已确认');
                            if (callback) setTimeout(callback, 500);
                        });
                    } else {
                        console.log('未找到确定按钮，尝试直接提交查询');
                        // 直接触发查询作为后备方案
                        if (callback) setTimeout(callback, 500);
                    }
                }, 800);
            }, 1000);
        });
    }

    // 初始化监控
    function initMonitoring(callback) {
        // 先重置分页信息（但不重置currentPage）
        config.currentIndex = 0;
        
        const initSteps = [
            (next) => selectOrderStatus('已支付', (success) => {
                console.log(success ? '状态设置成功' : '状态设置失败');
                next();
            }),
            (next) => setTimeRange(() => {
                console.log('时间设置完成');
                next();
            }),
            (next) => setPageSize(200, (success) => {
                console.log(success ? '分页设置成功' : '分页设置失败');
                next();
            }),
            () => {
                console.log('开始查询');
                updatePaginationInfo();
                setTimeout(() => {
                    clickQueryButton();
                    if (callback) callback();
                }, 1000);
            }
        ];

        function executeStep() {
            if (initSteps.length > 0) {
                const step = initSteps.shift();
                step(executeStep);
            }
        }

        executeStep();
    }

    // 更新分页信息
    function updatePaginationInfo() {
        const pagination = document.querySelector('.el-pagination');
        if (!pagination) {
            const rows = document.querySelectorAll('.el-table__row:not(.el-table__row--level)');
            config.totalItems = rows.length;
            config.itemsPerPage = rows.length || config.itemsPerPage;
            config.totalPages = 1;
        } else {
            // 获取总条数
            const totalText = pagination.querySelector('.el-pagination__total')?.textContent || '';
            const totalMatch = totalText.match(/(\d+)(?=\s*条)/) || [null, 0];
            config.totalItems = parseInt(totalMatch[1]) || 0;
            
            // 优先从分页按钮获取总页数
            const pageButtons = pagination.querySelectorAll('.el-pager .number');
            if (pageButtons.length > 0) {
                const lastPageBtn = pageButtons[pageButtons.length - 1];
                config.totalPages = parseInt(lastPageBtn.textContent) || 1;
                console.log('从分页按钮获取总页数:', config.totalPages);
            } else {
                // 回退计算方式
                config.itemsPerPage = config.itemsPerPage || 200;
                config.totalPages = Math.ceil(config.totalItems / config.itemsPerPage);
                console.log('计算得到总页数:', config.totalPages);
            }
            
            // 获取当前页码
            const activePage = pagination.querySelector('.el-pager .number.active');
            if (activePage) {
                config.currentPage = parseInt(activePage.textContent) || 1;
            }
        }
        
        // 更新UI显示
        document.getElementById('totalItems').textContent = config.totalItems;
        document.getElementById('totalPages').textContent = config.totalPages;
        document.getElementById('displayPage').textContent = config.currentPage;
        updateProgressDisplay();
        
        console.log('分页信息更新 - 当前页:', config.currentPage, 
                '总页数:', config.totalPages,
                '总条数:', config.totalItems);
    }

    // 点击查询按钮
    function clickQueryButton() {
        const queryBtn = [...document.querySelectorAll('.filter-container button.el-button')]
            .find(btn => !btn.classList.contains('is-disabled') && btn.textContent.includes('查询'));

        if (queryBtn) {
            safeClick(queryBtn, () => {
                setTimeout(() => checkUsers(), 3000);
            });
        } else {
            console.log('未找到查询按钮');
            setTimeout(() => {
                if (config.monitoring) clickQueryButton();
            }, 1000);
        }
    }

    // 更新进度显示函数
    function updateProgressDisplay() {
        // 计算已完成数量
        const currentPos = parseInt(document.getElementById('currentPosition').textContent);
        const totalItems = parseInt(document.getElementById('totalItems').textContent);
        
        // 计算进度百分比
        const progressPercent = (currentPos / totalItems * 100).toFixed(1);
        document.getElementById('progressBar').style.width = `${progressPercent}%`;
        
        // 计算处理速度
        const now = Date.now();
        const elapsedMinutes = (now - config.startTime) / 60000;
        const speed = elapsedMinutes > 0 ? Math.round(config.processedItems / elapsedMinutes) : 0;
        document.getElementById('speedText').textContent = `${speed} 条/分钟`;
        
        // 计算剩余时间
        if (speed > 0) {
            const remainingItems = totalItems - currentPos;
            const remainingMinutes = Math.ceil(remainingItems / speed);
            document.getElementById('timeRemaining').textContent = `此轮预计剩余时间: ${remainingMinutes} 分钟`;
        }
    }

    // 检查用户列表
    function checkUsers() {
        const userRows = document.querySelectorAll('.el-table__row:not(.el-table__row--level)');
        if (userRows.length === 0) {
            setTimeout(() => {
                if (config.monitoring) startMonitoring();
            }, config.checkInterval);
            return;
        }

        config.currentIndex = 0;
        config.initialLoadDone = true;
        processBatch();
    }

    // 修改resetForNewRound函数
    function resetForNewRound() {
        console.log('准备开始新一轮完整监控流程');
        
        // 重置所有关键状态
        config.currentIndex = 0;
        config.processedItems = 0;
        config.activeRequests = 0;
        config.profitAlerts = 0;
        config.lossAlerts = 0;
        config.isProcessing = false;
        
        // 更新UI显示
        document.getElementById('currentPosition').textContent = '0';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('profitAlerts').textContent = '0';
        document.getElementById('lossAlerts').textContent = '0';
        
        // 重新执行完整初始化
        initMonitoring(() => {
            // 初始化完成后跳转到最后一页
            goToLastPage(() => {
                console.log('新一轮监控准备就绪，从最后一页开始');
                config.initialLoadDone = true;
                processBatch();
            });
        });
    }

    // 处理单个用户
    async function processSingleUser(row, userIdElement, userNameElement) {
        try {
            // 步骤1: 关闭所有现有弹窗
            await closeAllDialogs();
            
            const userId = userIdElement.textContent.trim();
            // 步骤2: 滚动到用户行
            userNameElement.scrollIntoView({ behavior: 'auto', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 300));

            // 步骤3: 打开用户弹窗
            if (!simulateClick(userNameElement)) {
                throw new Error('点击用户元素失败');
            }

            // 步骤4: 等待弹窗出现
            const dialog = await waitForElement('.el-dialog__body .el-table', {
                multiple: true,
                notEmpty: true,
                timeout: 8000
            });
            if (!dialog) {
                throw new Error('弹窗加载超时');
            }

            // 步骤5: 检查余额
            const balance = await getBalanceFromSecondTable(dialog);
            if (balance === null) {
                throw new Error('获取余额失败');
            }

            // 步骤6: 阈值检查
            if (config.profitThreshold !== null && balance >= config.profitThreshold) {
                const exceed = (balance - config.profitThreshold).toFixed(2);
                await showAlert(`用户${userId} 余额超标: ${balance} (超过${exceed})`, 'profit');
                incrementAlertCount('profit');
            } 
            else if (config.lossThreshold !== null && balance < config.lossThreshold) {
                const below = (config.lossThreshold - balance).toFixed(2);
                await showAlert(`用户${userId} 余额不足: ${balance} (低于${below})`, 'loss');
                incrementAlertCount('loss');
            }
        } catch (e) {
            console.error('处理用户失败:', e);
        } finally {
            // 步骤7: 确保关闭弹窗
            await closeAllDialogs();
        }
    }
    
    async function getBalanceFromSecondTable(dialog) {
        const secondTable = dialog[1];

        // 等待第二个表格中至少有一行数据出现
        const dataRows = await waitForElement('.el-table__body-wrapper tbody tr', {
            root: secondTable,
            multiple: true,
            timeout: 8000
        });
        if (!dataRows || dataRows.length === 0) {
            console.log('❌ 第二个表格中没有数据行');
            return null;
        }

        const firstRow = dataRows[0];
        const cells = firstRow.querySelectorAll('td');

        if (cells.length === 0) {
            console.log('❌ 第一行中没有单元格');
            return null;
        }

        const balanceText = cells[0].innerText.trim(); // 根据需要调整列索引
        console.log('✅ 余额：', balanceText);
        return balanceText;
    }

    // 关闭所有弹窗
    async function closeAllDialogs() {
        const dialogs = document.querySelectorAll('.el-dialog__wrapper:not([style*="display: none"])');
        for (const dialog of dialogs) {
            const closeBtn = dialog.querySelector('.el-dialog__headerbtn');
            if (closeBtn) {
                simulateClick(closeBtn);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }
    
    /**
     * 等待指定元素加载完成
     * @param {string} selector CSS 选择器
     * @param {Object} options 可选项
     * @param {number} [options.timeout=5000] 超时时间，毫秒
     * @param {Element} [options.root=document] 查询范围（默认整个文档）
     * @param {boolean} [options.multiple=false] 是否等待多个元素（querySelectorAll）
     * @param {boolean} [options.notEmpty=false] 是否等待元素有子节点/非空
     * @returns {Promise<Element|Element[]|null>}
     */
    function waitForElement(selector, options = {}) {
        const {
            timeout = 5000,
            root = document,
            multiple = false,
            notEmpty = false
        } = options;

        return new Promise((resolve) => {
            const startTime = Date.now();

            const check = () => {
                let element = multiple
                    ? root.querySelectorAll(selector)
                    : root.querySelector(selector);

                let found = multiple
                    ? element.length > 0
                    : !!element;

                if (found && notEmpty) {
                    if (multiple) {
                        found = Array.from(element).every(el => el.textContent.trim().length > 0);
                    } else {
                        found = element.textContent.trim().length > 0;
                    }
                }

                if (found) {
                    resolve(element);
                } else if (Date.now() - startTime < timeout) {
                    setTimeout(check, 100);
                } else {
                    resolve(null);
                }
            };

            check();
        });
    }

    
    // 向前翻页函数
    function goToPreviousPage() {
        console.log('尝试转到上一页...');
        const userRows = document.querySelectorAll('.el-table__row:not(.el-table__row--level)');
        config.currentIndex = Math.min(config.currentIndex, userRows.length);  // 限制索引不超过用户数
        const prevBtn = document.querySelector('.el-pagination .btn-prev:not([disabled])');
        if (prevBtn) {
            safeClick(prevBtn, () => {
                setTimeout(() => {
                    config.currentPage--;
                    config.currentIndex = 0;  // 重置为0，准备从新页的最后开始
                    updatePaginationInfo();
                    console.log(`已转到第 ${config.currentPage} 页`);
                    setTimeout(() => checkUsers(), 2000);
                }, 1500);
            });
        } else {
            console.log('已经是第一页，重新开始循环');
            resetForNewRound();
        }
    }

    // 等待表格数据加载
    function waitForTableData(callback, retries = 10) {
        const interval = 500;
        const check = () => {
            const rows = document.querySelectorAll('.el-table__row:not(.el-table__row--level)');
            if (rows.length > 0) {
                console.log('表格数据已加载，共', rows.length, '行');
                if (callback) callback();
            } else if (retries > 0) {
                console.log('等待表格数据加载...');
                setTimeout(() => waitForTableData(callback, retries - 1), interval);
            } else {
                console.warn('等待表格数据超时，强制进入流程');
                if (callback) callback(); // 即使失败也执行
            }
        };
        check();
    }

    /**
     * 处理单个批次（顺序处理）
     */
    async function processBatch() {
        // 添加更严格的检查条件
        if (!config.monitoring || config.isProcessing) {
            console.log('监控未启用或正在处理中，跳过');
            return;
        }
    
        const userRows = document.querySelectorAll('.el-table__row:not(.el-table__row--level)');
        if (userRows.length === 0) {
            console.log('当前页没有用户行');
            return;
        }
        
        // 改进的索引计算
        let startIndex = userRows.length - 1 - config.currentIndex;
        console.log(`处理批次 - 当前索引: ${config.currentIndex}, 计算起始索引: ${startIndex}`);
        
        // 更严格的边界检查
        if (startIndex < 0 || startIndex >= userRows.length) {
            console.log(`索引越界 (${startIndex})，准备翻页`);
            if (config.currentPage > 1) {
                await goToPreviousPage();
            } else {
                await resetForNewRound();
            }
            return;
        }
    
        // 更严格的处理锁
        try {
            config.isProcessing = true;
            const currentRow = userRows[startIndex];
            const userIdElement = currentRow.querySelector('div[style*="height: 20px; color: gray;"]');
            const userNameElement = currentRow.querySelector('.el-tooltip[style*="color: rgb(24, 144, 255)"]');
    
            if (!userNameElement) {
                console.log('跳过无效用户条目');
                config.currentIndex++;
                return;
            }
    
            // 添加处理前检查
            const userId = userIdElement?.textContent.trim();
            if (config.lastProcessedUserId === userId) {
                console.log('检测到重复用户ID，跳过:', userId);
                config.currentIndex++;
                return;
            }
    
            await processSingleUser(currentRow, userIdElement, userNameElement);
            
            // 成功处理后更新状态
            config.lastProcessedUserId = userId;
            config.currentIndex++;
            config.processedItems++;
            
            // 立即更新UI
            document.getElementById('currentPosition').textContent = config.processedItems;
            updateProgressDisplay();
        } catch (e) {
            console.error('处理用户失败:', e);
        } finally {
            config.isProcessing = false;
            
            // 添加更智能的延迟
            const delay = config.activeRequests > 0 ? 500 : 300;
            setTimeout(processBatch, delay);
        }
    }
    
    // 增加警报计数
    function incrementAlertCount(type) {
        const elementId = type === 'profit' ? 'profitAlerts' : 'lossAlerts';
        const currentCount = parseInt(document.getElementById(elementId).textContent) || 0;
        const newCount = currentCount + 1;
        document.getElementById(elementId).textContent = newCount;
        
        if (type === 'profit') {
            config.profitAlerts = newCount;
            storage.set('profitAlerts', newCount);
        } else {
            config.lossAlerts = newCount;
            storage.set('lossAlerts', newCount);
        }
    }
    
    // 改进的通知函数
    async function showAlert(message, type) {
        // 1. 控制台日志
        console.warn(`[ALERT] ${message}`);
        // 提取userId部分（匹配"用户ID:数字"格式）
        const userIdMatch = message.match(/用户ID:(\d+)/);
        const userId = userIdMatch ? userIdMatch[1] : '';
        
        // 创建Promise以便暂停执行
        return new Promise((resolve) => {
            // 创建自定义alert弹窗
            const alertWrapper = document.createElement('div');
            alertWrapper.style.position = 'fixed';
            alertWrapper.style.top = '0';
            alertWrapper.style.left = '0';
            alertWrapper.style.width = '100%';
            alertWrapper.style.height = '100%';
            alertWrapper.style.backgroundColor = 'rgba(0,0,0,0.5)';
            alertWrapper.style.display = 'flex';
            alertWrapper.style.justifyContent = 'center';
            alertWrapper.style.alignItems = 'center';
            alertWrapper.style.zIndex = '99999';
            
            const alertBox = document.createElement('div');
            alertBox.style.backgroundColor = 'white';
            alertBox.style.padding = '20px';
            alertBox.style.borderRadius = '5px';
            alertBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            alertBox.style.maxWidth = '80%';
            alertBox.style.wordBreak = 'break-all';
            
            // 高亮显示用户ID并添加复制功能
            if (userId) {
                const highlightedMessage = message.replace(
                    `用户ID:${userId}`,
                    `用户ID:<span id="userIdSpan" style="color: #1890ff; cursor: pointer; font-weight: bold; text-decoration: underline;" 
                    title="点击复制用户ID">
                    ${userId}
                    </span>
                    <span id="copyFeedback" style="color: green; display: none; margin-left: 5px;">已复制!</span>`
                );
                alertBox.innerHTML = highlightedMessage;
                
                // 添加点击事件处理程序
                setTimeout(() => {
                    const userIdSpan = document.getElementById('userIdSpan');
                    const copyFeedback = document.getElementById('copyFeedback');
                    
                    if (userIdSpan && copyFeedback) {
                        userIdSpan.onclick = () => {
                            navigator.clipboard.writeText(userId).then(() => {
                                copyFeedback.style.display = 'inline';
                                setTimeout(() => {
                                    copyFeedback.style.display = 'none';
                                }, 1000);
                            });
                        };
                    }
                }, 0);
            } else {
                alertBox.textContent = message;
            }
            
            // 添加确定按钮
            const okButton = document.createElement('button');
            okButton.textContent = '确定';
            okButton.style.marginTop = '15px';
            okButton.style.padding = '5px 15px';
            okButton.style.backgroundColor = '#409EFF';
            okButton.style.color = 'white';
            okButton.style.border = 'none';
            okButton.style.borderRadius = '3px';
            okButton.style.cursor = 'pointer';
            okButton.onclick = () => {
                document.body.removeChild(alertWrapper);
                resolve(); // 解决Promise，继续执行
            };
            
            alertBox.appendChild(document.createElement('br'));
            alertBox.appendChild(okButton);
            alertWrapper.appendChild(alertBox);
            document.body.appendChild(alertWrapper);
            
            // 2. 使用GM_notification或浏览器通知
            if (typeof GM_notification !== 'undefined') {
                try {
                    GM_notification({
                        title: type === 'profit' ? '超标报警' : '不足报警',
                        text: message,
                        timeout: 5000,
                        onclick: function () {
                            window.focus();
                        }
                    });
                    return;
                } catch (e) {
                    console.error('GM_notification失败:', e);
                }
            }
        
            // 3. 使用Web Notification
            if (window.Notification && Notification.permission === 'granted') {
                new Notification(type === 'profit' ? '超标报警' : '不足报警', {
                    body: message,
                    icon: 'https://7777m.topcms.org/favicon.ico'
                });
                return;
            } else if (window.Notification && Notification.permission !== 'denied') {
                Notification.requestPermission().then(function (permission) {
                    if (permission === 'granted') {
                        new Notification(type === 'profit' ? '超标报警' : '不足报警', {
                            body: message,
                            icon: 'https://7777m.topcms.org/favicon.ico'
                        });
                    } else {
                        fallbackAlert(message);
                    }
                });
                return;
            }
        
            // 4. 最终弹窗方案
            fallbackAlert(message);
        });
    }
    
    function fallbackAlert(message) {
        // 创建自定义弹窗
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.padding = '15px';
        alertDiv.style.background = '#f8f8f8';
        alertDiv.style.border = '1px solid #ddd';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        alertDiv.style.zIndex = '99999';
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        // 5秒后自动消失
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // 初始化
    function init() {
        const checkTable = setInterval(() => {
            if (document.querySelector('.el-table')) {
                clearInterval(checkTable);
                createControlPanel();
                console.log('脚本初始化完成');
            }
        }, 500);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();