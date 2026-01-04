// ==UserScript==
// @name         净化剪贴板
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  从 xxx 网站复制的文字都会被加上版权声明，这个脚本会去除这个版权声明
// @author       Miroxyz
// @match        *://*.bilibili.com/*
// @match        *://*.juejin.cn/*
// @match        *://*.leetcode-cn.com/*
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432602/%E5%87%80%E5%8C%96%E5%89%AA%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/432602/%E5%87%80%E5%8C%96%E5%89%AA%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("copy", function (e) {
    e.preventDefault();
    var copytext = window.getSelection().toString();
    navigator.clipboard.writeText(copytext).then(
      function () {
        /* clipboard successfully set */
      },
      function () {
        /* clipboard write failed */
      }
    );
  });
})();
