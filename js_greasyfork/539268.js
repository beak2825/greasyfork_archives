// ==UserScript==
// @name        kimi 加宽
// @namespace   Violentmonkey Scripts
// @match       https://www.kimi.com/**
// @grant       none
// @version     1.1
// @author      -
// @description 2025/6/13 15:05:37
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539268/kimi%20%E5%8A%A0%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/539268/kimi%20%E5%8A%A0%E5%AE%BD.meta.js
// ==/UserScript==

 // 创建一个 <style> 元素
window.onload=function(){
  const styleElement = document.createElement('style');

  // 定义要添加的CSS样式
  const cssText = `
      .chat-content-list {
          max-width: 98% !important;
      }
  `;

  // 将CSS样式设置为 <style> 元素的内容
  styleElement.textContent = cssText;

  // 将 <style> 元素添加到文档的 <head> 中
  document.head.appendChild(styleElement);
}