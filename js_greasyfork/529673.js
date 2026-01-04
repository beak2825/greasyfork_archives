// ==UserScript==
// @name         icomoon.io 一键删除所有集合
// @namespace    https://github.com/dlzmoe/scripts
// @version      0.1
// @description  添加一个按钮，点击时触发所有ng-click="removeSet($index)"按钮
// @author       dlzmoe
// @match        *://icomoon.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529673/icomoonio%20%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/529673/icomoonio%20%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建一个按钮
  const triggerButton = document.createElement('button');
  triggerButton.textContent = '删除所有集合';
  triggerButton.style.position = 'fixed';
  triggerButton.style.top = '60px';
  triggerButton.style.right = '10px';
  triggerButton.style.zIndex = '9999';
  triggerButton.style.padding = '8px 12px';
  triggerButton.style.backgroundColor = '#f44336';
  triggerButton.style.color = 'white';
  triggerButton.style.border = 'none';
  triggerButton.style.borderRadius = '4px';
  triggerButton.style.cursor = 'pointer';
  triggerButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

  // 鼠标悬停效果
  triggerButton.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#d32f2f';
  });

  triggerButton.addEventListener('mouseout', function() {
      this.style.backgroundColor = '#f44336';
  });

  // 创建一个临时通知弹窗的函数
  function showNotification(message, duration = 2000) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.position = 'fixed';
      notification.style.top = '40px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.backgroundColor = '#4CAF50';
      notification.style.color = 'white';
      notification.style.padding = '12px 20px';
      notification.style.borderRadius = '4px';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notification.style.zIndex = '10000';
      notification.style.transition = 'opacity 0.3s ease-in-out';

      document.body.appendChild(notification);

      setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
              document.body.removeChild(notification);
          }, 300);
      }, duration);
  }

  // 点击事件
  triggerButton.addEventListener('click', function() {
      // 获取所有符合条件的按钮
      const buttons = document.querySelectorAll('button[ng-click="removeSet($index)"]');

      if (buttons.length === 0) {
          showNotification(`未找到任何"removeSet($index)"按钮！`);
          return;
      }

      // 确认操作
      if (confirm(`确定要触发全部 ${buttons.length} 个删除按钮吗？`)) {
          // 遍历并点击每个按钮
          buttons.forEach(button => {
              button.click();
          });
          // 使用自定义通知代替alert
          showNotification(`成功触发了 ${buttons.length} 个删除按钮！`);
      }
  });

  // 将按钮添加到页面
  document.body.appendChild(triggerButton);
})();
