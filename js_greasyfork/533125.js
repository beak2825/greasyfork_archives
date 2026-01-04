// ==UserScript==
// @name         DeepSeek防撤回助手
// @namespace    ds+@Byzod.user.js
// @version      0.14
// @description  自动缓存并恢复被撤回的AI回答内容
// @author       Deepseek & Byozd
// @license      MIT
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533125/DeepSeek%E9%98%B2%E6%92%A4%E5%9B%9E%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533125/DeepSeek%E9%98%B2%E6%92%A4%E5%9B%9E%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

GM_addStyle(`
  #ai-rescue-button {
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 99999 !important;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  #ai-rescue-button.ds-button--alert {
    box-shadow: 0 0 15px rgba(0,255,0,0.7) !important;
    animation: pulse 1s infinite;
  }
  @keyframes pulse {
    0% { opacity: 0.95; }
    50% { opacity: 1; }
    100% { opacity: 0.95; }
  }
  /* 新增弹出层样式 */
  #ai-rescue-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-30%, -50%);
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    z-index: 100000;
    min-width: 800px;
    max-width: 80%;
    padding: 20px;
  }

  #ai-rescue-popup h3 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 18px;
  }

  #ai-rescue-popup textarea {
    width: 100%;
    height: 300px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: monospace;
  }

  #ai-rescue-popup button {
    margin-top: 15px;
    padding: 8px 15px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  /* 新增渲染模式样式 */
  .content-viewer {
    display: flex;
    gap: 15px;
    min-height: 300px;
    max-height: 80vh;
  }

  .render-pane, .source-pane {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    overflow: auto;
  }

  .render-pane {
    background: #f9f9f9;
    white-space: pre-wrap;
  }

  .render-pane img {
    max-width: 100%;
  }

  .source-pane {
    font-family: monospace;
    display: none;
  }

  .source-pane.active {
    display: block;
  }

  .view-switcher {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .toggle-source {
    background: none;
    border: 1px solid #3498db;
    color: #3498db;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
`);

