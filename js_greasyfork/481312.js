// ==UserScript==
// @name         bilibili AI 内容可选中复制
// @name:zh-cn   bilibili AI 内容可选中复制
// @version      1.0.5
// @namespace    https://github.com/aboutmydreams
// @homepage     https://github.com/aboutmydreams
// @author       Diven
// @description  Copying Bilibili AI generated content
// @description:zh-cn Bilibili AI 生成内容可复制
// @match        https://www.bilibili.com/*
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/481312/bilibili%20AI%20%E5%86%85%E5%AE%B9%E5%8F%AF%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481312/bilibili%20AI%20%E5%86%85%E5%AE%B9%E5%8F%AF%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
  // 定义一个函数来执行复制操作
  function enableCopy() {
    // 获取所有具有特定类名的元素
    const elements = document.getElementsByClassName('resizable-component');

    // 遍历所有找到的元素
    for (let i = 0; i < elements.length; i++) {
      // 设置 user-select 属性为 auto
      elements[i].style.userSelect = 'auto';
    }

    // 获取所有具有特定类名的元素
    const elements2 = document.getElementsByClassName('ai-summary-popup');

    // 遍历所有找到的元素
    for (let i = 0; i < elements2.length; i++) {
      // 设置 user-select 属性为 auto
      elements2[i].style.userSelect = 'auto';
    }
  }

  // 设置定时器，每秒执行一次 enableCopy 函数
  setInterval(enableCopy, 1000);
})();