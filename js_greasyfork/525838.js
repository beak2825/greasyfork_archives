// ==UserScript==
// @name         javbus 快捷键
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  使用说明：下载封面：alt+s 复制番号：alt+c
// @author       You
// @match        https://www.javbus.com/*
// @match        https://www.buscdn.shop/*
// @match        https://www.javsee.ink/*
// @icon         https://www.javbus.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525838/javbus%20%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525838/javbus%20%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function showInfo(textContent, ms = 1200) {
    // 创建一个新的div元素，用于显示消息
    let messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed'; // 设置位置固定
    messageDiv.style.top = '10px'; // 从页面顶部距离10px开始
    messageDiv.style.right = '10px'; // 从页面右侧距离10px开始
    messageDiv.style.padding = '10px';
    messageDiv.style.backgroundColor = '#333';
    messageDiv.style.color = '#fff';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999'; // 确保消息显示在其他元素之上
    messageDiv.textContent = textContent; // 显示的消息内容

    // 将新创建的div添加到body中
    document.body.appendChild(messageDiv);

    setTimeout(() => {
      // 删除消息
      document.body.removeChild(messageDiv);
    }, ms);
  }

  function getAvCode() {
    return document.querySelector(
      'body > div.container > div.row.movie > div.info > p:nth-child(1) span:nth-child(2)'
    ).innerText;
  }

  async function copyAvCode() {
    try {
      const avCode = getAvCode();
      await navigator.clipboard.writeText(avCode);
      showInfo(`已复制 ${avCode}`);
    } catch (error) {
      showInfo(error);
    }
  }

  async function downloadCover() {
    const avCode = getAvCode();
    const imgElement = document.querySelector(
      'body > div.container > div.row.movie img'
    );
    if (!imgElement) {
      showInfo('没有找到匹配的img标签');
      return;
    }
    const imageUrl = imgElement.src;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = avCode;
    showInfo(`封面开始下载 ${avCode}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  document.addEventListener('keydown', function (event) {
    if (event.altKey && (event.key === 'c' || event.key === 'C')) {
      copyAvCode();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.altKey && (event.key === 's' || event.key === 'S')) {
      downloadCover();
    }
  });
})();
