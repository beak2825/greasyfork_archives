// ==UserScript==
// @name         考试题库划词搜索
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  适用与超星，智慧树等任意考试网站搜索一之题库的答案，支持划词搜索、拖拽和自定义token（加密显示）
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      q.icodef.com
// @author      有问题联系q: 2430486030
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512327/%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/512327/%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建搜索框和结果显示区域
  const container = document.createElement('div');
  container.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      background-color: #f0f0f0;
      border-radius: 5px;
      padding: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      cursor: move;
  `;

  const searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.placeholder = '输入问题搜索答案';
  searchBox.style.cssText = `
      width: 200px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
      font-size: 14px;
      cursor: text;
      margin-bottom: 5px;
  `;

  const tokenInput = document.createElement('input');
  tokenInput.type = 'password';
  tokenInput.placeholder = '输入你的token';
  tokenInput.style.cssText = `
      width: 170px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 3px 0 0 3px;
      font-size: 14px;
      cursor: text;
      margin-bottom: 5px;
  `;

  const toggleTokenVisibility = document.createElement('button');
  toggleTokenVisibility.textContent = '👁️';
  toggleTokenVisibility.style.cssText = `
      width: 30px;
      padding: 5px;
      border: 1px solid #ccc;
      border-left: none;
      border-radius: 0 3px 3px 0;
      font-size: 14px;
      cursor: pointer;
      background-color: #f0f0f0;
  `;

  const tokenInputWrapper = document.createElement('div');
  tokenInputWrapper.style.cssText = `
      display: flex;
      margin-bottom: 5px;
  `;
  tokenInputWrapper.appendChild(tokenInput);
  tokenInputWrapper.appendChild(toggleTokenVisibility);

  const saveTokenButton = document.createElement('button');
  saveTokenButton.textContent = '保存Token';
  saveTokenButton.style.cssText = `
      padding: 5px;
      margin-left: 5px;
      cursor: pointer;
  `;

  const resultDiv = document.createElement('div');
  resultDiv.style.cssText = `
      margin-top: 10px;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 10px;
      border-radius: 3px;
      font-size: 14px;
      line-height: 1.4;
      cursor: default;
  `;

  container.appendChild(tokenInputWrapper);
  container.appendChild(saveTokenButton);
  container.appendChild(searchBox);
  container.appendChild(resultDiv);
  document.body.appendChild(container);

  // 读取保存的token
  let token = GM_getValue('oneTokenValue', '');
  tokenInput.value = token;

  // 切换token可见性
  toggleTokenVisibility.addEventListener('click', function() {
      if (tokenInput.type === 'password') {
          tokenInput.type = 'text';
          toggleTokenVisibility.textContent = '🔒';
      } else {
          tokenInput.type = 'password';
          toggleTokenVisibility.textContent = '👁️';
      }
  });

  // 保存token
  saveTokenButton.addEventListener('click', function() {
      token = tokenInput.value.trim();
      GM_setValue('oneTokenValue', token);
      alert('Token已保存');
  });

  // 添加拖拽功能
  let isDragging = false;
  let dragOffsetX, dragOffsetY;

  container.addEventListener('mousedown', function(e) {
      if (e.target === container) {
          isDragging = true;
          dragOffsetX = e.clientX - container.offsetLeft;
          dragOffsetY = e.clientY - container.offsetTop;
      }
  });

  document.addEventListener('mousemove', function(e) {
      if (isDragging) {
          container.style.left = (e.clientX - dragOffsetX) + 'px';
          container.style.top = (e.clientY - dragOffsetY) + 'px';
          container.style.right = 'auto';
      }
  });

  document.addEventListener('mouseup', function() {
      isDragging = false;
  });

  // 添加事件监听器
  searchBox.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          searchAnswer(this.value);
      }
  });

  // 添加划词搜索功能
  let selectionTimeout;
  document.addEventListener('selectionchange', function() {
      clearTimeout(selectionTimeout);
      selectionTimeout = setTimeout(() => {
          const selectedText = window.getSelection().toString().trim();
          if (selectedText) {
              searchBox.value = selectedText;
              searchAnswer(selectedText);
          }
      }, 2000); // 2秒延迟
  });

  // 搜索答案的函数
  function searchAnswer(question) {
      if (!token) {
          resultDiv.textContent = '请先设置你的Token';
          return;
      }

      const simple = "true";
      const split = "%23";
      const url = `https://q.icodef.com/api/v1/q/${encodeURIComponent(question)}?simple=${simple}&token=${token}&split=${split}`;

      resultDiv.textContent = '搜索中...';

      GM_xmlhttpRequest({
          method: "GET",
          url: url,
          onload: function(response) {
              console.log(response);
              if (response.status === 200) {
                  const result = JSON.parse(response.response);
                  if (result.data) {
                      resultDiv.textContent = `搜索结果：${result.data}`;
                  } else {
                      resultDiv.textContent = '未找到相关答案';
                  }
              } else {
                  const result = JSON.parse(response.response);
                  resultDiv.textContent = result.msg || '搜索失败，请稍后再试';
              }
          },
          onerror: function(error) {
              console.error('搜索出错:', error);
              resultDiv.textContent = '搜索出错，请检查网络连接';
          }
      });
  }
})();
