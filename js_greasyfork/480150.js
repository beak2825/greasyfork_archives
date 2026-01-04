// ==UserScript==
// @name         icloudnative工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除掉页面中一些效果
// @author       You
// @match        https://icloudnative.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icloudnative.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480150/icloudnative%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480150/icloudnative%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";
  $("body").off("click");
  var originalTitle = document.title;
  // 创建一个新的 style 元素
  var style = document.createElement("style");
  style.type = "text/css";

  // 添加 CSS 规则
  style.innerHTML = ".pace-active { display: none;!important }";
  console.log("style", style);

  // 将 style 元素添加到文档的 head 中
  document.head.appendChild(style);

  setTimeout(() => {
    Object.defineProperty(document, "title", {
      get: function () {
        return originalTitle;
      },
      set: function (newTitle) {
        console.log("尝试修改标题为: " + newTitle);
        // 在这里可以决定是否允许修改
        // 例如，通过条件判断来决定是否赋值
        // originalTitle = newTitle; // 取消注释这行代码以允许修改
      },
    });
  }, 2000);
  // Your code here...
})();
