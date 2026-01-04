// ==UserScript==
// @name         清除TAPD弹窗
// @namespace    http://tampermonkey.net/
// @version      2025-06-10
// @description  清除TAPD人员上限弹窗
// @author       th
// @match        https://www.tapd.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538984/%E6%B8%85%E9%99%A4TAPD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/538984/%E6%B8%85%E9%99%A4TAPD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 创建观察器实例
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // 处理 .company-renew-dialog
        if (
          node.matches(".company-renew-dialog") ||
          node.querySelector(".company-renew-dialog")
        ) {
          // 尝试点击关闭按钮
          const closeBtn = node.querySelector(".el-dialog__headerbtn");
          if (closeBtn) {
            closeBtn.click();
          } else {
            // 没有按钮就直接移除
            const dialog = node.matches(".company-renew-dialog")
              ? node
              : node.querySelector(".company-renew-dialog");
            dialog?.remove();
          }
        }
      }
    }
  });

  // 观察整个 body 下的子元素添加
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 可选：页面已加载时也检查一次（防止已经存在弹窗）
  window.addEventListener("DOMContentLoaded", () => {
    const dialog = document.querySelector(".company-renew-dialog");
    if (dialog) {
      const closeBtn = dialog.querySelector(".el-dialog__headerbtn");
      if (closeBtn) {
        closeBtn.click();
      } else {
        dialog.remove();
      }
    }
  });
})();
