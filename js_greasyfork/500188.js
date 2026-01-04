// ==UserScript==
// @name         叔叔不约自动重开
// @namespace    GPT3.5
// @version      1.2
// @description  在叔叔不约对方离开后  2秒自动点击离开 0.5秒重新匹配
// @match        *://www.shushubuyue.net/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500188/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E9%87%8D%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/500188/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%87%AA%E5%8A%A8%E9%87%8D%E5%BC%80.meta.js
// ==/UserScript==


(function() {
  'use strict';






// 创建 MutationObserver 实例
var observer = new MutationObserver(function(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // 在变化发生时检查目标元素并进行点击
      checkAndClickElements();
    }
  }
});

// 配置 MutationObserver
var observerConfig = {
  childList: true,
  subtree: true
};

// 启动 MutationObserver 监视
observer.observe(document.body, observerConfig);

// 检查目标元素并进行点击
var isClickInProgress = false; // 标记点击是否正在进行中

function checkAndClickElements() {
  // 如果点击正在进行中，则直接返回
  if (isClickInProgress) {
    return;
  }

  // 设置点击进行中的标记
  isClickInProgress = true;

  var leaveElement = getElementByText('span.chat-control[href="#"]', '离开');
  if (leaveElement) {
    // 等待2000毫秒后点击 "离开" 元素
    setTimeout(function() {
      leaveElement.click();
      console.log('已点击 "离开" 元素');

      // 等待500毫秒后点击 "重新开始" 元素
      setTimeout(function() {
        var restartElement = getElementByText('span.chat-control[href="#"]', '重新开始');
        if (restartElement) {
          restartElement.click();
          console.log('已点击 "重新开始" 元素');
        }

        // 重置点击标记
        isClickInProgress = false;
      }, 500); // 延迟时间，单位：毫秒

    }, 4000); // 延迟时间，单位：毫秒
  } else {
    // 重置点击标记
    isClickInProgress = false;
  }
}

// 根据元素的文本内容选择元素
function getElementByText(selector, text) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].innerText.includes(text)) {
      return elements[i];
    }
  }
  return null;
}




})();