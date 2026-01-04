// ==UserScript==
// @name         快速刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It will click refresh button every second.
// @author       You
// @match        *://grafana.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.co
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472876/%E5%BF%AB%E9%80%9F%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/472876/%E5%BF%AB%E9%80%9F%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  window.onload = function () {
    // 创建输入框元素
    const input = document.createElement('input');
    input.type = 'number';
    input.value = 1; // 默认刷新时间为1
    input.style.marginRight = '10px';

    // 创建按钮元素
    const button = document.createElement('button');
    button.textContent = '快速刷新';
    button.className = 'css-fbg4cg-toolbar-button'; // 添加类名
    button.id = 'quick-refresh';

    // 获取元素
    const buttonContainer = document.getElementsByClassName('page-toolbar')[0];
    buttonContainer.insertBefore(input, buttonContainer.firstChild);
    buttonContainer.insertBefore(button, input);

    // 定义点击事件处理函数
    function handleClick() {
      const refreshTime = parseInt(input.value); // 获取输入框的值作为刷新时间

      // 在这里执行你的脚本代码
      // 获取要点击的元素
      const element = document.querySelector('[aria-label="Refresh dashboard"]');

      // 定义点击函数
      function clickElement() {
        // 模拟点击事件
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        element.dispatchEvent(event);
      }

      // 每隔指定的刷新时间点击元素
      setInterval(clickElement, refreshTime * 1000);
    }

    // 绑定点击事件监听器
    button.addEventListener('click', handleClick);
  }
})();
