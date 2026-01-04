// ==UserScript==
// @license MIT
// @name         NodeSeek-PicGo图床（支持deepflood.com）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在nodeseek.com与deepflood.com的论坛中自动上传图片到PicGo并插入Markdown链接
// @author       https://www.nodeseek.com/space/1257#
// @match        https://www.nodeseek.com/*
// @match        https://www.deepflood.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/529221/NodeSeek-PicGo%E5%9B%BE%E5%BA%8A%EF%BC%88%E6%94%AF%E6%8C%81deepfloodcom%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529221/NodeSeek-PicGo%E5%9B%BE%E5%BA%8A%EF%BC%88%E6%94%AF%E6%8C%81deepfloodcom%EF%BC%89.meta.js
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
        await uploadToPicGo(file);
      }
    }
  }

  function uploadToPicGo(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64Data = reader.result.split(',')[1];
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://127.0.0.1:36677/upload',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ "image": base64Data }),
          onload: (response) => {
            console.log('PicGo Response:', response.responseText);
            let jsonResponse = JSON.parse(response.responseText);
            if (response.status === 200 && jsonResponse.success && jsonResponse.result.length > 0) {
              insertToEditor(jsonResponse.result[0]);
            } else {
              alert('图片上传失败，返回数据: ' + response.responseText);
            }
            resolve();
          },
          onerror: (error) => {
            alert('图片上传到 PicGo 失败，请确保 PicGo 处于运行状态');
            reject(error);
          }
        });
      };
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
