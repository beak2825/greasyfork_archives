// ==UserScript==
// @name         Keep Kaggle Notebook Alive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keep the Kaggle Notebook alive by simulating user activity
// @author       liuweiqing
// @match        https://www.kaggle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504382/Keep%20Kaggle%20Notebook%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/504382/Keep%20Kaggle%20Notebook%20Alive.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 每隔5分钟模拟一次点击事件，以保持Kaggle Notebook的活动状态
  function keepAlive() {
    console.log("Keeping the Kaggle Notebook alive...");
    const addButton = document.querySelector('button[aria-label="Add cell"]');
    if (addButton) {
      addButton.click(); // 模拟点击添加单元格按钮
    }
    const runButton = document.querySelector(
      'button[aria-label="Run current cell"]'
    );
    if (runButton) {
      runButton.click(); // 模拟点击运行单元格按钮
    }
    const cutButton = document.querySelector('button[aria-label="Cut cell"]');
    if (cutButton) {
      cutButton.click(); // 模拟点击删除单元格按钮
    }

    // 随机生成几分钟的间隔
    const randomInterval =
      Math.floor(Math.random() * (100000 - 50000 + 1)) + 240000;
    console.log(`Next execution in ${randomInterval} milliseconds.`);

    // 重新设置定时器
    setTimeout(keepAlive, randomInterval);
  }

  // 首次调用
  keepAlive();
  // 300000 毫秒 = 5 分钟
  // 这种形式已经无法触发任何按键了
  // const ctrlEnterEvent = new KeyboardEvent("keydown", {
  //   bubbles: true,
  //   cancelable: true,
  //   key: "Enter",
  //   code: "Enter",
  //   location: 0,
  //   ctrlKey: true, // 表示 Ctrl 键被按下
  //   repeat: false,
  // });
  // document.dispatchEvent(EnterEvent);
})();
