// ==UserScript==
// @name         剪贴板净化助手
// @namespace    https://github.com/Abdurihim
// @version      0.2
// @description  清除在复制的时候添加的一些个人信息，目前支持所有的网站，包括牛客网,Leetcode,掘金，知乎、简书、csdn、实验楼等
// @author       Abdurihim
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/443306/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%87%80%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443306/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%87%80%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
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
