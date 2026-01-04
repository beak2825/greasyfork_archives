// ==UserScript==
// @name         南京大学教务网课程评估自动好评
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动好评
// @author       njuer
// @match        https://ehallapp.nju.edu.cn/jwapp/sys/wspjyyapp/*default/index.do?*
// @icon         https://www.nju.edu.cn/images/favicon.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471129/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%BD%91%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/471129/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%BD%91%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
function selectElementsWithText(text) {
  const inputElements = document.querySelectorAll('input[type="radio"]');
  for (const inputElement of inputElements) {
    if (inputElement.dataset.xDafxsm === text) {
      inputElement.checked = true;
    }
  }
}

// 调用函数并传入需要识别的文本
const targetText = "很好";
setInterval(() => selectElementsWithText(targetText), 1000); // 每隔1秒执行一次

})();