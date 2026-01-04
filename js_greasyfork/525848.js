// ==UserScript==
// @name         To-Do List + Pomodoro Timer (Ctrl+T)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Manages tasks with a Pomodoro timer, accessible via Ctrl+T.
// @author       kq (fixed by AI)
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525848/To-Do%20List%20%2B%20Pomodoro%20Timer%20%28Ctrl%2BT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525848/To-Do%20List%20%2B%20Pomodoro%20Timer%20%28Ctrl%2BT%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'kq_todo_pomodoro_tasks';
    let tasks = [];
    let showExpired = false;
    let timerInterval = null;
    let timeLeft = 0; // in seconds
    let currentTaskForTimer = null;
    let isTimerPaused = false;
    let selectedTaskIndexForPanel = -1;

    // --- Audio Setup ---
    let audioContext;

    function setupAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playAlarm() {
        if (!audioContext) setupAudio();
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        if (navigator.vibrate) navigator.vibrate(200);
    }

    // --- Data Management ---
    function loadTasks() {
        const tasksJSON = GM_getValue(STORAGE_KEY, '[]');
        tasks = JSON.parse(tasksJSON);
    }

    function saveTasks() {
        GM_setValue(STORAGE_KEY, JSON.stringify(tasks));
    }

    function getTaskById(id) {
        return tasks.find(task => task.id === id);
    }

    // --- UI Elements ---
    let managementPanel, taskListDiv, floatingHud, hudText, hudTime, hudProgressBar;

    function createManagementPanel() {
        const panel = document.createElement('div');
        panel.id = 'todo-pomodoro-panel';
        panel.innerHTML = `
            <div id="panel-header">
                <h2>To-Do List & Pomodoro (Ctrl+T)</h2>
                <button id="close-panel-btn">&times;</button>
            </div>
            <div id="task-input-area">
                <input type="text" id="new-task-name" placeholder="Task Name">
                <input type="number" id="new-task-duration" placeholder="Minutes (default 25)" min="1">
                <button id="add-task-btn">Add Task</button>
            </div>
            <div id="task-filters">
                <label><input type="checkbox" id="show-expired-checkbox"> Show Expired</label>
            </div>
            <div id="task-list-container"></div>
            <div id="panel-timer-controls">
                <h3>Timer for Selected Task</h3>
                <div id="selected-task-name-panel">No task selected</div>
                <div id="selected-task-timer-panel">00:00</div>
                <button id="start-task-btn" disabled>Start</button>
                <button id="pause-task-btn" disabled>Pause</button>
                <button id="stop-task-btn" disabled>Stop</button>
            </div>
        `;
        document.body.appendChild(panel);
        managementPanel = panel;
        taskListDiv = panel.querySelector('#task-list-container');

        panel.querySelector('#close-panel-btn').addEventListener('click', togglePanel);
        panel.querySelector('#add-task-btn').addEventListener('click', handleAddTask);

        panel.querySelector('#new-task-name').addEventListener('keypress', e => {
            if (e.key === 'Enter') handleAddTask();
        });

        panel.querySelector('#show-expired-checkbox').addEventListener('change', e => {
            showExpired = e.target.checked;
            renderTaskList();
        });

        panel.querySelector('#start-task-btn').addEventListener('click', handleStartPanelTimer);
        panel.querySelector('#pause-task-btn').addEventListener('click', handlePausePanelTimer);
        panel.querySelector('#stop-task-btn').addEventListener('click', handleStopPanelTimer);
    }

    function createFloatingHUD() {
        const hud = document.createElement('div');
        hud.id = 'todo-pomodoro-hud';
        hud.innerHTML = `
            <div id="hud-task-info">
                <span id="hud-current-task-name">No active task</span>
                <span id="hud-completion-percentage">0%</span>
            </div>
            <div id="hud-timer-display">
                <svg id="hud-progress-svg" viewBox="0 0 108 108" width="108" height="108">
                    <path id="hud-progress-bg"
                          d="M54 6 a 48 48 0 0 1 0 96 a 48 48 0 0 1 0 -96"
                          fill="none" stroke="#ddd" stroke-width="6"/>
                    <path id="hud-progress-bar"
                          d="M54 6 a 48 48 0 0 1 0 96 a 48 48 0 0 1 0 -96"
                          fill="none" stroke="#4CAF50" stroke-width="6"
                          stroke-dasharray="301.44, 301.44"
                          stroke-dashoffset="301.44"/>
                </svg>
                <div id="hud-time-text">25:00</div>
            </div>
        `;
        document.body.appendChild(hud);
        floatingHud = hud;
        hudText = hud.querySelector('#hud-current-task-name');
        hudTime = hud.querySelector('#hud-time-text');
        hudProgressBar = hud.querySelector('#hud-progress-bar');
        updateFloatingHUD();
        floatingHud.style.pointerEvents = 'none';
    }

    function togglePanel() {
        if (!managementPanel) createManagementPanel();
        managementPanel.style.position = 'fixed';
        managementPanel.style.top = '20%';
        managementPanel.style.right = '20%';
        managementPanel.style.left = 'auto';
        managementPanel.style.transform = 'translate(0, 0)';
        managementPanel.style.display = managementPanel.style.display === 'block' ? 'none' : 'block';
        if (managementPanel.style.display === 'block') {
            renderTaskList();
            updatePanelTimerControls();
        }
        updateFloatingHUDVisibility();
    }

    function updateFloatingHUDVisibility() {
        if (floatingHud) {
            floatingHud.style.display = currentTaskForTimer ? 'flex' : 'none';
        }
    }

    // --- Task Rendering ---
    function renderTaskList() {
        if (!taskListDiv) return;
        taskListDiv.innerHTML = '';
        const filteredTasks = tasks.filter(task => showExpired || !task.Expired);

        if (filteredTasks.length === 0) {
            taskListDiv.innerHTML = '<p>No tasks yet. Add one!</p>';
            return;
        }

        const ul = document.createElement('ul');
        filteredTasks.forEach((task, indexInFilteredTasks) => {
            const originalIndex = tasks.findIndex(t => t.id === task.id);
            const li = document.createElement('li');
            li.className = `task-item ${task.Done ? 'done' : ''} ${task.Expired ? 'expired' : ''}`;
            if (originalIndex === selectedTaskIndexForPanel) li.classList.add('selected-for-panel');
            li.dataset.taskId = task.id;
            li.innerHTML = `
                <span class="task-name">${task.Name} (${task.Duration} min)</span>
                <div class="task-actions">
                    <button class="complete-btn">${task.Done ? 'Undo' : 'Done'}</button>
                    <button class="expire-btn">${task.Expired ? 'Unexpire' : 'Expire'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            li.addEventListener('click', e => {
                if (e.target.tagName !== 'BUTTON') {
                    selectedTaskIndexForPanel = originalIndex;
                    updatePanelTimerControls();
                    renderTaskList(); // Re-render to highlight selected item
                }
            });

            li.querySelector('.complete-btn').addEventListener('click', () => toggleDone(task.id));
            li.querySelector('.expire-btn').addEventListener('click', () => toggleExpired(task.id));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

            ul.appendChild(li);
        });

        taskListDiv.appendChild(ul);
        updateCompletionPercentage();
    }

    function handleAddTask() {
        const nameInput = managementPanel.querySelector('#new-task-name');
        const durationInput = managementPanel.querySelector('#new-task-duration');
        const name = nameInput.value.trim();
        const duration = parseInt(durationInput.value) || 25;

        if (!name) {
            alert('请输入任务名称');
            return;
        }

        tasks.push({
            id: Date.now().toString(),
            Name: name,
            Duration: duration,
            Done: false,
            Expired: false
        });

        saveTasks();
        renderTaskList();
        nameInput.value = '';
        durationInput.value = '';
        updateCompletionPercentage();
    }

    function toggleDone(taskId) {
        const task = getTaskById(taskId);
        if (task) {
            task.Done = !task.Done;
            if (currentTaskForTimer && currentTaskForTimer.id === taskId) handleStopPanelTimer(true);
            saveTasks();
            renderTaskList();
            updateCompletionPercentage();
        }
    }

    function toggleExpired(taskId) {
        const task = getTaskById(taskId);
        if (task) {
            task.Expired = !task.Expired;
            if (currentTaskForTimer && currentTaskForTimer.id === taskId) handleStopPanelTimer(true);
            saveTasks();
            renderTaskList();
            updateCompletionPercentage();
        }
    }

    function deleteTask(taskId) {
        if (confirm('确定要删除这个任务吗？')) {
            tasks = tasks.filter(task => task.id !== taskId);
            if (currentTaskForTimer && currentTaskForTimer.id === taskId) handleStopPanelTimer(true);
            if (selectedTaskIndexForPanel !== -1 && tasks[selectedTaskIndexForPanel]?.id === taskId) {
                selectedTaskIndexForPanel = -1;
            }
            saveTasks();
            renderTaskList();
            updatePanelTimerControls();
            updateCompletionPercentage();
        }
    }

    function updateCompletionPercentage() {
        const nonExpiredTasks = tasks.filter(task => !task.Expired);
        const completedNonExpired = nonExpiredTasks.filter(task => task.Done).length;
        const percentage = nonExpiredTasks.length > 0 ? Math.round((completedNonExpired / nonExpiredTasks.length) * 100) : 0;
        if (floatingHud) floatingHud.querySelector('#hud-completion-percentage').textContent = `${percentage}%`;
    }

    // --- Timer Logic ---
    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateTimerDisplay(totalSeconds, displayElement) {
        if (displayElement) {
            displayElement.textContent = formatTime(totalSeconds);
        }
    }

    function updateFloatingHUD() {
        if (!floatingHud) return;
        const circumference = 2 * Math.PI * 48;

        if (currentTaskForTimer && !isTimerPaused) {
            hudText.textContent = `当前任务：${currentTaskForTimer.Name}`;
            hudTime.textContent = formatTime(timeLeft);
            const total = currentTaskForTimer.Duration * 60;
            const progress = total > 0 ? (total - timeLeft) / total : 0;
            hudProgressBar.style.strokeDasharray = `${circumference}`;
            hudProgressBar.style.strokeDashoffset = `${circumference * (1 - progress)}`;
            hudProgressBar.style.stroke = '#4CAF50';
        } else if (currentTaskForTimer && isTimerPaused) {
            hudText.textContent = `已暂停：${currentTaskForTimer.Name}`;
            hudTime.textContent = formatTime(timeLeft);
            const total = currentTaskForTimer.Duration * 60;
            const progress = total > 0 ? (total - timeLeft) / total : 0;
            hudProgressBar.style.strokeDasharray = `${circumference}`;
            hudProgressBar.style.strokeDashoffset = `${circumference * (1 - progress)}`;
            hudProgressBar.style.stroke = '#FFC107';
        } else {
            hudText.textContent = "无活动任务";
            hudTime.textContent = "00:00";
            hudProgressBar.style.strokeDasharray = `${circumference}`;
            hudProgressBar.style.strokeDashoffset = `${circumference}`;
            hudProgressBar.style.stroke = '#ddd';
        }

        updateCompletionPercentage();
        updateFloatingHUDVisibility();
    }

    function timerTick() {
        if (isTimerPaused || !currentTaskForTimer) return;
        timeLeft--;
        updateTimerDisplay(timeLeft, managementPanel.querySelector('#selected-task-timer-panel'));
        updateFloatingHUD();
        // 更新网页标签标题为剩余时间
        document.title = formatTime(timeLeft); // 👈 新增这一行：设置网页标签名
    
        // 同步状态到其他页面
        saveSharedTimerState();
    
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
        
            // 播放7次提示音
            let alarmCount = 0;
            const maxAlarms = 7;
            const alarmInterval = setInterval(() => {
                playAlarm();
                alarmCount++;
                if (alarmCount >= maxAlarms) {
                    clearInterval(alarmInterval);
                }
            }, 500); // 每隔半秒响一次
        
            // 不再使用 alert 提醒
        
            currentTaskForTimer = null;
            isTimerPaused = false;
            updatePanelTimerControls();
            updateFloatingHUD();
        }
    }

    function updatePanelTimerControls() {
        if (!managementPanel) return;
        const startBtn = managementPanel.querySelector('#start-task-btn');
        const pauseBtn = managementPanel.querySelector('#pause-task-btn');
        const stopBtn = managementPanel.querySelector('#stop-task-btn');
        const taskNameDisplay = managementPanel.querySelector('#selected-task-name-panel');
        const taskTimerDisplay = managementPanel.querySelector('#selected-task-timer-panel');

        if (selectedTaskIndexForPanel !== -1 && tasks[selectedTaskIndexForPanel]) {
            const selectedTask = tasks[selectedTaskIndexForPanel];

            taskNameDisplay.textContent = `任务：${selectedTask.Name}`;

            if (currentTaskForTimer && currentTaskForTimer.id === selectedTask.id) {
                startBtn.disabled = true;
                pauseBtn.textContent = isTimerPaused ? "继续" : "暂停";
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                updateTimerDisplay(timeLeft, taskTimerDisplay);
            } else {
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
                pauseBtn.textContent = "暂停";
                updateTimerDisplay(selectedTask.Duration * 60, taskTimerDisplay);
            }
        } else {
            taskNameDisplay.textContent = '未选择任务';
            updateTimerDisplay(0, taskTimerDisplay);
            startBtn.disabled = true;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
        }
    }
    function saveSharedTimerState() {
        if (!currentTaskForTimer) {
            localStorage.removeItem("shared_timer_state");
            return;
        }
        const state = {
            taskId: currentTaskForTimer.id,
            taskName: currentTaskForTimer.Name,
            taskDuration: currentTaskForTimer.Duration,
            timeLeft,
            isTimerPaused
        };
        localStorage.setItem("shared_timer_state", JSON.stringify(state));
        syncTimerFromStorage(); // 立即同步
    }
    function handleStartPanelTimer() {
        if (selectedTaskIndexForPanel === -1 || !tasks[selectedTaskIndexForPanel]) return;
    
        const selectedTask = tasks[selectedTaskIndexForPanel];
    
        if (timerInterval) clearInterval(timerInterval);
    
        currentTaskForTimer = selectedTask;
        timeLeft = selectedTask.Duration * 60; // Use the task's duration
        isTimerPaused = false;
        timerInterval = setInterval(timerTick, 1000);
    
        saveSharedTimerState(); // Save immediately
        updatePanelTimerControls();
        updateFloatingHUD();
    }

    function handlePausePanelTimer() {
        if (!currentTaskForTimer) return;

        isTimerPaused = !isTimerPaused;
        updatePanelTimerControls();
        updateFloatingHUD();
    }
    let originalTitle = document.title; // 在顶部附近加上这行
    function handleStopPanelTimer(isSilent = false) {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timeLeft = currentTaskForTimer?.Duration * 60 || 0;
        currentTaskForTimer = null;
        isTimerPaused = false;
        updatePanelTimerControls();
        updateFloatingHUD();
        document.title = originalTitle; // 还原原始标题
    }

    // --- Styles ---
    function addStyles() {
        GM_addStyle(`
            #todo-pomodoro-panel {
                position: fixed; top: 20%; right: 20%;
                width: 450px; max-height: 80vh; background-color: #f9f9f9;
                border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                z-index: 99999; display: none; flex-direction: column;
                font-family: Arial, sans-serif;
            }
            #panel-header { display: flex; justify-content: space-between; align-items: center;
                padding: 10px 15px; background-color: #eee; border-bottom: 1px solid #ccc; }
            #panel-header h2 { margin: 0; font-size: 1.2em; }
            #close-panel-btn { background: none; border: none; font-size: 1.5em; cursor: pointer; }
            #task-input-area { padding: 15px; display: flex; gap: 10px; border-bottom: 1px solid #eee; }
            #task-input-area input[type="text"] { flex-grow: 1; padding: 8px; }
            #task-input-area input[type="number"] { width: 120px; padding: 8px; }
            #task-input-area button { padding: 8px 12px; cursor: pointer; background-color: #4CAF50; color: white; border: none; }
            #task-filters { padding: 10px 15px; border-bottom: 1px solid #eee; }
            #task-list-container {
                padding: 10px 15px; overflow-y: auto; flex-grow: 1;
            }
            #task-list-container ul { list-style: none; padding: 0; margin: 0; }
            .task-item {
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 5px; border-bottom: 1px solid #eee; cursor: default;
            }
            .task-item.selected-for-panel { background-color: #e0e0e0; font-weight: bold; }
            .task-item:hover:not(.selected-for-panel) { background-color: #f0f0f0; }
            .task-item.done .task-name { text-decoration: line-through; color: #888; }
            .task-item.expired .task-name { color: #aaa; font-style: italic; }
            .task-name { flex-grow: 1; }
            .task-actions button { margin-left: 5px; padding: 3px 6px; cursor: pointer; font-size: 0.8em; }
            #panel-timer-controls { padding: 15px; border-top: 1px solid #ccc; text-align: center; }
            #panel-timer-controls h3 { margin-top: 0; font-size: 1em; }
            #selected-task-name-panel { margin-bottom: 5px; font-style: italic; }
            #selected-task-timer-panel { font-size: 1.8em; margin-bottom: 10px; font-weight: bold; }
            #panel-timer-controls button { padding: 8px 15px; margin: 0 5px; cursor: pointer; }
            #panel-timer-controls button:disabled { background-color: #ccc; cursor: not-allowed; }
            #todo-pomodoro-hud {
                position: fixed; top: 20px; right: 20px; background-color: rgba(255, 255, 255, 0.7);
                border: 1px solid #ccc; border-radius: 10px; padding: 15px 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.15); z-index: 99998; display: none;
                align-items: center; gap: 20px; font-family: Arial, sans-serif;
                min-width: 260px; pointer-events: none; transition: all 0.2s ease-in-out;
            }
            #hud-task-info { display: flex; flex-direction: column; flex-grow: 1; }
            #hud-current-task-name { font-size: 1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
            #hud-completion-percentage { font-size: 0.9em; color: #555; }
            #hud-timer-display { position: relative; width: 108px; height: 108px; }
            #hud-progress-svg { transform: rotate(-90deg); transition: stroke-dashoffset 0.3s linear; }
            #hud-time-text {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.2em; font-weight: bold;
            }
        `);
    }
    function syncTimerFromStorage() {
        try {
            const raw = localStorage.getItem("shared_timer_state");
            if (raw) {
                const state = JSON.parse(raw);
                if (state && state.taskId) {
                    let task = getTaskById(state.taskId);
                    if (!task) {
                        // 动态创建临时任务
                        task = {
                            id: state.taskId,
                            Name: state.taskName,
                            Duration: state.taskDuration || 25,
                            Done: false,
                            Expired: false
                        };
                        tasks.unshift(task);
                        renderTaskList();
                    }
    
                    if (currentTaskForTimer && currentTaskForTimer.id === state.taskId) {
                        timeLeft = state.timeLeft;
                        isTimerPaused = state.isTimerPaused;
                        updateFloatingHUD();
                        updatePanelTimerControls();
                        return;
                    }
    
                    if (timerInterval) clearInterval(timerInterval);
                    currentTaskForTimer = task;
                    timeLeft = state.timeLeft;
                    isTimerPaused = state.isTimerPaused;
    
                    if (!isTimerPaused) {
                        timerInterval = setInterval(timerTick, 1000); // ✅ 重启定时器
                    }
    
                    updateFloatingHUD();
                    updatePanelTimerControls();
                } else if (currentTaskForTimer) {
                    handleStopPanelTimer(true);
                }
            }
        } catch (e) {
            console.error("Failed to parse shared timer state", e);
        }
    }
    
    // Add storage event listener
    function setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === "shared_timer_state") {
                syncTimerFromStorage();
            }
        });
    }
    // --- Init ---
    function init() {
        loadTasks(); // 加载本地任务列表
        addStyles();
        createFloatingHUD();
    
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
                e.preventDefault();
                togglePanel();
            }
        });
    
        setupAudio();
    
        // 首次同步
        setTimeout(() => {
            syncTimerFromStorage();
            setupStorageListener();
            setInterval(syncTimerFromStorage, 1000);
        }, 500);
    
    }

    init();
})();