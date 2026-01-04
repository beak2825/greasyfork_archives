// ==UserScript==
// @name         飞书APP版本号自动加1
// @namespace    your-namespace-here
// @version      0.0.4
// @description  自动将指定 input 标签中的版本号加 1
// @match        https://open.feishu.cn/app/*
// @grant        none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464894/%E9%A3%9E%E4%B9%A6APP%E7%89%88%E6%9C%AC%E5%8F%B7%E8%87%AA%E5%8A%A8%E5%8A%A01.user.js
// @updateURL https://update.greasyfork.org/scripts/464894/%E9%A3%9E%E4%B9%A6APP%E7%89%88%E6%9C%AC%E5%8F%B7%E8%87%AA%E5%8A%A8%E5%8A%A01.meta.js
// ==/UserScript==

setTimeout(function() {
  'use strict';

  console.log("飞书APP版本号自动加1");

  // 找到指定的 input 元素
  const input = document.querySelector('input[placeholder*=对用户展示的正式版本号，上一个版本号为]');

  if (input) {
    // 解析当前版本号
    const currentVersionMatch = input.placeholder.match(/\d+\.\d+\.\d+/);
    if (!currentVersionMatch) {
      console.warn('找不到当前版本号');
      return;
    }
    const currentVersion = currentVersionMatch[0];
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    // 计算新版本号
    const newVersion = `${major}.${minor}.${patch + 1}`;

    // 更新 input 的值
    input.setAttribute("value", newVersion);
  }
}, 5000); // 等待 5 秒钟
