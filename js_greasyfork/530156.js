// ==UserScript==
// @name         Ollama Chat 助手
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  一个基于 Ollama 的聊天助手，随时随地与您的本地大语言模型交流
// @author       h7ml
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      localhost
// @connect      *
// @resource     jquery https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @resource     marked https://cdn.bootcdn.net/ajax/libs/marked/4.3.0/marked.min.js
// @resource     highlight https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @resource     highlightStyle https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/github.min.css
// @downloadURL https://update.greasyfork.org/scripts/530156/Ollama%20Chat%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530156/Ollama%20Chat%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
  // 检查jQuery是否已经存在
  if (typeof jQuery === 'undefined') {
    try {
      const jqueryCode = GM_getResourceText('jquery');
      eval(jqueryCode);
      initApp();
    } catch (error) {
      console.error('加载jQuery失败:', error);
      const script = document.createElement('script');
      script.textContent = GM_getResourceText('jquery');
      document.head.appendChild(script);
      script.onload = initApp;
    }
  } else {
    initApp();
  }

  function initApp() {
    'use strict';

    // 配置管理类
    class ConfigManager {
      constructor() {
        this.DEFAULT_CONFIG = {
          url: 'http://160.202.244.103:11434/api/chat',
          model: 'deepseek-r1:7b',
          useStream: false, // 默认不使用流式响应
          params: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 4096,
            repeat_penalty: 1.1
          }
        };
        this.DEFAULT_APP_SIZE = {
          width: 420,
          height: 620
        };
      }

      getConfig() {
        return GM_getValue('ollamaChatConfig', this.DEFAULT_CONFIG);
      }

      setConfig(config) {
        GM_setValue('ollamaChatConfig', config);
      }

      updateServerUrl(url) {
        const config = this.getConfig();
        config.url = url;
        this.setConfig(config);
        return config;
      }

      updateUseStream(useStream) {
        const config = this.getConfig();
        config.useStream = useStream;
        this.setConfig(config);
        return config;
      }

      getModelList() {
        return GM_getValue('ollamaModelList', []);
      }

      setModelList(list) {
        GM_setValue('ollamaModelList', list);
      }

      getAppPosition() {
        return GM_getValue('chatAppPosition', null);
      }

      setAppPosition(position) {
        GM_setValue('chatAppPosition', position);
      }

      getIconPosition() {
        return GM_getValue('chatIconPosition', null);
      }

      setIconPosition(position) {
        GM_setValue('chatIconPosition', position);
      }

      getAppSize() {
        return GM_getValue('chatAppSize', this.DEFAULT_APP_SIZE);
      }

      setAppSize(size) {
        GM_setValue('chatAppSize', size);
      }

      getAppMinimized() {
        return GM_getValue('chatAppMinimized', false);
      }

      setAppMinimized(minimized) {
        GM_setValue('chatAppMinimized', minimized);
      }

      getChatHistory() {
        return GM_getValue('chatHistory', []);
      }

      setChatHistory(history) {
        GM_setValue('chatHistory', history);
      }
    }

    // Ollama服务类
    class OllamaService {
      constructor(configManager) {
        this.configManager = configManager;
        this.chatHistory = [];
        this.activeRequest = null;
      }

      async getModelList() {
        try {
          const config = this.configManager.getConfig();
          // 从URL中提取基本URL，删除/api/chat部分
          const baseUrl = config.url.replace(/\/api\/chat$/, '');
          const listUrl = `${baseUrl}/api/tags`;

          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url: listUrl,
              responseType: 'json',
              onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                  const data = response.response;
                  if (!data.models || !Array.isArray(data.models)) {
                    console.error('获取到的模型数据格式不正确:', data);
                    resolve([]);
                    return;
                  }
                  // 提取模型名称并排序
                  const models = data.models.map(model => model.name).sort();
                  this.configManager.setModelList(models);
                  resolve(models);
                } else {
                  console.error('获取模型列表失败:', response.statusText);
                  resolve([]);
                }
              }.bind(this),
              onerror: function (error) {
                console.error('获取模型列表异常:', error);
                resolve([]);
              }
            });
          });
        } catch (error) {
          console.error('获取模型列表异常:', error);
          return [];
        }
      }

      async sendChatMessage(message, messageCallback, completeCallback, errorCallback) {
        const config = this.configManager.getConfig();
        const history = this.configManager.getChatHistory();

        const messages = [...history];
        messages.push({
          role: "user",
          content: message,
          timestamp: Date.now()
        });

        const requestData = {
          model: config.model,
          messages: messages,
          stream: config.useStream,
          options: config.params
        };

        // 打印请求数据
        console.log('请求数据:', JSON.stringify(requestData, null, 2));

        // 如果存在以前的请求，尝试终止
        if (this.activeRequest) {
          try {
            this.activeRequest.abort();
          } catch (e) {
            console.error('终止上一次请求失败:', e);
          }
          this.activeRequest = null;
        }

        let streamResponse = {
          role: "assistant",
          content: "",
          timestamp: Date.now()
        };
        let buffer = '';

        this.activeRequest = GM_xmlhttpRequest({
          method: 'POST',
          url: config.url,
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(requestData),
          responseType: 'text',
          onloadstart: () => {
            console.log('请求开始 - 模式:', config.useStream ? '流式' : '非流式');
          },
          onprogress: (response) => {
            // 如果不是流式响应，不处理增量更新
            if (!config.useStream) return;

            // 解码收到的数据并添加到缓冲区
            const newText = response.responseText || '';

            if (newText.length > buffer.length) {
              // 获取新增的文本
              const newChunk = newText.substring(buffer.length);
              buffer = newText;

              // 处理新增的文本
              const lines = newChunk.split('\n');

              // 处理每一行
              for (const line of lines) {
                if (!line.trim()) continue;

                try {
                  const jsonData = JSON.parse(line);

                  // 打印接收到的流式数据
                  console.log('收到流式数据片段:', JSON.stringify(jsonData));

                  // 处理不同的 Ollama API 响应格式
                  if (jsonData.message && typeof jsonData.message.content === 'string') {
                    // 新版 Ollama API 使用 message.content 返回完整内容
                    streamResponse.content = jsonData.message.content;
                    messageCallback(streamResponse.content);
                  } else if (typeof jsonData.response === 'string') {
                    // 旧版 Ollama API 使用 response 字段返回增量内容
                    streamResponse.content += jsonData.response;
                    messageCallback(streamResponse.content);
                  } else if (jsonData.content && typeof jsonData.content === 'string') {
                    // 某些版本可能直接使用 content 字段
                    streamResponse.content += jsonData.content;
                    messageCallback(streamResponse.content);
                  } else if (jsonData.done === true || jsonData.done === false) {
                    // 如果 API 返回了 done 标志但没有内容，忽略这个消息
                    continue;
                  } else {
                    // 尝试寻找任何可能包含文本的字段
                    const foundText = this.findContentInObject(jsonData);
                    if (foundText) {
                      streamResponse.content += foundText;
                      messageCallback(streamResponse.content);
                    } else {
                      console.log('无法识别的响应格式:', jsonData);
                    }
                  }
                } catch (e) {
                  // 可能是不完整的JSON，忽略解析错误
                  console.log('解析JSON出错:', e, '原始文本:', line);
                }
              }
            }
          },
          onload: (response) => {
            // 打印完整响应
            console.log('完整响应状态:', response.status, response.statusText);
            console.log('完整响应头:', response.responseHeaders);
            console.log('完整响应内容:', response.responseText);

            if (response.status >= 200 && response.status < 300) {
              // 非流式响应处理
              if (!config.useStream) {
                try {
                  const jsonResponse = JSON.parse(response.responseText);
                  console.log('解析后的非流式响应:', JSON.stringify(jsonResponse, null, 2));

                  // 处理非流式响应的不同格式
                  let contentExtracted = false; // 标记是否已经提取内容

                  if (jsonResponse.message && typeof jsonResponse.message.content === 'string') {
                    // 新版 Ollama API 使用 message.content
                    console.log('检测到 message.content 字段:', jsonResponse.message.content);
                    streamResponse.content = jsonResponse.message.content;
                    contentExtracted = true;
                  } else if (typeof jsonResponse.response === 'string') {
                    // 旧版 Ollama API 使用 response 字段
                    console.log('检测到 response 字段:', jsonResponse.response);
                    streamResponse.content = jsonResponse.response;
                    contentExtracted = true;
                  } else if (jsonResponse.content && typeof jsonResponse.content === 'string') {
                    // 某些版本可能直接使用 content 字段
                    console.log('检测到 content 字段:', jsonResponse.content);
                    streamResponse.content = jsonResponse.content;
                    contentExtracted = true;
                  } else {
                    // 尝试寻找任何可能包含文本的字段
                    const foundText = this.findContentInObject(jsonResponse);
                    if (foundText) {
                      console.log('通过递归查找到文本内容:', foundText);
                      streamResponse.content = foundText;
                      contentExtracted = true;
                    } else {
                      console.error('无法识别的响应格式:', jsonResponse);
                      streamResponse.content = '服务器返回了无法解析的数据。';
                    }
                  }

                  // 只调用一次消息回调
                  if (contentExtracted) {
                    console.log('更新UI显示提取的内容:', streamResponse.content);
                    messageCallback(streamResponse.content);
                  }
                } catch (error) {
                  console.error('解析响应失败:', error, '原始响应文本:', response.responseText);
                  streamResponse.content = '解析响应失败: ' + error.message;
                  messageCallback(streamResponse.content);
                }
              }

              // 添加到历史
              history.push({
                role: "user",
                content: message,
                timestamp: Date.now()
              });

              history.push(streamResponse);
              console.log('聊天历史已更新，添加了用户消息和助手回复');

              // 限制历史长度
              const originalLength = history.length;
              while (JSON.stringify(history).length > 12000) {
                history.splice(0, 2); // 移除最旧的一轮对话
              }

              if (originalLength !== history.length) {
                console.log(`历史记录过长，已移除 ${originalLength - history.length} 条记录`);
              }

              this.configManager.setChatHistory(history);
              completeCallback(streamResponse.content);
            } else {
              console.error('HTTP错误响应:', response.status, response.statusText, response.responseText);
              errorCallback(`HTTP 错误: ${response.status} ${response.statusText}`);
            }
            this.activeRequest = null;
          },
          onerror: (error) => {
            console.error('发送消息错误:', error);
            errorCallback(error.message || '网络请求失败');
            this.activeRequest = null;
          },
          ontimeout: () => {
            console.error('请求超时');
            errorCallback('请求超时');
            this.activeRequest = null;
          },
          onabort: () => {
            console.log('请求已取消');
            this.activeRequest = null;
          }
        });
      }

      // 递归查找对象中的文本内容
      findContentInObject(obj) {
        if (!obj || typeof obj !== 'object') return null;

        // 直接检查常见的内容字段
        const commonFields = ['content', 'text', 'message', 'response', 'answer', 'result'];
        for (const field of commonFields) {
          if (typeof obj[field] === 'string' && obj[field].trim()) {
            return obj[field];
          } else if (obj[field] && typeof obj[field] === 'object') {
            // 如果字段是对象，递归检查
            const nestedContent = this.findContentInObject(obj[field]);
            if (nestedContent) return nestedContent;
          }
        }

        // 检查所有其他字段
        for (const key in obj) {
          if (typeof obj[key] === 'string' && obj[key].trim() &&
            !['model', 'id', 'status', 'type', 'role'].includes(key)) {
            return obj[key];
          } else if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const nestedContent = this.findContentInObject(obj[key]);
            if (nestedContent) return nestedContent;
          }
        }

        return null;
      }

      clearChatHistory() {
        this.configManager.setChatHistory([]);
      }
    }

    // UI管理类
    class UIManager {
      constructor(configManager, ollamaService) {
        this.configManager = configManager;
        this.ollamaService = ollamaService;
        this.app = null;
        this.iconElement = null;
        this.elements = {};
        this.isDragging = false;
        this.isIconDragging = false;
        this.isResizing = false;
        this.isMaximized = false;
        this.previousSize = {};
        this.messageHandler = null;
        this.isGenerating = false;
      }

      async init() {
        await this.loadStyles();
        this.createApp();
        this.createIcon();
        this.initializeElements();
        this.bindEvents();
        this.restoreState();
        await this.fetchModels();
      }

      async loadStyles() {
        const css = `
          /* 基础样式 */
          #ollama-chat-app {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            height: 600px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            z-index: 999999;
            font-family: "MiSans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            resize: both;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          #ollama-chat-app:hover {
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
          }

          /* 调整大小把手 */
          .resize-handle {
            position: absolute;
            width: 20px;
            height: 20px;
            transition: opacity 0.2s ease;
            opacity: 0.4;
            z-index: 10;
          }

          .resize-handle:hover {
            opacity: 1;
          }

          .resize-handle.right-bottom {
            bottom: 0;
            right: 0;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, rgba(16, 163, 127, 0.6) 50%, rgba(16, 163, 127, 0.9) 100%);
            border-radius: 0 0 16px 0;
          }

          .resize-handle.left-bottom {
            bottom: 0;
            left: 0;
            cursor: nesw-resize;
            background: linear-gradient(225deg, transparent 50%, rgba(16, 163, 127, 0.6) 50%, rgba(16, 163, 127, 0.9) 100%);
            border-radius: 0 0 0 16px;
          }
          
          .resize-handle.left-top {
            top: 0;
            left: 0;
            cursor: nwse-resize;
            background: linear-gradient(315deg, transparent 50%, rgba(16, 163, 127, 0.6) 50%, rgba(16, 163, 127, 0.9) 100%);
            border-radius: 16px 0 0 0;
          }
          
          .resize-handle.right-top {
            top: 0;
            right: 0;
            cursor: nesw-resize;
            background: linear-gradient(45deg, transparent 50%, rgba(16, 163, 127, 0.6) 50%, rgba(16, 163, 127, 0.9) 100%);
            border-radius: 0 16px 0 0;
          }

          /* 消息样式 */
          .message {
            margin: 12px;
            padding: 12px;
            border-radius: 8px;
            max-width: 85%;
            word-wrap: break-word;
            position: relative;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .message:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }

          .message.user {
            background-color: #FF6700;
            color: white;
            margin-left: auto;
          }

          .message.assistant {
            background-color: #f5f5f5;
            color: #333;
            margin-right: auto;
          }

          .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            font-size: 12px;
          }

          .role-name {
            font-weight: 500;
          }

          .message-time {
            opacity: 0.7;
            font-size: 11px;
          }

          .message.user .message-time {
            color: rgba(255, 255, 255, 0.8);
          }

          .message.assistant .message-time {
            color: rgba(0, 0, 0, 0.5);
          }

          .message-content {
            line-height: 1.5;
          }
          
          /* 聊天图标 */
          #ollama-chat-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: #10a37f;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3);
            z-index: 999999;
            color: white;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          #ollama-chat-icon:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(16, 163, 127, 0.4);
          }
          
          #ollama-chat-icon:active {
            transform: scale(0.98);
          }
          
          /* 头部样式 */
          #chat-header {
            padding: 16px 18px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            background: #fff;
          }
          
          #chat-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          #header-actions {
            display: flex;
            gap: 10px;
          }
          
          .header-btn {
            background: none;
            border: none;
            padding: 8px;
            cursor: pointer;
            color: #666;
            border-radius: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .header-btn:hover {
            background: rgba(255, 103, 0, 0.1);
            color: #FF6700;
          }
          
          .header-btn:active {
            transform: scale(0.95);
          }
          
          /* 模型选择 */
          #model-selector {
            padding: 12px 18px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            background: #fff;
          }
          
          #model-select {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            font-size: 14px;
            color: #333;
            background-color: #f5f5f5;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          #model-select:focus {
            border-color: #FF6700;
            background-color: #fff;
            box-shadow: 0 0 0 2px rgba(255, 103, 0, 0.1);
          }
          
          /* 聊天内容区 */
          #chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            scroll-behavior: smooth;
            background-color: #fafafa;
          }
          
          .message {
            display: flex;
            flex-direction: column;
            max-width: 85%;
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .message-header {
            font-size: 12px;
            color: #8E8E93;
            margin-bottom: 4px;
            font-weight: 500;
          }
          
          .message-content {
            padding: 12px 16px;
            border-radius: 16px;
            position: relative;
            font-size: 14px;
            line-height: 1.5;
          }
          
          .user .message-content {
            background-color: #10a37f;
            color: white;
            border-top-right-radius: 4px;
            align-self: flex-end;
          }
          
          .assistant .message-content {
            background-color: #f1f1f1;
            color: #1D1D1F;
            border-top-left-radius: 4px;
            align-self: flex-start;
          }
          
          /* 代码块样式 */
          .message-content pre {
            background: rgba(0, 0, 0, 0.1);
            padding: 14px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 10px 0;
            border-left: 3px solid rgba(16, 163, 127, 0.5);
          }
          
          .assistant .message-content pre {
            background: rgba(0, 0, 0, 0.05);
          }
          
          .user .message-content pre {
            background: rgba(255, 255, 255, 0.1);
            border-left: 3px solid rgba(255, 255, 255, 0.3);
          }
          
          .message-content code {
            font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 13px;
          }
          
          .message-content p {
            margin: 0 0 10px 0;
          }
          
          .message-content p:last-child {
            margin-bottom: 0;
          }
          
          /* 输入区域 */
          #chat-input-container {
            padding: 16px 18px;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            background: #fff;
            position: relative;
            display: flex;
            flex-direction: column;
          }
          
          .input-wrapper {
            display: flex;
            align-items: center;
            background: #f5f5f5;
            border: 1px solid transparent;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .input-wrapper:focus-within {
            border-color: #FF6700;
            background-color: #fff;
            box-shadow: 0 0 0 2px rgba(255, 103, 0, 0.1);
          }
          
          #chat-input {
            flex: 1;
            min-height: 24px;
            max-height: 120px;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-family: inherit;
            font-size: 14px;
            resize: none;
            background-color: transparent;
            color: #333;
          }
          
          #send-button {
            background: none;
            border: none;
            color: #FF6700;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          #send-button:hover {
            background-color: rgba(255, 103, 0, 0.1);
          }
          
          #send-button:active {
            transform: scale(0.95);
          }
          
          #send-button:disabled {
            color: #C7C7CC;
            cursor: not-allowed;
          }
          
          /* 工具栏 */
          #chat-toolbar {
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
            font-size: 12px;
          }
          
          .toolbar-actions {
            display: flex;
            gap: 16px;
            color: #8E8E93;
          }
          
          .toolbar-btn {
            background: none;
            border: none;
            font-size: 12px;
            color: #666;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .toolbar-btn:hover {
            color: #FF6700;
          }
          
          #char-counter {
            color: #8E8E93;
            font-size: 12px;
          }
          
          .waiting-cursor {
            cursor: wait;
          }
          
          /* 打字机效果 */
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          
          .typing-indicator::after {
            content: '';
            width: 6px;
            height: 14px;
            display: inline-block;
            background-color: #1D1D1F;
            margin-left: 2px;
            animation: blink 1s infinite;
            vertical-align: text-bottom;
          }
          
          .user .typing-indicator::after {
            background-color: #fff;
          }
          
          /* 其他 */
          .icon {
            width: 18px;
            height: 18px;
          }
          
          /* 加载动画 */
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          .bounce-loader {
            display: flex;
            justify-content: center;
            gap: 4px;
            padding: 5px 0;
          }
          
          .bounce-loader > div {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
            animation: pulse 1.5s infinite ease-in-out;
          }
          
          .bounce-loader > div:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .bounce-loader > div:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          /* Markdown 样式 */
          .markdown-content h1, 
          .markdown-content h2,
          .markdown-content h3,
          .markdown-content h4 {
            margin-top: 16px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .markdown-content h1 { font-size: 1.3rem; }
          .markdown-content h2 { font-size: 1.2rem; }
          .markdown-content h3 { font-size: 1.1rem; }
          
          .markdown-content ul, 
          .markdown-content ol {
            padding-left: 20px;
            margin: 10px 0;
          }
          
          .markdown-content a {
            color: #10a37f;
            text-decoration: none;
          }
          
          .markdown-content a:hover {
            text-decoration: underline;
          }
          
          .markdown-content blockquote {
            border-left: 3px solid rgba(16, 163, 127, 0.5);
            padding-left: 12px;
            margin-left: 0;
            color: #555;
            font-style: italic;
          }

          /* 服务器配置样式 */
          #server-config {
            padding: 12px 18px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            background: rgba(16, 163, 127, 0.03);
          }
          
          .input-group {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          #server-url {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.2s ease;
          }
          
          #server-url:focus {
            outline: none;
            border-color: #10a37f;
            box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.15);
          }
          
          .save-btn {
            background: #10a37f;
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .save-btn:hover {
            background: #0c8e6e;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(16, 163, 127, 0.3);
          }

          .save-btn:active {
            transform: translateY(0);
          }
          
          .form-tip {
            display: block;
            margin-top: 8px;
            font-size: 12px;
            color: #8E8E93;
          }
          
          .form-tip a {
            color: #10a37f;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
          }
          
          .form-tip a:hover {
            color: #0c8e6e;
            text-decoration: underline;
          }
          
          /* 通知样式 */
          #ollama-notification {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(25, 25, 25, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 14px;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 9999999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          
          #ollama-notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          
          /* 加载动画 */
          .loading-spinner {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* 配置面板样式 */
          .config-panel {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #ffffff;
            z-index: 1000;
            display: none;
            flex-direction: column;
            border-radius: 16px;
            overflow: hidden;
          }

          .config-panel.show {
            display: flex;
          }

          .config-header {
            padding: 16px 18px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
          }

          .config-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }

          .close-btn {
            background: none;
            border: none;
            padding: 8px;
            cursor: pointer;
            color: #666;
            border-radius: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-btn:hover {
            background: rgba(255, 103, 0, 0.1);
            color: #FF6700;
          }

          .config-content {
            flex: 1;
            overflow-y: auto;
            padding: 18px;
            background: #fafafa;
          }

          .config-group {
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            padding-bottom: 20px;
          }

          .config-group:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          .config-group label {
            display: block;
            margin-bottom: 12px;
            font-size: 14px;
            color: #1D1D1F;
            font-weight: 600;
          }

          .config-group input[type="checkbox"] {
            margin-right: 10px;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            accent-color: #10a37f;
          }

          .config-group input[type="range"] {
            width: 100%;
            margin: 8px 0;
            -webkit-appearance: none;
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            outline: none;
          }

          .config-group input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            background: #10a37f;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          }

          .config-group input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #10a37f;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          }

          .range-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
          }

          .range-slider {
            flex: 1;
            margin-right: 14px;
          }

          .range-value {
            display: inline-block;
            min-width: 40px;
            text-align: center;
            font-size: 14px;
            color: #10a37f;
            font-weight: 500;
            background: rgba(16, 163, 127, 0.1);
            padding: 6px 10px;
            border-radius: 8px;
          }

          .config-footer {
            padding: 16px 18px;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            display: flex;
            justify-content: flex-end;
            background: rgba(255, 255, 255, 0.95);
          }

          .config-footer .save-btn {
            padding: 10px 18px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 10px;
            width: auto;
            height: auto;
            transition: all 0.2s ease;
          }

          .config-footer .save-btn:hover {
            background: #0c8e6e;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(16, 163, 127, 0.3);
          }
        `;
        GM_addStyle(css);
      }

      createApp() {
        this.app = document.createElement('div');
        this.app.id = 'ollama-chat-app';
        this.app.innerHTML = this.getAppHTML();
        document.body.appendChild(this.app);

        // 添加调整大小把手
        this.addResizeHandles();
      }

      // 添加调整大小把手
      addResizeHandles() {
        // 右下角把手
        const rightBottomHandle = document.createElement('div');
        rightBottomHandle.className = 'resize-handle right-bottom';
        rightBottomHandle.addEventListener('mousedown', (e) => this.startResize(e, 'right-bottom'));
        this.app.appendChild(rightBottomHandle);

        // 左下角把手
        const leftBottomHandle = document.createElement('div');
        leftBottomHandle.className = 'resize-handle left-bottom';
        leftBottomHandle.addEventListener('mousedown', (e) => this.startResize(e, 'left-bottom'));
        this.app.appendChild(leftBottomHandle);

        // 左上角把手
        const leftTopHandle = document.createElement('div');
        leftTopHandle.className = 'resize-handle left-top';
        leftTopHandle.addEventListener('mousedown', (e) => this.startResize(e, 'left-top'));
        this.app.appendChild(leftTopHandle);

        // 右上角把手
        const rightTopHandle = document.createElement('div');
        rightTopHandle.className = 'resize-handle right-top';
        rightTopHandle.addEventListener('mousedown', (e) => this.startResize(e, 'right-top'));
        this.app.appendChild(rightTopHandle);
      }

      createIcon() {
        this.iconElement = document.createElement('div');
        this.iconElement.id = 'ollama-chat-icon';
        this.iconElement.innerHTML = this.getIconHTML();
        document.body.appendChild(this.iconElement);
      }

      initializeElements() {
        this.elements = {
          chatHeader: document.getElementById('chat-header'),
          chatMessages: document.getElementById('chat-messages'),
          chatInput: document.getElementById('chat-input'),
          sendButton: document.getElementById('send-button'),
          modelSelect: document.getElementById('model-select'),
          clearButton: document.getElementById('clear-chat'),
          charCounter: document.getElementById('char-counter'),
          toggleMinBtn: document.getElementById('toggle-min-btn'),
          toggleMaxBtn: document.getElementById('toggle-max-btn'),
          toggleConfigBtn: document.getElementById('toggle-config-btn'),
          configPanel: document.getElementById('config-panel'),
          closeConfigBtn: document.querySelector('.close-btn'),
          saveConfigBtn: document.getElementById('save-config'),
          useStreamCheckbox: document.getElementById('use-stream'),
          temperatureInput: document.getElementById('temperature'),
          topPInput: document.getElementById('top-p'),
          topKInput: document.getElementById('top-k'),
          numCtxInput: document.getElementById('num-ctx'),
          repeatPenaltyInput: document.getElementById('repeat-penalty'),
          serverUrl: document.getElementById('server-url')
        };

        // 检查关键元素是否存在
        const missingElements = [];
        for (const [key, element] of Object.entries(this.elements)) {
          if (!element) {
            missingElements.push(key);
            console.warn(`Element not found: ${key}`);
          }
        }

        if (missingElements.length > 0) {
          console.error('Missing elements:', missingElements.join(', '));
        }
      }

      bindEvents() {
        try {
          console.log('正在绑定事件...');

          // 拖拽事件
          if (this.elements.chatHeader) {
            this.elements.chatHeader.addEventListener('mousedown', this.dragStart.bind(this));
            console.log('已绑定头部拖拽事件');
          } else {
            console.warn('未找到聊天头部元素');
          }

          document.addEventListener('mousemove', this.drag.bind(this));
          document.addEventListener('mouseup', this.dragEnd.bind(this));

          // 聊天图标事件
          if (this.iconElement) {
            this.iconElement.addEventListener('mousedown', this.iconDragStart.bind(this));
            this.iconElement.addEventListener('click', this.toggleApp.bind(this));
            console.log('已绑定图标事件');
          } else {
            console.warn('未找到图标元素');
          }

          // 窗口控制
          if (this.elements.toggleMinBtn) {
            this.elements.toggleMinBtn.addEventListener('click', this.toggleMinimize.bind(this));
            console.log('已绑定最小化按钮事件');
          } else {
            console.warn('未找到最小化按钮');
          }

          if (this.elements.toggleMaxBtn) {
            this.elements.toggleMaxBtn.addEventListener('click', this.toggleMaximize.bind(this));
            console.log('已绑定最大化按钮事件');
          } else {
            console.warn('未找到最大化按钮');
          }

          if (this.elements.toggleConfigBtn) {
            this.elements.toggleConfigBtn.addEventListener('click', () => this.toggleConfigPanel());
            console.log('已绑定配置按钮事件');
          } else {
            console.warn('未找到配置按钮');
          }

          // 发送消息
          if (this.elements.sendButton && this.elements.chatInput) {
            this.elements.sendButton.addEventListener('click', this.handleSendMessage.bind(this));
            this.elements.chatInput.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
              }
            });
            this.elements.chatInput.addEventListener('input', this.updateCharCount.bind(this));
            console.log('已绑定发送消息相关事件');
          } else {
            console.warn('未找到发送按钮或输入框');
          }

          // 输入框高度自适应
          if (this.elements.chatInput) {
            this.elements.chatInput.addEventListener('input', function () {
              this.style.height = 'auto';
              this.style.height = (this.scrollHeight < 160 ? Math.max(24, this.scrollHeight) : 160) + 'px';
            });
            console.log('已绑定输入框高度自适应事件');
          }

          // 模型切换
          if (this.elements.modelSelect) {
            this.elements.modelSelect.addEventListener('change', this.handleModelChange.bind(this));
            console.log('已绑定模型选择事件');
          } else {
            console.warn('未找到模型选择框');
          }

          // 清空聊天
          if (this.elements.clearButton) {
            this.elements.clearButton.addEventListener('click', this.clearChat.bind(this));
            console.log('已绑定清空聊天事件');
          } else {
            console.warn('未找到清空按钮');
          }

          // 配置面板事件
          if (this.elements.closeConfigBtn) {
            this.elements.closeConfigBtn.addEventListener('click', () => this.toggleConfigPanel());
            console.log('已绑定关闭配置面板事件');
          } else {
            console.warn('未找到关闭配置按钮');
          }

          if (this.elements.saveConfigBtn) {
            this.elements.saveConfigBtn.addEventListener('click', () => this.saveConfig());
            console.log('已绑定保存配置事件');
          } else {
            console.warn('未找到保存配置按钮');
          }

          // 配置值变化事件
          const configInputs = {
            useStream: this.elements.useStreamCheckbox,
            temperature: this.elements.temperatureInput,
            topP: this.elements.topPInput,
            topK: this.elements.topKInput,
            numCtx: this.elements.numCtxInput,
            repeatPenalty: this.elements.repeatPenaltyInput
          };

          for (const [name, element] of Object.entries(configInputs)) {
            if (element) {
              if (name === 'useStream') {
                element.addEventListener('change', () => this.updateConfig());
              } else {
                element.addEventListener('input', (e) => this.updateRangeValue(e));
              }
              console.log(`已绑定${name}配置项事件`);
            } else {
              console.warn(`未找到${name}配置项元素`);
            }
          }

          console.log('所有事件绑定完成');
        } catch (error) {
          console.error('绑定事件时出错:', error);
        }
      }

      async fetchModels() {
        try {
          const models = await this.ollamaService.getModelList();
          this.updateModelSelect(models);
        } catch (error) {
          console.error('获取模型列表失败:', error);
        }
      }

      updateModelSelect(models) {
        if (!models || models.length === 0) {
          // 如果没有获取到模型，使用默认选项
          models = ['deepseek-r1:7b', 'deepseek-r1:7b:13b', 'mistral', 'mixtral'];
        }

        const selectEl = this.elements.modelSelect;
        selectEl.innerHTML = '';

        const config = this.configManager.getConfig();

        models.forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model;
          selectEl.appendChild(option);
        });

        // 设置当前选中的模型
        if (models.includes(config.model)) {
          selectEl.value = config.model;
        } else if (models.length > 0) {
          selectEl.value = models[0];
          this.handleModelChange();
        }
      }

      handleModelChange() {
        const modelName = this.elements.modelSelect.value;
        const config = this.configManager.getConfig();
        config.model = modelName;
        this.configManager.setConfig(config);
      }

      clearChat() {
        this.elements.chatMessages.innerHTML = '';
        this.ollamaService.clearChatHistory();
      }

      handleSendMessage() {
        if (this.isGenerating) return;

        const message = this.elements.chatInput.value.trim();
        if (!message) return;

        this.isGenerating = true;
        this.elements.chatInput.value = '';
        this.elements.chatInput.style.height = 'auto';
        this.updateCharCount();

        // 禁用发送按钮
        this.elements.sendButton.disabled = true;
        document.body.classList.add('waiting-cursor');

        // 添加用户消息
        const userMessageId = this.addChatMessage(message, 'user');

        // 添加机器人消息（先显示加载动画）
        const botMessageId = this.addChatMessage('', 'assistant', true);

        // 滚动到底部
        this.scrollToBottom();

        // 发送消息到Ollama
        this.ollamaService.sendChatMessage(
          message,
          // 消息流式更新回调
          (content) => {
            // 更新机器人消息内容（打字机效果）
            this.updateChatMessage(botMessageId, content);
            this.scrollToBottom();
          },
          // 消息完成回调
          (finalContent) => {
            // 完成时移除打字机效果
            this.updateChatMessage(botMessageId, finalContent, false);
            this.isGenerating = false;
            this.elements.sendButton.disabled = false;
            document.body.classList.remove('waiting-cursor');
          },
          // 错误回调
          (error) => {
            this.updateChatMessage(botMessageId, `出错了: ${error}`, false);
            this.isGenerating = false;
            this.elements.sendButton.disabled = false;
            document.body.classList.remove('waiting-cursor');
          }
        );
      }

      addChatMessage(content, role, isTyping = false) {
        const id = Date.now().toString();
        const messageDiv = document.createElement('div');
        messageDiv.id = `message-${id}`;
        messageDiv.className = `message ${role}`;

        const header = document.createElement('div');
        header.className = 'message-header';
        const time = new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        header.innerHTML = `
          <span class="role-name">${role === 'user' ? '我' : 'Ollama'}</span>
          <span class="message-time">${time}</span>
        `;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content markdown-content';
        if (isTyping) {
          contentDiv.classList.add('typing-indicator');
        }

        // 处理Markdown
        if (content) {
          contentDiv.innerHTML = this.markdownToHtml(content);
        }

        messageDiv.appendChild(header);
        messageDiv.appendChild(contentDiv);
        this.elements.chatMessages.appendChild(messageDiv);

        return id;
      }

      updateChatMessage(id, content, isTyping = true) {
        const contentDiv = document.querySelector(`#message-${id} .message-content`);
        if (!contentDiv) return;

        // 设置内容
        contentDiv.innerHTML = this.markdownToHtml(content);

        // 更新打字机效果
        if (isTyping) {
          contentDiv.classList.add('typing-indicator');
        } else {
          contentDiv.classList.remove('typing-indicator');
        }
      }

      markdownToHtml(text) {
        // 简单的Markdown转HTML
        return text
          // 代码块
          .replace(/```(\w*)([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
          // 行内代码
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          // 粗体
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          // 斜体
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          // 链接
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
          // 无序列表
          .replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>')
          // 段落
          .replace(/^(?!<)(.+)$/gm, '<p>$1</p>');
      }

      scrollToBottom() {
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
      }

      updateCharCount() {
        const count = this.elements.chatInput.value.length;
        this.elements.charCounter.textContent = count > 0 ? `${count}` : '';
      }

      // 拖拽相关方法
      dragStart(e) {
        if (e.target.closest('button') || e.target.closest('select')) return;
        this.isDragging = true;
        this.initialX = e.clientX - this.app.offsetLeft;
        this.initialY = e.clientY - this.app.offsetTop;
      }

      drag(e) {
        if (this.isDragging) {
          e.preventDefault();
          const currentX = Math.max(0, Math.min(
            e.clientX - this.initialX,
            window.innerWidth - this.app.offsetWidth
          ));
          const currentY = Math.max(0, Math.min(
            e.clientY - this.initialY,
            window.innerHeight - this.app.offsetHeight
          ));

          this.app.style.left = currentX + 'px';
          this.app.style.top = currentY + 'px';
        }
      }

      dragEnd() {
        if (this.isDragging) {
          this.isDragging = false;
          const position = {
            x: parseInt(this.app.style.left),
            y: parseInt(this.app.style.top)
          };
          this.configManager.setAppPosition(position);
        }
      }

      // 图标拖拽相关方法
      iconDragStart(e) {
        if (e.target.closest('button')) return;
        this.isIconDragging = true;
        this.iconInitialX = e.clientX - this.iconElement.offsetLeft;
        this.iconInitialY = e.clientY - this.iconElement.offsetTop;
        this.iconElement.style.cursor = 'grabbing';
      }

      iconDrag(e) {
        if (this.isIconDragging) {
          e.preventDefault();
          const currentX = Math.max(0, Math.min(
            e.clientX - this.iconInitialX,
            window.innerWidth - this.iconElement.offsetWidth
          ));
          const currentY = Math.max(0, Math.min(
            e.clientY - this.iconInitialY,
            window.innerHeight - this.iconElement.offsetHeight
          ));

          this.iconElement.style.left = currentX + 'px';
          this.iconElement.style.top = currentY + 'px';
          this.iconElement.style.right = 'auto';
        }
      }

      iconDragEnd() {
        if (this.isIconDragging) {
          this.isIconDragging = false;
          this.iconElement.style.cursor = 'pointer';
          const position = {
            x: parseInt(this.iconElement.style.left),
            y: parseInt(this.iconElement.style.top)
          };
          this.configManager.setIconPosition(position);
        }
      }

      // 调整大小
      startResize(e, direction) {
        e.preventDefault();
        e.stopPropagation();

        this.isResizing = true;
        this.resizeDirection = direction;
        this.initialWidth = this.app.offsetWidth;
        this.initialHeight = this.app.offsetHeight;
        this.initialX = e.clientX;
        this.initialY = e.clientY;
        this.initialLeft = this.app.offsetLeft;

        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
      }

      resize(e) {
        if (!this.isResizing) return;

        const minWidth = 320;
        const minHeight = 400;

        if (this.resizeDirection === 'right-bottom') {
          // 右下角调整 - 只改变宽高
          const newWidth = Math.max(minWidth, this.initialWidth + (e.clientX - this.initialX));
          const newHeight = Math.max(minHeight, this.initialHeight + (e.clientY - this.initialY));

          this.app.style.width = newWidth + 'px';
          this.app.style.height = newHeight + 'px';
        } else if (this.resizeDirection === 'left-bottom') {
          // 左下角调整 - 改变宽高和左侧位置
          const widthDelta = this.initialX - e.clientX;
          const newWidth = Math.max(minWidth, this.initialWidth + widthDelta);
          const newHeight = Math.max(minHeight, this.initialHeight + (e.clientY - this.initialY));

          // 只有当宽度有效时才调整左侧位置
          if (newWidth >= minWidth) {
            this.app.style.left = (this.initialLeft - widthDelta) + 'px';
          }

          this.app.style.width = newWidth + 'px';
          this.app.style.height = newHeight + 'px';
        } else if (this.resizeDirection === 'left-top') {
          // 左上角调整 - 改变宽高和左侧、顶部位置
          const widthDelta = this.initialX - e.clientX;
          const heightDelta = this.initialY - e.clientY;
          const newWidth = Math.max(minWidth, this.initialWidth + widthDelta);
          const newHeight = Math.max(minHeight, this.initialHeight + heightDelta);

          // 只有当尺寸有效时才调整位置
          if (newWidth >= minWidth) {
            this.app.style.left = (this.initialLeft - widthDelta) + 'px';
          }
          if (newHeight >= minHeight) {
            this.app.style.top = (this.app.offsetTop - heightDelta) + 'px';
          }

          this.app.style.width = newWidth + 'px';
          this.app.style.height = newHeight + 'px';
        } else if (this.resizeDirection === 'right-top') {
          // 右上角调整 - 改变宽高和顶部位置
          const heightDelta = this.initialY - e.clientY;
          const newWidth = Math.max(minWidth, this.initialWidth + (e.clientX - this.initialX));
          const newHeight = Math.max(minHeight, this.initialHeight + heightDelta);

          // 只有当高度有效时才调整顶部位置
          if (newHeight >= minHeight) {
            this.app.style.top = (this.app.offsetTop - heightDelta) + 'px';
          }

          this.app.style.width = newWidth + 'px';
          this.app.style.height = newHeight + 'px';
        }

        this.configManager.setAppSize({ width: this.app.offsetWidth, height: this.app.offsetHeight });
        this.configManager.setAppPosition({ x: this.app.offsetLeft, y: this.app.offsetTop });
      }

      stopResize() {
        this.isResizing = false;
        document.removeEventListener('mousemove', this.resize.bind(this));
        document.removeEventListener('mouseup', this.stopResize.bind(this));
      }

      // 窗口控制
      toggleMaximize() {
        if (!this.isMaximized) {
          this.previousSize = {
            width: this.app.style.width,
            height: this.app.style.height,
            left: this.app.style.left,
            top: this.app.style.top
          };

          this.app.style.width = '100%';
          this.app.style.height = '100vh';
          this.app.style.left = '0';
          this.app.style.top = '0';

          this.elements.toggleMaxBtn.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"></path>
            </svg>
          `;
        } else {
          Object.assign(this.app.style, this.previousSize);
          this.elements.toggleMaxBtn.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
            </svg>
          `;
        }
        this.isMaximized = !this.isMaximized;
      }

      toggleMinimize() {
        this.app.style.display = 'none';
        this.iconElement.style.display = 'flex';
        this.configManager.setAppMinimized(true);
        // 确保图标可见
        this.iconElement.style.zIndex = '999999';
      }

      toggleApp() {
        // 确保应用可见
        this.app.style.display = 'flex';
        this.app.style.zIndex = '999999';
        this.iconElement.style.display = 'none';
        this.configManager.setAppMinimized(false);
        // 恢复焦点
        this.elements.chatInput.focus();
      }

      restoreState() {
        // 恢复位置
        const appPosition = this.configManager.getAppPosition();
        if (appPosition) {
          this.app.style.left = appPosition.x + 'px';
          this.app.style.top = appPosition.y + 'px';
          this.app.style.right = 'auto';
          this.app.style.bottom = 'auto';
        }

        // 恢复尺寸
        const appSize = this.configManager.getAppSize();
        if (appSize) {
          this.app.style.width = appSize.width + 'px';
          this.app.style.height = appSize.height + 'px';
        }

        // 恢复最小化状态
        const appMinimized = this.configManager.getAppMinimized();
        if (appMinimized) {
          this.app.style.display = 'none';
          this.iconElement.style.display = 'flex';
        } else {
          this.app.style.display = 'flex';
          this.iconElement.style.display = 'none';
        }

        const iconPosition = this.configManager.getIconPosition();
        if (iconPosition) {
          this.iconElement.style.left = iconPosition.x + 'px';
          this.iconElement.style.top = iconPosition.y + 'px';
          this.iconElement.style.right = 'auto';
          this.iconElement.style.bottom = 'auto';
        }

        // 加载服务器配置
        this.loadServerConfig();

        // 加载聊天历史
        this.loadChatHistory();
      }

      loadServerConfig() {
        // 加载服务器地址
        const config = this.configManager.getConfig();
        const serverUrlInput = document.getElementById('server-url');
        if (serverUrlInput) {
          // 设置默认值
          serverUrlInput.value = config.url || 'http://160.202.244.103:11434/api/chat';
          serverUrlInput.placeholder = '例如：http://160.202.244.103:11434/api/chat';
        }

        // 绑定保存URL按钮事件
        const saveUrlBtn = document.getElementById('save-url');
        if (saveUrlBtn) {
          saveUrlBtn.addEventListener('click', this.saveServerUrl.bind(this));
        }
      }

      loadChatHistory() {
        const history = this.configManager.getChatHistory();
        let lastUserMessageIndex = -1;

        // 查找历史中的最后一个用户消息
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].role === 'user') {
            lastUserMessageIndex = i;
            break;
          }
        }

        // 显示历史消息
        for (let i = 0; i < history.length; i++) {
          // 只显示最后一轮对话
          if (lastUserMessageIndex > -1 && i < lastUserMessageIndex - 1) continue;

          const msg = history[i];
          const messageId = this.addChatMessage(msg.content, msg.role);

          // 如果有时间信息，更新消息时间
          if (msg.timestamp) {
            const time = new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
            const timeElement = document.querySelector(`#message-${messageId} .message-time`);
            if (timeElement) {
              timeElement.textContent = time;
            }
          }
        }

        // 滚动到底部
        this.scrollToBottom();
      }

      getAppHTML() {
        return `
          <div id="chat-header">
            <h3>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#FF6700" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4l3 3"></path>
              </svg>
              Ollama 聊天助手
            </h3>
            <div id="header-actions">
              <button id="toggle-config-btn" class="header-btn" title="配置">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
                </svg>
              </button>
              <button id="toggle-min-btn" class="header-btn" title="最小化">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 18h8"></path>
                </svg>
              </button>
              <button id="toggle-max-btn" class="header-btn" title="最大化">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div id="server-config">
            <div class="input-group">
              <label for="server-url">服务器地址</label>
              <input id="server-url" type="text" placeholder="Ollama服务URL" title="Ollama服务地址">
              <button id="save-url" class="save-btn" title="保存">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
            </div>
            <small class="form-tip">没有Ollama服务？<a href="https://freeollama.oneplus1.top/" target="_blank">点击这里</a>获取免费Ollama服务</small>
          </div>
          
          <div id="model-selector">
            <select id="model-select" title="选择模型">
              <option value="deepseek-r1:7b">模型加载中...</option>
            </select>
          </div>
          
          <div id="chat-messages"></div>
          
          <div id="chat-input-container">
            <div class="input-wrapper">
              <textarea id="chat-input" placeholder="输入消息..." rows="1"></textarea>
              <button id="send-button" title="发送">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
              </button>
            </div>
            
            <div id="chat-toolbar">
              <div class="toolbar-actions">
                <button id="clear-chat" class="toolbar-btn" title="清空对话">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                  清空对话
                </button>
              </div>
              <div id="char-counter"></div>
            </div>
          </div>
          <div class="resize-handle"></div>

          <!-- 配置面板 -->
          <div id="config-panel" class="config-panel">
            <div class="config-header">
              <h3>模型配置</h3>
              <button class="close-btn" title="关闭">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="config-content">
              <div class="config-group">
                <label>
                  <input type="checkbox" id="use-stream" title="使用流式响应">
                  使用流式响应
                </label>
              </div>
              <div class="config-group">
                <label for="temperature">温度 (Temperature)</label>
                <div class="range-container">
                  <div class="range-slider">
                    <input type="range" id="temperature" min="0" max="2" step="0.1" title="控制输出的随机性">
                  </div>
                  <span class="range-value">0.7</span>
                </div>
              </div>
              <div class="config-group">
                <label for="top-p">Top P</label>
                <div class="range-container">
                  <div class="range-slider">
                    <input type="range" id="top-p" min="0" max="1" step="0.1" title="控制输出的多样性">
                  </div>
                  <span class="range-value">0.9</span>
                </div>
              </div>
              <div class="config-group">
                <label for="top-k">Top K</label>
                <div class="range-container">
                  <div class="range-slider">
                    <input type="range" id="top-k" min="1" max="100" step="1" title="控制输出的多样性">
                  </div>
                  <span class="range-value">40</span>
                </div>
              </div>
              <div class="config-group">
                <label for="num-ctx">上下文长度</label>
                <div class="range-container">
                  <div class="range-slider">
                    <input type="range" id="num-ctx" min="512" max="8192" step="512" title="控制上下文窗口大小">
                  </div>
                  <span class="range-value">4096</span>
                </div>
              </div>
              <div class="config-group">
                <label for="repeat-penalty">重复惩罚</label>
                <div class="range-container">
                  <div class="range-slider">
                    <input type="range" id="repeat-penalty" min="1" max="2" step="0.1" title="控制重复内容的惩罚程度">
                  </div>
                  <span class="range-value">1.1</span>
                </div>
              </div>
            </div>
            <div class="config-footer">
              <button id="save-config" class="save-btn">保存配置</button>
            </div>
          </div>
        `;
      }

      getIconHTML() {
        return `
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/>
            <path d="M12 7V12L14.5 14.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      }

      saveServerUrl() {
        const urlInput = this.elements.serverUrl;
        if (!urlInput) return;

        let url = urlInput.value.trim();
        if (!url) return;

        // 确保URL格式正确
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'http://' + url;
        }

        // 确保URL以/api/chat结尾
        if (!url.endsWith('/api/chat')) {
          url = url.replace(/\/*$/, '') + '/api/chat';
        }

        // 显示加载状态
        this.elements.saveUrlBtn.disabled = true;
        this.elements.serverUrl.disabled = true;

        // 保存动画
        const originalContent = this.elements.saveUrlBtn.innerHTML;
        this.elements.saveUrlBtn.innerHTML = '<span class="loading-spinner"></span>';

        // 更新URL
        this.configManager.updateServerUrl(url);
        urlInput.value = url;

        // 延迟一下，模拟服务器验证
        setTimeout(() => {
          // 恢复按钮状态
          this.elements.saveUrlBtn.disabled = false;
          this.elements.serverUrl.disabled = false;
          this.elements.saveUrlBtn.innerHTML = originalContent;

          // 提示保存成功
          this.showNotification('服务器地址已保存');

          // 重新获取模型列表
          this.fetchModels();
        }, 500);
      }

      showNotification(message, duration = 2000) {
        let notification = document.getElementById('ollama-notification');
        if (!notification) {
          notification = document.createElement('div');
          notification.id = 'ollama-notification';
          document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.className = 'show';

        setTimeout(() => {
          notification.className = '';
        }, duration);
      }

      toggleConfigPanel() {
        try {
          console.log('正在切换配置面板...');

          const configPanel = document.getElementById('config-panel');
          if (!configPanel) {
            console.error('配置面板元素未找到');
            return;
          }

          const isVisible = configPanel.classList.contains('show');
          console.log('当前配置面板状态:', isVisible ? '显示' : '隐藏');

          if (isVisible) {
            configPanel.classList.remove('show');
            console.log('配置面板已隐藏');
          } else {
            console.log('正在加载配置值...');
            this.loadConfigValues();
            configPanel.classList.add('show');
            console.log('配置面板已显示');
          }
        } catch (error) {
          console.error('切换配置面板时出错:', error);
        }
      }

      loadConfigValues() {
        const config = this.configManager.getConfig();

        // 添加空值检查
        if (!this.elements.useStreamCheckbox || !this.elements.temperatureInput ||
          !this.elements.topPInput || !this.elements.topKInput ||
          !this.elements.numCtxInput || !this.elements.repeatPenaltyInput) {
          console.error('配置面板元素未找到，无法加载配置值');
          return;
        }

        // 设置流式响应选项
        this.elements.useStreamCheckbox.checked = config.useStream;

        // 设置模型参数
        if (this.elements.temperatureInput && this.elements.temperatureInput.nextElementSibling) {
          this.elements.temperatureInput.value = config.params.temperature;
          this.elements.temperatureInput.nextElementSibling.textContent = config.params.temperature;
        }

        if (this.elements.topPInput && this.elements.topPInput.nextElementSibling) {
          this.elements.topPInput.value = config.params.top_p;
          this.elements.topPInput.nextElementSibling.textContent = config.params.top_p;
        }

        if (this.elements.topKInput && this.elements.topKInput.nextElementSibling) {
          this.elements.topKInput.value = config.params.top_k;
          this.elements.topKInput.nextElementSibling.textContent = config.params.top_k;
        }

        if (this.elements.numCtxInput && this.elements.numCtxInput.nextElementSibling) {
          this.elements.numCtxInput.value = config.params.num_ctx;
          this.elements.numCtxInput.nextElementSibling.textContent = config.params.num_ctx;
        }

        if (this.elements.repeatPenaltyInput && this.elements.repeatPenaltyInput.nextElementSibling) {
          this.elements.repeatPenaltyInput.value = config.params.repeat_penalty;
          this.elements.repeatPenaltyInput.nextElementSibling.textContent = config.params.repeat_penalty;
        }
      }

      updateRangeValue(e) {
        try {
          const input = e.target;
          const container = input.closest('.range-container');
          if (!container) {
            console.warn('未找到 range-container 元素');
            return;
          }

          const valueDisplay = container.querySelector('.range-value');
          if (!valueDisplay) {
            console.warn('未找到 range-value 元素');
            return;
          }

          valueDisplay.textContent = input.value;
          console.log(`更新范围值: ${input.id} = ${input.value}`);
        } catch (error) {
          console.error('更新范围值时出错:', error);
        }
      }

      updateConfig() {
        const config = this.configManager.getConfig();

        // 更新流式响应选项
        config.useStream = this.elements.useStreamCheckbox.checked;

        // 更新模型参数
        config.params.temperature = parseFloat(this.elements.temperatureInput.value);
        config.params.top_p = parseFloat(this.elements.topPInput.value);
        config.params.top_k = parseInt(this.elements.topKInput.value);
        config.params.num_ctx = parseInt(this.elements.numCtxInput.value);
        config.params.repeat_penalty = parseFloat(this.elements.repeatPenaltyInput.value);

        this.configManager.setConfig(config);
      }

      saveConfig() {
        this.updateConfig();
        this.toggleConfigPanel();
        this.showNotification('配置已保存');
      }
    }

    // 初始化应用
    const configManager = new ConfigManager();
    const ollamaService = new OllamaService(configManager);
    const uiManager = new UIManager(configManager, ollamaService);
    uiManager.init();
  }
})();
