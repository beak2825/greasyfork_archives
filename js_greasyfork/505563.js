// ==UserScript==
// @name         自动收集4everland
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动收集4everland积分
// @author       CaloxNg
// @license      GPL-v3.0
// @include      /https://dashboard.4everland.org/boost/
// @match        *://*/*
// @icon         https://img.alicdn.com/imgextra/i4/O1CN01FOwagl1XBpyVA2QVy_!!6000000002886-2-tps-512-512.png
// @run-at      document-start
// @grant       unsafeWindow
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/505563/%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%864everland.user.js
// @updateURL https://update.greasyfork.org/scripts/505563/%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%864everland.meta.js
// ==/UserScript==


; (function () {
  window.onload = function () {
    let myInterval = setInterval(myFunction, 10000);
    // 在合适的时候清除定时器
    // function clearTimer() {
    //   clearInterval(myInterval);
    //   console.log('定时器已清除');
    // }
    function myFunction() {
      // 获取目标<span>标签
      let spanElement = document.querySelector('span.mr-1');

      if (spanElement) {
        // 获取标签内的文本内容并分割以提取数字值
        let valueStrings = spanElement.textContent.trim().split('/');
        if (valueStrings.length > 1) {
          // 尝试将第一个分割后的字符串转换为数字
          let value = parseFloat(valueStrings[0]);
          if (!isNaN(value) && value > 7899) {
            // 如果值大于7899，则模拟点击事件
            spanElement.click();
            console.log(`标签被点击，因为其值为: ${value}`);
          } else {
            console.log(`标签的值为 ${value}，未点击。`);
          }
        } else {
          console.error("未找到适当的分割值");
        }
      } else {
        console.error("未找到指定的<span>标签");
      }
    }

  }
})();

