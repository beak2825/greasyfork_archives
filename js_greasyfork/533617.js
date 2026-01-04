// ==UserScript==
// @name         bilinovel
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  去除bilinovel检测到屏蔽后隐藏内容
// @author       karl
// @match        https://www.bilinovel.com/*
// @match        https://www.linovelib.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilinovel.com
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533617/bilinovel.user.js
// @updateURL https://update.greasyfork.org/scripts/533617/bilinovel.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- Part 1: Block eval and Function (保持不变) ---
  console.log('Tampermonkey: 尝试覆盖 eval() 和 Function()...');
  const targets = [window, unsafeWindow].filter(w => w);
  targets.forEach(targetWindow => {
      try {
          const originalEval = targetWindow.eval;
          const originalFunction = targetWindow.Function;
          Object.defineProperty(targetWindow, 'eval', {
              value: function(str) {
                  console.warn(`Tampermonkey: 检测到 ${targetWindow === window ? 'window' : 'unsafeWindow'}.eval() 调用并已阻止:`, str);
                  throw new Error('Tampermonkey: eval() 已被禁用');
              }, writable: false, configurable: true
          });
          Object.defineProperty(targetWindow, 'Function', {
              value: function(...args) {
                  const code = args.length > 0 ? args[args.length - 1] : '';
                  console.warn(`Tampermonkey: 检测到 ${targetWindow === window ? 'window' : 'unsafeWindow'}.Function() 调用并已阻止:`, code);
                  throw new Error('Tampermonkey: new Function() 已被禁用');
              }, writable: false, configurable: true
          });
      } catch (e) {
          console.error(`Tampermonkey: 覆盖 ${targetWindow === window ? 'window' : 'unsafeWindow'} 的 eval/Function 时出错:`, e);
      }
  });
  console.log('Tampermonkey: eval() 和 Function() 已尝试覆盖。');


  // --- Part 2: Force display of #acontent (修改部分) ---
  const checkElementInterval = 150;
  const maxWaitTime = 15000;
  let timeWaited = 0;

  console.log('Tampermonkey: 开始轮询检查 #acontent 元素...');

  const intervalId = setInterval(() => {
      const element = document.getElementById('acontent');
      timeWaited += checkElementInterval;

      if (element) {
          console.log('Tampermonkey: 找到 #acontent 元素。');
          clearInterval(intervalId);

          try {
              // **核心改动：移除 adv-box 类**
              if (element.classList.contains('adv-box')) {
                  element.classList.remove('adv-box');
                  console.log('Tampermonkey: 已移除 #acontent 的 adv-box 类，以避免UA样式覆盖。');
              } else {
                  console.log('Tampermonkey: #acontent 未找到 adv-box 类，无需移除。');
              }

              // 设置内联样式仍然有用，可以覆盖其他可能的作者样式规则
              // 即使移除了 adv-box，可能还有其他规则隐藏它
              element.style.setProperty('display', 'block', 'important');
              console.log('Tampermonkey: #acontent 的 display 样式已强制设置为 block !important');

          } catch (e) {
              console.error('Tampermonkey: 修改 #acontent 类或样式时出错:', e);
          }

      } else if (timeWaited >= maxWaitTime) {
          console.warn('Tampermonkey: 等待 #acontent 元素超时 (' + maxWaitTime + 'ms)，停止检查。');
          clearInterval(intervalId);
      }

  }, checkElementInterval);

})();