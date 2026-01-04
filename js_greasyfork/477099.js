// ==UserScript==
// @name         ChatGPT Input Saver
// @namespace    https://greasyfork.org/zh-CN/scripts/477099-chatgpt-input-saver
// @version      0.2.2
// @description  Save input for ChatGPT
// @author       OpenAI
// @match        *://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477099/ChatGPT%20Input%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/477099/ChatGPT%20Input%20Saver.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const saveInputData = (event) => {
    const value = event.target.value;
    if (value?.length === 1) {
      localStorage.setItem('chatgpt_last_input2', localStorage.getItem('chatgpt_last_input'));
    }
    localStorage.setItem('chatgpt_last_input', event.target.value);
  }

  let inputDom = document.querySelector('prompt-textarea');

  // if (inputBox) {
  //   // 当页面加载时，设置输入框的值为上次保存的值
  //   const lastValue = localStorage.getItem('chatgpt_last_input');
  //   if (lastValue) {
  //     inputBox.value = lastValue;
  //   }

  //   // 当输入框的内容发生变化时，保存其值
  //   inputBox.addEventListener('input', function () {
  //     localStorage.setItem('chatgpt_last_input', inputBox.value);
  //   });
  // }

  // 回调函数当观察到变化时执行
  const callback = function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (let removedNode of mutation.removedNodes) {
          // 属性的id为
          if (removedNode.id === 'prompt-textarea') {
            removedNode?.removeEventListener?.('input', saveInputData);
          }
        }
      }
    }
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (let addedNode of mutation.addedNodes) {
          if (addedNode.id === 'prompt-textarea') {
            addedNode?.addEventListener?.('input', saveInputData);
          }
        }
      }
    }
  };

  // 配置观察器: 只观察子节点的变化
  const config = { childList: true, subtree: true };

  // 创建观察器实例并传入回调
  const observer = new MutationObserver(callback);

  // 开始观察目标元素
  observer.observe(document.body, config);

})();
