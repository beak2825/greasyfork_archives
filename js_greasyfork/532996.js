// ==UserScript==
// @name         雀魂牌谱屋对局数据采集脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  保存所有加载的对局数据
// @author       藤田
// @license      MIT
// @match        https://amae-koromo.sapk.ch/*
// @match        https://saki.sapk.ch/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532996/%E9%9B%80%E9%AD%82%E7%89%8C%E8%B0%B1%E5%B1%8B%E5%AF%B9%E5%B1%80%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532996/%E9%9B%80%E9%AD%82%E7%89%8C%E8%B0%B1%E5%B1%8B%E5%AF%B9%E5%B1%80%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .auto-scroll-container {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            max-width: 300px;
            font-size: 14px;
        }
        .auto-scroll-container button {
            margin: 5px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .auto-scroll-container button:hover {
            background-color: #45a049;
        }
        .auto-scroll-container button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        .progress-bar-container {
            width: 100%;
            background-color: #e0e0e0;
            border-radius: 4px;
            margin-top: 10px;
            height: 10px;
        }
        .progress-bar {
            height: 100%;
            background-color: #4CAF50;
            border-radius: 4px;
            width: 0%;
            transition: width 0.3s;
        }
        .status-indicator {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            z-index: 9999;
            font-size: 12px;
            transition: opacity 0.3s;
        }
        .minimize-button {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            font-size: 16px;
            color: #666;
        }
        .minimize-button:hover {
            color: #000;
        }
        .auto-scroll-container.minimized {
            width: 30px;
            height: 30px;
            overflow: hidden;
            padding: 0;
        }
        .expand-button {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            color: #666;
        }
        .advanced-options {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 12px;
        }
        .advanced-options-toggle {
            color: #0066cc;
            cursor: pointer;
            text-decoration: underline;
            display: block;
            margin-bottom: 5px;
        }
        .advanced-options-content {
            display: none;
        }
        .advanced-options-content.visible {
            display: block;
        }
        .scroll-stats {
            margin-top: 5px;
            font-size: 11px;
            color: #666;
        }
        .memory-stats {
            margin-top: 5px;
            font-size: 11px;
            color: #666;
        }
        .pause-resume-button {
            background-color: #ff9800 !important;
        }
        .pause-resume-button:hover {
            background-color: #e68a00 !important;
        }
        .export-progress {
            margin-top: 5px;
            font-size: 11px;
            color: #666;
            display: none;
        }
    `;
    document.head.appendChild(style);

    // 存储所有已加载的数据
    let allPreservedData = [];
    let isScrolling = false;
    let isPaused = false;
    let scrollInterval = null;
    let observer = null;
    let lastDataLength = 0;
    let isMinimized = false;
    let scrollSpeed = 1; // 默认滚动速度
    let maxScrollAttempts = 10000; // 最大滚动尝试次数，设置为极高的值
    let scrollAttempts = 0;
    let noNewDataCounter = 0;
    let autoStopThreshold = 20; // 连续多少次没有新数据时自动停止，增加阈值
    let pauseBeforeScroll = 500; // 每次滚动前暂停时间(毫秒)
    let batchSize = 100; // 数据批处理大小
    let memoryOptimization = true; // 是否启用内存优化
    let showAdvancedOptions = false; // 是否显示高级选项
    let lastScrollPosition = 0; // 上次滚动位置
    let samePositionCounter = 0; // 相同位置计数器
    let samePositionThreshold = 5; // 连续多少次相同位置时判断为无法继续滚动
    let totalScrollDistance = 0; // 总滚动距离
    let totalDataCollected = 0; // 总采集数据量
    let scrollStartTime = null; // 滚动开始时间
    let memoryCheckInterval = null; // 内存检查间隔
    let dataChunks = []; // 数据分块存储
    let currentChunkIndex = 0; // 当前数据块索引
    let chunkSize = 500; // 每个数据块的大小
    let autoSaveInterval = null; // 自动保存间隔
    let autoSaveEnabled = true; // 是否启用自动保存
    let autoSaveMinutes = 5; // 自动保存间隔（分钟）
    let lastAutoSaveTime = null; // 上次自动保存时间
    let processedRowIds = new Set(); // 已处理的行ID集合

    // 节流函数，限制函数调用频率
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // 防抖函数，延迟函数执行
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // 获取当前内存使用情况
    function getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            return {
                total: Math.round(window.performance.memory.totalJSHeapSize / (1024 * 1024)),
                used: Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)),
                limit: Math.round(window.performance.memory.jsHeapSizeLimit / (1024 * 1024))
            };
        }
        return null;
    }

    // 更新内存使用统计
    function updateMemoryStats() {
        const memoryStatsDiv = document.getElementById('memory-stats');
        if (!memoryStatsDiv) return;

        const memoryUsage = getMemoryUsage();
        if (memoryUsage) {
            memoryStatsDiv.textContent = `内存: ${memoryUsage.used}MB / ${memoryUsage.total}MB (${Math.round(memoryUsage.used / memoryUsage.total * 100)}%)`;

            // 如果内存使用率超过80%，触发垃圾回收和数据优化
            if (memoryUsage.used / memoryUsage.total > 0.8) {
                optimizeMemoryUsage();
            }
        } else {
            memoryStatsDiv.textContent = '内存统计不可用';
        }
    }

    // 优化内存使用
    function optimizeMemoryUsage() {
        if (!memoryOptimization) return;

        // 如果当前数据块已满，创建新数据块
        if (allPreservedData.length >= chunkSize) {
            // 将当前数据块添加到数据块数组
            dataChunks.push([...allPreservedData]);
            currentChunkIndex = dataChunks.length;

            // 清空当前数据数组，释放内存
            allPreservedData = [];

            // 强制垃圾回收（尽管JavaScript没有直接的垃圾回收API）
            setTimeout(() => {
                // 这里不做任何事情，只是给垃圾回收一个机会
            }, 0);

            updateStatus(`已创建数据块 #${currentChunkIndex}，共 ${getTotalDataCount()} 条数据`);
        }
    }

    // 获取总数据数量
    function getTotalDataCount() {
        let total = allPreservedData.length;
        dataChunks.forEach(chunk => {
            total += chunk.length;
        });
        return total;
    }

    // 获取所有数据（合并所有数据块）
    function getAllData() {
        let allData = [];
        dataChunks.forEach(chunk => {
            allData = allData.concat(chunk);
        });
        allData = allData.concat(allPreservedData);
        return allData;
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 创建控制面板
        createControlPanel();

        // 初始化数据保存功能
        initDataPreservation();

        // 启动内存监控
        startMemoryMonitoring();

        // 初始化自动保存时间
        lastAutoSaveTime = new Date();
    });

    // 启动内存监控
    function startMemoryMonitoring() {
        if (memoryCheckInterval) {
            clearInterval(memoryCheckInterval);
        }

        // 每10秒检查一次内存使用情况
        memoryCheckInterval = setInterval(() => {
            updateMemoryStats();

            // 检查是否需要自动保存
            if (autoSaveEnabled && isScrolling && !isPaused && lastAutoSaveTime) {
                const now = new Date();
                const minutesSinceLastSave = (now - lastAutoSaveTime) / (1000 * 60);

                if (minutesSinceLastSave >= autoSaveMinutes) {
                    autoSaveData();
                }
            }
        }, 10000);
    }

    // 自动保存数据
    function autoSaveData() {
        if (getTotalDataCount() === 0) return;

        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const filename = `雀魂牌谱数据_自动保存_${timestamp}.json`;

        // 创建一个隐藏的下载链接
        const jsonContent = 'data:text/json;charset=utf-8,' +
                           encodeURIComponent(JSON.stringify(getAllData(), null, 2));

        const link = document.createElement('a');
        link.setAttribute('href', jsonContent);
        link.setAttribute('download', filename);
        link.style.display = 'none';
        document.body.appendChild(link);

        // 触发下载
        link.click();
        document.body.removeChild(link);

        lastAutoSaveTime = new Date();
        updateStatus(`已自动保存 ${getTotalDataCount()} 条数据`);
    }

    // 创建控制面板
    function createControlPanel() {
        const container = document.createElement('div');
        container.className = 'auto-scroll-container';

        // 添加最小化按钮
        const minimizeButton = document.createElement('div');
        minimizeButton.className = 'minimize-button';
        minimizeButton.textContent = '−';
        minimizeButton.title = '最小化';
        minimizeButton.onclick = toggleMinimize;
        container.appendChild(minimizeButton);

        // 创建内容容器
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';

        const title = document.createElement('h3');
        title.textContent = '雀魂牌谱屋对局数据采集';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '14px';
        contentContainer.appendChild(title);

        // 滚动速度控制
        const speedContainer = document.createElement('div');
        speedContainer.style.marginBottom = '10px';

        const speedLabel = document.createElement('label');
        speedLabel.textContent = '滚动速度: ';
        speedLabel.style.fontSize = '12px';
        speedContainer.appendChild(speedLabel);

        const speedSelect = document.createElement('select');
        speedSelect.style.marginLeft = '5px';
        speedSelect.style.padding = '2px';

        const speeds = [
            { value: 0.2, text: '超慢速' },
            { value: 0.5, text: '慢速' },
            { value: 1, text: '正常' },
            { value: 2, text: '快速' },
            { value: 3, text: '极速' }
        ];

        speeds.forEach(speed => {
            const option = document.createElement('option');
            option.value = speed.value;
            option.textContent = speed.text;
            if (speed.value === 1) option.selected = true;
            speedSelect.appendChild(option);
        });

        speedSelect.onchange = function() {
            scrollSpeed = parseFloat(this.value);

            // 如果正在滚动，更新滚动间隔
            if (isScrolling && !isPaused && scrollInterval) {
                clearInterval(scrollInterval);
                startScrollInterval();
            }
        };

        speedContainer.appendChild(speedSelect);
        contentContainer.appendChild(speedContainer);

        // 开始按钮
        const startButton = document.createElement('button');
        startButton.textContent = '开始完全遍历';
        startButton.onclick = function() {
            startAutoScroll();
            this.disabled = true;
            stopButton.disabled = false;
            pauseResumeButton.disabled = false;
            updateStatus('正在自动滚动并采集数据...');
        };
        contentContainer.appendChild(startButton);

        // 停止按钮
        const stopButton = document.createElement('button');
        stopButton.textContent = '停止滚动';
        stopButton.disabled = true;
        stopButton.onclick = function() {
            stopAutoScroll();
            this.disabled = true;
            startButton.disabled = false;
            pauseResumeButton.disabled = true;
            pauseResumeButton.textContent = '暂停滚动';
            isPaused = false;
            updateStatus(`已停止滚动，共采集 ${getTotalDataCount()} 条数据`);
        };
        contentContainer.appendChild(stopButton);

        // 暂停/恢复按钮
        const pauseResumeButton = document.createElement('button');
        pauseResumeButton.textContent = '暂停滚动';
        pauseResumeButton.className = 'pause-resume-button';
        pauseResumeButton.disabled = true;
        pauseResumeButton.onclick = function() {
            if (isPaused) {
                // 恢复滚动
                isPaused = false;
                this.textContent = '暂停滚动';
                startScrollInterval();
                updateStatus('已恢复滚动');
            } else {
                // 暂停滚动
                isPaused = true;
                this.textContent = '恢复滚动';
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
                updateStatus('已暂停滚动');
            }
        };
        contentContainer.appendChild(pauseResumeButton);

        // 复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制所有数据';
        copyButton.onclick = copyAllData;
        contentContainer.appendChild(copyButton);

        // 清除按钮
        const clearButton = document.createElement('button');
        clearButton.textContent = '清除数据';
        clearButton.onclick = function() {
            if (confirm('确定要清除所有已采集的数据吗？')) {
                allPreservedData = [];
                dataChunks = [];
                currentChunkIndex = 0;
                lastDataLength = 0;
                totalDataCollected = 0;
                processedRowIds.clear();
                updateStatus('已清除所有数据');
                updateProgressBar(0);
                updateScrollStats();
                updateMemoryStats();
            }
        };
        contentContainer.appendChild(clearButton);

        // 进度条
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bar-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'scroll-progress-bar';

        progressContainer.appendChild(progressBar);
        contentContainer.appendChild(progressContainer);

        // 滚动统计信息
        const scrollStatsDiv = document.createElement('div');
        scrollStatsDiv.className = 'scroll-stats';
        scrollStatsDiv.id = 'scroll-stats';
        scrollStatsDiv.innerHTML = '滚动次数: 0 | 滚动距离: 0px | 运行时间: 0:00';
        contentContainer.appendChild(scrollStatsDiv);

        // 内存统计信息
        const memoryStatsDiv = document.createElement('div');
        memoryStatsDiv.className = 'memory-stats';
        memoryStatsDiv.id = 'memory-stats';
        memoryStatsDiv.textContent = '内存统计加载中...';
        contentContainer.appendChild(memoryStatsDiv);

        // 数据统计信息
        const statsDiv = document.createElement('div');
        statsDiv.style.fontSize = '12px';
        statsDiv.style.marginTop = '5px';
        statsDiv.style.color = '#666';
        statsDiv.id = 'data-stats';
        statsDiv.textContent = '已采集 0 条数据';
        contentContainer.appendChild(statsDiv);

        // 导出进度
        const exportProgressDiv = document.createElement('div');
        exportProgressDiv.className = 'export-progress';
        exportProgressDiv.id = 'export-progress';
        exportProgressDiv.textContent = '导出进度: 0%';
        contentContainer.appendChild(exportProgressDiv);

        // 高级选项
        const advancedOptions = document.createElement('div');
        advancedOptions.className = 'advanced-options';

        const advancedToggle = document.createElement('span');
        advancedToggle.className = 'advanced-options-toggle';
        advancedToggle.textContent = '显示高级选项';
        advancedToggle.onclick = function() {
            showAdvancedOptions = !showAdvancedOptions;
            advancedContent.classList.toggle('visible', showAdvancedOptions);
            this.textContent = showAdvancedOptions ? '隐藏高级选项' : '显示高级选项';
        };
        advancedOptions.appendChild(advancedToggle);

        const advancedContent = document.createElement('div');
        advancedContent.className = 'advanced-options-content';

        // 暂停时间设置
        const pauseContainer = document.createElement('div');
        pauseContainer.style.marginBottom = '5px';

        const pauseLabel = document.createElement('label');
        pauseLabel.textContent = '滚动间隔(毫秒): ';
        pauseLabel.style.fontSize = '12px';
        pauseContainer.appendChild(pauseLabel);

        const pauseInput = document.createElement('input');
        pauseInput.type = 'number';
        pauseInput.min = '100';
        pauseInput.max = '2000';
        pauseInput.step = '100';
        pauseInput.value = pauseBeforeScroll;
        pauseInput.style.width = '60px';
        pauseInput.onchange = function() {
            pauseBeforeScroll = parseInt(this.value) || 500;
        };
        pauseContainer.appendChild(pauseInput);
        advancedContent.appendChild(pauseContainer);

        // 自动停止阈值设置
        const thresholdContainer = document.createElement('div');
        thresholdContainer.style.marginBottom = '5px';

        const thresholdLabel = document.createElement('label');
        thresholdLabel.textContent = '自动停止阈值: ';
        thresholdLabel.style.fontSize = '12px';
        thresholdContainer.appendChild(thresholdLabel);

        const thresholdInput = document.createElement('input');
        thresholdInput.type = 'number';
        thresholdInput.min = '5';
        thresholdInput.max = '50';
        thresholdInput.step = '1';
        thresholdInput.value = autoStopThreshold;
        thresholdInput.style.width = '40px';
        thresholdInput.onchange = function() {
            autoStopThreshold = parseInt(this.value) || 20;
        };
        thresholdContainer.appendChild(thresholdInput);
        advancedContent.appendChild(thresholdContainer);

        // 相同位置阈值设置
        const samePositionContainer = document.createElement('div');
        samePositionContainer.style.marginBottom = '5px';

        const samePositionLabel = document.createElement('label');
        samePositionLabel.textContent = '相同位置阈值: ';
        samePositionLabel.style.fontSize = '12px';
        samePositionContainer.appendChild(samePositionLabel);

        const samePositionInput = document.createElement('input');
        samePositionInput.type = 'number';
        samePositionInput.min = '3';
        samePositionInput.max = '20';
        samePositionInput.step = '1';
        samePositionInput.value = samePositionThreshold;
        samePositionInput.style.width = '40px';
        samePositionInput.onchange = function() {
            samePositionThreshold = parseInt(this.value) || 5;
        };
        samePositionContainer.appendChild(samePositionInput);
        advancedContent.appendChild(samePositionContainer);

        // 数据块大小设置
        const chunkSizeContainer = document.createElement('div');
        chunkSizeContainer.style.marginBottom = '5px';

        const chunkSizeLabel = document.createElement('label');
        chunkSizeLabel.textContent = '数据块大小: ';
        chunkSizeLabel.style.fontSize = '12px';
        chunkSizeContainer.appendChild(chunkSizeLabel);

        const chunkSizeInput = document.createElement('input');
        chunkSizeInput.type = 'number';
        chunkSizeInput.min = '100';
        chunkSizeInput.max = '2000';
        chunkSizeInput.step = '100';
        chunkSizeInput.value = chunkSize;
        chunkSizeInput.style.width = '60px';
        chunkSizeInput.onchange = function() {
            chunkSize = parseInt(this.value) || 500;
        };
        chunkSizeContainer.appendChild(chunkSizeInput);
        advancedContent.appendChild(chunkSizeContainer);

        // 自动保存设置
        const autoSaveContainer = document.createElement('div');
        autoSaveContainer.style.marginBottom = '5px';

        const autoSaveCheckbox = document.createElement('input');
        autoSaveCheckbox.type = 'checkbox';
        autoSaveCheckbox.id = 'auto-save';
        autoSaveCheckbox.checked = autoSaveEnabled;
        autoSaveCheckbox.onchange = function() {
            autoSaveEnabled = this.checked;
            autoSaveMinutesInput.disabled = !this.checked;
        };
        autoSaveContainer.appendChild(autoSaveCheckbox);

        const autoSaveLabel = document.createElement('label');
        autoSaveLabel.htmlFor = 'auto-save';
        autoSaveLabel.textContent = ' 启用自动保存，间隔(分钟): ';
        autoSaveLabel.style.fontSize = '12px';
        autoSaveContainer.appendChild(autoSaveLabel);

        const autoSaveMinutesInput = document.createElement('input');
        autoSaveMinutesInput.type = 'number';
        autoSaveMinutesInput.min = '1';
        autoSaveMinutesInput.max = '60';
        autoSaveMinutesInput.step = '1';
        autoSaveMinutesInput.value = autoSaveMinutes;
        autoSaveMinutesInput.style.width = '40px';
        autoSaveMinutesInput.disabled = !autoSaveEnabled;
        autoSaveMinutesInput.onchange = function() {
            autoSaveMinutes = parseInt(this.value) || 5;
        };
        autoSaveContainer.appendChild(autoSaveMinutesInput);
        advancedContent.appendChild(autoSaveContainer);

        // 内存优化选项
        const memoryContainer = document.createElement('div');

        const memoryCheckbox = document.createElement('input');
        memoryCheckbox.type = 'checkbox';
        memoryCheckbox.id = 'memory-optimization';
        memoryCheckbox.checked = memoryOptimization;
        memoryCheckbox.onchange = function() {
            memoryOptimization = this.checked;
        };
        memoryContainer.appendChild(memoryCheckbox);

        const memoryLabel = document.createElement('label');
        memoryLabel.htmlFor = 'memory-optimization';
        memoryLabel.textContent = ' 启用内存优化';
        memoryLabel.style.fontSize = '12px';
        memoryContainer.appendChild(memoryLabel);
        advancedContent.appendChild(memoryContainer);

        // 导出选项
        const exportContainer = document.createElement('div');
        exportContainer.style.marginTop = '5px';

        const exportButton = document.createElement('button');
        exportButton.textContent = '导出为CSV';
        exportButton.style.fontSize = '12px';
        exportButton.style.padding = '3px 6px';
        exportButton.onclick = exportToCsv;
        exportContainer.appendChild(exportButton);

        const jsonButton = document.createElement('button');
        jsonButton.textContent = '导出为JSON';
        jsonButton.style.fontSize = '12px';
        jsonButton.style.padding = '3px 6px';
        jsonButton.style.marginLeft = '5px';
        jsonButton.onclick = exportToJson;
        exportContainer.appendChild(jsonButton);

        // 手动保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '手动保存';
        saveButton.style.fontSize = '12px';
        saveButton.style.padding = '3px 6px';
        saveButton.style.marginLeft = '5px';
        saveButton.onclick = function() {
            autoSaveData();
        };
        exportContainer.appendChild(saveButton);

        advancedContent.appendChild(exportContainer);
        advancedOptions.appendChild(advancedContent);
        contentContainer.appendChild(advancedOptions);

        container.appendChild(contentContainer);

        // 创建展开按钮（初始隐藏）
        const expandButton = document.createElement('div');
        expandButton.className = 'expand-button';
        expandButton.textContent = '+';
        expandButton.title = '展开';
        expandButton.style.display = 'none';
        expandButton.onclick = toggleMinimize;
        container.appendChild(expandButton);

        document.body.appendChild(container);

        // 创建状态指示器
        const indicator = document.createElement('div');
        indicator.className = 'status-indicator';
        indicator.id = 'status-indicator';
        indicator.style.display = 'none';
        document.body.appendChild(indicator);

        // 初始化内存统计
        updateMemoryStats();
    }

    // 切换最小化状态
    function toggleMinimize() {
        const container = document.querySelector('.auto-scroll-container');
        const contentContainer = container.querySelector('.content-container');
        const minimizeButton = container.querySelector('.minimize-button');
        const expandButton = container.querySelector('.expand-button');

        isMinimized = !isMinimized;

        if (isMinimized) {
            container.classList.add('minimized');
            contentContainer.style.display = 'none';
            minimizeButton.style.display = 'none';
            expandButton.style.display = 'flex';
        } else {
            container.classList.remove('minimized');
            contentContainer.style.display = 'block';
            minimizeButton.style.display = 'block';
            expandButton.style.display = 'none';
        }
    }

    // 更新状态指示器
    const updateStatus = debounce(function(message) {
        const indicator = document.getElementById('status-indicator');
        const statsDiv = document.getElementById('data-stats');

        if (!indicator || !statsDiv) return;

        statsDiv.textContent = `已采集 ${getTotalDataCount()} 条数据`;
        indicator.textContent = message;
        indicator.style.display = 'block';

        // 5秒后自动隐藏指示器
        setTimeout(() => {
            if (indicator && !isScrolling) {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    indicator.style.display = 'none';
                    indicator.style.opacity = '1';
                }, 300);
            }
        }, 5000);
    }, 300);

    // 更新进度条
    function updateProgressBar(percentage) {
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = Math.min(100, Math.max(0, percentage)) + '%';
        }
    }

    // 更新滚动统计信息
    function updateScrollStats() {
        const statsDiv = document.getElementById('scroll-stats');
        if (!statsDiv) return;

        let runTime = '0:00';
        if (scrollStartTime) {
            const elapsedSeconds = Math.floor((Date.now() - scrollStartTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            runTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        statsDiv.innerHTML = `滚动次数: ${scrollAttempts} | 滚动距离: ${totalScrollDistance}px | 运行时间: ${runTime}`;
    }

    // 更新导出进度
    function updateExportProgress(percentage) {
        const progressDiv = document.getElementById('export-progress');
        if (progressDiv) {
            progressDiv.textContent = `导出进度: ${Math.round(percentage)}%`;
            progressDiv.style.display = 'block';

            if (percentage >= 100) {
                setTimeout(() => {
                    progressDiv.style.display = 'none';
                }, 3000);
            }
        }
    }

    // 初始化数据保存功能
    function initDataPreservation() {
        // 使用MutationObserver监视DOM变化
        observer = new MutationObserver(throttle(function(mutations) {
            if (!isScrolling || isPaused) return;

            // 查找ReactVirtualized组件
            const virtualList = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
            if (!virtualList) return;

            // 获取当前显示的所有行
            const currentRows = Array.from(virtualList.children);
            if (currentRows.length === 0) return;

            let newDataAdded = false;
            let initialDataLength = allPreservedData.length;
            let newRowsData = [];

            // 提取每行的数据
            currentRows.forEach(row => {
                // 使用行的属性或内容创建唯一ID
                const rowId = row.getAttribute('aria-rowindex') ||
                              row.textContent.replace(/\s+/g, '').substring(0, 50);

                // 如果已处理过此行，则跳过
                if (processedRowIds.has(rowId)) return;

                // 标记为已处理
                processedRowIds.add(rowId);

                const playerElements = row.querySelectorAll('a');
                if (playerElements.length === 0) return;

                // 提取玩家数据
                const players = Array.from(playerElements)
                    .map(el => el.textContent.trim())
                    .filter(text => text);

                // 如果没有有效数据，则跳过
                if (players.length === 0) return;

                // 创建行数据对象
                const rowData = {
                    id: rowId,
                    timestamp: new Date().toISOString(),
                    players: players
                };

                // 添加到临时数组
                newRowsData.push(rowData);
                newDataAdded = true;
            });

            // 批量处理新数据
            if (newRowsData.length > 0) {
                // 如果启用内存优化，则只保留必要的数据
                if (memoryOptimization) {
                    newRowsData = newRowsData.map(row => ({
                        id: row.id,
                        players: row.players
                    }));
                }

                // 添加到保存列表
                allPreservedData = allPreservedData.concat(newRowsData);
                totalDataCollected += newRowsData.length;

                // 检查是否需要优化内存使用
                optimizeMemoryUsage();
            }

            // 检查是否有新数据添加
            if (newDataAdded) {
                noNewDataCounter = 0; // 重置计数器
                updateStatus(`正在滚动，已采集 ${getTotalDataCount()} 条数据`);

                // 更新进度条，动态调整估计总数
                const estimatedTotal = Math.max(1000, getTotalDataCount() * 2);
                const percentage = Math.min(100, Math.round((getTotalDataCount() / estimatedTotal) * 100));
                updateProgressBar(percentage);
            } else {
                noNewDataCounter++;

                // 如果连续多次没有新数据，可能已经到达底部
                if (noNewDataCounter >= autoStopThreshold) {
                    stopAutoScroll();
                    updateStatus(`已自动停止滚动，共采集 ${getTotalDataCount()} 条数据`);
                    document.querySelector('button[disabled]').disabled = false;
                    document.querySelectorAll('button')[0].disabled = true;
                    document.querySelectorAll('button')[1].disabled = true;
                }
            }
        }, 200));

        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 开始自动滚动
    function startAutoScroll() {
        if (isScrolling) return;

        isScrolling = true;
        isPaused = false;
        scrollAttempts = 0;
        noNewDataCounter = 0;
        samePositionCounter = 0;
        lastScrollPosition = window.scrollY;
        totalScrollDistance = 0;
        scrollStartTime = Date.now();
        lastAutoSaveTime = new Date();

        // 滚动到页面顶部
        window.scrollTo(0, 0);

        // 设置滚动间隔
        startScrollInterval();
    }

    // 开始滚动间隔
    function startScrollInterval() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
        }

        scrollInterval = setInterval(() => {
            // 计算滚动步长，基于滚动速度
            const scrollStep = 100 * scrollSpeed;

            // 滚动页面
            window.scrollBy(0, scrollStep);
            totalScrollDistance += scrollStep;

            // 增加尝试次数
            scrollAttempts++;

            // 更新滚动统计信息
            updateScrollStats();

            // 检查是否已经到达页面底部
            const currentPosition = window.scrollY;
            if (Math.abs(currentPosition - lastScrollPosition) < 5) {
                samePositionCounter++;

                // 如果连续多次位置相同，判断为无法继续滚动
                if (samePositionCounter >= samePositionThreshold) {
                    stopAutoScroll();
                    updateStatus(`已到达页面底部，无法继续滚动，共采集 ${getTotalDataCount()} 条数据`);
                    document.querySelector('button[disabled]').disabled = false;
                    document.querySelectorAll('button')[0].disabled = true;
                    document.querySelectorAll('button')[1].disabled = true;
                    return;
                }
            } else {
                samePositionCounter = 0;
                lastScrollPosition = currentPosition;
            }

            // 如果达到最大尝试次数，停止滚动
            if (scrollAttempts >= maxScrollAttempts) {
                stopAutoScroll();
                updateStatus(`已达到最大滚动次数，共采集 ${getTotalDataCount()} 条数据`);
                document.querySelector('button[disabled]').disabled = false;
                document.querySelectorAll('button')[0].disabled = true;
                document.querySelectorAll('button')[1].disabled = true;
            }

            // 检查是否已经到达页面底部
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
                // 等待一段时间，看是否有新内容加载
                setTimeout(() => {
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
                        noNewDataCounter++;

                        // 如果连续多次检测到底部，停止滚动
                        if (noNewDataCounter >= autoStopThreshold) {
                            stopAutoScroll();
                            updateStatus(`已到达页面底部，共采集 ${getTotalDataCount()} 条数据`);
                            document.querySelector('button[disabled]').disabled = false;
                            document.querySelectorAll('button')[0].disabled = true;
                            document.querySelectorAll('button')[1].disabled = true;
                        }
                    }
                }, pauseBeforeScroll);
            }
        }, 500 / scrollSpeed); // 滚动间隔随速度调整
    }

    // 停止自动滚动
    function stopAutoScroll() {
        if (!isScrolling) return;

        isScrolling = false;
        isPaused = false;
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }

        // 最后更新一次滚动统计信息
        updateScrollStats();
    }

    // 复制所有数据到剪贴板
    function copyAllData() {
        const totalCount = getTotalDataCount();
        if (totalCount === 0) {
            alert('没有采集的数据可复制');
            return;
        }

        // 如果数据量很大，提示用户
        if (totalCount > 1000) {
            if (!confirm(`数据量较大(${totalCount}条)，复制可能需要一些时间，是否继续？`)) {
                return;
            }
        }

        // 获取所有数据
        const allData = getAllData();

        // 格式化数据为易读的文本
        let formattedData = '';

        // 按行组织数据
        const rowsMap = new Map();

        updateExportProgress(0);

        // 使用Web Worker处理大量数据
        const workerCode = `
            self.onmessage = function(e) {
                const data = e.data;
                const rowsMap = new Map();

                for (let i = 0; i < data.length; i++) {
                    const rowData = data[i];
                    // 使用第一个玩家名称作为行标识
                    const rowKey = rowData.players[0] || 'unknown';

                    if (!rowsMap.has(rowKey)) {
                        rowsMap.set(rowKey, rowData.players);
                    }

                    // 每处理100条数据，报告进度
                    if (i % 100 === 0) {
                        self.postMessage({
                            type: 'progress',
                            progress: Math.round((i / data.length) * 100)
                        });
                    }
                }

                // 将Map转换为数组并格式化输出
                let formattedData = '';
                let rowIndex = 1;
                rowsMap.forEach((players, key) => {
                    formattedData += '对局 ' + rowIndex++ + ':\\n';
                    players.forEach(player => {
                        formattedData += player + '\\n';
                    });
                    formattedData += '\\n';
                });

                self.postMessage({
                    type: 'result',
                    formattedData: formattedData,
                    rowCount: rowsMap.size
                });
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = function(e) {
            const message = e.data;

            if (message.type === 'progress') {
                updateExportProgress(message.progress);
            } else if (message.type === 'result') {
                // 创建临时文本区域并复制
                const textarea = document.createElement('textarea');
                textarea.value = message.formattedData;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                updateExportProgress(100);
                alert('已复制 ' + message.rowCount + ' 条数据到剪贴板');

                // 终止Worker
                worker.terminate();
            }
        };

        // 启动Worker处理数据
        worker.postMessage(allData);
    }

    // 导出为CSV格式
    function exportToCsv() {
        const totalCount = getTotalDataCount();
        if (totalCount === 0) {
            alert('没有采集的数据可导出');
            return;
        }

        // 获取所有数据
        const allData = getAllData();

        updateExportProgress(0);

        // 使用Web Worker处理大量数据
        const workerCode = `
            self.onmessage = function(e) {
                const data = e.data;
                const rowsMap = new Map();

                for (let i = 0; i < data.length; i++) {
                    const rowData = data[i];
                    // 使用第一个玩家名称作为行标识
                    const rowKey = rowData.players[0] || 'unknown';

                    if (!rowsMap.has(rowKey)) {
                        rowsMap.set(rowKey, rowData.players);
                    }

                    // 每处理100条数据，报告进度
                    if (i % 100 === 0) {
                        self.postMessage({
                            type: 'progress',
                            progress: Math.round((i / data.length) * 50) // 前半部分进度
                        });
                    }
                }

                // 找出最大玩家数量
                let maxPlayers = 0;
                rowsMap.forEach(players => {
                    maxPlayers = Math.max(maxPlayers, players.length);
                });

                // 创建CSV内容
                let csvContent = '';

                // 添加表头
                let headers = ['对局'];
                for (let i = 1; i <= maxPlayers; i++) {
                    headers.push('玩家' + i);
                }
                csvContent += headers.join(',') + '\\r\\n';

                // 添加数据行
                let rowIndex = 1;
                let processedRows = 0;
                const totalRows = rowsMap.size;

                rowsMap.forEach((players, key) => {
                    let row = ['对局' + rowIndex++];
                    players.forEach(player => {
                        // 处理CSV中的特殊字符
                        row.push('"' + player.replace(/"/g, '""') + '"');
                    });

                    // 补齐空列
                    while (row.length <= maxPlayers) {
                        row.push('');
                    }

                    csvContent += row.join(',') + '\\r\\n';

                    // 更新后半部分进度
                    processedRows++;
                    if (processedRows % 10 === 0) {
                        self.postMessage({
                            type: 'progress',
                            progress: 50 + Math.round((processedRows / totalRows) * 50)
                        });
                    }
                });

                self.postMessage({
                    type: 'result',
                    csvContent: csvContent,
                    rowCount: rowsMap.size
                });
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = function(e) {
            const message = e.data;

            if (message.type === 'progress') {
                updateExportProgress(message.progress);
            } else if (message.type === 'result') {
                // 创建下载链接
                const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + message.csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', '雀魂牌谱数据_' + new Date().toISOString().slice(0,10) + '.csv');
                document.body.appendChild(link);

                // 触发下载
                link.click();
                document.body.removeChild(link);

                updateExportProgress(100);
                alert('已导出 ' + message.rowCount + ' 条数据为CSV文件');

                // 终止Worker
                worker.terminate();
            }
        };

        // 启动Worker处理数据
        worker.postMessage(allData);
    }

    // 导出为JSON格式
    function exportToJson() {
        const totalCount = getTotalDataCount();
        if (totalCount === 0) {
            alert('没有采集的数据可导出');
            return;
        }

        // 获取所有数据
        const allData = getAllData();

        updateExportProgress(0);

        // 使用Web Worker处理大量数据
        const workerCode = `
            self.onmessage = function(e) {
                const data = e.data;
                const rowsMap = new Map();

                for (let i = 0; i < data.length; i++) {
                    const rowData = data[i];
                    // 使用第一个玩家名称作为行标识
                    const rowKey = rowData.players[0] || 'unknown';

                    if (!rowsMap.has(rowKey)) {
                        rowsMap.set(rowKey, rowData.players);
                    }

                    // 每处理100条数据，报告进度
                    if (i % 100 === 0) {
                        self.postMessage({
                            type: 'progress',
                            progress: Math.round((i / data.length) * 50) // 前半部分进度
                        });
                    }
                }

                // 转换为JSON数组
                const jsonData = [];
                let rowIndex = 1;
                let processedRows = 0;
                const totalRows = rowsMap.size;

                rowsMap.forEach((players, key) => {
                    jsonData.push({
                        id: rowIndex++,
                        players: players
                    });

                    // 更新后半部分进度
                    processedRows++;
                    if (processedRows % 10 === 0) {
                        self.postMessage({
                            type: 'progress',
                            progress: 50 + Math.round((processedRows / totalRows) * 50)
                        });
                    }
                });

                // 创建JSON内容
                const jsonContent = JSON.stringify(jsonData, null, 2);

                self.postMessage({
                    type: 'result',
                    jsonContent: jsonContent,
                    rowCount: jsonData.length
                });
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = function(e) {
            const message = e.data;

            if (message.type === 'progress') {
                updateExportProgress(message.progress);
            } else if (message.type === 'result') {
                // 创建下载链接
                const jsonContent = 'data:text/json;charset=utf-8,' +
                                   encodeURIComponent(message.jsonContent);

                const link = document.createElement('a');
                link.setAttribute('href', jsonContent);
                link.setAttribute('download', '雀魂牌谱数据_' + new Date().toISOString().slice(0,10) + '.json');
                document.body.appendChild(link);

                // 触发下载
                link.click();
                document.body.removeChild(link);

                updateExportProgress(100);
                alert('已导出 ' + message.rowCount + ' 条数据为JSON文件');

                // 终止Worker
                worker.terminate();
            }
        };

        // 启动Worker处理数据
        worker.postMessage(allData);
    }

    // 在页面关闭前提示用户保存数据
    window.addEventListener('beforeunload', function(e) {
        if (getTotalDataCount() > 0) {
            e.preventDefault();
            e.returnValue = '页面上有未保存的数据，确定要离开吗？';
            return e.returnValue;
        }
    });
})();