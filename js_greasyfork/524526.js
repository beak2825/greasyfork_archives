// ==UserScript==
// @license MIT
// @name         NodeSeek非官方图床
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在nodeseek.com的论坛中自动上传图片到疯子社图床并插入Markdown链接
// @author       ShaBiYun.com
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/524526/NodeSeek%E9%9D%9E%E5%AE%98%E6%96%B9%E5%9B%BE%E5%BA%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/524526/NodeSeek%E9%9D%9E%E5%AE%98%E6%96%B9%E5%9B%BE%E5%BA%8A.meta.js
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
        // Optional parameters can be added here as needed
        formData.append('format', 'json'); // Setting the return format to JSON
        await uploadToImageHost(formData);
      }
    }
  }

  function uploadToImageHost(formData) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://img.fengzishe.com/api.php', // 修改后的图床 API URL
        data: formData,
        onload: (response) => {
          let jsonResponse = JSON.parse(response.responseText);
          if (response.status === 200 && jsonResponse.code === 0 && jsonResponse.viewurl) {
            insertToEditor(jsonResponse.viewurl); // 使用返回的预览地址
          } else {
            mscAlert('图片上传成功，但未获取到Markdown链接');
          }
          resolve();
        },
        onerror: (error) => {
          mscAlert('图片上传错误');
          reject(error);
        }
      });
    });
  }

  function insertToEditor(Link) {
    const codeMirrorElement = document.querySelector('.CodeMirror');
    if (codeMirrorElement) {
      const codeMirrorInstance = codeMirrorElement.CodeMirror;
      if (codeMirrorInstance) {
        const cursor = codeMirrorInstance.getCursor();
        let markdownLink = '![](' + Link + ')';
        GM_setClipboard(markdownLink);
        codeMirrorInstance.replaceRange(markdownLink + '\n', cursor);
      }
    }
  }
})();