// ==UserScript==
// @name         鼠标移动和双击复制文本工具（带开关）
// @namespace    your-namespace
// @version      1.1
// @description  在鼠标移动时在当前 div 上覆盖半透明蓝色方框，并且双击可复制当前 div 的富文本内容，包括超链接。复制成功后方框将锁定不消失，并变成绿色，同时显示一个白色半透明小气泡，提示复制成功。
// @match        https://www.oppo.com/*
// @grant        none
// @author      Paul zr.holmes@live.com
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/481054/%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%92%8C%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E5%B7%A5%E5%85%B7%EF%BC%88%E5%B8%A6%E5%BC%80%E5%85%B3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/481054/%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%92%8C%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E5%B7%A5%E5%85%B7%EF%BC%88%E5%B8%A6%E5%BC%80%E5%85%B3%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建悬浮开关按钮
  var toggleButton = document.createElement('div');
  toggleButton.setAttribute('id', 'toggle-button');
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '20px';
  toggleButton.style.right = '20px';
  toggleButton.style.width = '50px';
  toggleButton.style.height = '50px';
  toggleButton.style.backgroundColor = '#2196f3';
  toggleButton.style.borderRadius = '50%';
  toggleButton.style.zIndex = '9999';
  toggleButton.style.cursor = 'move';
  toggleButton.style.display = 'block';
  toggleButton.style.pointerEvents = 'auto';
  toggleButton.style.opacity = '0.7';
  toggleButton.style.transition = 'opacity 0.3s';
  toggleButton.innerText = 'ON';
  document.body.appendChild(toggleButton);

  // 添加拖动功能
  var isDragging = false;
  var initialX = 0;
  var initialY = 0;

  toggleButton.addEventListener('mousedown', function(e) {
    isDragging = true;
    initialX = e.clientX - toggleButton.offsetLeft;
    initialY = e.clientY - toggleButton.offsetTop;
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      var newX = e.clientX - initialX;
      var newY = e.clientY - initialY;

      toggleButton.style.left = newX + 'px';
      toggleButton.style.top = newY + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  var overlay = document.createElement('div');
  overlay.setAttribute('id', 'overlay');
  overlay.style.position = 'fixed';
  overlay.style.zIndex = '9999';
  overlay.style.pointerEvents = 'none';
  overlay.style.border = '2px solid rgba(0, 0, 255, 0.5)';
  overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
  overlay.style.display = 'none';
  document.body.appendChild(overlay);

  var copiedMessage = document.createElement('div');
  copiedMessage.setAttribute('id', 'copied-message');
  copiedMessage.style.position = 'fixed';
  copiedMessage.style.top = '50%';
  copiedMessage.style.left = '50%';
  copiedMessage.style.transform = 'translate(-50%, -50%)';
  copiedMessage.style.background = 'rgba(255, 255, 255, 0.8)';
  copiedMessage.style.borderRadius = '5px';
  copiedMessage.style.color = '#000';
  copiedMessage.style.padding = '10px';
  copiedMessage.style.fontSize = '16px';
  copiedMessage.style.zIndex = '9999';
  copiedMessage.style.pointerEvents = 'none';
  copiedMessage.style.display = 'none';
  copiedMessage.style.opacity = '0';
  copiedMessage.style.transition = 'opacity 0.5s';
  copiedMessage.innerText = '复制成功';
  document.body.appendChild(copiedMessage);

  var activeDiv = null;
  var isScriptEnabled = true;

  function enableScript() {
    isScriptEnabled = true;
    resetOverlay();
    toggleButton.innerText = 'ON';
  }

  function disableScript() {
    isScriptEnabled = false;
    toggleButton.innerText = 'OFF';
  }

  function resetOverlay() {
    overlay.style.display = 'none';
    overlay.style.border = '2px solid rgba(0, 0, 255, 0.5)';
    overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
    overlay.style.pointerEvents = 'none';
  }

  function resetCopiedMessage() {
    copiedMessage.style.opacity = '0';
    setTimeout(function() {
      copiedMessage.style.display = 'none';
    }, 500);
  }

  document.addEventListener('mousemove', function(e) {
    if (!isScriptEnabled) return;

    var target = e.target;

    if (target.tagName === 'DIV' && target !== toggleButton) {
      var rect = target.getBoundingClientRect();

      overlay.style.top = rect.top + 'px';
      overlay.style.left = rect.left + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';

      overlay.style.display = 'block';
    }
  });

  document.addEventListener('dblclick', function(e) {
    if (!isScriptEnabled) return;

    var target = e.target;

    if (target.tagName === 'DIV' && target !== toggleButton) {
      var range = document.createRange();
      range.selectNode(target);

      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand('copy');

      overlay.style.border = '2px solid rgba(0, 128, 0, 0.5)';
      overlay.style.backgroundColor = 'rgba(0, 128, 0, 0.2)';
      overlay.style.pointerEvents = 'auto';

      copiedMessage.style.display = 'block';
      copiedMessage.style.opacity = '1';

      disableScript();

      setTimeout(function() {
        copiedMessage.style.opacity = '0';
        setTimeout(function() {
          copiedMessage.style.display = 'none';
          enableScript();
        }, 500);
      }, 800);
    }
  });

  toggleButton.addEventListener('dblclick', function() {
    if (isScriptEnabled) {
      disableScript();
    } else {
      enableScript();
    }
  });

  // 初始状态为开启
        disableScript();

})();