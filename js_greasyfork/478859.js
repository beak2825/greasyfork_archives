// ==UserScript==
// @name         🤗解除学校就业网输入框字数限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  仅适用于使用了就业宝系统的校园招生就业门户使用，破除输入框字数上限。
// @match        *://*.jiuyeb.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478859/%F0%9F%A4%97%E8%A7%A3%E9%99%A4%E5%AD%A6%E6%A0%A1%E5%B0%B1%E4%B8%9A%E7%BD%91%E8%BE%93%E5%85%A5%E6%A1%86%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/478859/%F0%9F%A4%97%E8%A7%A3%E9%99%A4%E5%AD%A6%E6%A0%A1%E5%B0%B1%E4%B8%9A%E7%BD%91%E8%BE%93%E5%85%A5%E6%A1%86%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 创建一个观察器来监视DOM更改
  var observer = new MutationObserver(function (mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type === "childList") {
        // 获取所有带有 maxlength 属性的输入框
        var inputFields = document.querySelectorAll("input[maxlength]");
        // 遍历输入框并将 maxlength 设置为 99999
        for (var i = 0; i < inputFields.length; i++) {
          inputFields[i].setAttribute("maxlength", "99999");
        }
        // 获取所有带有 maxlength 属性的 textarea
        var textareaFields = document.querySelectorAll("textarea[maxlength]");
        // 遍历 textarea 并将 maxlength 设置为 99999
        for (var i = 0; i < textareaFields.length; i++) {
          textareaFields[i].setAttribute("maxlength", "99999");
        }
      }
    }
  });

  // 开始观察整个文档树的变化
  observer.observe(document.body, { childList: true, subtree: true });
})();
