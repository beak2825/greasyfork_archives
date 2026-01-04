// ==UserScript==
// @name         liblib comfyUI 打开设置面板后，快捷键切换深色浅色。
// @namespace    http://leizingyiu.net/
// @version      20250508
// @description  liblib comfyUI cmd+, 打开设置，然后 opt + w 切换到浅色模式 , opt + b 切换到深色模式
// @author       leizingyiu
// @match        http*://comfy.liblib.art/*
// @grant        none
// @license     GNU AGPLv3

// @downloadURL https://update.greasyfork.org/scripts/535319/liblib%20comfyUI%20%E6%89%93%E5%BC%80%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%E5%90%8E%EF%BC%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%88%87%E6%8D%A2%E6%B7%B1%E8%89%B2%E6%B5%85%E8%89%B2%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/535319/liblib%20comfyUI%20%E6%89%93%E5%BC%80%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%E5%90%8E%EF%BC%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%88%87%E6%8D%A2%E6%B7%B1%E8%89%B2%E6%B5%85%E8%89%B2%E3%80%82.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function sequentialClickAndWait(...selectors) {
    let delay = Math.floor(Math.random() * 1000);

    if (selectors.length > 0) {
      const last = selectors[selectors.length - 1];
      if (!isNaN(Number(last))) {
        delay = Number(last);
        selectors.pop();
      }
    }

    function clickNext(index) {
      if (index >= selectors.length) {
        console.log("全部完成");
        return;
      }

      const selector = selectors[index];
      if (selector == null) {
        console.log(`第 ${index} 个 selector 是 null，跳过`);
        clickNext(index + 1);
        return;
      }

      const el = document.querySelector(selector);
      if (el) {
        console.log(`点击第 ${index} 个: ${selector}`);
        el.click();
      } else {
        console.warn(`第 ${index} 个 selector 没找到: ${selector}`);
      }

      setTimeout(() => {
        clickNext(index + 1);
      }, delay);
    }

    clickNext(0);
  }

  document.addEventListener("keydown", function (event) {
    if (event.altKey && event.code === "KeyW") {
      sequentialClickAndWait(
        ".p-listbox-list li:nth-child(3)",
        "div.p-message-content>div>div>div>div>span",
        ".p-select-list>li:nth-child(2)",
      );
    }

    if (event.altKey && event.code === "KeyB") {
      sequentialClickAndWait(
        ".p-listbox-list li:nth-child(3)",
        "div.p-message-content>div>div>div>div>span",
        ".p-select-list>li:nth-child(1)",
      );
    }
  });
})();
