// ==UserScript==
// @name         Google AI Studio auto-continue helper
// @name:zh-CN   Google AI Studio 自动续写助手
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  auto-continue helper for Google AI Studio with Agent mode
// @description:zh-CN  谷歌AI Studio 自动续写助手 (支持Agent模式)
// @author       metrovoc
// @match        https://aistudio.google.com/prompts/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?domain=aistudio.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539086/Google%20AI%20Studio%20auto-continue%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/539086/Google%20AI%20Studio%20auto-continue%20helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- 配置区域 ---
  const SCROLL_CONTAINER_SELECTOR = "ms-autoscroll-container";
  const MESSAGE_TURN_SELECTOR = "ms-chat-turn";
  const AUTOSIZE_CONTAINER_SELECTOR = "ms-autosize-textarea";
  const TEXTAREA_SELECTOR = "ms-autosize-textarea textarea";
  const RUN_BUTTON_SELECTOR = 'run-button button[aria-label="Run"]';
  const STOP_BUTTON_SELECTOR = "run-button button.stoppable";
  const DEFAULT_CONTINUE_PROMPT = "continue";

  // --- 脚本状态变量 ---
  let isAutoContinueEnabled = false;
  let isAgentModeEnabled = false; // Agent模式开关
  let targetMessageCount = 10; // 目标消息数
  let isPanelExpanded = false;
  let customContinuePrompt = DEFAULT_CONTINUE_PROMPT;
  let debugPanel = null;
  let agentProgressPanel = null; // Agent进度显示
  let continueButton = null;
  let toggleButton = null;
  let customPromptInput = null;
  let targetCountInput = null; // 目标数量输入框
  let agentToggle = null; // Agent模式开关
  let uiContainer = null;
  let scrollTimeout = null;
  let agentInterval = null; // Agent模式定时器
  let countdownInterval = null; // 倒计时进度条定时器
  let countdownProgressBar = null; // 倒计时进度条元素
  let isAgentSectionExpanded = false; // Agent区域展开状态
  let currentScrollContainer = null;
  let containerWatcher = null;
  let lastMessageCount = 0; // 上次消息数量
  let pendingAgentTrigger = false; // 防止重复触发

  // --- 启动逻辑 ---
  console.log("Gemini 自动续写脚本 v4.2 (Agent Mode) 已启动！");
  createAdvancedUI();
  startContainerWatcher();

  // 调试函数 - 可在控制台手动调用
  window.debugAgentBreathing = function () {
    const agentSection = document.querySelector(".agent-section");
    if (agentSection) {
      agentSection.classList.toggle("breathing");
      console.log(
        "呼吸效果状态:",
        agentSection.classList.contains("breathing")
      );
    }
  };

  function startContainerWatcher() {
    // 持续监控容器的存在和变化
    containerWatcher = setInterval(() => {
      const scrollContainer = document.querySelector(SCROLL_CONTAINER_SELECTOR);

      // 检查容器是否发生变化
      if (scrollContainer !== currentScrollContainer) {
        if (currentScrollContainer) {
          console.log("检测到容器变化，重新绑定监听器");
          // 移除旧的监听器
          currentScrollContainer.removeEventListener("scroll", handleScroll);
        }

        if (scrollContainer) {
          console.log("找到新的滚动容器，绑定监听器");
          currentScrollContainer = scrollContainer;
          bindScrollListener(scrollContainer);
          // 立即更新一次状态
          setTimeout(() => updateDebugInfoAndTrigger(scrollContainer), 100);
        } else {
          console.log("未找到滚动容器");
          currentScrollContainer = null;
          if (debugPanel) {
            debugPanel.textContent = "...";
          }
          if (agentProgressPanel) {
            agentProgressPanel.textContent = "0/0";
          }
        }
      }

      // Agent模式独立更新
      if (isAgentModeEnabled && scrollContainer) {
        updateAgentProgress(scrollContainer);
      } else if (isAgentModeEnabled) {
        // 即使没有容器也要更新视觉状态
        updateAgentVisualState();
      }

      // 每次都检查视觉状态，确保及时清除
      updateAgentVisualState();

      // 同步UI状态，确保continue button在fetching时被禁用
      syncUIState();
    }, 500);
  }

  function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (currentScrollContainer) {
        updateDebugInfoAndTrigger(currentScrollContainer);
      }
    }, 100);
  }

  function bindScrollListener(scrollContainer) {
    scrollContainer.addEventListener("scroll", handleScroll);
  }

  // --- Agent模式相关函数 ---
  function updateAgentProgress(container) {
    const validTurns = getValidChatTurns(container);
    const currentCount = validTurns.length;

    if (agentProgressPanel) {
      agentProgressPanel.textContent = `${currentCount}/${targetMessageCount}`;
    }

    // 更新Agent UI状态
    updateAgentVisualState();

    // 检查是否需要触发Agent自动续写
    if (
      isAgentModeEnabled &&
      currentCount < targetMessageCount &&
      !isCurrentlyFetching() &&
      !pendingAgentTrigger
    ) {
      // 检查消息数是否有增加(说明AI已经回复完成)
      if (currentCount > lastMessageCount || lastMessageCount === 0) {
        lastMessageCount = currentCount;
        scheduleAgentContinue();
      }
    } else if (currentCount >= targetMessageCount) {
      stopAgentMode();
    }
  }

  function updateAgentVisualState() {
    const agentSection = document.querySelector(".agent-section");
    if (!agentSection) return;

    // 如果Agent模式未启用，强制清除呼吸效果
    if (!isAgentModeEnabled) {
      agentSection.classList.remove("breathing");
      return;
    }

    const isGenerating = isCurrentlyFetching();
    const isCountingDown = pendingAgentTrigger;

    console.log(
      `视觉状态更新: Agent=${isAgentModeEnabled}, 生成中=${isGenerating}, 倒计时=${isCountingDown}`
    );

    // 只在AI正在生成且不在倒计时时显示呼吸效果
    if (isGenerating && !isCountingDown) {
      agentSection.classList.add("breathing");
    } else {
      agentSection.classList.remove("breathing");
    }
  }

  function scheduleAgentContinue() {
    // 随机间隔: 2-8秒，防止风控
    const randomDelay = Math.random() * 6000 + 2000; // 2000-8000ms
    console.log(
      `Agent模式: 将在 ${(randomDelay / 1000).toFixed(1)} 秒后继续生成`
    );

    pendingAgentTrigger = true;
    updateAgentVisualState(); // 更新视觉状态
    startCountdownProgress(randomDelay);

    agentInterval = setTimeout(() => {
      if (isAgentModeEnabled && !isCurrentlyFetching()) {
        console.log("Agent模式: 执行自动续写");
        performAutoContinue();
      }
      pendingAgentTrigger = false;
      updateAgentVisualState(); // 更新视觉状态
      hideCountdownProgress();
    }, randomDelay);
  }

  function startCountdownProgress(totalDelay) {
    if (!countdownProgressBar) return;

    countdownProgressBar.style.display = "block";
    const startTime = Date.now();
    const updateInterval = 50; // 每50ms更新一次

    countdownInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDelay) * 100, 100);

      const progressFill = countdownProgressBar.querySelector(".progress-fill");
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }

      if (progress >= 100) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }, updateInterval);
  }

  function hideCountdownProgress() {
    if (countdownProgressBar) {
      countdownProgressBar.style.display = "none";
      const progressFill = countdownProgressBar.querySelector(".progress-fill");
      if (progressFill) {
        progressFill.style.width = "0%";
      }
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  function startAgentMode() {
    console.log(`Agent模式启动: 目标 ${targetMessageCount} 条消息`);
    isAgentModeEnabled = true;
    lastMessageCount = 0;
    pendingAgentTrigger = false;

    updateAgentProgressVisibility();

    // 立即检查一次状态
    if (currentScrollContainer) {
      updateAgentProgress(currentScrollContainer);
    }
  }

  function stopAgentMode() {
    console.log("Agent模式已停止");
    isAgentModeEnabled = false;
    pendingAgentTrigger = false;
    lastMessageCount = 0;

    if (agentInterval) {
      clearTimeout(agentInterval);
      agentInterval = null;
    }

    hideCountdownProgress();
    updateAgentProgressVisibility();

    // 强制清除呼吸效果
    const agentSection = document.querySelector(".agent-section");
    if (agentSection) {
      agentSection.classList.remove("breathing");
    }
    updateAgentVisualState();

    if (agentToggle) {
      agentToggle.checked = false;
    }
  }

  function updateAgentProgressVisibility() {
    if (agentProgressPanel) {
      const agentStatusSection = agentProgressPanel.closest(".panel-section");
      if (agentStatusSection) {
        agentStatusSection.style.display = isAgentModeEnabled ? "flex" : "none";
      }
    }
  }

  // 页面卸载时清理
  window.addEventListener("beforeunload", () => {
    stopAgentMode();
    if (containerWatcher) {
      clearInterval(containerWatcher);
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });

  // --- 核心功能函数 ---
  function isCurrentlyFetching() {
    return !!document.querySelector(STOP_BUTTON_SELECTOR);
  }

  function syncUIState() {
    if (continueButton) {
      continueButton.disabled = isCurrentlyFetching();
    }
  }

  function performAutoContinue() {
    if (isCurrentlyFetching()) {
      console.log("正在等待AI响应，续写操作已跳过。");
      return;
    }

    const autosizeContainer = document.querySelector(
      AUTOSIZE_CONTAINER_SELECTOR
    );
    const textarea = document.querySelector(TEXTAREA_SELECTOR);
    const runButton = document.querySelector(RUN_BUTTON_SELECTOR);

    if (autosizeContainer && textarea && runButton) {
      console.log(`尝试执行续写，发送: "${customContinuePrompt}"`);

      autosizeContainer.setAttribute("data-value", customContinuePrompt);
      textarea.value = customContinuePrompt;
      textarea.dispatchEvent(
        new Event("input", { bubbles: true, composed: true })
      );

      // Generate random delay between 50ms and 250ms to simulate human behavior
      const humanDelay = Math.random() * 200 + 50; // 50-250ms
      console.log(
        `Human-like delay: ${humanDelay.toFixed(
          0
        )}ms before clicking run button`
      );

      setTimeout(() => {
        // Re-check conditions before clicking to avoid conflicts during delay
        if (isCurrentlyFetching()) {
          console.log(
            "AI started responding during delay, skipping button click"
          );
          return;
        }

        const finalRunButton = document.querySelector(RUN_BUTTON_SELECTOR);
        if (finalRunButton && !finalRunButton.disabled) {
          finalRunButton.click();
          console.log("消息已发送！");
          // 立即同步UI状态，禁用continue button
          setTimeout(() => syncUIState(), 100);
        } else {
          console.error("发送失败：按钮在填充输入后仍然被禁用。");
        }
      }, humanDelay);
    } else {
      console.warn("无法执行续写：缺少必要的UI组件。");
    }
  }

  // 过滤有效的聊天轮次：包含model-prompt-container且不含ms-thought-chunk的ms-chat-turn
  function getValidChatTurns(container) {
    const allTurns = container.querySelectorAll(MESSAGE_TURN_SELECTOR);
    const validTurns = [];

    console.log(`[getValidChatTurns] 总聊天轮次: ${allTurns.length}`);

    allTurns.forEach((turn, index) => {
      // 检查是否包含 model-prompt-container
      const hasModelPromptContainer = turn.querySelector(
        ".model-prompt-container"
      );
      if (!hasModelPromptContainer) {
        console.log(
          `[getValidChatTurns] 轮次 ${
            index + 1
          }: 跳过 - 无 model-prompt-container`
        );
        return;
      }

      // 检查是否不包含 ms-thought-chunk (自定义元素，不用点号)
      const hasThoughtChunk = turn.querySelector("ms-thought-chunk");
      if (hasThoughtChunk) {
        console.log(
          `[getValidChatTurns] 轮次 ${index + 1}: 跳过 - 包含 ms-thought-chunk`
        );
        return;
      }

      console.log(`[getValidChatTurns] 轮次 ${index + 1}: ✓ 有效`);
      validTurns.push(turn);
    });

    console.log(
      `[getValidChatTurns] 有效聊天轮次: ${validTurns.length}/${allTurns.length}`
    );
    return validTurns;
  }

  function updateDebugInfoAndTrigger(container) {
    if (!debugPanel || !container) return;

    const validTurns = getValidChatTurns(container);
    const total = validTurns.length;
    if (total === 0) {
      debugPanel.textContent = "0/0";
      return;
    }

    let currentIndex = -1;
    const viewportTopThreshold = container.getBoundingClientRect().top + 60;
    for (let i = 0; i < validTurns.length; i++) {
      const rect = validTurns[i].getBoundingClientRect();
      if (rect.top >= viewportTopThreshold) {
        currentIndex = i;
        break;
      }
    }

    // 计算显示位置：
    // currentIndex = -1 表示所有validturn都已滚动过，显示最后一个
    // currentIndex = 0 表示还没开始看第一个validturn，显示0
    // currentIndex = i 表示正在看第i个validturn，显示i
    let displayPosition;
    if (currentIndex === -1) {
      displayPosition = total; // 所有都看过了
    } else if (currentIndex === 0) {
      displayPosition = 0; // 还没开始看第一个
    } else {
      displayPosition = currentIndex; // 正在看第currentIndex个（从0开始）
    }

    debugPanel.textContent = `${displayPosition}/${total}`;

    // 只有在非Agent模式下才使用滚动逻辑触发
    if (!isAgentModeEnabled) {
      const shouldTrigger =
        isAutoContinueEnabled && total > 1 && displayPosition >= total - 1;
      if (shouldTrigger && !isCurrentlyFetching()) {
        console.log(`自动续写条件满足：位置 ${displayPosition}/${total}`);
        performAutoContinue();
      }
    }
  }

  // --- SVG图标创建函数 ---
  function createSVGIcon(pathData, viewBox = "0 0 24 24") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("fill", "currentColor");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);

    svg.appendChild(path);
    return svg;
  }

  function createExpandIcon() {
    return createSVGIcon("M7 14l5-5 5 5z");
  }

  function createCollapseIcon() {
    return createSVGIcon("M7 10l5 5 5-5z");
  }

  function createSettingsIcon() {
    return createSVGIcon(
      "M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
    );
  }

  function togglePanel() {
    isPanelExpanded = !isPanelExpanded;
    updatePanelState();
  }

  function updatePanelState() {
    const panel = document.getElementById("tampermonkey-panel");
    const toggleBtnIcon = document.getElementById("tampermonkey-toggle-icon");

    if (isPanelExpanded) {
      panel.style.display = "flex";
      // 清空并重新添加icon
      toggleBtnIcon.textContent = "";
      toggleBtnIcon.appendChild(createCollapseIcon());
      uiContainer.classList.add("expanded");
    } else {
      panel.style.display = "none";
      // 清空并重新添加icon
      toggleBtnIcon.textContent = "";
      toggleBtnIcon.appendChild(createSettingsIcon());
      uiContainer.classList.remove("expanded");
    }
  }

  function toggleAgentSection() {
    isAgentSectionExpanded = !isAgentSectionExpanded;
    const agentDetails = document.querySelector(".agent-details");
    const expandArrow = document.querySelector(".expand-arrow");

    if (agentDetails && expandArrow) {
      if (isAgentSectionExpanded) {
        agentDetails.style.display = "block";
        expandArrow.textContent = "▼";
        expandArrow.classList.add("expanded");
      } else {
        agentDetails.style.display = "none";
        expandArrow.textContent = "▶";
        expandArrow.classList.remove("expanded");
      }
    }
  }

  // --- 高级UI创建 ---
  function createAdvancedUI() {
    // 主容器
    uiContainer = document.createElement("div");
    uiContainer.id = "tampermonkey-ui-container";
    uiContainer.className = "collapsed";
    document.body.appendChild(uiContainer);

    // 切换按钮（始终可见）
    toggleButton = document.createElement("button");
    toggleButton.id = "tampermonkey-toggle-btn";
    toggleButton.className = "toggle-button";
    toggleButton.setAttribute("title", "Toggle Gemini Assistant Panel");

    const toggleIcon = document.createElement("span");
    toggleIcon.id = "tampermonkey-toggle-icon";
    toggleIcon.appendChild(createSettingsIcon());
    toggleButton.appendChild(toggleIcon);

    toggleButton.addEventListener("click", togglePanel);
    uiContainer.appendChild(toggleButton);

    // 主面板容器（可折叠）
    const panel = document.createElement("div");
    panel.id = "tampermonkey-panel";
    panel.className = "main-panel";
    panel.style.display = "none";
    uiContainer.appendChild(panel);

    // 状态显示区域
    const statusSection = document.createElement("div");
    statusSection.className = "panel-section";

    const statusLabel = document.createElement("span");
    statusLabel.className = "section-label";
    statusLabel.textContent = "Scroll Position:";

    debugPanel = document.createElement("div");
    debugPanel.id = "tampermonkey-debug-panel";
    debugPanel.className = "status-display";
    debugPanel.textContent = "...";

    statusSection.appendChild(statusLabel);
    statusSection.appendChild(debugPanel);
    panel.appendChild(statusSection);

    // Agent模式状态区域（初始隐藏）
    const agentStatusSection = document.createElement("div");
    agentStatusSection.className = "panel-section";
    agentStatusSection.style.display = "none";

    const agentStatusLabel = document.createElement("span");
    agentStatusLabel.className = "section-label";
    agentStatusLabel.textContent = "Agent Progress:";

    agentProgressPanel = document.createElement("div");
    agentProgressPanel.id = "tampermonkey-agent-panel";
    agentProgressPanel.className = "status-display agent-status";
    agentProgressPanel.textContent = "0/0";

    agentStatusSection.appendChild(agentStatusLabel);
    agentStatusSection.appendChild(agentProgressPanel);
    panel.appendChild(agentStatusSection);

    // 控制按钮区域
    const controlSection = document.createElement("div");
    controlSection.className = "panel-section compact";

    // 手动继续按钮行
    const continueRow = document.createElement("div");
    continueRow.className = "control-row";

    continueButton = document.createElement("button");
    continueButton.id = "tampermonkey-continue-btn";
    continueButton.className = "control-button primary compact";
    continueButton.textContent = "Continue";
    continueButton.addEventListener("click", () => {
      console.log("手动触发续写...");
      performAutoContinue();
      // 更新Agent视觉状态，因为可能开始了新的生成
      setTimeout(() => {
        updateAgentVisualState();
        syncUIState();
      }, 100);
    });

    continueRow.appendChild(continueButton);

    // 自动续写开关行
    const autoRow = document.createElement("div");
    autoRow.className = "control-row";

    const autoLabel = document.createElement("label");
    autoLabel.className = "control-label";
    autoLabel.textContent = "Auto continue:";

    const autoSwitchContainer = document.createElement("div");
    autoSwitchContainer.className = "switch-container";

    const autoSwitchLabel = document.createElement("label");
    autoSwitchLabel.className = "switch-label small";
    autoSwitchLabel.setAttribute("title", "Auto-Continue Toggle");

    const autoContinueToggle = document.createElement("input");
    autoContinueToggle.type = "checkbox";
    autoContinueToggle.checked = isAutoContinueEnabled;
    autoContinueToggle.addEventListener("change", (e) => {
      isAutoContinueEnabled = e.target.checked;
      // 开启普通自动续写时，关闭Agent模式
      if (isAutoContinueEnabled && isAgentModeEnabled) {
        stopAgentMode();
      }
      console.log(`自动续写已 ${isAutoContinueEnabled ? "开启" : "关闭"}`);
    });

    const switchSlider = document.createElement("span");
    switchSlider.className = "switch-slider";

    autoSwitchLabel.appendChild(autoContinueToggle);
    autoSwitchLabel.appendChild(switchSlider);
    autoSwitchContainer.appendChild(autoSwitchLabel);

    autoRow.appendChild(autoLabel);
    autoRow.appendChild(autoSwitchContainer);

    controlSection.appendChild(continueRow);
    controlSection.appendChild(autoRow);
    panel.appendChild(controlSection);

    // Agent模式控制区域
    const agentSection = document.createElement("div");
    agentSection.className = "panel-section agent-section";

    // Agent模式主标题和展开箭头
    const agentMainHeader = document.createElement("div");
    agentMainHeader.className = "agent-main-header";
    agentMainHeader.addEventListener("click", toggleAgentSection);

    const agentMainTitle = document.createElement("span");
    agentMainTitle.className = "section-label clickable";
    agentMainTitle.textContent = "Agent Mode";

    const expandArrow = document.createElement("span");
    expandArrow.className = "expand-arrow";
    expandArrow.textContent = "▶";

    agentMainHeader.appendChild(agentMainTitle);
    agentMainHeader.appendChild(expandArrow);

    // Agent详细控制区域（可折叠）
    const agentDetailsSection = document.createElement("div");
    agentDetailsSection.className = "agent-details";
    agentDetailsSection.style.display = "none";

    // Agent模式开关行
    const agentToggleRow = document.createElement("div");
    agentToggleRow.className = "agent-control-row";

    const agentToggleLabel = document.createElement("label");
    agentToggleLabel.className = "control-label";
    agentToggleLabel.textContent = "Enable:";

    const agentSwitchContainer = document.createElement("div");
    agentSwitchContainer.className = "switch-container";

    const agentSwitchLabel = document.createElement("label");
    agentSwitchLabel.className = "switch-label small";
    agentSwitchLabel.setAttribute("title", "Agent Mode Toggle");

    agentToggle = document.createElement("input");
    agentToggle.type = "checkbox";
    agentToggle.checked = isAgentModeEnabled;
    agentToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        // 开启Agent模式时，关闭普通自动续写
        if (isAutoContinueEnabled) {
          isAutoContinueEnabled = false;
          const normalToggle = document.querySelector(
            '#tampermonkey-panel input[type="checkbox"]'
          );
          if (normalToggle && normalToggle !== agentToggle) {
            normalToggle.checked = false;
          }
        }
        startAgentMode();
      } else {
        stopAgentMode();
      }
    });

    const agentSwitchSlider = document.createElement("span");
    agentSwitchSlider.className = "switch-slider";

    agentSwitchLabel.appendChild(agentToggle);
    agentSwitchLabel.appendChild(agentSwitchSlider);
    agentSwitchContainer.appendChild(agentSwitchLabel);

    agentToggleRow.appendChild(agentToggleLabel);
    agentToggleRow.appendChild(agentSwitchContainer);

    // 目标数量输入行
    const targetRow = document.createElement("div");
    targetRow.className = "agent-control-row";

    const targetLabel = document.createElement("label");
    targetLabel.className = "control-label";
    targetLabel.setAttribute("for", "tampermonkey-target-input");
    targetLabel.textContent = "Target:";

    targetCountInput = document.createElement("input");
    targetCountInput.id = "tampermonkey-target-input";
    targetCountInput.type = "number";
    targetCountInput.className = "number-input compact";
    targetCountInput.value = targetMessageCount;
    targetCountInput.min = "1";
    targetCountInput.max = "999";
    targetCountInput.placeholder = "10";
    targetCountInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      if (value && value > 0) {
        targetMessageCount = value;
        console.log(`目标消息数已更新: ${targetMessageCount}`);
      }
    });

    targetRow.appendChild(targetLabel);
    targetRow.appendChild(targetCountInput);

    // 倒计时进度条
    countdownProgressBar = document.createElement("div");
    countdownProgressBar.className = "countdown-progress";
    countdownProgressBar.style.display = "none";

    const progressLabel = document.createElement("div");
    progressLabel.className = "progress-label";
    progressLabel.textContent = "Next generation in:";

    const progressBarContainer = document.createElement("div");
    progressBarContainer.className = "progress-bar-container";

    const progressFill = document.createElement("div");
    progressFill.className = "progress-fill";

    progressBarContainer.appendChild(progressFill);
    countdownProgressBar.appendChild(progressLabel);
    countdownProgressBar.appendChild(progressBarContainer);

    agentDetailsSection.appendChild(agentToggleRow);
    agentDetailsSection.appendChild(targetRow);
    agentDetailsSection.appendChild(countdownProgressBar);

    agentSection.appendChild(agentMainHeader);
    agentSection.appendChild(agentDetailsSection);
    panel.appendChild(agentSection);

    // 自定义提示词区域
    const promptSection = document.createElement("div");
    promptSection.className = "panel-section";

    const promptLabel = document.createElement("label");
    promptLabel.className = "section-label";
    promptLabel.setAttribute("for", "tampermonkey-prompt-input");
    promptLabel.textContent = "Custom Prompt:";

    customPromptInput = document.createElement("input");
    customPromptInput.id = "tampermonkey-prompt-input";
    customPromptInput.type = "text";
    customPromptInput.className = "prompt-input";
    customPromptInput.value = customContinuePrompt;
    customPromptInput.placeholder = "Enter custom continue prompt...";
    customPromptInput.addEventListener("input", (e) => {
      customContinuePrompt = e.target.value.trim() || DEFAULT_CONTINUE_PROMPT;
      console.log(`自定义提示词已更新: "${customContinuePrompt}"`);
    });

    promptSection.appendChild(promptLabel);
    promptSection.appendChild(customPromptInput);
    panel.appendChild(promptSection);

    // 添加样式
    GM_addStyle(`
      #tampermonkey-ui-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .toggle-button {
        width: 48px;
        height: 48px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #1a73e8, #185abc);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
      }

      .toggle-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.4);
        background: linear-gradient(135deg, #185abc, #1557a0);
      }

      .toggle-button:active {
        transform: translateY(0);
      }

      #tampermonkey-toggle-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
      }

      .expanded #tampermonkey-toggle-icon {
        transform: rotate(180deg);
      }

      .main-panel {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 16px;
        min-width: 280px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: none;
        flex-direction: column;
        gap: 12px;
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .panel-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .panel-section.compact {
        gap: 6px;
      }

      .control-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 32px;
      }

      .section-label {
        font-size: 12px;
        font-weight: 600;
        color: #5f6368;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-display {
        background: rgba(26, 115, 232, 0.1);
        color: #1a73e8;
        padding: 8px 12px;
        border-radius: 8px;
        font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        border: 1px solid rgba(26, 115, 232, 0.2);
      }

      .agent-status {
        background: rgba(34, 139, 34, 0.1);
        color: #228b22;
        border: 1px solid rgba(34, 139, 34, 0.2);
      }

      .control-button {
        background: linear-gradient(135deg, #1a73e8, #185abc);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
      }

      .control-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4);
      }

      .control-button:disabled {
        background: #e0e0e0;
        color: #9e9e9e;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .control-button.compact {
        padding: 8px 16px;
        font-size: 13px;
        width: 100%;
      }



      .switch-label {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 28px;
        cursor: pointer;
        align-self: flex-start;
      }

      .switch-label input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .switch-slider {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        border-radius: 28px;
        transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .switch-slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        border-radius: 50%;
        transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .switch-label input:checked + .switch-slider {
        background: linear-gradient(135deg, #1a73e8, #185abc);
      }

      .switch-label input:checked + .switch-slider:before {
        transform: translateX(24px);
      }

      .switch-label.small {
        width: 40px;
        height: 22px;
      }

      .switch-label.small .switch-slider {
        border-radius: 22px;
      }

      .switch-label.small .switch-slider:before {
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
      }

      .switch-label.small input:checked + .switch-slider:before {
        transform: translateX(18px);
      }

      .prompt-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        font-size: 14px;
        font-family: inherit;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(255, 255, 255, 0.8);
        box-sizing: border-box;
      }

      .prompt-input:focus {
        outline: none;
        border-color: #1a73e8;
        box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
        background: white;
      }

      .prompt-input::placeholder {
        color: #9e9e9e;
        font-style: italic;
      }

      .agent-section {
        border-top: 1px solid #e0e0e0;
        background: rgba(34, 139, 34, 0.03);
        border-radius: 10px;
        padding: 10px;
        margin-top: 4px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .agent-section.breathing {
        animation: agentBreathing 2.2s ease-in-out infinite;
      }

      .agent-section.breathing::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        background: radial-gradient(circle at center, rgba(34, 139, 34, 0.4) 0%, rgba(34, 139, 34, 0.2) 40%, transparent 70%);
        border-radius: inherit;
        transform: scale(0);
        animation: rippleBreathing 2.2s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      }

      .agent-section.breathing::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        right: 4px;
        bottom: 4px;
        background: radial-gradient(circle at center, rgba(34, 139, 34, 0.5) 0%, rgba(34, 139, 34, 0.3) 30%, transparent 60%);
        border-radius: inherit;
        transform: scale(0);
        animation: rippleBreathing 2.2s ease-in-out infinite 0.6s;
        pointer-events: none;
        z-index: 1;
      }

      .agent-section.breathing > * {
        position: relative;
        z-index: 2;
      }

      @keyframes agentBreathing {
        0%, 100% {
          background: rgba(34, 139, 34, 0.03);
          box-shadow: 0 0 0 0 rgba(34, 139, 34, 0.1), 
                      0 0 15px 0 rgba(34, 139, 34, 0.05);
          border-color: #e0e0e0;
          transform: scale(1);
        }
        50% {
          background: rgba(34, 139, 34, 0.12);
          box-shadow: 0 0 0 4px rgba(34, 139, 34, 0.2), 
                      0 0 25px 5px rgba(34, 139, 34, 0.15);
          border-color: rgba(34, 139, 34, 0.4);
          transform: scale(1.02);
        }
      }

      @keyframes rippleBreathing {
        0%, 100% {
          transform: scale(0);
          opacity: 0;
        }
        15% {
          transform: scale(0.5);
          opacity: 0.8;
        }
        35% {
          transform: scale(1.2);
          opacity: 0.7;
        }
        60% {
          transform: scale(1.8);
          opacity: 0.4;
        }
        85% {
          transform: scale(2.2);
          opacity: 0.1;
        }
        100% {
          transform: scale(2.5);
          opacity: 0;
        }
      }

      .agent-main-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 4px 0;
        transition: all 0.2s ease;
      }

      .agent-main-header:hover {
        background: rgba(34, 139, 34, 0.1);
        border-radius: 6px;
        padding: 4px 8px;
      }

      .section-label.clickable {
        user-select: none;
        transition: color 0.2s ease;
      }

      .expand-arrow {
        font-size: 12px;
        transition: transform 0.3s ease;
        color: #228b22;
        font-weight: bold;
      }

      .expand-arrow.expanded {
        transform: rotate(0deg);
      }

      .agent-details {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(34, 139, 34, 0.2);
        display: none;
      }

      .agent-control-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        min-height: 28px;
      }

      .control-label {
        font-size: 12px;
        font-weight: 600;
        color: #5f6368;
        min-width: 60px;
      }

      .switch-container {
        display: flex;
        align-items: center;
      }

      .input-label {
        font-size: 12px;
        font-weight: 600;
        color: #5f6368;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        display: block;
      }

      .number-input {
        width: 100%;
        padding: 10px 14px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(255, 255, 255, 0.8);
        box-sizing: border-box;
        text-align: center;
        font-weight: 600;
      }

      .number-input:focus {
        outline: none;
        border-color: #228b22;
        box-shadow: 0 0 0 3px rgba(34, 139, 34, 0.1);
        background: white;
      }

      .number-input.compact {
        width: 80px;
        padding: 8px 12px;
        font-size: 13px;
      }



      .countdown-progress {
        background: rgba(34, 139, 34, 0.1);
        border-radius: 8px;
        padding: 8px;
        margin: 6px 0;
        border: 1px solid rgba(34, 139, 34, 0.2);
      }

      .progress-label {
        font-size: 11px;
        color: #228b22;
        font-weight: 600;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .progress-bar-container {
        width: 100%;
        height: 4px;
        background: rgba(34, 139, 34, 0.2);
        border-radius: 2px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #228b22, #32cd32);
        border-radius: 2px;
        width: 0%;
        transition: width 0.1s ease-out;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .main-panel {
          background: rgba(32, 33, 36, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-label {
          color: #bdc1c6;
        }
        
        .prompt-input {
          background: rgba(32, 33, 36, 0.8);
          border-color: #5f6368;
          color: #e8eaed;
        }
        
        .prompt-input:focus {
          background: #32333;
          border-color: #1a73e8;
        }

        .agent-section {
          background: rgba(34, 139, 34, 0.08);
          border-top: 1px solid #5f6368;
        }

        .agent-section.breathing::before {
          background: radial-gradient(circle at center, rgba(74, 222, 128, 0.4) 0%, rgba(34, 139, 34, 0.2) 40%, transparent 70%);
        }

        .agent-section.breathing::after {
          background: radial-gradient(circle at center, rgba(74, 222, 128, 0.5) 0%, rgba(34, 139, 34, 0.3) 30%, transparent 60%);
        }

        @keyframes agentBreathing {
          0%, 100% {
            background: rgba(34, 139, 34, 0.08);
            box-shadow: 0 0 0 0 rgba(34, 139, 34, 0.15), 
                        0 0 20px 0 rgba(34, 139, 34, 0.1);
            border-color: #5f6368;
            transform: scale(1);
          }
          50% {
            background: rgba(34, 139, 34, 0.20);
            box-shadow: 0 0 0 4px rgba(34, 139, 34, 0.35), 
                        0 0 30px 8px rgba(34, 139, 34, 0.25);
            border-color: rgba(74, 222, 128, 0.5);
            transform: scale(1.02);
          }
        }

        .agent-main-header:hover {
          background: rgba(34, 139, 34, 0.15);
        }

        .agent-details {
          border-top: 1px solid rgba(34, 139, 34, 0.3);
        }

        .input-label, .control-label {
          color: #bdc1c6;
        }

        .number-input {
          background: rgba(32, 33, 36, 0.8);
          border-color: #5f6368;
          color: #e8eaed;
        }

        .number-input:focus {
          background: #323336;
          border-color: #228b22;
        }

        .countdown-progress {
          background: rgba(34, 139, 34, 0.15);
          border-color: rgba(34, 139, 34, 0.3);
        }

        .progress-label {
          color: #4ade80;
        }

        .progress-bar-container {
          background: rgba(34, 139, 34, 0.3);
        }
      }
    `);

    // 初始化面板状态
    updatePanelState();
  }
})();
