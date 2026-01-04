// ==UserScript==
// @name         ctrl+enter发送chatgpt请求
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在平板模式下可以按ctrl+enter发送chatgpt请求
// @author       You
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464665/ctrl%2Benter%E5%8F%91%E9%80%81chatgpt%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/464665/ctrl%2Benter%E5%8F%91%E9%80%81chatgpt%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==


(function() {
  'use strict';
  document.addEventListener('keydown', function(event) {
  // 判断是否按下了 Ctrl 和 Enter 键
  if (event.ctrlKey && event.keyCode == 13) {
    // 执行操作
    let submitButtom = document.getElementsByTagName("polygon")[0].parentElement.parentElement;
     if(submitButtom.disabled === false){
         submitButtom.click();
     }
  }
});
})();
