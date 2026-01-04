// ==UserScript==
// @name         自动任务认领
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  智能重启任务系统（可视化版）
// @match        https://cuttlefish.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543856/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/543856/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        MAX_FAILURES: 3000,
        MAX_CLICKS: 50,
        TASK_THRESHOLD: 60,
        RESTART_THRESHOLD: 30,      // 可修改的连续失败重启阈值
        MAX_RETRIES: 3,             // 最大自动重启次数
        RETRY_DELAY: 5000,          // 重启延迟时间(毫秒)
        API_ENDPOINT: 'http://localhost:8083',
        BASE_DELAY: 500,
        RANDOM_RANGE: 800,
        HUMAN_VARIATION: 0.2,
        HARDCODED_BLACKLIST: ['大全',
			'三全',
			'\\',
			'/',
			':',
			'*',
			'?',
			'"',
			'<',
			'>',
			'|'],
        CUSTOM_BLACKLIST_KEY: 'taskBlacklist',
        savedInput: { category: '', keywords: [] },
        currentRetries: 0,
		TASK_TARGET_3: 3,
		TASK_TARGET_4: 4,
		TASK_TITLE_MAX_LENGTH: 25,
		TASK_REQUEST_DELAY_MS: 400,
    };
	CONFIG.API_PICK = CONFIG.API_ENDPOINT + '/generate/ft/pick';
	CONFIG.API_CREATE = CONFIG.API_ENDPOINT + '/generate/ft/create';

    let systemStatus = {
        username: '加载中...',
        tasks: [],
        running: false,
        intervalId: null,
        currentIndex: 0,
        startTime: null,
        stats: {
            total: 0,
            success: 0,
            failures: 0,
            clicks: 0,
        },
        consecutiveFails: 0,       // 新增：连续失败次数
        restartCount: 0,           // 新增：重启次数统计
        failedTitles: JSON.parse(localStorage.getItem('failedTitles') || '[]'),
        blacklist: [...CONFIG.HARDCODED_BLACKLIST, ...JSON.parse(localStorage.getItem(CONFIG.CUSTOM_BLACKLIST_KEY) || '[]')],
        limitReached: false,
        lastExecTime: 0,
		taskTarget: CONFIG.TASK_TARGET_4
    };

    const { controlPanel, statusPanel } = createInterface();
    document.body.append(controlPanel, statusPanel);

    function createInterface() {
        const controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            background: white;
            padding: 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            min-width: 280px;
            max-width: 280px;
            cursor: default;
        `;
        controlPanel.innerHTML = `
            <div class="drag-header" style="padding:12px;background:#056B00;color:white;cursor:move;">
                任务控制中心
                <span style="float:right;font-size:0.8em;">
                    <span id="blacklistBtn" style="cursor:pointer;margin-right:5px;">🛡️</span>
                    ↯ 1.9.5
                </span>
            </div>
            <div style="padding:15px;">
                <input id="category" type="text" placeholder="栏目编号" style="width:40%">
                <input id="key_word" type="text" placeholder="关键词" style="width:40%">
                <button id="mainBtn" style="width:100%;background:#056B00; color:white; padding:8px; border:none; cursor:pointer; margin-bottom:15px;">
                    启动系统
                </button>
                <div id="statusDisplay" style="color:#666; font-size:0.9em;">
                    <div>📋 任务总数：<span id="taskCount">0</span></div>
                    <div>🔄 重启次数：<span id="restartCount">0</span></div>
                    <div>❌ 连续失败：<span id="consecutiveFails">0</span>/${CONFIG.RESTART_THRESHOLD}</div>
                    <div>⏱ 运行时间：00:00:00</div>
                    <div>✅ 成功认领：0</div>
                    <div>📊 进度：<progress value="0" max="100"></progress> 0%</div>
                </div>
            </div>
        `;

        const statusPanel = document.createElement('div');
        statusPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 20%;
            background: white;
            padding: 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9998;
            width: 180px;
            cursor: default;
        `;
        statusPanel.innerHTML = `
            <div class="drag-header" style="padding:10px 12px;background:#666;color:white;cursor:move;">
                实时监控
                <span style="float:right;font-size:0.8em;">↻ 已连接</span>
            </div>
            <div style="padding:10px 15px;">
                <div id="liveStats">
                    <div>📈 处理速度：<span>0.00</span>/秒</div>
                    <div>📌 当前任务：<span>等待中...</span></div>
                    <div>⚠️ 系统状态：<span style="color:green">正常</span></div>
                </div>
            </div>
        `;

        makeDraggable(controlPanel, controlPanel.querySelector('.drag-header'));
        makeDraggable(statusPanel, statusPanel.querySelector('.drag-header'));

        return { controlPanel, statusPanel };
    }

    function makeDraggable(panel, header) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = parseFloat(panel.style.left) || panel.offsetLeft;
            initialY = parseFloat(panel.style.top) || panel.offsetTop;
            panel.style.transition = 'none';
        }

        function drag(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, initialX + dx));
            const newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, initialY + dy));

            panel.style.left = `${newX}px`;
            panel.style.top = `${newY}px`;
        }

        function stopDrag() {
            isDragging = false;
            panel.style.transition = 'all 0.3s ease';
        }
    }

    function createBlacklistManager() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            min-width: 400px;
            max-height: 80vh;
            overflow: auto;
        `;

        panel.innerHTML = `
            <h3 style="margin-top:0;">黑名单管理</h3>
            <div style="display:flex;gap:10px;margin-bottom:15px;">
                <input id="blacklistInput" type="text" placeholder="输入关键词"
                    style="flex:1;padding:8px;border:1px solid #ddd;">
                <button id="addBlacklist" style="padding:8px 15px;background:#056B00;color:white;border:none;cursor:pointer;">
                    添加
                </button>
            </div>
            <div id="blacklistList" style="border-top:1px solid #eee;padding-top:15px;"></div>
            <div style="margin-top:15px;display:flex;gap:10px;justify-content:flex-end;">
                <button id="importBlacklist" style="padding:6px 12px;background:#f0f0f0;border:1px solid #ddd;cursor:pointer;">
                    导入
                </button>
                <button id="exportBlacklist" style="padding:6px 12px;background:#f0f0f0;border:1px solid #ddd;cursor:pointer;">
                    导出
                </button>
            </div>
        `;

        function renderList() {
            const listContainer = panel.querySelector('#blacklistList');
            listContainer.innerHTML = systemStatus.blacklist
                .map(
                    (word) => `
                <div style="display:flex;align-items:center;padding:8px;border-bottom:1px solid #eee;">
                    <span style="flex:1;">
                        ${word}
                        ${CONFIG.HARDCODED_BLACKLIST.includes(word) ? '<span style="color:#666;font-size:0.8em;">（系统默认）</span>' : ''}
                    </span>
                    ${!CONFIG.HARDCODED_BLACKLIST.includes(word)
                        ? `<button class="removeWord" data-word="${word}"
                         style="background:none;border:none;color:#cc0000;cursor:pointer;">×</button>`
                        : ''}
                </div>
            `
                )
                .join('');
        }

        panel.querySelector('#addBlacklist').addEventListener('click', () => {
            const input = panel.querySelector('#blacklistInput');
            const word = input.value.trim();
            if (word && !systemStatus.blacklist.includes(word)) {
                const customList = JSON.parse(localStorage.getItem(CONFIG.CUSTOM_BLACKLIST_KEY) || '[]');
                customList.push(word);
                localStorage.setItem(CONFIG.CUSTOM_BLACKLIST_KEY, JSON.stringify(customList));
                systemStatus.blacklist.push(word);
                renderList();
                input.value = '';
            }
        });

        panel.addEventListener('click', (e) => {
            if (e.target.classList.contains('removeWord')) {
                const word = e.target.dataset.word;
                const customList = JSON.parse(localStorage.getItem(CONFIG.CUSTOM_BLACKLIST_KEY) || '[]').filter((w) => w !== word);
                localStorage.setItem(CONFIG.CUSTOM_BLACKLIST_KEY, JSON.stringify(customList));
                systemStatus.blacklist = [...CONFIG.HARDCODED_BLACKLIST, ...customList];
                renderList();
            }
        });

        panel.querySelector('#exportBlacklist').addEventListener('click', () => {
            const customList = JSON.parse(localStorage.getItem(CONFIG.CUSTOM_BLACKLIST_KEY) || '[]');
            const data = JSON.stringify(customList);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'blacklist_backup.json';
            a.click();
        });

        panel.querySelector('#importBlacklist').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        const customList = Array.from(new Set([...JSON.parse(localStorage.getItem(CONFIG.CUSTOM_BLACKLIST_KEY) || '[]'), ...data]));
                        localStorage.setItem(CONFIG.CUSTOM_BLACKLIST_KEY, JSON.stringify(customList));
                        systemStatus.blacklist = [...CONFIG.HARDCODED_BLACKLIST, ...customList];
                        renderList();
                    } catch (error) {
                        alert('文件格式错误！');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        overlay.appendChild(panel);
        renderList();
        return overlay;
    }

    document.querySelector('#blacklistBtn').addEventListener('click', () => {
        const manager = createBlacklistManager();
        document.body.appendChild(manager);
        manager.addEventListener('click', (e) => {
            if (e.target === manager) {
                document.body.removeChild(manager);
            }
        });
    });

    document.querySelector('#mainBtn').addEventListener('click', async () => {
        if (!systemStatus.running) {
            const categoryInput = document.querySelector('#category').value;
            const keywords = document.querySelector('#key_word').value.split(',');

            const categoryIds = categoryInput
                .split(',')
                .map((num) => {
                    const n = parseInt(num);
                    if (n === 0) return 99;
                    if (n === 12) return 11;
                    return n > 0 ? n - 1 : 99;
                })
                .filter((id) => id >= 0 && id <= 105);

            showAlert(`🗃️ 任务采集模式已启动，正在爬取前${CONFIG.TASK_THRESHOLD}个优质任务...`);
            await initializeSystem(categoryIds, keywords);
        } else {
            shutdownSystem('手动停止');
        }
    });

    /**
	* * 系统初始化，开启任务总入口
	**/
	async function initializeSystem(categoryIds, keywords) {
        CONFIG.savedInput = {
            category: document.querySelector('#category').value,
            keywords: document.querySelector('#key_word').value.split(',')
        };

        systemStatus.running = true;
        systemStatus.currentIndex = 0;
        systemStatus.startTime = Date.now();
        systemStatus.limitReached = false;
        document.querySelector('#mainBtn').textContent = '停止系统';
        document.querySelector('#mainBtn').style.background = '#cc0000';

        await fetchUserInfo();
        await loadTasks(categoryIds, keywords);
        renderTaskList();
        startAutoClaim();
    }

    /**
	* * 1. 获取用户信息
	**/
	async function fetchUserInfo() {
        try {
            const response = await fetch('https://cuttlefish.baidu.com/user/shopfufei/getwithdrawlog');
            const responseData = await response.json();
            systemStatus.username = responseData.data.userInfo.uname || '未知用户';
        } catch (error) {
            systemStatus.username = '获取失败';
        }
    }

    /**
	* * 2. 获取任务（至内存结构systemStatus.tasks），最多CONFIG.TASK_THRESHOLD（60个）
	* *  外层循环：标签页栏目，如推荐、学前教育能
	* *  内层循环：分页获取任务列表，直至 获取不到或达到上限 CONFIG.TASK_THRESHOLD
	**/
	async function loadTasks(categoryIds, keywords) {
        systemStatus.tasks = [];

        outer: for (const cid of categoryIds) {
            let page = 0;
			let target = CONFIG.TASK_TARGET_4;

			// 获取当前用户原力任务级别，先4后3
			let testUrl = `https://cuttlefish.baidu.com/gcontent/targettask/querylist?cid=1&pn=0&rn=20&word=&tab=1&target=${target}`;
			let testResponse = await fetch(testUrl);
			let testResult = await testResponse.json();

			if (testResult.status.code === 200017 ) {
				target = CONFIG.TASK_TARGET_3;

				testUrl = `https://cuttlefish.baidu.com/gcontent/targettask/querylist?cid=1&pn=0&rn=20&word=&tab=1&target=${target}`;
				testResponse = await fetch(testUrl);
				testResult = await testResponse.json();
				if (testResult.status.code === 200017 ) {
					let msg = '系统错误，已尝试4级、3级原力任务，均无法领取！';
					console.log(msg);
					return shutdownSystem(msg);
				}  else if (testResult.status.code === 0 ) {
					systemStatus.taskTarget = CONFIG.TASK_TARGET_3;
					console.log('可领取3级原力任务！');
				}
			} else if (testResult.status.code === 0 ) {
				console.log('可领取4级原力任务！');
			}

            // 获取任务
			while (true) {
                try {
                    // https://cuttlefish.baidu.com/gcontent/targettask/querylist?cid=99&pn=1&rn=20&word=作用,故事&tab=1&target=4
					const url = `https://cuttlefish.baidu.com/gcontent/targettask/querylist?cid=${cid}&pn=${page}&rn=20&word=${keywords.join(' ')}&tab=1&target=${systemStatus.taskTarget}`;
                    const response = await fetch(url);
                    const result = await response.json();

                    if (result.status.code !== 0 || !result.data?.list?.length) break;

                    for (const item of result.data.list) {
                        if (systemStatus.tasks.length >= CONFIG.TASK_THRESHOLD) break outer;

                        const isThroughFilter = isThroughBasicFilter(item.queryName);
						if (isThroughFilter && !isBlacklisted(item.queryName) && !isFailedTask(item.queryName)) {
                            systemStatus.tasks.push({
                                id: item.queryId,
                                name: item.queryName,
                                price: parseFloat(item.estimatedPrice),
                                claimed: false,
                                success: false,
                            });
                        }
                    }
                    page++;
					// 模拟人工操作，适当延迟
					await sleep(CONFIG.TASK_REQUEST_DELAY_MS); 
                } catch (error) {
                    break;
                }
            }
        }

		await pickTask();
        systemStatus.stats.total = systemStatus.tasks.length;
        systemStatus.tasks.sort((a, b) => b.price - a.price);
        document.getElementById('taskCount').textContent = systemStatus.tasks.length;
    }
	
	function isThroughBasicFilter(title) {
		  if (typeof title !== 'string') {
			return false;
		  }
		  const trimmedTitle = title.trim();
		  if (trimmedTitle === '') {
			return false;
		  }
		  if (trimmedTitle.length > CONFIG.TASK_TITLE_MAX_LENGTH) {
			return false;
		  }
		  const allowedPattern = /^[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u0000-\u007f]*$/;
		  if (!allowedPattern.test(trimmedTitle)) {
			return false;
		  }
		  
		  return true;
	}

    function isBlacklisted(title) {
        return systemStatus.blacklist.some((word) => title.includes(word));
    }

    function isFailedTask(title) {
        return systemStatus.failedTitles.includes(title);
    }
	
	function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

	/**
	* * 2.1  挑选任务
	**/
    async function pickTask() {
        try {
            let originalTasks = systemStatus.tasks
			const response = await fetch(CONFIG.API_PICK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify({
					username: systemStatus.username,
					tasks:originalTasks
				}),
            });

            const responseData = await response.json();
			if (responseData.code === 0) {
				let pickedTasks = responseData.data.tasks;
				systemStatus.tasks = pickedTasks;
			}
            return {
                success: responseData.code === 0,
                message: responseData.msg,
            };
        } catch (error) {
            return { success: false, message: '网络错误' };
        }
    }


    /**
	* * 3. 任务列表渲染
	**/
	function renderTaskList() {
        const existingContainer = document.querySelector('#taskContainer');
        if (existingContainer) existingContainer.remove();

        const container = document.createElement('div');
        container.id = 'taskContainer';
        container.style.cssText = `
            margin: 20px auto;
            width: 90%;
            background: white;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-height: 60vh;
            overflow: auto;
            position: relative;
            z-index: 9996;
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '▲ 折叠任务列表';
        toggleBtn.style.cssText = `
            position: sticky;
            top: 0;
            background: #056B00;
            color: white;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            z-index: 9997;
        `;
        toggleBtn.onclick = () => {
            const table = container.querySelector('table');
            table.style.display = table.style.display === 'none' ? 'block' : 'none';
            toggleBtn.textContent = table.style.display === 'none' ? '▼ 展开任务列表' : '▲ 折叠任务列表';
        };

        const table = document.createElement('table');
        table.style.width = '100%';
        table.innerHTML = `
            <thead>
                <tr>
                    <th style="width:15%">任务ID</th>
                    <th style="width:45%">任务名称</th>
                    <th style="width:15%">金额</th>
                    <th style="width:15%">状态</th>
                    <th style="width:10%">操作</th>
                </tr>
            </thead>
            <tbody>
                ${systemStatus.tasks
                    .map(
                        (task) => `
                    <tr data-id="${task.id}">
                        <td>${task.id}</td>
                        <td>${task.name}</td>
                        <td>¥${task.price.toFixed(2)}</td>
                        <td>${getStatusText(task)}</td>
                        <td>
                            <button class="claimBtn" ${task.claimed ? 'disabled' : ''}>
                                ${getButtonText(task)}
                            </button>
                        </td>
                    </tr>
                `
                    )
                    .join('')}
            </tbody>
        `;

        container.appendChild(toggleBtn);
        container.appendChild(table);

        const pageBottom = document.createElement('div');
        pageBottom.id = 'taskListAnchor';
        document.body.appendChild(pageBottom);
        pageBottom.after(container);

        function getStatusText(task) {
            if (!task.claimed) return '🟡 待认领';
            return task.success ? '✅ 已认领' : '❌ 认领失败';
        }

        function getButtonText(task) {
            if (!task.claimed) return '立即认领';
            return task.success ? '已完成' : '认领失败';
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        #taskContainer {
            transition: all 0.3s ease;
        }

        @media (max-height: 800px) {
            #taskContainer {
                max-height: 50vh;
            }
        }

        #taskContainer table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        #taskContainer th, #taskContainer td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
        }

        #taskContainer th {
            background-color: #f5f5f5;
        }

        #taskContainer tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    `;
    document.head.appendChild(style);

    /**
	* * 4 任务自动认领
	**/
	function startAutoClaim() {
        const humanizedLoop = async () => {
            if (!systemStatus.running) return;

            const task = findNextTask();
            if (!task) return shutdownSystem('已达认领上限');

            try {
                console.log('待认领百度原力任务：', task.name);
				const result = await claimTask(task.id);
                if (result.success) {
                    console.log('百度原力任务认领成功：', task.name);
					handleSuccess(task);
                } else {
                    console.log('百度原力任务认领失败：', task.name);
					handleApiError(task, result);
                }
            } catch (error) {
                console.log('百度原力任务认领失败：', task.name);
				handleFailure(task);
            }

            checkStopConditions();
            setTimeout(humanizedLoop, getDynamicInterval());
        };

        humanizedLoop();
    }

    function getDynamicInterval() {
        let interval = CONFIG.BASE_DELAY + Math.random() * CONFIG.RANDOM_RANGE;
        const speedVariation = 1 + (Math.random() - 0.5) * CONFIG.HUMAN_VARIATION;
        interval *= speedVariation;

        if (systemStatus.stats.failures > 0) {
            interval *= 1 + systemStatus.stats.failures * 0.1;
        }

        if (systemStatus.stats.clicks > CONFIG.MAX_CLICKS * 0.8) {
            interval += Math.random() * 1500;
        }

        return Math.max(500, Math.min(interval, 6000));
    }

    function findNextTask() {
        for (let i = systemStatus.currentIndex; i < systemStatus.tasks.length; i++) {
            if (!systemStatus.tasks[i].claimed) {
                systemStatus.currentIndex = i + 1;
                return systemStatus.tasks[i];
            }
        }
        return null;
    }

	/**
	* * 4.1  认领任务
	**/
    async function claimTask(taskId) {
        try {
            const response = await fetch('https://cuttlefish.baidu.com/gcontent/targettask/queryclaim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryId: taskId,
                    type: 1,
                    target: systemStatus.taskTarget,
                }),
            });

            const responseData = await response.json();
            return {
                success: responseData.status.code === 0,
                message: responseData.status.msg,
            };
        } catch (error) {
            return { success: false, message: '网络错误' };
        }
    }

    function handleSuccess(task) {
        systemStatus.consecutiveFails = 0; // 成功时重置连续失败
        updateFailureDisplay();

        task.claimed = true;
        task.success = true;
        systemStatus.stats.success++;
        systemStatus.stats.clicks++;
        systemStatus.stats.failures = 0;
        sendToAI(task);
        updateTaskRow(task.id);
    }

    function handleApiError(task, result) {
        if (result.message.includes('已达上限')) {
            systemStatus.limitReached = true;
            shutdownSystem('认领数量已达上限');
            return;
        }
        handleFailure(task);
    }

    function handleFailure(task) {
        systemStatus.consecutiveFails++; // 累加连续失败次数
        updateFailureDisplay();

        task.claimed = true;
        task.success = false;
        systemStatus.stats.failures++;
        systemStatus.failedTitles.push(task.name);
        localStorage.setItem('failedTitles', JSON.stringify(systemStatus.failedTitles));
        updateTaskRow(task.id);
    }

    function updateFailureDisplay() {
        const failElement = document.querySelector('#consecutiveFails');
        if (failElement) {
            failElement.textContent = `${systemStatus.consecutiveFails}/${CONFIG.RESTART_THRESHOLD}`;
            failElement.style.color = systemStatus.consecutiveFails >= CONFIG.RESTART_THRESHOLD ? 'red' : 'inherit';
        }
    }

    /**
	* * 4.2  发送至java守护程序生成任务答案
	**/
	function sendToAI(task) {
        fetch(CONFIG.API_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                username: systemStatus.username,
                title: task.name,
                price: task.price,
                timestamp: new Date().toISOString(),
				taskTarget: systemStatus.taskTarget
            }),
        })
            .then((response) => {
                if (!response.ok) {
					console.error('AI生成命令发送失败：', task.name);
					throw new Error(`HTTP错误 ${response.status}`);
				}
                return response.json();
            })
            .then((data) => console.log('AI生成命令发送成功：', task.name))
            .catch((error) => {
                console.error('AI生成命令发送失败：', task.name, error);
                showAlert(`⚠️ 本地服务错误: ${error.message}`);
            });
    }

    function updateTaskRow(taskId) {
        const row = document.querySelector(`tr[data-id="${taskId}"]`);
        if (!row) return;

        const task = systemStatus.tasks.find((t) => t.id === taskId);
        const statusCell = row.querySelector('td:nth-child(4)');
        const button = row.querySelector('.claimBtn');

        statusCell.textContent = task.claimed ? (task.success ? '✅ 已认领' : '❌ 认领失败') : '🟡 待认领';
        button.disabled = task.claimed;
        button.textContent = task.claimed ? (task.success ? '已完成' : '认领失败') : '立即认领';
        row.style.backgroundColor = task.success ? '#e8f5e9' : '#ffebee';
    }

    function checkStopConditions() {
        if (systemStatus.stats.clicks >= CONFIG.MAX_CLICKS || systemStatus.stats.failures >= CONFIG.MAX_FAILURES || systemStatus.limitReached) {
            shutdownSystem();
        }
    }

    function shutdownSystem(reason = '手动停止') {
        const shouldRetry = systemStatus.consecutiveFails >= CONFIG.RESTART_THRESHOLD &&
                          CONFIG.currentRetries < CONFIG.MAX_RETRIES;

        if (systemStatus.stats.total < CONFIG.TASK_THRESHOLD && (reason.includes('上限') || reason.includes('全部处理'))) {
            reason = `任务已全部处理（共${systemStatus.stats.total}个）`;
        }

        systemStatus.running = false;
        document.querySelector('#mainBtn').textContent = '启动系统';
        document.querySelector('#mainBtn').style.background = '#056B00';

        if (shouldRetry) {
            CONFIG.currentRetries++;
            systemStatus.restartCount++;
            document.querySelector('#restartCount').textContent = systemStatus.restartCount;

            showAlert(`⚠️ 将在${CONFIG.RETRY_DELAY/1000}秒后第${systemStatus.restartCount}次重启...`, true);

            setTimeout(() => {
                systemStatus.stats.failures = 0;
                systemStatus.consecutiveFails = 0;
                systemStatus.limitReached = false;
                systemStatus.tasks = [];

                document.querySelector('#category').value = CONFIG.savedInput.category;
                document.querySelector('#key_word').value = CONFIG.savedInput.keywords.join(',');
                document.querySelector('#mainBtn').click();
            }, CONFIG.RETRY_DELAY);
        } else {
            updateStatusDisplay(reason);
            if (systemStatus.limitReached || reason.includes('上限')) {
                showAlert(`⛔ 系统已停止: ${reason}`);
            }
        }

        localStorage.setItem('failedTitles', JSON.stringify(systemStatus.failedTitles));
    }

    function updateStatusDisplay(reason) {
        const liveStats = document.querySelector('#liveStats');
        if (liveStats) {
            liveStats.innerHTML = `
                <div>📈 处理速度：<span>0.00</span>/秒</div>
                <div>📌 当前任务：<span>已停止</span></div>
                <div>⚠️ 系统状态：<span style="color:red">${reason}</span></div>
                ${systemStatus.limitReached ? '<div style="color:red;margin-top:5px;">⛔ 已达认领上限</div>' : ''}
            `;
        }
    }

    function showAlert(message, isRetry = false) {
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background: ${isRetry ? '#4CAF50' : '#ff4444'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
        `;
        alertBox.textContent = message;
        document.body.appendChild(alertBox);
        setTimeout(() => document.body.removeChild(alertBox), 3000);
    }

    setInterval(() => {
        if (!systemStatus.running) return;

        const runtime = Date.now() - systemStatus.startTime;
        const timeString = new Date(runtime).toISOString().substr(11, 8);
        const progress = ((systemStatus.stats.clicks / systemStatus.stats.total) * 100).toFixed(1);
        const speed = (systemStatus.stats.clicks / (runtime / 1000)).toFixed(2);

        document.querySelector('#statusDisplay').innerHTML = `
            <div>📋 任务总数：<span id="taskCount">${systemStatus.tasks.length}</span></div>
            <div>🔄 重启次数：<span id="restartCount">${systemStatus.restartCount}</span></div>
            <div>❌ 连续失败：<span id="consecutiveFails">${systemStatus.consecutiveFails}</span>/${CONFIG.RESTART_THRESHOLD}</div>
            <div>⏱ 运行时间：${timeString}</div>
            <div>✅ 成功认领：${systemStatus.stats.success}</div>
            <div>📊 进度：<progress value="${progress}" max="100"></progress> ${progress}%</div>
        `;

        const statusElement = document.querySelector('#liveStats');
        if (statusElement) {
            statusElement.innerHTML = `
                <div>📈 处理速度：<span>${speed}</span>/秒</div>
                <div>📌 当前任务：<span>${getCurrentTaskName()}</span></div>
                <div>⚠️ 系统状态：<span style="color:${getStatusColor()}">${getStatusText()}</span></div>
                ${systemStatus.limitReached ? '<div style="color:red;margin-top:5px;">⛔ 已达认领上限</div>' : ''}
            `;
        }

        function getCurrentTaskName() {
            const task = systemStatus.tasks.find((t) => !t.claimed);
            return task?.name || '无待处理任务';
        }

        function getStatusColor() {
            if (systemStatus.limitReached) return 'red';
            return systemStatus.stats.failures >= CONFIG.MAX_FAILURES ? 'red' : 'green';
        }

        function getStatusText() {
            if (systemStatus.limitReached) return '已达上限';
            return systemStatus.stats.failures >= CONFIG.MAX_FAILURES ? '异常' : '正常';
        }
    }, 1000);
})();