// ==UserScript==
// @name         Easy Input
// @namespace    zarttic
// @description  一键粘贴文本到当前页面的输入框.
// @author       zarttic
// @match        *
// @grant        none
// @license      MIT
// @version      1.03
// @downloadURL https://update.greasyfork.org/scripts/513393/Easy%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/513393/Easy%20Input.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    body {
      font-family: Arial, sans-serif;
      padding: 10px;
      width: 300px;
    }

    .container {
      text-align: center;
    }

    textarea {
      width: 100%;
      height: 100px;
      margin-bottom: 10px;
    }

    button {
      width: 100%;
      padding: 10px;
      background-color: #0078d7;
      color: white;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color: #005a9e;
    }
  `;
  document.head.appendChild(style);

  // 创建一个容器
  const container = document.createElement('div');
  container.className = 'container';

  // 创建标题
  const title = document.createElement('h1');
  title.innerText = '😎Easy Input✍️';
  container.appendChild(title);

  // 创建文本区域
  const textarea = document.createElement('textarea');
  textarea.id = 'textInput';
  textarea.placeholder = '✍️粘贴到这里~~';
  container.appendChild(textarea);

  // 创建按钮
  const button = document.createElement('button');
  button.id = 'pasteButton';
  button.innerText = '👉一键粘贴👈';
  container.appendChild(button);

  // 添加容器到页面
  document.body.appendChild(container);

  // 监听按钮点击事件
  button.addEventListener('click', async () => {
    const text = textarea.value;
    if (text) {
      simulateInput(text);
    }
  });

  // 模拟输入函数
  function simulateInput(text) {
    const inputField = document.activeElement;
    if (inputField && (inputField.tagName === 'INPUT' || inputField.tagName === 'TEXTAREA')) {
      inputField.value = text;
      const event = new Event('input', { bubbles: true });
      inputField.dispatchEvent(event);
    }
  }
})();