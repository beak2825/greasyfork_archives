// ==UserScript==
// @name         掘金写文章预览放大
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  掘金写文章预览放大，方便保存PDF打印
// @author       tcatche
// @match        https://juejin.cn/editor/drafts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442908/%E6%8E%98%E9%87%91%E5%86%99%E6%96%87%E7%AB%A0%E9%A2%84%E8%A7%88%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/442908/%E6%8E%98%E9%87%91%E5%86%99%E6%96%87%E7%AB%A0%E9%A2%84%E8%A7%88%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .print-preview #juejin-web-editor {
      display: none;
    }
    .print-preview .bytemd-preview {
      background: #fff;
      width: 100% !important;
    }
    .print-preview .bytemd-preview .markdown-body {
      margin: 0 auto;
      max-width: unset;
      padding: 16px 48px;
    }
  `
  document.body.appendChild(style)

  setTimeout(() => {
    let node;
    document.body.addEventListener('click', (evt) => {
      if (!evt.target.closest('.bytemd-preview')) {
        return;
      }
      if (evt.ctrlKey) {
        document.body.classList.toggle('print-preview');
        if (node) {
          node.remove();
          node = null;
        } else {
          node = document.querySelector('.bytemd-preview').cloneNode(true);
          document.body.appendChild(node);
        }
      }
    })
  }, 2000)
})();