// ==UserScript==
// @name         Python123
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一个用于获取 Python123 选择题解析或答案的，接入大模型完成程序设计题的脚本
// @author       forxk
// @match        *://python123.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520973/Python123.user.js
// @updateURL https://update.greasyfork.org/scripts/520973/Python123.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 创建一个显示数据包的窗体
  const packetContainer = document.createElement('div');
  packetContainer.style.position = 'fixed';
  packetContainer.style.top = '10px';
  packetContainer.style.right = '10px';
  packetContainer.style.width = '350px';
  packetContainer.style.height = '500px';
  packetContainer.style.overflowY = 'scroll';
  packetContainer.style.backgroundColor = '#f9f9f9';
  packetContainer.style.border = '1px solid #ccc';
  packetContainer.style.borderRadius = '8px';
  packetContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  packetContainer.style.zIndex = '9999';
  packetContainer.style.fontSize = '14px';
  packetContainer.style.resize = 'both'; // 允许拖动四周边框调整大小
  packetContainer.style.overflow = 'auto';
  packetContainer.style.minWidth = '200px'; // 设置最小宽度
  packetContainer.style.minHeight = '200px'; // 设置最小高度
  document.body.appendChild(packetContainer);

  // 创建控制面板
  const controlPanel = document.createElement('div');
  controlPanel.style.position = 'sticky';
  controlPanel.style.top = '0';
  controlPanel.style.backgroundColor = '#e0e0e0';
  controlPanel.style.borderBottom = '1px solid #ccc';
  controlPanel.style.width = '100%';
  controlPanel.style.display = 'flex';
  controlPanel.style.flexDirection = 'column';
  controlPanel.style.padding = '5px';
  controlPanel.style.borderTopLeftRadius = '8px';
  controlPanel.style.borderTopRightRadius = '8px';
  controlPanel.style.zIndex = '10000'; // 确保控制面板在最上层
  packetContainer.appendChild(controlPanel);

  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.marginBottom = '5px';
  controlPanel.appendChild(buttonContainer);

  const moveButton = document.createElement('button');
  moveButton.textContent = 'Move';
  moveButton.style.marginRight = '5px';
  moveButton.style.padding = '5px 10px';
  moveButton.style.border = 'none';
  moveButton.style.borderRadius = '4px';
  moveButton.style.backgroundColor = 'rgb(96, 206, 179)';
  moveButton.style.color = 'white';
  moveButton.style.cursor = 'pointer';
  buttonContainer.appendChild(moveButton);

  const minimizeButton = document.createElement('button');
  minimizeButton.textContent = 'Minimize';
  minimizeButton.style.padding = '5px 10px';
  minimizeButton.style.border = 'none';
  minimizeButton.style.borderRadius = '4px';
  minimizeButton.style.backgroundColor = 'rgb(96, 206, 179)';
  minimizeButton.style.color = 'white';
  minimizeButton.style.cursor = 'pointer';
  buttonContainer.appendChild(minimizeButton);

  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Toggle';
  toggleButton.style.padding = '5px 10px';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '4px';
  toggleButton.style.backgroundColor = 'rgb(96, 206, 179)';
  toggleButton.style.color = 'white';
  toggleButton.style.cursor = 'pointer';
  buttonContainer.appendChild(toggleButton);

  // 创建模型选择容器
  const modelContainer = document.createElement('div');
  modelContainer.style.display = 'flex';
  modelContainer.style.justifyContent = 'space-between';
  modelContainer.style.marginBottom = '5px';
  controlPanel.appendChild(modelContainer);

  const modelSelect = document.createElement('select');
  modelSelect.style.padding = '5px 10px';
  modelSelect.style.border = 'none';
  modelSelect.style.borderRadius = '4px';
  modelSelect.style.backgroundColor = 'rgb(96, 206, 179)';
  modelSelect.style.color = 'white';
  modelSelect.style.cursor = 'pointer';
  const models = [
    'THUDM/glm-4-9b-chat',
    'Qwen/Qwen2.5-72B-Instruct',
    'deepseek-ai/DeepSeek-V2.5',
    'deepseek-ai/DeepSeek-V2-Chat',
    'Qwen/Qwen2.5-7B-Instruct'
  ];
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
  modelContainer.appendChild(modelSelect);

  // 从 localStorage 中读取并设置模型选择
  const savedModel = localStorage.getItem('selectedModel');
  if (savedModel) {
    modelSelect.value = savedModel;
  }

  // 创建搜索框容器
  const searchContainer = document.createElement('div');
  searchContainer.style.display = 'flex';
  searchContainer.style.justifyContent = 'space-between';
  controlPanel.appendChild(searchContainer);

  // 创建搜索框
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = '搜索内容';
  searchInput.style.padding = '5px 10px';
  searchInput.style.border = 'none';
  searchInput.style.borderRadius = '4px';
  searchInput.style.flexGrow = '1';
  searchContainer.appendChild(searchInput);

  // 监听搜索框输入事件
  searchInput.addEventListener('input', function () {
    const searchText = searchInput.value.toLowerCase();
    const packets = packetContainer.querySelectorAll('div.packet');
    packets.forEach(packet => {
      const content = packet.textContent.toLowerCase();
      if (content.includes(searchText)) {
        packet.style.display = 'block';
      } else {
        packet.style.display = 'none';
      }
    });
  });

  // 创建API Key输入框和按钮
  const apiKeyContainer = document.createElement('div');
  apiKeyContainer.style.display = 'flex';
  apiKeyContainer.style.justifyContent = 'space-between';
  apiKeyContainer.style.marginBottom = '5px';
  controlPanel.appendChild(apiKeyContainer);

  const apiKeyInput = document.createElement('input');
  apiKeyInput.type = 'text';
  apiKeyInput.placeholder = 'Enter API Key';
  apiKeyInput.style.padding = '5px 10px';
  apiKeyInput.style.border = 'none';
  apiKeyInput.style.borderRadius = '4px';
  apiKeyInput.style.flexGrow = '1';
  apiKeyContainer.appendChild(apiKeyInput);

  const saveApiKeyButton = document.createElement('button');
  saveApiKeyButton.textContent = 'Save API Key';
  saveApiKeyButton.style.padding = '5px 10px';
  saveApiKeyButton.style.border = 'none';
  saveApiKeyButton.style.borderRadius = '4px';
  saveApiKeyButton.style.backgroundColor = 'rgb(96, 206, 179)';
  saveApiKeyButton.style.color = 'white';
  saveApiKeyButton.style.cursor = 'pointer';
  apiKeyContainer.appendChild(saveApiKeyButton);

  // 从 localStorage 中读取并设置API Key
  const savedApiKey = localStorage.getItem('apiKey');
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }

  saveApiKeyButton.onclick = function () {
    const apiKey = apiKeyInput.value;
    localStorage.setItem('apiKey', apiKey);
    alert('API Key saved!');
  };

  let isMinimized = false;
  minimizeButton.onclick = function () {
    if (isMinimized) {
      packetContainer.style.height = '500px';
      minimizeButton.textContent = 'Minimize';
    } else {
      packetContainer.style.height = '30px';
      minimizeButton.textContent = 'Maximize';
    }
    isMinimized = !isMinimized;
  };

  toggleButton.onclick = function () {
    if (packetContainer.style.display === 'none') {
      packetContainer.style.display = 'block';
    } else {
      packetContainer.style.display = 'none';
    }
  };

  modelSelect.onchange = function () {
    localStorage.setItem('selectedModel', modelSelect.value);
    refreshData();
  };

  // 使窗口可通过拖动Move按钮移动
  moveButton.onmousedown = function (event) {
    event.preventDefault();
    let shiftX = event.clientX - packetContainer.getBoundingClientRect().left;
    let shiftY = event.clientY - packetContainer.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      packetContainer.style.left = pageX - shiftX + 'px';
      packetContainer.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  };

  moveButton.ondragstart = function () {
    return false;
  };

  function displayPacket(name, content, explanationContent, answer, description, aiResponse, type) {
    const packetElement = document.createElement('div');
    packetElement.classList.add('packet');
    packetElement.style.marginBottom = '10px';
    packetElement.style.borderBottom = '1px solid #ccc';
    packetElement.style.paddingBottom = '10px';
    packetElement.style.padding = '10px';
    packetElement.style.backgroundColor = 'white';
    packetElement.style.borderRadius = '4px';
    packetElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

    const nameElement = document.createElement('div');
    nameElement.textContent = `Name: ${name}`;
    nameElement.style.fontWeight = 'bold';
    nameElement.style.marginBottom = '5px';
    packetElement.appendChild(nameElement);

    if (content) {
      const contentElement = document.createElement('div');
      contentElement.textContent = `Content: ${content}`;
      contentElement.style.marginBottom = '5px';
      packetElement.appendChild(contentElement);
    }

    if (explanationContent) {
      const explanationElement = document.createElement('div');
      explanationElement.textContent = `Explanation: ${explanationContent}`;
      explanationElement.style.marginBottom = '5px';
      packetElement.appendChild(explanationElement);
    }

    if (answer) {
      const answerElement = document.createElement('div');
      answerElement.textContent = `Answer: ${answer}`;
      answerElement.style.marginBottom = '5px';
      packetElement.appendChild(answerElement);
    }

    if (description) {
      const descriptionElement = document.createElement('div');
      descriptionElement.textContent = `Description: ${description}`;
      descriptionElement.style.marginBottom = '5px';
      packetElement.appendChild(descriptionElement);
    }

    if (type) {
      const typeElement = document.createElement('div');
      typeElement.textContent = `Type: ${type}`;
      typeElement.style.marginBottom = '5px';
      packetElement.appendChild(typeElement);
    }

    if (aiResponse) {
      const aiResponseElement = document.createElement('pre');
      aiResponseElement.style.marginTop = '10px';
      aiResponseElement.style.padding = '10px';
      aiResponseElement.style.backgroundColor = '#f0f0f0';
      aiResponseElement.style.borderRadius = '4px';
      aiResponseElement.textContent = aiResponse;
      packetElement.appendChild(aiResponseElement);
    }

    packetContainer.appendChild(packetElement);
  }

  function extractAndDisplayData(json) {
    json.data.forEach(item => {
      const name = item.name || 'N/A';
      const content = item.content ? stripHtml(item.content) : 'N/A';
      const explanationContent = item.explanation_content ? stripHtml(item.explanation_content) : null;
      const answer = item.answer || null;
      const description = item.description || null;
      const type = item.type || 'N/A'; // 解析出 type 类型

      // 检查是否能从Content中找到答案
      let answerText = null;
      if (answer && content) {
        try {
          const contentArray = JSON.parse(content);
          answerText = contentArray.find(item => item[0] == answer)[1];
        } catch (e) {
          console.error('Failed to parse content or find answer:', e);
        }
      }

      if (answerText) {
        displayPacket(name, content, explanationContent, answer, description, null, type);
      } else {
        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) {
          displayPacket(name, content, explanationContent, answer, description, 'API Key is missing, cannot call AI model.', type);
        } else {
          sendToAI(name, content, explanationContent, answer, description, type, (aiResponse) => {
            displayPacket(name, content, explanationContent, answer, description, aiResponse, type);
          });
        }
      }
    });
  }

  function stripHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  function sendToAI(name, content, explanationContent, answer, description, type, callback) {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      alert('Please enter your API Key.');
      return;
    }

    const prompt = `Name: ${name}\nContent: ${content}\nExplanation: ${explanationContent}\nAnswer: ${answer}\nDescription: ${description}\nQuestion Type: ${type}`;
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelSelect.value,
        messages: [
          { role: 'system', content: '你现在是一个 Python 程序助理，下面我将向你输入题目，题目的类型由“Question Type”决定，如果是“Choice”请输出完整选项；如果是"programming"，请你按照要求输出Python代码，请不要输出md格式的代码，而是直接输出，并且输出完整的注释，以便我能直接复制粘贴' },
          { role: 'user', content: prompt }
        ]
      })
    };

    fetch('https://api.siliconflow.cn/v1/chat/completions', options)
      .then(response => response.json())
      .then(response => {
        console.log('AI Response:', response);
        const responseContent = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content;
        callback(responseContent || 'No response');
      })
      .catch(err => {
        console.error('AI Request Error:', err);
        callback('Error fetching AI response');
      });
  }

  function refreshData() {
    // 重新获取数据并刷新显示
    const event = new Event('keydown');
    event.ctrlKey = true;
    event.key = 'q';
    document.dispatchEvent(event);
  }

  // 正则表达式匹配URL
  const urlPattern = /\/api\/v1\/student\/courses\/\d+\/groups\/\d+\/problems/;

  // 拦截XMLHttpRequest
  (function (open) {
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      console.log('XMLHttpRequest open called with URL:', url);
      this.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          console.log('XMLHttpRequest readyState:', this.readyState, 'status:', this.status, 'URL:', url);
          if (this.status === 200 && urlPattern.test(url)) {
            console.log('Intercepted Prombles packet:', this.responseText);
            try {
              const jsonResponse = JSON.parse(this.responseText);
              extractAndDisplayData(jsonResponse);
            } catch (e) {
              console.error('Failed to parse JSON response:', e);
            }
          }
        }
      }, false);
      open.call(this, method, url, async, user, password);
    };
  })(XMLHttpRequest.prototype.open);

  // 拦截Fetch API
  (function (fetch) {
    window.fetch = function () {
      console.log('Fetch called with arguments:', arguments);
      return fetch.apply(this, arguments).then(function (response) {
        console.log('Fetch response URL:', response.url);
        if (urlPattern.test(response.url)) {
          response.clone().text().then(function (text) {
            console.log('Intercepted Prombles packet:', text);
            try {
              const jsonResponse = JSON.parse(text);
              extractAndDisplayData(jsonResponse);
            } catch (e) {
              console.error('Failed to parse JSON response:', e);
            }
          });
        }
        return response;
      });
    };
  })(window.fetch);

  // 添加快捷键监听器
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'p') {
      packetContainer.style.display = 'none';
    }
    if (event.ctrlKey && event.key === 'q') {
      packetContainer.style.display = 'block';
    }
  });
})();