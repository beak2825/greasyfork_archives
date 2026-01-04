// ==UserScript==
// @name         CoverMore辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  CoverMore的辅助小工具
// @author       EchoJ
// @include      *insurance*
// @include      *covermore*
// @include      *celebritycruises*
// @include      *local*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499553/CoverMore%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/499553/CoverMore%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 创建一个悬浮按钮
  function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.position = 'fixed';

    // 计算 bottom 和 right 的值
    const numButtons = document.querySelectorAll('.echo-j-button').length;
    const bottom = 50 + numButtons * 60 + 'px';
    const right = '20px';

    button.style.bottom = bottom;
    button.style.right = right;
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', clickHandler);

    // 添加类名 "echo-j-button"
    button.classList.add('echo-j-button');
    document.body.appendChild(button);
  }

  // 复制文本到剪贴板
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        Swal.fire({
          icon: 'success',
          title: text + ' 已复制',
          showConfirmButton: false,
          timer: 1500
        });
      }).catch(function (error) {
        console.error('复制失败: ', error);
        Swal.fire({
          icon: 'error',
          title: '复制失败',
          showConfirmButton: false,
          timer: 1500
        });
      });
    } else {
      // 兼容不支持 Clipboard API 的旧浏览器
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      Swal.fire({
        icon: 'success',
        title: text + ' 已复制',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  // 获取 recallID 值方法
  function getRecallID() {
    const recallElement = document.getElementById('recallID');
    if (recallElement) {
      return recallElement.value;
    } else {
      return 'Nil';
    }
  }

  // 复制 recallID 值方法
  function copyRecallID() {
    const recallID = getRecallID();
    if (recallID && recallID !== 'Nil') {
      copyToClipboard(recallID);
    } else {
      Swal.fire({
        icon: 'error',
        title: '未找到 recall ID',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  // 生成链接方法
  function copyRecallLink() {
    const recallID = getRecallID();
    if (recallID && recallID !== 'Nil') {
      const currentURL = window.location.origin; // 获取协议和域名部分
      const recallLink = `${currentURL}/recall-quote?recallID=${recallID}`;
      copyToClipboard(recallLink);
    } else {
      Swal.fire({
        icon: 'error',
        title: '未找到 recall ID',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  // 获取 Site ID 值方法
  function getSiteID() {
    const linkElements = document.querySelectorAll('script');
    const pattern = /\/sites\/g\/files\/xfwnwa(\d+)/;
    let siteID = 'Nil';
    for (let index = 0; index < linkElements.length; index++) {
      if (!linkElements[index].hasAttribute('src')) {
        continue;
      }
      const href = linkElements[index].getAttribute('src');
      const match = href.match(pattern);
      if (match) {
        // 提取数字部分
        siteID = match[1];
        break;
      }
    }
    return siteID;
  }

  // 复制 recallID 值方法
  function copySiteID() {
    const siteID = getSiteID();
    if (siteID && siteID !== 'Nil') {
      copyToClipboard(siteID);
    } else {
      Swal.fire({
        icon: 'error',
        title: '未找到 site ID',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }


  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // 确保在脚本加载完成后执行回调函数
    script.onload = function () {
      callback();
    };

    // 将脚本添加到文档的 <head> 中
    document.head.appendChild(script);
  }

  function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    // 将样式表添加到文档的 <head> 中
    document.head.appendChild(link);
  }

  loadCSS('https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css');
  loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11', function () {
    console.log('SweetAlert2 已加载');
    // 创建生成链接按钮
    createButton('复制 recall-v2 链接', copyRecallLink);

    // 创建复制 recallID 值按钮
    createButton('复制 recallID: ' + getRecallID(), copyRecallID);

    // 创建复制 siteID 值按钮
    createButton('复制 siteID: ' + getSiteID(), copySiteID);
  });

})();
