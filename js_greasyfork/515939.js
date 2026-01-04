// ==UserScript==
// @name         使用 Ctrl+Alt+V 上传到屋舍图床并在NodeSeek插入md链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用 Ctrl+Alt+V 上传到屋舍图床并在NodeSeek插入md链接的脚本
// @author       WiseScripts
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/515939/%E4%BD%BF%E7%94%A8%20Ctrl%2BAlt%2BV%20%E4%B8%8A%E4%BC%A0%E5%88%B0%E5%B1%8B%E8%88%8D%E5%9B%BE%E5%BA%8A%E5%B9%B6%E5%9C%A8NodeSeek%E6%8F%92%E5%85%A5md%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/515939/%E4%BD%BF%E7%94%A8%20Ctrl%2BAlt%2BV%20%E4%B8%8A%E4%BC%A0%E5%88%B0%E5%B1%8B%E8%88%8D%E5%9B%BE%E5%BA%8A%E5%B9%B6%E5%9C%A8NodeSeek%E6%8F%92%E5%85%A5md%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.addEventListener('keyup', doc_keyUp, false);
  async function doc_keyUp(event) {
    if (event.altKey && event.ctrlKey && event.code == "KeyV") {
      handlePaste();
    }
  }

  async function handlePaste() {
    let imageFiles = [];
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type.indexOf('image/') !== -1) {
          let blob = await clipboardItem.getType(type);
          imageFiles.push(blob);
        }
      }
    }

    if (imageFiles.length > 0) {
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
            mscAlert('图片上传成功，但未获取到Markdown链接');
          }
          resolve();
        },
        onerror: (error) => {
          mscAlert('图片上传遇到错误，请检查网络或稍后重试。');
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