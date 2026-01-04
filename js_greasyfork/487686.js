// ==UserScript==
// @name         Hostloc自动上传到屋舍图床并插入BB链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在hostloc.com的论坛中自动上传图片到图床并插入BB链接
// @author       WiseScripts
// @match        *://*.hostloc.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/487686/Hostloc%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%88%B0%E5%B1%8B%E8%88%8D%E5%9B%BE%E5%BA%8A%E5%B9%B6%E6%8F%92%E5%85%A5BB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/487686/Hostloc%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%88%B0%E5%B1%8B%E8%88%8D%E5%9B%BE%E5%BA%8A%E5%B9%B6%E6%8F%92%E5%85%A5BB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
  'use strict';
  document.addEventListener('paste', (event) => handlePaste(event));
  async function handlePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let imageFiles = [];
    for (let item of items) {
      if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
        let blob = item.getAsFile();
        imageFiles.push(blob);
      }
    }
    if (imageFiles.length > 0) {
      event.preventDefault();
      for (let file of imageFiles) {
        let formData = new FormData();
        formData.append('file', file);
        await uploadToImageHost(formData);
      }
    }
  }

  function uploadToImageHost(formData) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://uhsea.com/Frontend/upload',
        data: formData,
        onload: (response) => {
          let jsonResponse = JSON.parse(response.responseText);
          if (response.status === 200 && jsonResponse && jsonResponse.data) {
            insertToEditor(jsonResponse.data);
          } else {
            alert('图片上传成功，但未获取到图片链接');
          }
          resolve();
        },
        onerror: (error) => {
          alert('图片上传遇到错误，请检查网络或稍后重试。');
          reject(error);
        }
      });
    });
  }

  function insertToEditor(Link) {
    let e = document.querySelector("#e_textarea")
    if (!e) {
      e = document.querySelector("#fastpostmessage")
    }
    if (e) {
      let bbLink = '[img]' + Link + '[/img]';
      GM_setClipboard(bbLink);
      e.setRangeText('\n' + bbLink + '\n');
    }
  }

})();