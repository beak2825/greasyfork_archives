// ==UserScript==
// @name         编程猫绕屏蔽词
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  绕过编程猫屏蔽词限制
// @author       Fantasy
// @match        *://*.codemao.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510554/%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%BB%95%E5%B1%8F%E8%94%BD%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/510554/%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%BB%95%E5%B1%8F%E8%94%BD%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addZeroWidthChars(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const zeroWidthChar = '\u200B';
    function traverseAndModify(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.split('').map(char => char + zeroWidthChar).join('');
        } else {
            for (let child of node.childNodes) {
                traverseAndModify(child);
            }
        }
    }
    traverseAndModify(doc.body);
    return doc.body.innerHTML;
  }

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
      this._url = url;
      originalOpen.apply(this, arguments);
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(data) {
    // 如果 data 是 FormData，则不处理直接发送
    if (data instanceof FormData) {
      return originalSend.call(this, data);
    }

    let jsonData = null;
    try {
      if (typeof data === 'string') {
        jsonData = JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse JSON: ', e);
      return originalSend.call(this, data); // 如果解析失败，原样发送
    }

    // 根据URL修改相应的字段
    if (/^https:\/\/api\.codemao\.cn\/web\/forums\/boards\/\d+\/posts$/.test(this._url)) {
      jsonData.content = addZeroWidthChars(jsonData.content);
      jsonData.title = addZeroWidthChars(jsonData.title);
    }
    if (/^https:\/\/api-creation\.codemao\.cn\/kitten\/r2\/work\/\d+\/publish$/.test(this._url)) {
      jsonData.description = addZeroWidthChars(jsonData.description);
      jsonData.name = addZeroWidthChars(jsonData.name);
    }
    if (/^https:\/\/api\.codemao\.cn\/(?:web\/forums\/(posts|replies)\/\d+\/(replies|comments)|creation-tools\/v1\/works\/\d+\/comment)$/.test(this._url) || /^https:\/\/api\.codemao\.cn\/creation-tools\/v1\/works\/\d+\/comment\/\d+\/reply$/.test(this._url)) {
      jsonData.content = addZeroWidthChars(jsonData.content);
    }
    if (this._url.includes('https://api.codemao.cn/tiger/v3/web/accounts/info')) {
      jsonData.nickname = addZeroWidthChars(jsonData.nickname);
    }

    // 将修改后的jsonData重新转换成字符串
    data = JSON.stringify(jsonData);
    return originalSend.call(this, data);
  };
})();