// ==UserScript==
// @name         HFUT Program
// @namespace    https://greasyfork.org/zh-CN/scripts/460368
// @version      0.2
// @description  合肥工业大学培养方案检查工具
// @author       xqm32
// @include      /^https?://jxglstu\.hfut\.edu\.cn/eams5-student/for-std/program-completion-preview/info/.*/
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460368/HFUT%20Program.user.js
// @updateURL https://update.greasyfork.org/scripts/460368/HFUT%20Program.meta.js
// ==/UserScript==

(function () {
  // 等待培养方案获取完毕
  setTimeout(() => {
    for (i of document.querySelectorAll("#course-info-table > tbody > tr > td"))
      if (i.textContent === "通过")
        i.parentElement.style.backgroundColor = "#aaeeee";
      else if (i.textContent === "在读")
        i.parentElement.style.backgroundColor = "#eeeeaa";
      else if (i.textContent === "未修")
        i.parentElement.style.backgroundColor = "#eeaaee";
  }, 1000)
})()