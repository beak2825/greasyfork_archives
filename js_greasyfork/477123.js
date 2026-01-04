// ==UserScript==
// @name         共创世界(CCW)快捷键暂停
// @namespace    https://greasyfork.org/zh-CN/scripts/477123-ccw%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%9A%82%E5%81%9C
// @version      1.5
// @description  使用模拟点击元素实现的快捷暂停
// @match        https://www.ccw.site/detail/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477123/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/477123/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // 用户自定义的触发按键
  const customKey = 'x';

  // 需要点击的元素选择器
  const elementSelector = 'div.action-item-P9SP6.action-control-8nmb9';

  window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    // 判断是否按下用户定义的按键
    if (key === customKey) {
      // 获取要点击的元素
      const element = document.querySelector(elementSelector);
      console.log(element.style.visibility);

      if (element && element.style.visibility === '' && typeof element.click === 'function') {
        element.click();
      }
    }
  });
})();