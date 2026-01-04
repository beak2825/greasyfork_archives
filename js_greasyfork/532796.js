// ==UserScript==
// @name         copy icloud reminder content
// @author       ziqiya
// @version      1.0.0
// @namespace    https://github.com/ziqiya/copyReminder
// @description  copy icloud reminder content in icloud website
// @match        *://*.icloud.com/*
// @match        *://*.icloud.com.cn/*
// @grant        GM_setClipboard
// @license      Apache Licence 2.0
// @downloadURL https://update.greasyfork.org/scripts/532796/copy%20icloud%20reminder%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/532796/copy%20icloud%20reminder%20content.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 创建按钮
  const button = document.createElement('button');
  button.innerText = 'copy content';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.padding = '10px';
  button.style.fontSize = '14px';
  button.style.backgroundColor = '#007BFF';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999'; // 确保按钮在页面最上层

  // 将按钮添加到页面
  document.body.appendChild(button);

  // 设置 MutationObserver 来监听 DOM 变化
  const observer = new MutationObserver(() => {
    // 当 DOM 内容发生变化时，确保按钮依然可用
    const elements = document.querySelectorAll('.tt-input-field');
    if (elements.length > 0) {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  });

  // 配置 MutationObserver 监听 DOM 内容的变化
  observer.observe(document.body, {
    childList: true, // 监听子节点的变化
    subtree: true // 监听整个文档树的变化
  });

  // 点击按钮时的处理逻辑
  button.addEventListener('click', () => {
    const elements = document.querySelectorAll('.tt-input-field');
    let content = '';

    // 拼接所有内容，每个元素后面加换行符
    elements.forEach(element => {
      content += element.innerText.trim() + '\n';
    });

    if (content) {
      // 复制到剪贴板
      GM_setClipboard(content);

      // 提示用户复制成功
      alert('Copied successfully！');
    } else {
      alert('No content found');
    }
  });
})();
