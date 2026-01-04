// ==UserScript==
// @name         番茄工作法助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个功能完整的番茄工作法工具
// @author       Your name
// @match        *://*.sankuai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521290/%E7%95%AA%E8%8C%84%E5%B7%A5%E4%BD%9C%E6%B3%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521290/%E7%95%AA%E8%8C%84%E5%B7%A5%E4%BD%9C%E6%B3%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 引入必要的样式
GM_addStyle(`
  :root {
    --tomato-red: #FF6B6B;
    --tomato-dark: #E74C3C;
    --tomato-light: #FFA5A5;
    --tomato-bg: #FFF5F5;
    --tomato-accent: #FF8787;
    --text-primary: #2D3436;
    --text-secondary: #636E72;
    --bg-white: rgba(255, 255, 255, 0.98);
    --shadow-sm: 0 2px 4px rgba(231, 76, 60, 0.1);
    --shadow-md: 0 4px 6px rgba(231, 76, 60, 0.15);
    --radius-lg: 16px;
    --radius-md: 12px;
    --radius-sm: 8px;
  }

  .tomato-timer-container {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    z-index: 9999;
    background: var(--bg-white);
    backdrop-filter: blur(20px);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid rgba(231, 76, 60, 0.1);
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    cursor: move;
    transition: all 0.3s ease;
  }

  .tomato-timer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .tomato-timer-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--tomato-red);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tomato-timer-menu-button {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .tomato-timer-menu-button span {
    display: block;
    width: 16px;
    height: 2px;
    background-color: var(--tomato-red);
    transition: all 0.3s ease;
  }

  .tomato-timer-menu-button:hover span {
    background-color: var(--tomato-dark);
  }

  .tomato-timer-container.collapsed {
    width: 120px;
    height: 120px;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    border-radius: 50%;
    background: url('https://mss-shon-img.sankuai.com/v1/mss_a4877bdba78b4ed995c84b4532e23fd7/harbour-static/images/63e5b2700167859e4aeae038362664dc') center/cover;
    background-repeat: no-repeat;
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
    transform-origin: center;
    transition: all 0.3s ease;
  }

  .tomato-timer-container.collapsed .tomato-timer-header,
  .tomato-timer-container.collapsed .control-buttons,
  .tomato-timer-container.collapsed .todo-list,
  .tomato-timer-container.collapsed #add-todo,
  .tomato-timer-container.collapsed #view-stats {
    display: none;
  }

  .tomato-timer-container.collapsed:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
  }

  .tomato-timer-container.collapsed .timer-display {
    height: 100%;
    margin: 0;
    padding: 0;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: none;
    position: relative;
  }

  .tomato-timer-container.collapsed .time-left {
    font-size: 36px;
    margin: 15px 0 5px;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .tomato-timer-container.collapsed .task-name {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
    max-width: 100px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    padding: 0 10px;
  }

  .tomato-timer-container.collapsed .toggle-collapse {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tomato-timer-container.collapsed:hover .toggle-collapse {
    opacity: 1;
  }

  /* 番茄光泽效果 */
  .tomato-timer-container.collapsed::after {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    filter: blur(4px);
  }

  /* 暗色模式适配 */
  .dark-mode .tomato-timer-container.collapsed {
    background: linear-gradient(135deg, #FF5252 0%, #D32F2F 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .toggle-collapse {
    position: absolute;
    top: 6%;
    left: 114px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: var(--tomato-red);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    z-index: 1;
  }

  .toggle-collapse:hover {
    background: var(--tomato-dark);
    transform: translateY(-50%) scale(1.1);
  }

  .tomato-timer-container.collapsed .toggle-collapse {
    display: none;
    transform: translateY(-50%) rotate(90deg);
  }

  .tomato-timer-container.collapsed .toggle-collapse:hover {
    transform: translateY(-50%) rotate(90deg) scale(1.1);
  }

  .timer-display {
    background: linear-gradient(135deg, var(--tomato-red) 0%, var(--tomato-dark) 100%);
    border-radius: var(--radius-lg);
    padding: 24px 20px;
    text-align: center;
    margin: 16px 0;
    font-size: 48px;
    font-weight: 700;
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .time-left {
    font-size: 48px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 8px;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .task-name {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  .control-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 16px 0;
  }

  .tomato-timer-button {
    background: var(--tomato-red);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: var(--shadow-sm);
  }

  .tomato-timer-button:hover {
    background: var(--tomato-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.2);
  }

  .tomato-timer-button:active {
    transform: translateY(0);
  }

  .todo-list {
    background: var(--tomato-bg);
    border-radius: var(--radius-md);
    padding: 16px;
    margin-top: 16px;
  }

  .todo-list h4 {
    color: var(--text-primary);
    font-size: 14px;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .todo-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    margin: 6px 0;
    background: white;
    border-radius: var(--radius-sm);
    border: 1px solid rgba(231, 76, 60, 0.1);
    transition: all 0.2s ease;
  }

  .todo-item:hover {
    border-color: var(--tomato-light);
    transform: translateX(2px);
    box-shadow: var(--shadow-sm);
  }

  .todo-item.current {
    background: var(--tomato-bg);
    border: 1px solid var(--tomato-red);
  }

  .todo-priority {
    font-size: 12px;
    font-weight: 600;
    color: var(--tomato-red);
    background: var(--tomato-bg);
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    margin-right: 10px;
  }

  .todo-title {
    flex: 1;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 13px;
  }

  .todo-pomodoros {
    color: var(--tomato-accent);
    font-size: 12px;
  }

  .tomato-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--bg-white);
    border-radius: var(--radius-md);
    padding: 12px 16px;
    box-shadow: var(--shadow-md);
    border-left: 3px solid var(--tomato-red);
    max-width: 280px;
    animation: slideIn 0.3s ease-out;
  }

  .notification-content h4 {
    color: var(--tomato-red);
    margin: 0 0 6px 0;
    font-size: 14px;
  }

  .notification-content p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
  }

  /* 深色模式 */
  .dark-mode {
    --bg-white: rgba(44, 62, 80, 0.98);
    --text-primary: #ECF0F1;
    --text-secondary: #BDC3C7;
    --tomato-bg: rgba(231, 76, 60, 0.1);
  }

  .dark-mode .tomato-timer-container {
    border-color: rgba(255, 107, 107, 0.2);
  }

  .dark-mode .todo-item {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .dark-mode .todo-title {
    color: var(--text-primary);
  }

  .dark-mode .todo-priority {
    background: rgba(255, 107, 107, 0.2);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%) translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateX(0) translateY(0);
      opacity: 1;
    }
  }

  .tomato-timer-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tomato-timer-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .tomato-timer-dialog-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 300px;
  }

  .tomato-timer-dialog input,
  .tomato-timer-dialog select {
    width: 100%;
    margin: 8px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }

  .rating-container {
    margin: 16px 0;
  }

  .rating-buttons {
    display: flex;
    gap: 8px;
    margin: 8px 0;
  }

  .rating-button {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
  }

  .rating-button.selected {
    background: #007AFF;
    color: white;
    border-color: #007AFF;
  }

  .rating-desc {
    font-size: 12px;
    color: #666;
    margin-top: 8px;
  }

  .stats-dialog {
    width: 400px;
  }

  .stats-container {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #007AFF;
  }

  .stat-label {
    font-size: 12px;
    color: #666;
  }

  .stats-chart {
    height: 200px;
    display: flex;
    align-items: flex-end;
    gap: 4px;
    margin: 20px 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
  }

  .stat-bar {
    flex: 1;
    background: #007AFF;
    min-width: 20px;
    position: relative;
    transition: height 0.3s;
  }

  .stat-bar-label {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #666;
    writing-mode: vertical-rl;
  }

  .todo-item.dragging {
    opacity: 0.5;
  }

  .tomato-menu {
    position: absolute;
    top: 40px;
    right: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10000;
  }

  .menu-item {
    padding: 8px 16px;
    cursor: pointer;
  }

  .menu-item:hover {
    background: #f5f5f5;
  }

  .control-buttons {
    display: flex;
    gap: 8px;
  }

  .settings-dialog {
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .settings-section {
    margin: 16px 0;
    padding: 16px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }

  .setting-item {
    margin: 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .setting-item input[type="number"] {
    width: 80px;
  }

  .setting-item input[type="color"] {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 4px;
  }

  .dialog-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .dark-mode {
    color-scheme: dark;
  }

  .todo-delete-btn {
    background: none;
    border: none;
    color: var(--tomato-red);
    font-size: 18px;
    font-weight: bold;
    padding: 4px 8px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    margin-left: 8px;
  }

  .todo-item:hover .todo-delete-btn {
    opacity: 1;
  }

  .todo-delete-btn:hover {
    background: rgba(255, 107, 107, 0.1);
    border-radius: 4px;
  }

  .todo-item {
    position: relative;
    padding-right: 40px;
  }

  .todo-delete-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }

  @keyframes collapse {
    from {
      border-radius: var(--radius-lg);
      transform: scale(1);
    }
    to {
      border-radius: 50%;
      transform: scale(0.95);
    }
  }

  @keyframes expand {
    from {
      border-radius: 50%;
      transform: scale(0.95);
    }
    to {
      border-radius: var(--radius-lg);
      transform: scale(1);
    }
  }
`);

