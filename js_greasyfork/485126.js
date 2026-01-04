// ==UserScript==
// @name         去除复制后的小尾巴
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  复制文字时自动去除网站自带的版权信息
// @author       leone
// @match        https://leetcode.cn/*
// @match        https://www.jianshu.com/p/*
// @match        https://www.bilibili.com/read/*
// @match        https://juejin.cn/post/*
// @match        https://www.acwing.com/file_system/file/content/whole/index/content/*
// @match        https://*.nowcoder.com/*
// @match        https://pkmer.cn/*
// @match        https://www.zhihu.com/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485126/%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%90%8E%E7%9A%84%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/485126/%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%90%8E%E7%9A%84%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function handleCopy(e) {
    e.stopPropagation();
    const copytext = window.getSelection();
    const clipdata = e.clipboardData || window.clipboardData;

    if (clipdata) {
      clipdata.setData("Text", copytext);
    }
  }

  document.addEventListener("copy", handleCopy, true);
})();