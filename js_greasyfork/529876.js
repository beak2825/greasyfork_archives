// ==UserScript==
// @name         B站搜索框PlaceHolder清空锁定
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  锁定指定搜索框的placeholder为空且不可修改
// @author       YILS
// @license      MIT
// @match        *://bilibili.com/*
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529876/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86PlaceHolder%E6%B8%85%E7%A9%BA%E9%94%81%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/529876/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86PlaceHolder%E6%B8%85%E7%A9%BA%E9%94%81%E5%AE%9A.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 锁定placeholder的核心逻辑
  const lockPlaceholder = (input) => {
    // 立即清空已有placeholder
    input.removeAttribute("placeholder");
    input.placeholder = "";

    // 锁定属性防止修改
    Object.defineProperty(input, "placeholder", {
      value: "",
      writable: false,
      configurable: false,
    });

    // 拦截setAttribute方法
    const originalSetAttribute = input.setAttribute.bind(input);
    input.setAttribute = function (name) {
      if (name.toLowerCase() === "placeholder") return;
      originalSetAttribute.apply(this, arguments);
    };
  };

  // 执行锁定操作
  const interval = setInterval(() => {
    const targetInput = document.querySelector(".nav-search-input");
    if (targetInput) {
      lockPlaceholder(targetInput);
      clearInterval(interval);
    }
  }, 100);
})();
