// ==UserScript==
// @name         Custom Bilibili Auto Follow/Unfollow
// @namespace    https://github.com/IGCrystal/Custom-Bilibili-Auto-Follow-Unfollow/
// @version      5.9.3
// @description  A script to automatically follow/unfollow on Bilibili with enhanced UI and controls.
// @author       Larch4, IGCrystal
// @match        https://space.bilibili.com/*
// @grant        none
// @license      GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/512572/Custom%20Bilibili%20Auto%20FollowUnfollow.user.js
// @updateURL https://update.greasyfork.org/scripts/512572/Custom%20Bilibili%20Auto%20FollowUnfollow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FOLLOW_INTERVAL_DEFAULT = 2000; // 关注时间间隔（默认2秒）
    const UNFOLLOW_INTERVAL_DEFAULT = 2000; // 取消关注时间间隔（默认2秒）
    const MAX_LOGS = 20; // 日志最大数量为10条
    const logQueue = []; // 存储日志的数组

    let isRunning = false;
    let useRandomInterval = true; // 是否使用随机间隔
    let followUnfollowTimeout = null; // 关注/取消关注的定时器
    let modalCheckInterval = null; // 弹窗检查的定时器
    let captchaModalInterval = null; //
    let modalCheckIntervalIfNeeded = null; //验证码弹窗检查定时器
    let networkCheckInterval = null; // 网络状态检测的定时器
    let errorCheckInterval = null;
    let followInterval = FOLLOW_INTERVAL_DEFAULT;
    let unfollowInterval = UNFOLLOW_INTERVAL_DEFAULT;
    let previousState = null;
    let checkButtonIfRuning = null;
    let checkIntervaling = 3000; // 每3秒检查一次
    let maxWaitTime = 54000; // 最大等待时间为12秒
    let elapsedTime = 0;

    // 检测页面是否是刷新加载
    let isPageReload = performance.navigation.type === 1;

    // 确保页面刷新后创建面板并根据情况恢复状态
    window.addEventListener('load', () => {
        // 检查面板是否已经存在，避免重复创建
        if (!document.getElementById('bilibili-auto-follow-panel')) {
            createPanel(); // 每次页面加载时创建面板
        }

        // 仅当页面是刷新时，才恢复脚本运行状态
        if (isPageReload && localStorage.getItem('scriptRunning') === 'true') {
            isRunning = true;
            startAutoFollowUnfollow();
        } else {
            // 页面重新打开时，脚本默认不运行
            isRunning = false;
            localStorage.removeItem('scriptRunning');
        }
    });

    // 在页面刷新或关闭前保存当前的运行状态
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('scriptRunning', isRunning.toString());
    });


    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'bilibili-auto-follow-panel';
        panel.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background-color: #fff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            color: #333; padding: 15px; border-radius: 10px; z-index: 2147483699;
            display: flex; flex-direction: column; align-items: stretch; width: 240px;
            font-family: Arial, sans-serif; transition: max-height 0.3s ease, opacity 0.3s ease;
            overflow: hidden; max-height: 400px;
            opacity: 1;
        `;

        panel.innerHTML = `
<div id="panelHeader" 
     style="
       display: flex; 
       align-items: center; 
       justify-content: space-between; 
       margin-bottom: 10px;
     "
>
  <!-- 左侧：标题 -->
  <div style="
    font-size: 16px;
    font-weight: bold;
    color: #00a1d6;
    margin-bottom: 0;
  ">
    Bilibili 自动关注脚本
  </div>

  <!-- 右侧：展开/收缩按钮 -->
  <button
    id="foldButton"
    style="
      background-color: #00a1d6;
      color: #fff;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
      margin-left: 10px;
    "
  >
    展开
  </button>
</div>

<!-- 第二行：开始/暂停按钮 + 状态文字 -->
<div 
  style="
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 5px;
  "
