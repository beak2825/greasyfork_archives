// ==UserScript==
// @name         Google Search Suggestions Collector
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Collect Google search suggestions
// @author       WWW
// @include      *://www.google.*/*
// @include      *://google.*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519953/Google%20Search%20Suggestions%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/519953/Google%20Search%20Suggestions%20Collector.meta.js
// ==/UserScript==

let MAX_CONCURRENT_REQUESTS = 5; // 最大并发请求数
let REQUEST_DELAY = 100; // 请求间隔(ms)

(function() {
    'use strict';

    // 在全局作用域内添加状态变量
    let isCollecting = false;
    let shouldStop = false;

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .suggest-collector-btn {
                position: fixed;
                right: 200px;
                top: 20px;
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background: var(--collector-bg, #ffffff);
                border: 2px solid var(--collector-border, #e0e0e0);
                box-shadow: 0 2px 12px rgba(0,0,0,0.15);
                cursor: move;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
            }

            .suggest-collector-panel {
                position: fixed;
                width: 300px;
                background: var(--collector-bg, #ffffff);
                border: 1px solid var(--collector-border, #e0e0e0);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                display: none;
            }

            .suggest-collector-panel input {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--collector-border, #e0e0e0);
                border-radius: 4px;
                margin-bottom: 10px;
                background: var(--collector-input-bg, #ffffff);
                color: var(--collector-text, #333333);
            }

            .suggest-collector-panel button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
                transition: background 0.3s;
            }

            .suggest-collector-panel button:hover {
                background: #45a049;
            }

            .suggest-collector-panel textarea {
                background: var(--collector-input-bg, #ffffff);
                color: var(--collector-text, #333333);
                border: 1px solid var(--collector-border, #e0e0e0);
                border-radius: 4px;
            }

            @media (prefers-color-scheme: dark) {
                :root {
                    --collector-bg: #2d2d2d;
                    --collector-border: #404040;
                    --collector-text: #e0e0e0;
                    --collector-input-bg: #3d3d3d;
                }
            }

            .input-mode-selector {
                display: flex;
                gap: 20px;
                margin-bottom: 15px;
                padding: 0 10px;
            }

            .input-mode-selector label {
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                color: var(--collector-text, #333333);
                min-width: 70px;
            }

            .input-mode-selector input[type="radio"],
            .filter-options input[type="checkbox"] {
                margin: 0;
                cursor: pointer;
                width: 16px;
                height: 16px;
            }

            .filter-options {
                margin-bottom: 15px;
                padding: 0 10px;
            }

            .filter-options label {
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                color: var(--collector-text, #333333);
                justify-content: flex-end;
            }

            #singleInput {
                padding: 0 10px;
            }

            .depth-selector {
                margin-bottom: 15px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .depth-selector label {
                color: var(--collector-text, #333333);
            }

            .depth-selector select {
                padding: 5px;
                border-radius: 4px;
                border: 1px solid var(--collector-border, #e0e0e0);
                background: var(--collector-input-bg, #ffffff);
                color: var(--collector-text, #333333);
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    function createUI() {
        const btn = document.createElement('div');
        btn.className = 'suggest-collector-btn';
        btn.innerHTML = '🔍';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'suggest-collector-panel';
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div class="input-mode-selector">
                    <label><input type="radio" name="inputMode" value="single" checked> single</label>
                    <label><input type="radio" name="inputMode" value="batch"> batch</label>
                </div>
                <div class="filter-options">
                    <label><input type="checkbox" id="onlyEnglish"> Only English</label>
                </div>
            </div>
            <div class="depth-selector">
                <label>Search Depth:</label>
                <select id="searchDepth">
                    <option value="1">1 letter</option>
                    <option value="2">2 letters</option>
                    <option value="3">3 letters</option>
                    <option value="4">4 letters</option>
                    <option value="5">5 letters</option>
                </select>
            </div>
            <div class="performance-settings" style="display: flex; gap: 10px; margin-bottom: 15px; padding: 0 10px;">
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 5px; color: var(--collector-text);">Max Concurrent:</label>
                    <input type="number" id="maxConcurrent" value="5" min="1" max="20"
                        style="width: 100%; padding: 5px; border: 1px solid var(--collector-border);
                        border-radius: 4px; background: var(--collector-input-bg);
                        color: var(--collector-text);">
                </div>
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 5px; color: var(--collector-text);">Delay (ms):</label>
                    <input type="number" id="requestDelay" value="100" min="0" max="1000" step="50"
                        style="width: 100%; padding: 5px; border: 1px solid var(--collector-border);
                        border-radius: 4px; background: var(--collector-input-bg);
                        color: var(--collector-text);">
                </div>
            </div>
            <div id="singleInput">
                <input type="text" id="baseKeyword" placeholder="type keyword">
            </div>
            <div id="batchInput" style="display: none;">
                <textarea id="batchKeywords" placeholder="type keyword in each line" style="width: 100%; height: 100px; margin-bottom: 10px;"></textarea>
            </div>
            <button id="startCollect">start collect</button>
            <div id="estimatedTime" style="margin: 10px 0; color: var(--collector-text);"></div>
            <div id="progress" style="display: none; margin-top: 10px;">
                <div style="margin-bottom: 8px;">
                    total progress: <span id="totalProgress">0/0</span>
                    <div style="background: var(--collector-border); height: 20px; border-radius: 10px;">
                        <div id="totalProgressBar" style="width: 0%; height: 100%; background: #4CAF50; border-radius: 10px; transition: width 0.3s;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 8px;">
                    current keyword progress: <span id="progressText">0/26</span>
                    <div style="background: var(--collector-border); height: 20px; border-radius: 10px;">
                        <div id="progressBar" style="width: 0%; height: 100%; background: #4CAF50; border-radius: 10px; transition: width 0.3s;"></div>
                    </div>
                </div>
                <div>collected: <span id="collectedCount">0</span> items</div>
            </div>
            <div id="result" style="max-height: 300px; overflow-y: auto; margin-top: 10px;"></div>
        `;
        document.body.appendChild(panel);

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // 更新面板位置的函数
        function updatePanelPosition() {
            const btnRect = btn.getBoundingClientRect();
            panel.style.right = `${window.innerWidth - (btnRect.right + 20)}px`;
            panel.style.top = `${btnRect.bottom + 20}px`;
        }

        btn.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === btn) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
                // 拖动时更新面板位置
                updatePanelPosition();
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        btn.addEventListener('click', (e) => {
            if (!isDragging) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                if (panel.style.display === 'block') {
                    updatePanelPosition();
                }
            }
        });

        // 添加事件监听器来实时更新预估时间
        function updateEstimatedTime() {
            const maxConcurrent = parseInt(document.getElementById('maxConcurrent').value) || 5;
            const requestDelay = parseInt(document.getElementById('requestDelay').value) || 100;
            const searchDepth = parseInt(document.getElementById('searchDepth').value);
            const isBatchMode = document.querySelector('input[name="inputMode"]:checked').value === 'batch';
            
            let keywordCount = 0;
            if (isBatchMode) {
                const batchText = document.getElementById('batchKeywords').value.trim();
                keywordCount = batchText.split('\n').filter(k => k.trim()).length;
            } else {
                const singleKeyword = document.getElementById('baseKeyword').value.trim();
                keywordCount = singleKeyword ? 1 : 0;
            }

            if (keywordCount === 0) {
                document.getElementById('estimatedTime').innerHTML = 
                    'Please enter keyword(s) to see estimated time';
                return;
            }

            const { totalRequests, estimatedSeconds } = calculateEstimatedTime(
                keywordCount,
                searchDepth,
                maxConcurrent,
                requestDelay
            );

            const minutes = Math.floor(estimatedSeconds / 60);
            const seconds = estimatedSeconds % 60;
            const timeStr = minutes > 0 
                ? `${minutes} min ${seconds} sec`
                : `${seconds} sec`;
            
            document.getElementById('estimatedTime').innerHTML = 
                `Estimated time: ${timeStr}<br>Total requests: ${totalRequests}`;
        }

        // 添加事件监听器到所有可能影响预估时间的输入元素
        document.getElementById('maxConcurrent').addEventListener('input', updateEstimatedTime);
        document.getElementById('requestDelay').addEventListener('input', updateEstimatedTime);
        document.getElementById('searchDepth').addEventListener('change', updateEstimatedTime);
        document.getElementById('baseKeyword').addEventListener('input', updateEstimatedTime);
        document.getElementById('batchKeywords').addEventListener('input', updateEstimatedTime);
        
        const radioButtons = panel.querySelectorAll('input[name="inputMode"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('singleInput').style.display = 
                    e.target.value === 'single' ? 'block' : 'none';
                document.getElementById('batchInput').style.display = 
                    e.target.value === 'batch' ? 'block' : 'none';
                updateEstimatedTime(); // 添加这行来更新预估时间
            });
        });
    }

    async function getSuggestions(keyword, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(keyword)}`);
                const data = await response.json();
                return data[1];
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000)); // 失败后等待1秒再重试
            }
        }
    }

    function updateProgress(current, total, collectedItems) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const collectedCount = document.getElementById('collectedCount');
        const progress = document.getElementById('progress');

        progress.style.display = 'block';
        const percentage = (current / total) * 100;
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${current}/${total}`;
        collectedCount.textContent = collectedItems.size;
    }

    function generateCombinations(letters, depth) {
        if (depth === 1) return letters.map(letter => [letter]);

        const combinations = [];
        for (let i = 0; i < letters.length; i++) {
            const subCombinations = generateCombinations(letters.slice(i + 1), depth - 1);
            subCombinations.forEach(subComb => {
                combinations.push([letters[i], ...subComb]);
            });
        }
        return combinations;
    }

    async function asyncPool(concurrency, iterable, iteratorFn) {
        const ret = []; // 存储所有的异步任务
        const executing = new Set(); // 存储正在执行的异步任务

        for (const item of iterable) {
            const p = Promise.resolve().then(() => iteratorFn(item, ret)); // 创建异步任务
            ret.push(p); // 保存新的异步任务
            executing.add(p); // 添加到执行集合

            const clean = () => executing.delete(p);
            p.then(clean).catch(clean);

            if (executing.size >= concurrency) {
                await Promise.race(executing); // 等待某个任务完成
            }

            await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY)); // 添加请求间隔
        }

        return Promise.all(ret);
    }

    async function collectSuggestions(baseKeyword) {
        // 获取用户设置的值
        MAX_CONCURRENT_REQUESTS = parseInt(document.getElementById('maxConcurrent').value) || 5;
        REQUEST_DELAY = parseInt(document.getElementById('requestDelay').value) || 100;

        const result = new Set();
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const resultDiv = document.getElementById('result');
        const onlyEnglish = document.getElementById('onlyEnglish').checked;
        const searchDepth = parseInt(document.getElementById('searchDepth').value);

        const isEnglishOnly = (text) => /^[A-Za-z0-9\s.,!?-]+$/.test(text);

        if (shouldStop) {
            return Array.from(result);
        }

        // 收集基础关键词建议
        const baseSuggestions = await getSuggestions(baseKeyword);
        baseSuggestions.forEach(s => {
            if (!onlyEnglish || isEnglishOnly(s)) {
                result.add(s);
            }
        });

        // 生成所有可能的字母组合
        const allCombinations = [];
        for (let depth = 1; depth <= searchDepth; depth++) {
            const depthCombinations = generateCombinations(letters, depth);
            allCombinations.push(...depthCombinations);
        }

        // 更新进度条的总数
        const totalCombinations = allCombinations.length;
        let completedCount = 0;

        // 创建查询任务
        const searchTasks = allCombinations.map(combination => {
            return async () => {
                if (shouldStop) return [];

                const letterCombination = combination.join('');
                const suggestions = await getSuggestions(`${baseKeyword} ${letterCombination}`);

                completedCount++;
                updateProgress(completedCount, totalCombinations, result);

                return suggestions.filter(s => !onlyEnglish || isEnglishOnly(s));
            };
        });

        // 建一个固定的 textarea 元素
        resultDiv.innerHTML = `<textarea style="width: 100%; height: 200px;"></textarea>`;
        const resultTextarea = resultDiv.querySelector('textarea');

        // 使用并发池执行查询
        const results = await asyncPool(MAX_CONCURRENT_REQUESTS, searchTasks, async (task) => {
            const suggestions = await task();
            suggestions.forEach(s => result.add(s));

            // 保存当前滚动位置
            const scrollTop = resultTextarea.scrollTop;

            // 更新内容
            resultTextarea.value = Array.from(result).join('\n');

            // 恢复滚动位置
            resultTextarea.scrollTop = scrollTop;

            return suggestions;
        });

        return Array.from(result);
    }

    function calculateEstimatedTime(keywordCount, searchDepth, maxConcurrent, requestDelay) {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let totalRequests = 0;
        
        // 计算每个关键词的请求数（基础请求 + 字母组合请求）
        for (let depth = 1; depth <= searchDepth; depth++) {
            // 计算组合数
            let combinations = 1;
            for (let i = 0; i < depth; i++) {
                combinations *= (letters.length - i);
            }
            for (let i = depth; i > 0; i--) {
                combinations = Math.floor(combinations / i);
            }
            totalRequests += combinations;
        }
        totalRequests += 1; // 加上基础关键词的请求
        totalRequests *= keywordCount; // 乘以关键词数量

        // 计算总时长（毫秒）
        const avgResponseTime = 300; // 假设平均响应时间为300ms
        const batchCount = Math.ceil(totalRequests / maxConcurrent);
        const totalTime = batchCount * (avgResponseTime + requestDelay);
        
        return {
            totalRequests,
            estimatedSeconds: Math.ceil(totalTime / 1000)
        };
    }

    function init() {
        addStyles();
        createUI();

        const startCollectBtn = document.getElementById('startCollect');

        startCollectBtn.addEventListener('click', async () => {
            if (isCollecting) {
                // 如果正在收集，点击按钮则停止
                shouldStop = true;
                startCollectBtn.textContent = 'start collect';
                startCollectBtn.style.background = '#4CAF50';
                isCollecting = false;
                return;
            }

            const isBatchMode = document.querySelector('input[name="inputMode"]:checked').value === 'batch';
            let keywords = [];

            if (isBatchMode) {
                const batchText = document.getElementById('batchKeywords').value.trim();
                keywords = batchText.split('\n').filter(k => k.trim());
            } else {
                const singleKeyword = document.getElementById('baseKeyword').value.trim();
                if (singleKeyword) {
                    keywords = [singleKeyword];
                }
            }

            if (keywords.length === 0) {
                alert('Please enter a keyword');
                return;
            }

            // 开始收集
            isCollecting = true;
            shouldStop = false;
            startCollectBtn.textContent = 'stop collect';
            startCollectBtn.style.background = '#ff4444';
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'Collecting...';
            document.getElementById('progress').style.display = 'block';

            try {
                const allSuggestions = new Set();
                const totalKeywords = keywords.length;

                for (let i = 0; i < keywords.length; i++) {
                    if (shouldStop) {
                        break;
                    }

                    const keyword = keywords[i];
                    document.getElementById('totalProgress').textContent = `${i + 1}/${totalKeywords}`;
                    document.getElementById('totalProgressBar').style.width = `${((i + 1) / totalKeywords) * 100}%`;

                    const suggestions = await collectSuggestions(keyword);
                    suggestions.forEach(s => allSuggestions.add(s));
                }

                const resultText = Array.from(allSuggestions).join('\n');
                resultDiv.innerHTML = `
                    <textarea style="width: 100%; height: 200px;">${resultText}</textarea>
                    <button id="copyBtn">Copy to Clipboard</button>
                `;

                document.getElementById('copyBtn').addEventListener('click', () => {
                    GM_setClipboard(resultText);
                    alert('Copied to clipboard!');
                });
            } catch (error) {
                resultDiv.innerHTML = 'Error occurred while collecting: ' + error.message;
            } finally {
                // 恢复按钮状态
                isCollecting = false;
                shouldStop = false;
                startCollectBtn.textContent = 'start collect';
                startCollectBtn.style.background = '#4CAF50';
            }
        });
    }

    init();
})();