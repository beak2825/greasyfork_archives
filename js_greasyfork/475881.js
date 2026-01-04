// ==UserScript==
// @name         剪贴板版权信息去除
// @namespace    https://github.com/jin-lin0/tampermonkey-demo
// @version      0.4
// @description  2023/9/22 14:34:30
// @author       logyes
// @license      MPL-2.0

// @match        *://juejin.cn/*
// @match        *://leetcode.cn/*
// @match        *://*.jianshu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.zhihu.com/*
// @match        *://*.nowcoder.com/*
// @match        *://*.bilibili.com/read/*

// @run-at       document-start

// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475881/%E5%89%AA%E8%B4%B4%E6%9D%BF%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/475881/%E5%89%AA%E8%B4%B4%E6%9D%BF%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
  function getCopiedContent() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());
    return {
      text: range.toString(),
      html: container.innerHTML,
    };
  }

  document.addEventListener(
    "copy",
    function (e) {
      const copiedContent = getCopiedContent();
      if (copiedContent.text) {
        let clipboardData = e.clipboardData || window.clipboardData;
        clipboardData.setData("text/plain", copiedContent.text);
        clipboardData.setData("text/html", copiedContent.html);
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
})();
