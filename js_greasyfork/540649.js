// ==UserScript==
// @name         一个优化你使用AI时候的prompt智能体。
// @namespace    prompt-agent
// @version      0.0.5
// @description  prompt-agent
// @author       LLinkedList771
// @run-at       document-end
// @match        https://chat.deepseek.com/*
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @homepageURL  https://github.com/linkedlist771/prompt-agent
// @supportURL   https://github.com/linkedlist771/prompt-agent/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540649/%E4%B8%80%E4%B8%AA%E4%BC%98%E5%8C%96%E4%BD%A0%E4%BD%BF%E7%94%A8AI%E6%97%B6%E5%80%99%E7%9A%84prompt%E6%99%BA%E8%83%BD%E4%BD%93%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/540649/%E4%B8%80%E4%B8%AA%E4%BC%98%E5%8C%96%E4%BD%A0%E4%BD%BF%E7%94%A8AI%E6%97%B6%E5%80%99%E7%9A%84prompt%E6%99%BA%E8%83%BD%E4%BD%93%E3%80%82.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 全局配置变量
  let isEnabled = false;
  let apiKey = localStorage.getItem('ai-script-apikey') || '';
  let isProcessing = false;
  let currentSiteConfig = null;

  // 网站配置
  const SITE_CONFIGS = {
    'chat.deepseek.com': {
      name: 'DeepSeek',
      textareaSelectors: ['textarea'],
      sendButtonSelectors: [
        'button[type="submit"]',
        '[data-testid="send-button"]',
        '.send-button'
      ],
      textInputMethod: 'simulate' // 'simulate' or 'direct'
    },
    'chatgpt.com': {
      name: 'ChatGPT',
      textareaSelectors: ['textarea', '[contenteditable="true"]'],
      sendButtonSelectors: [
        'button[data-testid="send-button"]',
        'button[aria-label*="Send"]',
        'button:has(svg)'
      ],
      textInputMethod: 'simulate'
    },
    'claude.ai': {
      name: 'Claude',
      textareaSelectors: ['div[contenteditable="true"]', 'textarea', '[contenteditable="true"]'],
      sendButtonSelectors: [
        'button[aria-label*="Send"]',
        'button:has(svg)',
        'button[type="submit"]'
      ],
      textInputMethod: 'simulate'
    }
  };

  // API配置
  const API_CONFIG = {
    endpoint: "https://promptagent.qqyunsd.com/api/v1/chat/completions",
    model: "mock-gpt-model",
    maxTokens: 512,
    temperature: 0.1
  };

  // 初始化网站配置
  function initSiteConfig() {
      const hostname = window.location.hostname;
      currentSiteConfig = SITE_CONFIGS[hostname];
      
      if (!currentSiteConfig) {
          console.warn('Prompt Agent: 不支持的网站:', hostname);
          return false;
      }
      
      console.log('Prompt Agent: 已加载配置for', currentSiteConfig.name);
      return true;
  }

  // UI管理类
  class UIManager {
      constructor() {
          this.container = null;
      }

      // 创建浮动UI
      createFloatingUI() {
          const container = document.createElement('div');
          container.id = 'ai-floating-ui';
          container.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              width: 280px;
              background: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              z-index: 10000;
              font-family: Arial, sans-serif;
              font-size: 14px;
          `;

          const siteName = currentSiteConfig ? currentSiteConfig.name : 'Unknown';
          container.innerHTML = `
              <div style="background: #f5f5f5; padding: 12px; border-radius: 8px 8px 0 0; border-bottom: 1px solid #ddd;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-weight: bold; color: #333;">Prompt Agent (${siteName})</span>
                      <button id="ai-minimize" style="background: none; border: none; font-size: 16px; cursor: pointer;">−</button>
                  </div>
              </div>
              <div id="ai-content" style="padding: 15px;">
                  <div style="margin-bottom: 15px;">
                      <label style="display: block; margin-bottom: 5px; color: #555;">API Key:</label>
                      <input type="password" id="ai-apikey" placeholder="Bearer token..."
                             style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                             value="${apiKey}">
                  </div>
                  <div style="margin-bottom: 15px;">
                      <label style="display: flex; align-items: center; color: #555;">
                          <input type="checkbox" id="ai-enable" ${isEnabled ? 'checked' : ''}
                                 style="margin-right: 8px;">
                          启用AI响应
                      </label>
                  </div>
                  <div style="margin-bottom: 10px;">
                      <button id="ai-test" style="width: 100%; padding: 8px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">
                          测试连接
                      </button>
                  </div>
                  <div style="margin-bottom: 10px;">
                      <button id="ai-manual-send" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                          手动发送
                      </button>
                  </div>
                  <div id="ai-status" style="font-size: 12px; color: #666; text-align: center;"></div>
              </div>
          `;

          document.body.appendChild(container);
          this.container = container;

          // 绑定事件
          this.bindEvents();
      }

      bindEvents() {
          document.getElementById('ai-minimize').addEventListener('click', () => this.toggleMinimize());
          document.getElementById('ai-enable').addEventListener('change', (e) => this.toggleEnable(e));
          document.getElementById('ai-apikey').addEventListener('input', (e) => this.saveApiKey(e));
          document.getElementById('ai-test').addEventListener('click', () => aiAgent.testConnection());
          document.getElementById('ai-manual-send').addEventListener('click', () => aiAgent.manualSend());

          // 监听Ctrl+Enter组合键
          document.addEventListener('keydown', (e) => this.handleKeyDown(e));
      }

      toggleMinimize() {
          const content = document.getElementById('ai-content');
          const button = document.getElementById('ai-minimize');
          if (content.style.display === 'none') {
              content.style.display = 'block';
              button.textContent = '−';
          } else {
              content.style.display = 'none';
              button.textContent = '+';
          }
      }

      toggleEnable(e) {
          isEnabled = e.target.checked;
          this.updateStatus(isEnabled ? '已启用 - 按Ctrl+Enter发送' : '已禁用');
      }

      saveApiKey(e) {
          apiKey = e.target.value;
          localStorage.setItem('ai-script-apikey', apiKey);
      }

      updateStatus(message, isError = false) {
          const status = document.getElementById('ai-status');
          if (status) {
              status.textContent = message;
              status.style.color = isError ? '#d32f2f' : '#666';
          }
      }

      handleKeyDown(e) {
          if (e.ctrlKey && e.key === 'Enter' && isEnabled && !isProcessing) {
              const textarea = inputManager.findActiveTextarea();
              if (textarea && inputManager.getTextContent(textarea).trim()) {
                  e.preventDefault();
                  aiAgent.sendRequest(textarea);
              }
          }
      }
  }

  // 输入管理类
  class InputManager {
      constructor(siteConfig) {
          this.siteConfig = siteConfig;
      }

      // 查找当前活跃的输入框
      findActiveTextarea() {
          // 优先查找聚焦的输入框
          for (const selector of this.siteConfig.textareaSelectors) {
              const focused = document.querySelector(selector + ':focus');
              if (focused) return focused;
          }

          // 查找页面上的输入框
          for (const selector of this.siteConfig.textareaSelectors) {
              const elements = document.querySelectorAll(selector);
              if (elements.length > 0) {
                  return elements[elements.length - 1]; // 选择最后一个
              }
          }

          return null;
      }

      // 获取文本内容（兼容textarea和contenteditable）
      getTextContent(element) {
          if (element.tagName.toLowerCase() === 'textarea') {
              return element.value;
          } else if (element.contentEditable === 'true' || element.getAttribute('contenteditable') === 'true') {
              return element.textContent || element.innerText || '';
          }
          return '';
      }

      // 设置文本内容
      async setTextContent(element, text) {
          if (this.siteConfig.textInputMethod === 'simulate') {
              await this.simulateTextInput(element, text);
          } else {
              this.directSetText(element, text);
          }
      }

      // 模拟文字输入
      async simulateTextInput(element, text) {
          element.focus();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 获取当前内容并清空
          const currentContent = this.getTextContent(element);
          if (currentContent.length > 0) {
              await this.clearContent(element);
          }

          // 逐字符输入
          for (let i = 0; i < text.length; i++) {
              const char = text[i];
              
              // 模拟按键事件
              this.simulateKeyboardEvent(element, 'keydown', char);
              this.simulateKeyboardEvent(element, 'keypress', char);
              
              // 更新内容
              if (element.tagName.toLowerCase() === 'textarea') {
                  element.value = text.substring(0, i + 1);
              } else {
                  element.textContent = text.substring(0, i + 1);
              }
              
              // 触发input事件
              const inputEvent = new Event('input', {
                  bubbles: true,
                  cancelable: true,
              });
              element.dispatchEvent(inputEvent);
              
              this.simulateKeyboardEvent(element, 'keyup', char);
              
              // 短暂延迟
              if (i % 5 === 0) {
                  await new Promise(resolve => setTimeout(resolve, 10));
              }
          }

          // 确保光标在最后
          if (element.tagName.toLowerCase() === 'textarea') {
              element.selectionStart = element.selectionEnd = element.value.length;
          }
      }

      // 清空内容
      async clearContent(element) {
          element.focus();
          await new Promise(resolve => setTimeout(resolve, 30));

          // 对于contenteditable元素，使用不同的选择方法
          if (element.tagName.toLowerCase() === 'textarea') {
              element.select();
          } else {
              // 对于contenteditable div，选择所有内容
              const range = document.createRange();
              range.selectNodeContents(element);
              const selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
          }
          
          await new Promise(resolve => setTimeout(resolve, 30));

          this.simulateKeyboardEvent(element, 'keydown', 'a', { ctrlKey: true });
          this.simulateKeyboardEvent(element, 'keyup', 'a', { ctrlKey: true });
          
          this.simulateKeyboardEvent(element, 'keydown', 'Delete');
          
          if (element.tagName.toLowerCase() === 'textarea') {
              element.value = '';
          } else {
              element.textContent = '';
              element.innerHTML = '';
          }
          
          const inputEvent = new Event('input', {
              bubbles: true,
              cancelable: true,
              inputType: 'deleteContentBackward'
          });
          element.dispatchEvent(inputEvent);
          
          this.simulateKeyboardEvent(element, 'keyup', 'Delete');
          await new Promise(resolve => setTimeout(resolve, 30));
      }

      // 直接设置文本
      directSetText(element, text) {
          if (element.tagName.toLowerCase() === 'textarea') {
              element.value = text;
          } else {
              element.textContent = text;
          }
          
          const inputEvent = new Event('input', {
              bubbles: true,
              cancelable: true,
          });
          element.dispatchEvent(inputEvent);
      }

      // 模拟键盘事件
      simulateKeyboardEvent(element, eventType, key, options = {}) {
          const event = new KeyboardEvent(eventType, {
              key: key,
              code: key,
              charCode: key.charCodeAt ? key.charCodeAt(0) : 0,
              keyCode: key.charCodeAt ? key.charCodeAt(0) : 0,
              which: key.charCodeAt ? key.charCodeAt(0) : 0,
              bubbles: true,
              cancelable: true,
              ...options
          });
          
          element.dispatchEvent(event);
      }

      // 查找发送按钮
      findSendButton() {
          for (const selector of this.siteConfig.sendButtonSelectors) {
              try {
                  const button = document.querySelector(selector);
                  if (button && button.offsetParent !== null) {
                      return button;
                  }
              } catch (e) {
                  // 忽略无效的选择器
              }
          }

          // 查找包含发送文本的按钮
          const buttons = document.querySelectorAll('button');
          for (const button of buttons) {
              const text = button.textContent || button.innerText || '';
              if ((text.includes('发送') || text.includes('Send') || text.includes('提交')) && 
                  button.offsetParent !== null) {
                  return button;
              }
          }

          return null;
      }
  }

  // AI代理类
  class AIAgent {
      constructor(uiManager, inputManager) {
          this.uiManager = uiManager;
          this.inputManager = inputManager;
      }

      async testConnection() {
          if (!apiKey.trim()) {
              this.uiManager.updateStatus('请先输入API Key', true);
              return;
          }

          this.uiManager.updateStatus('测试连接中...');

          try {
              const response = await fetch(API_CONFIG.endpoint, {
                  method: 'POST',
                  headers: {
                      "authorization": `Bearer ${apiKey}`,
                      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                      "model": API_CONFIG.model,
                      "messages": [
                          { "role": "user", "content": "test" }
                      ],
                      "max_tokens": 10,
                      "temperature": API_CONFIG.temperature,
                      "stream": false
                  })
              });

              if (response.ok) {
                  this.uiManager.updateStatus('连接成功!');
              } else {
                  this.uiManager.updateStatus(`连接失败: ${response.status}`, true);
              }
          } catch (error) {
              this.uiManager.updateStatus(`连接错误: ${error.message}`, true);
          }
      }

      manualSend() {
          if (isProcessing) {
              this.uiManager.updateStatus('正在处理中，请稍后...', true);
              return;
          }

          const textarea = this.inputManager.findActiveTextarea();
          
          if (!textarea) {
              this.uiManager.updateStatus('未找到输入框', true);
              return;
          }

          const content = this.inputManager.getTextContent(textarea);
          if (!content.trim()) {
              this.uiManager.updateStatus('请先输入内容', true);
              return;
          }

          this.sendRequest(textarea);
      }

      async sendRequest(textarea) {
          if (!apiKey.trim()) {
              this.uiManager.updateStatus('请先输入API Key', true);
              return;
          }

          isProcessing = true;
          this.uiManager.updateStatus('处理中...');

          const userInput = this.inputManager.getTextContent(textarea).trim();

          const myHeaders = new Headers();
          myHeaders.append("authorization", `Bearer ${apiKey}`);
          myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({
              "model": API_CONFIG.model,
              "messages": [
                  { "role": "user", "content": userInput }
              ],
              "max_tokens": API_CONFIG.maxTokens,
              "temperature": API_CONFIG.temperature,
              "stream": true
          });

          const requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
          };

          try {
              const response = await fetch(API_CONFIG.endpoint, requestOptions);

              if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }

              const reader = response.body.getReader();
              const decoder = new TextDecoder();

              this.uiManager.updateStatus('接收响应中...');

              let aiResponse = '';
              let isFirstContent = true; // 标记是否是第一次接收到内容

              while (true) {
                  const { done, value } = await reader.read();

                  if (done) {
                      break;
                  }

                  const chunk = decoder.decode(value, { stream: true });
                  const lines = chunk.split('\n');

                  for (const line of lines) {
                      if (line.startsWith('data: ')) {
                          const jsonStr = line.substring(6).trim();
                          if (jsonStr === '[DONE]') {
                              continue;
                          }

                          try {
                              const data = JSON.parse(jsonStr);
                              if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                                  const content = data.choices[0].delta.content;
                                  aiResponse += content;

                                  // 如果是第一次接收到内容，先清空输入框
                                  if (isFirstContent) {
                                      this.uiManager.updateStatus('开始输出响应...');
                                      await this.inputManager.setTextContent(textarea, '');
                                      isFirstContent = false;
                                  }

                                  // 逐字符添加到输入框
                                  for (const char of content) {
                                      if (textarea.tagName.toLowerCase() === 'textarea') {
                                          textarea.value += char;
                                      } else {
                                          // 对于contenteditable元素，追加文本内容
                                          textarea.textContent += char;
                                      }
                                      
                                      // 触发input事件
                                      const inputEvent = new Event('input', {
                                          bubbles: true,
                                          cancelable: true,
                                      });
                                      textarea.dispatchEvent(inputEvent);
                                      
                                      // 模拟打字效果
                                      await new Promise(resolve => setTimeout(resolve, 20));

                                      // 滚动到底部
                                      if (textarea.scrollTop !== undefined) {
                                          textarea.scrollTop = textarea.scrollHeight;
                                      }
                                  }
                              }
                          } catch (parseError) {
                              console.log('JSON解析错误:', parseError, jsonStr);
                          }
                      }
                  }
              }

              this.uiManager.updateStatus('完成!');

          } catch (error) {
              this.uiManager.updateStatus(`错误: ${error.message}`, true);
              console.error('请求错误:', error);
          } finally {
              isProcessing = false;
          }
      }
  }

  // 全局实例
  let uiManager, inputManager, aiAgent;

  // 初始化
  function init() {
      // 检查是否支持当前网站
      if (!initSiteConfig()) {
          console.warn('Prompt Agent: 当前网站不受支持');
          return;
      }

      // 创建管理器实例
      uiManager = new UIManager();
      inputManager = new InputManager(currentSiteConfig);
      aiAgent = new AIAgent(uiManager, inputManager);

      // 等待页面加载完成后创建UI
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
              uiManager.createFloatingUI();
              uiManager.updateStatus(`就绪 - 支持${currentSiteConfig.name} - 按Ctrl+Enter发送`);
          });
      } else {
          uiManager.createFloatingUI();
          uiManager.updateStatus(`就绪 - 支持${currentSiteConfig.name} - 按Ctrl+Enter发送`);
      }
  }

  init();
})();