(function() {
    'use strict';

    const config = {
        CONTAINER_SELECTOR: 'div:has(>div>div.ds-markdown--block)', // 对话列表容器
        TARGET_PATTERN: 'div:not(:has(+ div)) > div.ds-markdown--block', // 最新内容框选择器
        TARGET_THOUGHT_PATTERN: 'div:not(:has(+ div)) > div:has(+div.ds-markdown--block)', // 最新内容框选择器
        BUTTON_CONTAINER: 'div:has(>#chat-input)+div', // 原按钮选择器
        CHECK_INTERVAL: 2000, // 容器检查间隔
        MIN_LENGTH: 20
    };

    let state = {
        currentTarget: null,
        currentThought: null,
        containerObserver: null,
        contentObserver: null,
        lastContent: '',
        lastThought: '',
        pendingContent: null,
        pendingThought: null,
        controlButton: null
    };

    function createControlButton() {
        const btn = document.createElement('button');
        btn.id = 'ai-rescue-button'; // 添加唯一ID
        btn.className = 'ds-button ds-button--m';
        btn.textContent = '缓存';

        // 移除原有的marginLeft样式
        btn.style.cssText = `
            min-width: 80px;
            cursor: pointer;
            font-weight: bold;
        `;
        // 点击事件保持原有逻辑
        btn.addEventListener('click', handleButtonClick);

        // 直接添加到body避免被覆盖
        document.body.appendChild(btn);

        return btn;
    }

    // 在showCachePopup函数中进行修改
    function showCachePopup() {
        const existingPopup = document.getElementById('ai-rescue-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.id = 'ai-rescue-popup';
        popup.innerHTML = `
            <div class="view-switcher">
                <h3>已缓存内容 (${state.lastThought.length + state.lastContent.length}字符)</h3>
                <div class="button-panel">
                  <button class="toggle-source">查看源码</button>
                  <button onclick="this.closest('#ai-rescue-popup').remove()">关闭</button>
                </div>
            </div>
            <div class="content-viewer">
                <div class="render-pane"></div>
                <textarea class="source-pane" readonly></textarea>
            </div>
        `;

        // 填充内容
        const renderPane = popup.querySelector('.render-pane');
        const sourcePane = popup.querySelector('.source-pane');
        renderPane.classList.add(...Array.from(findLatestTarget()?.parentElement.classList));
        renderPane.innerHTML = state.lastThought + state.lastContent; // 渲染HTML
        sourcePane.value = state.lastThought + state.lastContent;     // 显示源码

        // 添加切换功能
        const toggleBtn = popup.querySelector('.toggle-source');
        toggleBtn.addEventListener('click', () => {
            const isShowingSource = sourcePane.classList.toggle('active');
            renderPane.style.display = isShowingSource ? 'none' : 'block';
            toggleBtn.textContent = isShowingSource ? '查看渲染' : '查看源码';

            // 自动滚动保持位置
            if (isShowingSource) {
                sourcePane.scrollTop = renderPane.scrollTop;
            } else {
                renderPane.scrollTop = sourcePane.scrollTop;
            }
        });

        // 保持原有点击外部关闭功能
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.remove();
        });

        document.body.appendChild(popup);
    }

    function initControlButton() {
        const parent = document.querySelector(config.BUTTON_CONTAINER);
        if (!parent || state.controlButton) return;

        state.controlButton = createControlButton();
        parent.insertAdjacentElement('beforeend', state.controlButton);
    }

    function updateButtonState(isAlert = false) {
        if (!state.controlButton) return;

        state.controlButton.classList.toggle('ds-button--alert', isAlert);
        state.controlButton.textContent = isAlert ? '不许撤回' : '缓存';
    }

    // 获取最新内容框
    function findLatestTarget() {
        return document.querySelector(config.TARGET_PATTERN);
    }
    // 获取最新内容框
    function findLatestThoughtTarget() {
        return document.querySelector(config.TARGET_THOUGHT_PATTERN);
    }

    // 初始化容器观察
    function initContainerObserver() {
        const container = document.querySelector(config.CONTAINER_SELECTOR) || document.body;

        state.containerObserver = new MutationObserver(() => {
            checkTargetUpdate();
        });

        state.containerObserver.observe(container, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    // 检查是否需要更新目标
    function checkTargetUpdate() {
        const newTarget = findLatestTarget();
        const newThoughtTarget = findLatestThoughtTarget();
        if (!newTarget || newTarget === state.currentTarget) return;

        // 切换观察目标
        if (state.contentObserver) {
            state.contentObserver.disconnect();
        }

        state.currentTarget = newTarget;
        state.lastContent = newTarget.outerHTML;

        state.currentThought = newThoughtTarget;
        state.lastThought = newThoughtTarget.outerHTML;

        state.contentObserver = new MutationObserver(handleContentMutations);
        state.contentObserver.observe(newTarget, {
            childList: true,
            subtree: true,
            characterData: true
        });

        console.log('切换到新内容框:', newTarget);
    }

    // 处理内容变化
    function handleContentMutations(mutations) {
        const newContent = state.currentTarget.innerHTML;
        const newThoughtContent = state.currentThought.innerHTML;

        // 内容增长时更新缓存
        if (newContent.length > state.lastContent.length) {
            state.lastContent = newContent;
            state.lastThought = newThoughtContent;
            updateButtonState();
        }
        // 检测撤回
        else if (newContent.length < state.lastContent.length - 10) {
            state.pendingContent = state.lastContent;
            state.pendingThought = state.lastThought;
            updateButtonState(true);
        }
    }

    // 控制按钮相关功能（保持原有实现，增加目标检查）
    function handleButtonClick() {
        if (!state.currentTarget) {
            checkTargetUpdate();
            return;
        }

        if (state.pendingContent) {
            restoreContent();
        } else {
            showCachePopup();
        }
    }

    function restoreContent() {
        state.currentTarget.insertAdjacentHTML("beforebegin", state.pendingThought);
        state.lastThought = state.pendingThought;
        state.pendingThought = null;

        state.currentTarget.innerHTML = state.pendingContent;
        state.lastContent = state.pendingContent;
        state.pendingContent = null;

        updateButtonState();
    }

    // 主初始化
    function mainInit() {
        // 确保按钮始终存在
        if (!state.controlButton || !document.body.contains(state.controlButton)) {
            state.controlButton = createControlButton();
        }
        initContainerObserver();
        setInterval(checkTargetUpdate, config.CHECK_INTERVAL);
    }

    setTimeout(mainInit, 500);
})();