>
  <button 
    id="toggleButton" 
    style="
      flex: 1; 
      background-color: #00a1d6; 
      color: #fff; 
      border: none; 
      padding: 8px 12px;
      border-radius: 6px; 
      cursor: pointer; 
      font-size: 14px; 
      transition: background-color 0.3s;
    "
  >
    开始
  </button>
  <span 
    id="statusText" 
    style="
      flex: 1; 
      margin-left: 95px; 
      font-size: 14px; 
      color: #666;
    "
  >
    未运行
  </span>
</div>

<!-- 第三行：可折叠区域 -->
<div 
  id="additionalContent" 
  style="
    max-height: 0; 
    opacity: 0; 
    overflow: hidden; 
    transition: max-height 0.5s ease, opacity 0.5s ease;
  "
>
  <div style="margin-bottom: 20px; display: flex; flex-direction: column;">
    <label>关注间隔（秒）：</label>
    <input 
      id="followIntervalInput" 
      type="number" 
      min="1" 
      value="${FOLLOW_INTERVAL_DEFAULT / 1000}" 
      style="
        width: 95%;
        padding: 5px;
        margin-top: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
      "
    />
  </div>
  <div style="margin-bottom: 20px; display: flex; flex-direction: column;">
    <label>取消关注间隔（秒）：</label>
    <input 
      id="unfollowIntervalInput" 
      type="number" 
      min="1" 
      value="${UNFOLLOW_INTERVAL_DEFAULT / 1000}" 
      style="
        width: 95%;
        padding: 5px;
        margin-top: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
      "
    />
  </div>
  <div style="display: flex; align-items: center; margin-bottom: 20px;">
    <input 
      id="useRandomInterval" 
      type="checkbox" 
      checked 
      style="margin-right: 9px;"
    />
    <label 
      for="useRandomInterval" 
      style="
        font-size: 14px; 
        color: #333; 
        cursor: pointer;
      "
    >
      使用随机时间间隔
    </label>
  </div>
  <div 
    id="logContainer" 
    style="
      max-height: 120px;
      overflow-y: auto;
      border: 1px solid #ddd;
      padding: 5px;
      margin-top: 20px;
      border-radius: 4px;
      font-size: 12px;
      color: #333;
      background-color: #f9f9f9;
    "
  ></div>
</div>

<!-- 错误消息提示区 -->
<div 
  id="errorMessage" 
  style="
    color: red; 
    font-size: 12px; 
    margin-top: 20px;
  "
