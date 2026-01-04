// ==UserScript==
// @name         力宾测试自动填写表单
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填写表单的示例脚本，仅供参考
// @author       ChatGPT
// @match        http://47.110.45.168/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475948/%E5%8A%9B%E5%AE%BE%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A1%A8%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/475948/%E5%8A%9B%E5%AE%BE%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A1%A8%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
const button = document.createElement('button');
button.textContent = '点击上传并读取txt文件';

// 创建文件上传控件
const input = document.createElement('input');
input.type = 'file';
input.accept = '.txt';

// 添加click事件处理程序
button.addEventListener('click', (event) => {
  // 触发文件选择框
  input.click();
});

// 添加change事件处理程序
input.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  // 创建FileReader对象
  const reader = new FileReader();
  
  // 读取文件内容
  reader.onload = (event) => {
    const content = event.target.result;
    alert(content);
  };
  
  reader.readAsText(file);
});

// 将按钮添加到页面中
const container = document.querySelector('#pagetitle');
container.appendChild(button);
})();