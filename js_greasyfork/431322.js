// ==UserScript==
// @name         恢复文本选择
// @namespace    https://github.com/yujinpan/tampermonkey-extension
// @version      1.1
// @license      MIT
// @description  解除文本选择的禁用。
// @author       yujinpan
// @include      http*://**
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/431322/%E6%81%A2%E5%A4%8D%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/431322/%E6%81%A2%E5%A4%8D%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(() => {
  const style = document.createElement('style');
  style.innerHTML = '*,*::after,*::before { user-select: auto !important; }';
  document.head.append(style);
})();