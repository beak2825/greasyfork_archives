// ==UserScript==
// @name         米游社帖子图片链接提取
// @namespace    https://github.com/shangxueink
// @version      1.4
// @description  提取米游社帖子中的图片链接
// @author       shangxueink
// @match        https://www.miyoushe.com/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @homepageURL  https://github.com/koakuuma/tampermonkey-scripts
// @supportURL   https://github.com/koakuuma/tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/494318/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494318/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
// 米游社帖子图片链接提取
// 提取米游社帖子中的图片链接

(function () {
  'use strict';

  function extractAndDownloadUrls() {
    // 更新选择器以匹配包含图片的元素
    const imgElements = document.querySelectorAll('div.mhy-img-article img');
    // 提取图片URL并移除查询字符串
    const urls = Array.from(imgElements).map(img => {
      const url = img.getAttribute('src');
      return url ? url.split('?')[0] : '';
    }).filter(url => url !== '');
    if (urls.length === 0) {
      alert('没有找到任何图片链接。');
      return;
    }
    if (confirm(`共找到了${urls.length}个图片链接，是否下载链接信息？`)) {
      downloadUrls(urls);
    }
  }
  function downloadUrls(urls) {
    const urlText = urls.join('\n');
    const blob = new Blob([urlText], {
      type: 'text/plain'
    });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'miyoushe_img_urls.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  }
  function createExtractButton() {
    const button = document.createElement('button');
    button.textContent = '提取图片链接';
    button.style.cssText = `
        position: fixed;
        top: 70px;
        left: 15%;
        transform: translateX(-50%);
        z-index: 1000;
        width: 120px;
        height: 60px;
        background-color: #53489c;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px; 
        `;
    button.onclick = extractAndDownloadUrls;
    document.body.appendChild(button);
  }
  window.addEventListener('load', createExtractButton);
})();
/******/ })()
;