></div>
        `;

        document.body.appendChild(panel);
        makePanelDraggable(panel);

        const toggleButton = panel.querySelector('#toggleButton');
        toggleButton.removeEventListener('click', toggleScript); // 先移除，再添加
        toggleButton.addEventListener('click', toggleScript);

        const foldButton = panel.querySelector('#foldButton');
        const additionalContent = panel.querySelector('#additionalContent');
        let isFolded = true;

        foldButton.addEventListener('click', () => {
            if (isFolded) {
                additionalContent.style.maxHeight = '400px';
                additionalContent.style.opacity = '1';
                foldButton.textContent = '收缩';
            } else {
                additionalContent.style.maxHeight = '0';
                additionalContent.style.opacity = '0';
                foldButton.textContent = '展开';
            }
            isFolded = !isFolded;
        });

        document.getElementById('toggleButton').addEventListener('click', toggleScript);
        document.getElementById('useRandomInterval').addEventListener('change', toggleRandomInterval);

        panel.querySelector('#followIntervalInput').addEventListener('input', (e) => {
            followInterval = parseInt(e.target.value, 10) * 1000;
        });
        panel.querySelector('#unfollowIntervalInput').addEventListener('input', (e) => {
            unfollowInterval = parseInt(e.target.value, 10) * 1000;
        });

        return {
            toggleButton,
            statusText: panel.querySelector('#statusText'),
            errorMessage: panel.querySelector('#errorMessage'),
            logContainer: panel.querySelector('#logContainer')
        };
    }

    function makePanelDraggable(panel) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SPAN' || e.target.tagName === 'INPUT') return;

            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            e.preventDefault();

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
            }
        }

        function onMouseUp() {
            if (isDragging) {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        }
    }

    function toggleScript() {
        if (isRunning) {
            stopAutoFollowUnfollow();
        } else {
            startAutoFollowUnfollow();
        }
        isRunning = !isRunning;
    }

    function startAutoFollowUnfollow() {
        localStorage.setItem('scriptRunning', 'true'); // 存储运行状态
        toggleFollowState(1);
        modalCheckInterval = setInterval(removeModal, 1000);
        captchaModalInterval = setInterval(geetest, 1000);
        modalCheckIntervalIfNeeded = setInterval(removeAllModalsIfNeeded, 1000);
        networkCheckInterval = setInterval(checkButtonStatus, 5000); // 每10秒检查一次
        errorCheckInterval = setInterval(checkForErrorPopup, 5000); // 每5秒检查一次弹窗
        checkButtonIfRuning = setInterval(checkButtonStatus, checkIntervaling);
        updateUI('暂停', '#f25d8e', '运行中');
    }

    function stopAutoFollowUnfollow() {
        localStorage.removeItem('scriptRunning'); // 清除运行状态
        clearTimeout(followUnfollowTimeout);
        clearInterval(modalCheckInterval);
        clearInterval(captchaModalInterval);
        clearInterval(modalCheckIntervalIfNeeded);
        clearInterval(networkCheckInterval); // 停止网络状态检测
        clearInterval(errorCheckInterval); // 停止检查
        clearInterval(checkButtonIfRuning);
        updateUI('开始', '#00a1d6', '未运行');
    }

    function removeModal() { 
        const modals = document.querySelectorAll('.modal-container');
        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-body');
            // 检查内容是否包含 "已经关注用户，无法重复关注" 或 "-352"
            if (modalContent && (modalContent.textContent.includes('已经关注用户，无法重复关注') || modalContent.textContent.includes('-352'))) 
                {
                modal.remove(); // 仅移除符合条件的弹窗
                showErrorMessage("指定的弹窗已被移除！");
            }
        });
    }

    function geetest() {
        const captchaModal = document.querySelector('.geetest_panel, .geetest_wind');
        const myPanel = document.getElementById('bilibili-auto-follow-panel');
        if (captchaModal && myPanel) {
            captchaModal.style.zIndex = '-2147483648'; // 保持验证码在你的面板之下
            myPanel.style.zIndex = '2147483647'; // 保证你的面板在最上层
        }
    }

    function removeAllModalsIfNeeded() {
        const modals = document.querySelectorAll('.be-toast'); // 选择的容器
        modals.forEach(modal => modal.remove()); // 移除所有匹配的面板
    }    


    function checkButtonStatus() { 
        const followBtn = document.querySelector('.follow-btn-wrapper .space-follow-btn');
        let currentState;
    
        if (!followBtn) {
            // 如果页面里连这个按钮都找不到，可能是还没加载或 DOM 改动
            currentState = 'error';
        } else {
            // 读取文本
            const btnText = followBtn.textContent.trim();
            // 举例：若包含“关注”，则判定为未关注
            if (btnText.includes('关注') && !btnText.includes('已关注')) {
                currentState = '未关注';
            }
            // 若包含“已关注”，则判定为已关注
            else if (btnText.includes('已关注')) {
                currentState = '已关注';
            } 
            // 如果以上都没匹配到，就可能是 B 站又改了文案，或网络加载中
            else {
                currentState = 'unknown';
            }
        }
    
        // 下面保持你原先的逻辑不变
        if (currentState !== previousState) {
            previousState = currentState;
            elapsedTime = 0; // 状态改变，重置时间
            console.log('状态发生变化:', currentState);
        } else {
            // 状态没有变化，增加经过时间
            elapsedTime += checkIntervaling;
            logMessage(`状态“${currentState}”未变化，已等待时间: ${elapsedTime / 1000} 秒`);
            
            // 如果超过最大等待时间，触发网络错误处理
            if (elapsedTime >= maxWaitTime) {
                handleNetworkError();
            }
        }
    }
    
    
    function handleNetworkError() {
        showErrorMessage("关注按钮未按预期变化，即将刷新页面");
        // 处理网络问题
        window.location.reload(); // 自动刷新页面
    }

    function checkForErrorPopup() {
        const modals = document.querySelectorAll('.modal-container'); // 获取弹窗元素
        modals.forEach(modal => {
            if (modal) {
                const modalContent = modal.querySelector('.modal-body'); // 获取弹窗内容
                if (modalContent && (modalContent.textContent.includes('获取用户关系数据失败，网络错误') || modalContent.textContent.includes('已经关注用户，无法重复关注'))) 
                    {
                    showErrorMessage('检测到网络问题弹窗，刷新页面...');
                    window.location.reload(); // 刷新页面以解决网络问题
                }
            }
        });
    }

    function toggleRandomInterval() {
        useRandomInterval = document.getElementById('useRandomInterval').checked;
    }

    function updateUI(buttonText, buttonColor, statusTextValue) {
        const toggleButton = document.getElementById('toggleButton');
        const statusText = document.getElementById('statusText');
        toggleButton.textContent = buttonText;
        toggleButton.style.backgroundColor = buttonColor;
        statusText.textContent = statusTextValue;
    }

    function toggleFollowState(action) {
        followOrUnfollow(action);
        const nextAction = action === 0 ? 1 : 0;
        const delay = getInterval(action === 0 ? unfollowInterval : followInterval);

        followUnfollowTimeout = setTimeout(() => toggleFollowState(nextAction), delay);
    }

    function followOrUnfollow(action) {
        try {
          if (action === 1) {
            // 1 表示“关注”
            const followBtn = findFollowButton(); // 如上定义
            if (followBtn) {
              followBtn.click();
              logMessage('已进行关注');
            } else {
              showErrorMessage('未找到关注按钮');
            }
          } else {
            // 0 表示“取消关注”
            // 这里先点击“已关注”按钮，再点下拉的“取消关注”
            const followBtn = document.querySelector('.space-follow-btn');
            if (followBtn) {
              followBtn.click(); 
              setTimeout(() => {
                const menuItem = findUnfollowMenuItem();
                if (menuItem) {
                  menuItem.click();
                  logMessage('已进行取消关注');
                } else {
                  showErrorMessage('未找到“取消关注”菜单项');
                }
              }, 500);
            } else {
              showErrorMessage('未找到已关注按钮');
            }
          }
        } catch (error) {
          showErrorMessage("执行关注/取消关注时出错: " + error.message);
        }
      }
      

    function getInterval(baseInterval) {
        let interval = useRandomInterval ? baseInterval + Math.random() * 1000 : baseInterval;
        console.log(`当前间隔时间: ${interval} 毫秒`);
        return interval;
    }

    function logMessage(message) {
        const logContainer = document.getElementById('logContainer');
        const logEntry = document.createElement('div');
        logEntry.textContent = message;

        if (logQueue.length >= MAX_LOGS) {
            logQueue.shift(); // 移除最早的日志，保持日志数量为10条
            logContainer.removeChild(logContainer.firstChild); // 删除页面中的最早日志
        }
        logQueue.push(message); // 添加日志到队列

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight; // 滚动到最底部

        // 同时限制控制台日志数量
        console.clear(); // 每次清空控制台
        logQueue.forEach(log => console.log(log)); // 重新输出最新的日志
    }

    function showErrorMessage(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            setTimeout(() => {
                errorMessage.textContent = '';
            }, 3000);
        }
    }

    createPanel();
})();