// 主要功能类
const TomatoTimer = {
  state: {
    todos: [],
    currentTask: null,
    isWorking: false,
    timeLeft: 0,
    interruptions: 0,
    dailyStats: [],
  },

  init() {
    this.loadState();

    // 检查并恢复计时状态
    if (this.state.isWorking) {
      // 如果之前在工作中，检查是否需要重置状态
      const now = Date.now();
      const lastSavedTime = localStorage.getItem('lastSavedTime');

      if (lastSavedTime) {
        const timePassed = Math.floor((now - parseInt(lastSavedTime)) / 1000);

        if (this.state.timeLeft > timePassed) {
          // 如果剩余时间大于经过时间，继续计时
          this.state.timeLeft -= timePassed;
          this.resumeTimer();
        } else {
          // 如果已超时，重置状态
          this.resetState();
        }
      } else {
        // 如果没有保存时间戳，重置状态
        this.resetState();
      }
    }

    this.createUI();
    this.setupDragAndDrop();
    this.updateUI();
  },

  loadState() {
    GM_setValue('tomatoTimerState', null);
    const savedState = GM_getValue('tomatoTimerState', null);
    if (savedState) {
      this.state = JSON.parse(savedState);
    }
  },

  // 添加重置状态的方法
  resetState() {
    this.state.isWorking = false;
    this.state.timeLeft = (this.state.settings?.workDuration || 25) * 60;
    this.state.currentTask = null;
    this.state.interruptions = 0;
    this.saveState();
  },

  // 添加恢复计时器的方法
  resumeTimer() {
    if (this.state.currentTask) {
      this.timerInterval = setInterval(() => this.updateTimer(), 1000);
      this.updateUI();
    } else {
      this.resetState();
    }
  },

  saveState() {
    GM_setValue('tomatoTimerState', JSON.stringify(this.state));
  },

  setupDragAndDrop() {
    const container = document.querySelector('.tomato-timer-container');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    container.addEventListener('mousedown', (e) => {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === container) {
        isDragging = true;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        container.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  },

  showAddTodoDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'tomato-timer-dialog';
    dialog.innerHTML = `
      <div class="tomato-timer-dialog-content">
        <h3>添加新任务</h3>
        <input type="text" id="todo-title" placeholder="任务名称">
        <select id="todo-priority">
          <option value="1">优先级 1 (最高)</option>
          <option value="2">优先级 2</option>
          <option value="3">优先级 3</option>
        </select>
        <input type="number" id="todo-pomodoros" placeholder="预计番茄钟数量">
        <button id="save-todo">保存</button>
        <button id="cancel-todo">取消</button>
      </div>
    `;

    document.body.appendChild(dialog);

    document.getElementById('save-todo').addEventListener('click', () => {
      const title = document.getElementById('todo-title').value;
      const priority = document.getElementById('todo-priority').value;
      const pomodoros = document.getElementById('todo-pomodoros').value;

      this.addTodo({
        title,
        priority: parseInt(priority),
        pomodoros: parseInt(pomodoros),
        completed: false,
        date: new Date().toISOString(),
      });

      document.body.removeChild(dialog);
    });

    document.getElementById('cancel-todo').addEventListener('click', () => {
      document.body.removeChild(dialog);
    });
  },

  addTodo(todo) {
    // 生成唯一ID
    todo.id = Date.now().toString();
    // 添加到todos数组
    this.state.todos.push(todo);
    // 按优先级排序
    this.state.todos.sort((a, b) => a.priority - b.priority);
    // 保存状态
    this.saveState();
    // 更新UI
    this.updateUI();
  },

  startTimer() {
    if (this.state.isWorking) {
      // 如果已经在工作中但计时器不存在，恢复计时
      if (!this.timerInterval) {
        this.resumeTimer();
      }
      return;
    };

    const currentTask = this.state.todos.find(todo => !todo.completed);
    if (!currentTask) {
      alert('没有待办任务！请先添加任务。');
      return;
    }

    this.state.currentTask = currentTask;
    this.state.isWorking = true;
    this.state.timeLeft = (this.state.settings?.workDuration || 25) * 60;
    this.state.interruptions = 0;

    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    this.updateUI();
    this.saveState();

    // // 更新UI显示
    // const timerDisplay = document.querySelector('.time-left');
    // if (timerDisplay) {
    //   timerDisplay.textContent = `${Math.floor(this.state.timeLeft / 60)}:00`;
    // }

    // const taskName = document.querySelector('.task-name');
    // if (taskName) {
    //   taskName.textContent = currentTask.title;
    // }

    // // 更新按钮状态
    // const startButton = document.getElementById('start-timer');
    // const interruptButton = document.getElementById('interrupt-timer');
    // const stopButton = document.getElementById('stop-timer');

    // if (startButton) {
    //   startButton.textContent = '专注中...';
    //   startButton.disabled = true;
    // }

    // if (interruptButton) {
    //   interruptButton.style.display = 'block';
    // }

    // if (stopButton) {
    //   stopButton.style.display = 'block';
    // }

    // this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  },

  updateTimer() {
    if (this.state.timeLeft > 0) {
      this.state.timeLeft--;
      this.saveState();
      // 保存当前时间戳
      localStorage.setItem('lastSavedTime', Date.now().toString());
      this.updateUI();
    } else {
      this.completePomodoro();
    }
  },

  updateTimerUI() {
    const minutes = Math.floor(this.state.timeLeft / 60);
    const seconds = this.state.timeLeft % 60;
    const timerDisplay = document.querySelector('.tomato-timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  },

  completePomodoro() {
    clearInterval(this.timerInterval);
    this.state.isWorking = false;

    // 记录统计数据
    this.state.dailyStats.push({
      date: new Date().toISOString(),
      taskTitle: this.state.currentTask.title,
      interruptions: this.state.interruptions,
      score: 0, // 等待用户评分
    });

    this.showPomodoroComplete();
    this.saveState();
  },

  showPomodoroComplete() {
    const dialog = document.createElement('div');
    dialog.className = 'tomato-timer-dialog';
    dialog.innerHTML = `
      <div class="tomato-timer-dialog-content">
        <h3>番茄钟完成!</h3>
        <p>任务: ${this.state.currentTask.title}</p>
        <p>中断次数: ${this.state.interruptions}</p>
        <div class="rating-container">
          <p>请为这个番茄钟评分:</p>
          <div class="rating-buttons">
            ${Array.from({length: 5}, (_, i) =>
              `<button class="rating-button" data-score="${i + 1}">${i + 1}分</button>`
            ).join('')}
          </div>
          <p class="rating-desc">
            1分: 完全散漫 | 2分: 稍有专注 | 3分: 一般专注 | 4分: 较为专注 | 5分: 高度专注
          </p>
        </div>
        <textarea id="interruption-notes" placeholder="记录中断原因(如果有)"></textarea>
        <button id="submit-pomodoro">提交</button>
      </div>
    `;

    document.body.appendChild(dialog);

    // 绑定评分按钮事件
    dialog.querySelectorAll('.rating-button').forEach(button => {
      button.addEventListener('click', (e) => {
        dialog.querySelectorAll('.rating-button').forEach(btn =>
          btn.classList.remove('selected'));
        e.target.classList.add('selected');
      });
    });

    document.getElementById('submit-pomodoro').addEventListener('click', () => {
      const score = dialog.querySelector('.rating-button.selected')?.dataset.score;
      const notes = document.getElementById('interruption-notes').value;

      if (!score) {
        alert('请为这个番茄钟评分!');
        return;
      }

      // 更新统计数据
      const lastStat = this.state.dailyStats[this.state.dailyStats.length - 1];
      lastStat.score = parseInt(score);
      lastStat.notes = notes;

      this.saveState();
      document.body.removeChild(dialog);

      // 检查是否需要长休息
      const completedPomodoros = this.state.dailyStats.filter(
        stat => new Date(stat.date).toDateString() === new Date().toDateString()
      ).length;

      if (completedPomodoros % 4 === 0) {
        this.showLongBreakNotification();
      } else {
        this.showShortBreakNotification();
      }
    });
  },

  showStats() {
    const dialog = document.createElement('div');
    dialog.className = 'tomato-timer-dialog';

    // 获取今日统计数据
    const today = new Date().toDateString();
    const todayStats = this.state.dailyStats.filter(
      stat => new Date(stat.date).toDateString() === today
    );

    const avgScore = todayStats.reduce((sum, stat) => sum + stat.score, 0) / todayStats.length || 0;
    const totalInterruptions = todayStats.reduce((sum, stat) => sum + stat.interruptions, 0);

    dialog.innerHTML = `
      <div class="tomato-timer-dialog-content stats-dialog">
        <h3>今日统计</h3>
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-value">${todayStats.length}</div>
            <div class="stat-label">完成番茄数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${avgScore.toFixed(1)}</div>
            <div class="stat-label">平均专注度</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${totalInterruptions}</div>
            <div class="stat-label">总中断次数</div>
          </div>
        </div>
        <div class="stats-chart" id="stats-chart"></div>
        <button id="close-stats">关闭</button>
      </div>
    `;

    document.body.appendChild(dialog);
    this.renderStatsChart(todayStats);

    document.getElementById('close-stats').addEventListener('click', () => {
      document.body.removeChild(dialog);
    });
  },

  renderStatsChart(stats) {
    // 这里可以使用 Chart.js 等库来绘制统计图表
    // 为简化示例，这里使用简单的 DOM 元素来展示
    const chartContainer = document.getElementById('stats-chart');
    const chartHtml = stats.map(stat => `
      <div class="stat-bar" style="height: ${stat.score * 20}%">
        <div class="stat-bar-label">${new Date(stat.date).toLocaleTimeString()}</div>
      </div>
    `).join('');

    chartContainer.innerHTML = chartHtml;
  },

  showShortBreakNotification() {
    this.showNotification('短休息时间', '休息5分钟，记得喝水、活动一下~');
    this.startBreakTimer(5);
  },

  showLongBreakNotification() {
    this.showNotification('长休息时间', '休息15-20分钟，建议出去走走、聊聊天~');
    this.startBreakTimer(15);
  },

  showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'tomato-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  },

  startBreakTimer(minutes) {
    this.state.isBreak = true;
    this.state.timeLeft = minutes * 60;
    this.updateTimerUI();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  },

  createUI() {
    const container = document.createElement('div');
    container.className = 'tomato-timer-container';

    // 创建内容容器
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="tomato-timer-header">
        <div class="tomato-timer-title">番茄工作法</div>
        <button class="tomato-timer-menu-button" id="menu-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="timer-display">
        <div class="time-left">25:00</div>
        <div class="task-name">准备开始...</div>
      </div>
      <div class="tomato-timer-content">
        <div class="control-buttons">
          <button class="tomato-timer-button" id="start-timer">
            ▶ 开始专注
          </button>
          <button class="tomato-timer-button" id="interrupt-timer" style="display: none;">
            ⏸️ 记录中断
          </button>
          <button class="tomato-timer-button" id="stop-timer" style="display: none;">
            ⏹️ 结束
          </button>
        </div>
        <div class="todo-list">
          <h4>今日待办</h4>
          <div id="todo-items"></div>
        </div>
        <button class="tomato-timer-button" id="add-todo">
          ＋ 添加任务
        </button>
        <button class="tomato-timer-button" id="view-stats">
          📊 查看统计
        </button>
      </div>
    `;
    container.appendChild(content);
    document.body.appendChild(container);

    // 点击折叠状态的容器时展开
    container.addEventListener('click', () => {
      console.log('container clicked');
      if (container.classList.contains('collapsed')) {
        this.toggleCollapse();
      }
    });
    this.bindEvents();
    this.updateTodoList();

    // 从本地存储读取折叠状态
    const isCollapsed = localStorage.getItem('tomatoTimerCollapsed') === 'true';
    if (isCollapsed) {
      container.classList.add('collapsed');
      // toggleButton.innerHTML = '▶';
    }
  },

  toggleCollapse() {
    console.log('toggleCollapse called');
    const container = document.querySelector('.tomato-timer-container');
    // const toggleButton = document.querySelector('.toggle-collapse');

    console.log(container.classList.contains('collapsed'));

    if (container.classList.contains('collapsed')) {
      container.classList.remove('collapsed');
      // toggleButton.innerHTML = '◀';
      localStorage.setItem('tomatoTimerCollapsed', 'false');
    } else {
      container.classList.add('collapsed');
      // toggleButton.innerHTML = '▶';
      localStorage.setItem('tomatoTimerCollapsed', 'true');
    }
  },

  bindEvents() {
    // ... 保持原有的事件绑定 ...
    document.getElementById('start-timer').addEventListener('click', () => this.startTimer());
    document.getElementById('add-todo').addEventListener('click', () => this.showAddTodoDialog());
    document.getElementById('view-stats').addEventListener('click', () => this.showStats());

    document.getElementById('interrupt-timer')?.addEventListener('click', () => this.recordInterruption());
    document.getElementById('stop-timer')?.addEventListener('click', () => this.stopTimer());
    document.getElementById('menu-button')?.addEventListener('click', () => this.showMenu());
  },

  recordInterruption() {
    const dialog = document.createElement('div');
    dialog.className = 'tomato-timer-dialog';
    dialog.innerHTML = `
      <div class="tomato-timer-dialog-content">
        <h3>记录中断</h3>
        <select id="interruption-type">
          <option value="meeting">会议</option>
          <option value="phone">电话</option>
          <option value="chat">聊天</option>
          <option value="email">邮件</option>
          <option value="other">其他</option>
        </select>
        <textarea id="interruption-detail" placeholder="详细说明(可选)"></textarea>
        <div class="dialog-buttons">
          <button id="save-interruption">继续专注</button>
          <button id="cancel-interruption">放弃本次</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    document.getElementById('save-interruption').addEventListener('click', () => {
      const type = document.getElementById('interruption-type').value;
      const detail = document.getElementById('interruption-detail').value;

      this.state.interruptions++;
      if (!this.state.interruptionDetails) {
        this.state.interruptionDetails = [];
      }
      this.state.interruptionDetails.push({
        type,
        detail,
        timestamp: new Date().toISOString()
      });

      this.saveState();
      document.body.removeChild(dialog);

      // 继续计时
      this.state.timeLeft = currentTime;
      this.timerInterval = setInterval(() => this.updateTimer(), 1000);

      // 显示提示
      this.showNotification(
        '已记录中断',
        '继续专注当前任务，加油！'
      );
    });

    document.getElementById('cancel-interruption').addEventListener('click', () => {
      document.body.removeChild(dialog);
      // 如果选择放弃，则停止当前番茄钟
      this.stopTimer();
    });
  },

  stopTimer() {
    if (!this.state.isWorking) return;

    clearInterval(this.timerInterval);
    this.timerInterval = null;
    localStorage.removeItem('lastSavedTime');

    // 清除计时器
    clearInterval(this.timerInterval);

    // 更新状态
    this.state.isWorking = false;
    this.state.timeLeft = (this.state.settings?.workDuration || 25) * 60;

    // 记录中断的番茄钟
    this.state.dailyStats.push({
      date: new Date().toISOString(),
      taskTitle: this.state.currentTask.title,
      interruptions: this.state.interruptions,
      score: 0,
      completed: false,
      stoppedEarly: true
    });

    // 重置当前任务状态
    this.state.currentTask = null;
    this.state.interruptions = 0;

    // 更新UI
    const timerDisplay = document.querySelector('.time-left');
    if (timerDisplay) {
      timerDisplay.textContent = `${Math.floor(this.state.timeLeft / 60)}:00`;
    }

    const taskName = document.querySelector('.task-name');
    if (taskName) {
      taskName.textContent = '准备开始...';
    }

    // 更新按钮状态
    const startButton = document.getElementById('tomato-start-timer');
    const interruptButton = document.getElementById('tomato-interrupt-timer');
    const stopButton = document.getElementById('tomato-stop-timer');

    if (startButton) {
      startButton.textContent = '▶️ 开始专注';
      startButton.disabled = false;
    }

    if (interruptButton) {
      interruptButton.style.display = 'none';
    }

    if (stopButton) {
      stopButton.style.display = 'none';
    }

    // 保存状态
    this.saveState();

    // 显示提示
    this.showNotification(
      '番茄钟已停止',
      '本次专注已中断。休息一下，随时可以重新开始！'
    );
  },

  updateUI() {
    // 更新计时器显示
    const timerDisplay = document.querySelector('.time-left');
    if (timerDisplay) {
      const minutes = Math.floor(this.state.timeLeft / 60);
      const seconds = this.state.timeLeft % 60;
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // 更新当前任务显示
    const taskName = document.querySelector('.task-name');
    if (taskName) {
      taskName.textContent = this.state.currentTask ? this.state.currentTask.title : '准备开始...';
    }

    // 更新按钮状态
    const startButton = document.getElementById('start-timer');
    const interruptButton = document.getElementById('interrupt-timer');
    const stopButton = document.getElementById('stop-timer');

    if (startButton) {
      if (this.state.isWorking) {
        startButton.textContent = '专注中...';
        startButton.disabled = true;
      } else {
        startButton.textContent = '▶️ 开始专注';
        startButton.disabled = false;
      }
    }

    if (interruptButton) {
      interruptButton.style.display = this.state.isWorking ? 'block' : 'none';
    }

    if (stopButton) {
      stopButton.style.display = this.state.isWorking ? 'block' : 'none';
    }

    // 更新待办任务列表
    this.updateTodoList();
  },

  deleteTodo(todoId) {
    // 找到要删除的任务索引
    const index = this.state.todos.findIndex(todo => todo.id === todoId);
    if (index === -1) return;

    // 如果要删除的是当前任务，先停止计时器
    if (this.state.currentTask && this.state.currentTask.id === todoId) {
      this.stopTimer();
    }

    // 删除任务
    this.state.todos.splice(index, 1);

    // 保存状态并更新UI
    this.saveState();
    this.updateUI();

    // 显示提示
    this.showNotification('任务已删除', '该任务已从待办列表中移除');
  },

  updateTodoList() {
    const todoContainer = document.getElementById('todo-items');
    if (!todoContainer) return;

    const todayTodos = this.state.todos.filter(todo => !todo.completed);
    todoContainer.innerHTML = todayTodos.map(todo => `
      <div class="todo-item ${todo === this.state.currentTask ? 'current' : ''}" data-id="${todo.id}">
        <div class="todo-priority">P${todo.priority}</div>
        <div class="todo-title">${todo.title}</div>
        <div class="todo-pomodoros">
          ${Array(todo.pomodoros).fill('🍅').join('')}
        </div>
        <button class="todo-delete-btn" data-id="${todo.id}">×</button>
      </div>
    `).join('');

    // 绑定删除按钮事件
    todoContainer.querySelectorAll('.todo-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        const todoId = btn.dataset.id;
        if (confirm('确定要删除这个任务吗？')) {
          this.deleteTodo(todoId);
        }
      });
    });

    // 添加拖拽排序功能
    this.setupTodoDragAndDrop();
  },

  setupTodoDragAndDrop() {
    const items = document.querySelectorAll('.todo-item');
    items.forEach(item => {
      item.draggable = true;
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.dataset.id);
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (dragging && dragging !== item) {
          const container = document.getElementById('todo-items');
          const afterElement = this.getDragAfterElement(container, e.clientY);
          if (afterElement) {
            container.insertBefore(dragging, afterElement);
          } else {
            container.appendChild(dragging);
          }
        }
      });
    });
  },

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },

  showMenu() {
    const menu = document.createElement('div');
    menu.className = 'tomato-menu';
    menu.innerHTML = `
      <div class="menu-item" id="togglec-collapse">收起</div>
      <div class="menu-item" id="export-data">导出数据</div>
      <div class="menu-item" id="import-data">导入数据</div>
      <div class="menu-item" id="settings">设置</div>
    `;

    document.body.appendChild(menu);

    // 点击其他地方关闭菜单
    const closeMenu = (e) => {
      if (menu && document.body.contains(menu)) {
        document.body.removeChild(menu);
        document.removeEventListener('click', closeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);

    // 绑定菜单项事件
    document.getElementById('togglec-collapse').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCollapse();
      closeMenu();
    });
    document.getElementById('export-data').addEventListener('click', () => this.exportData());
    document.getElementById('import-data').addEventListener('click', () => this.importData());
    document.getElementById('settings').addEventListener('click', () => {
      this.showSettings();
      closeMenu();
    });
  },

  exportData() {
    const data = {
      todos: this.state.todos,
      dailyStats: this.state.dailyStats,
      interruptionDetails: this.state.interruptionDetails,
      settings: this.state.settings,
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tomato-timer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          // 验证数据格式
          if (!data.version || !data.todos || !data.dailyStats) {
            throw new Error('无效的数据格式');
          }

          // 合并数据
          this.state = {
            ...this.state,
            todos: data.todos,
            dailyStats: data.dailyStats,
            interruptionDetails: data.interruptionDetails || [],
            settings: { ...this.state.settings, ...data.settings }
          };

          this.saveState();
          this.updateUI();
          alert('数据导入成功！');
        } catch (err) {
          alert('导入失败：' + err.message);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  },

  showSettings() {
    const dialog = document.createElement('div');
    dialog.className = 'tomato-timer-dialog';
    dialog.innerHTML = `
      <div class="tomato-timer-dialog-content settings-dialog">
        <h3>设置</h3>
        <div class="settings-section">
          <h4>时间设置</h4>
          <div class="setting-item">
            <label>工作时长(分钟)</label>
            <input type="number" id="work-duration" value="${this.state.settings?.workDuration || 25}" min="1" max="60">
          </div>
          <div class="setting-item">
            <label>短休息时长(分钟)</label>
            <input type="number" id="short-break" value="${this.state.settings?.shortBreak || 5}" min="1" max="30">
          </div>
          <div class="setting-item">
            <label>长休息时长(分钟)</label>
            <input type="number" id="long-break" value="${this.state.settings?.longBreak || 15}" min="5" max="60">
          </div>
          <div class="setting-item">
            <label>长休息间隔(番茄钟数)</label>
            <input type="number" id="long-break-interval" value="${this.state.settings?.longBreakInterval || 4}" min="2" max="8">
          </div>
        </div>
        <div class="settings-section">
          <h4>通知设置</h4>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="enable-notifications"
                ${this.state.settings?.enableNotifications ? 'checked' : ''}>
              启用桌面通知
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="enable-sound"
                ${this.state.settings?.enableSound ? 'checked' : ''}>
              启用提示音
            </label>
          </div>
        </div>
        <div class="settings-section">
          <h4>外观设置</h4>
          <div class="setting-item">
            <label>主题色</label>
            <input type="color" id="theme-color" value="${this.state.settings?.themeColor || '#ff6b6b'}">
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="dark-mode"
                ${this.state.settings?.darkMode ? 'checked' : ''}>
              深色模式
            </label>
          </div>
        </div>
        <div class="dialog-buttons">
          <button id="save-settings">保存</button>
          <button id="cancel-settings">取消</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    // 绑定设置保存事件
    document.getElementById('save-settings').addEventListener('click', () => {
      this.state.settings = {
        workDuration: parseInt(document.getElementById('work-duration').value),
        shortBreak: parseInt(document.getElementById('short-break').value),
        longBreak: parseInt(document.getElementById('long-break').value),
        longBreakInterval: parseInt(document.getElementById('long-break-interval').value),
        enableNotifications: document.getElementById('enable-notifications').checked,
        enableSound: document.getElementById('enable-sound').checked,
        themeColor: document.getElementById('theme-color').value,
        darkMode: document.getElementById('dark-mode').checked
      };

      this.saveState();
      this.applySettings();
      document.body.removeChild(dialog);
    });

    document.getElementById('cancel-settings').addEventListener('click', () => {
      document.body.removeChild(dialog);
    });
  },

  applySettings() {
    const settings = this.state.settings;
    if (!settings) return;

    // 应用主题色
    document.documentElement.style.setProperty('--theme-color', settings.themeColor);

    // 应用深色模式
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // 更新样式
    this.updateStyles();
  },

  updateStyles() {
    const themeColor = this.state.settings?.themeColor || '#007AFF';
    const isDark = this.state.settings?.darkMode;

    GM_addStyle(`
      .tomato-timer-container {
        background: ${isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        color: ${isDark ? '#fff' : '#1a1a1a'};
      }

      .tomato-timer-button {
        background: ${themeColor};
      }

      .tomato-timer-button:hover {
        background: ${this.adjustColor(themeColor, -20)};
      }

      .todo-item {
        background: ${isDark ? 'rgba(50, 50, 50, 0.95)' : '#f5f5f5'};
      }

      .todo-item.current {
        background: ${this.adjustColor(themeColor, isDark ? -40 : 40)};
      }
    `);
  },

  adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color =>
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

};


// 初始化应用
(function() {
    'use strict';
    TomatoTimer.init();
})();