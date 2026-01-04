// ==UserScript==
// @name         FlowUs 外链自动跳转并删除弹窗
// @namespace    https://flowus.cn
// @version      1.1
// @description  自动跳过外链提示并移除 FlowUs 的安全警告弹窗
// @license MIT
// @match        https://flowus.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534965/FlowUs%20%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%B9%B6%E5%88%A0%E9%99%A4%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/534965/FlowUs%20%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%B9%B6%E5%88%A0%E9%99%A4%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 1. 拦截点击外链，直接新标签打开
  document.addEventListener(
    "click",
    function (e) {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.href;
      const isExternal =
        /^https?:\/\//.test(href) && !href.includes("flowus.cn");
      if (isExternal) {
        e.preventDefault();
        window.open(href, "_blank");
      }
    },
    true
  );

  // 2. 定时清除安全提示弹窗（id 精准匹配 modalContent）
  setInterval(() => {
    const modal = document.getElementById("modalContent");
    if (modal) {
      modal.remove();
      console.log("[FlowUs 脚本] 安全警告弹窗已自动移除");
    }
  }, 300); // 每 300ms 检查一次
})();
