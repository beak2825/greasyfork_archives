// ==UserScript==
// @name        GPT4 Model Switcher
// @description 切换 OpenAI GPT-4 使用的模型（gpt-4 和 gpt-4-mobile）仅plus用户可用。
// @author       LShang
// @license MIT
// @match       https://chat.openai.com/*
// @match       https://chat.zhile.io/*
// @version     6.0
// @grant       none
// @namespace https://github.com/LShang001
// @downloadURL https://update.greasyfork.org/scripts/467244/GPT4%20Model%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/467244/GPT4%20Model%20Switcher.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 获取localStorage中的脚本是否启用的状态，默认为 gpt-4
  let isScriptEnabled = localStorage.getItem('isScriptEnabled') === 'true';
  let modelInUse = isScriptEnabled ? 'gpt-4-mobile' : 'gpt-4';

  // 创建并插入样式，用于显示切换按钮
  const style = document.createElement('style');
  style.innerHTML = `
    .toggle-button {
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px;
      background-color: #242424;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .toggle-button span {
      color: white;
      font-size: 16px;
    }

    .toggle-button input {
      display: none;
    }

    .slider {
      cursor: pointer;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 34px;
      width: 60px;
      height: 34px;
      position: relative;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #4CAF50;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }
  `;
  document.head.appendChild(style);

  // 创建切换按钮和相关元素
  const toggleButton = document.createElement('label');
  toggleButton.className = 'toggle-button';

  const toggleText = document.createElement('span');
  toggleText.textContent = 'Model: ' + modelInUse;
  toggleButton.appendChild(toggleText);

  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.checked = isScriptEnabled;
  // 当切换状态时，改变localStorage中的脚本启用状态，并更新模型名称
  toggleInput.addEventListener('change', toggleScript);
  toggleButton.appendChild(toggleInput);

  const slider = document.createElement('span');
  slider.className = 'slider';
  toggleButton.appendChild(slider);

  document.body.appendChild(toggleButton);

  // 切换脚本的启用状态，并更新模型名称
  function toggleScript() {
    isScriptEnabled = !isScriptEnabled;
    localStorage.setItem('isScriptEnabled', isScriptEnabled);
    modelInUse = isScriptEnabled ? 'gpt-4-mobile' : 'gpt-4';
    toggleText.textContent = 'Model: ' + modelInUse;
  }

  // 保存原始的fetch函数
  const originalFetch = window.fetch;

  // 修改fetch函数，对于POST请求的模型参数进行修改
  function modifiedFetch(url, init) {
    if (!isScriptEnabled) {
      return originalFetch(url, init);
    }
    try {
      if (init && init.method === 'POST' && init.body && init.headers['Content-Type'] === 'application/json') {
        let data = JSON.parse(init.body);
        if (data.hasOwnProperty('model') && (data.model === 'gpt-4' || data.model === 'gpt-4-mobile')) {
          data.model = isScriptEnabled ? 'gpt-4-mobile' : 'gpt-4';
          init.body = JSON.stringify(data);
        }
      }
      return originalFetch(url, init);
    } catch (e) {
      console.error('在处理请求时出现错误:', e);
      return originalFetch(url, init);
    }
  }

  // 在页面加载后替换原始的fetch函数
  window.addEventListener('load', () => {
    window.fetch = modifiedFetch;
  });
})();
