// ==UserScript==
// @name         按下ctrl+F键定位到伙伴网最上面的输入框
// @namespace    http://tampermonkey
// @version      1
// @description   按下ctrl+F键  定位到 伙伴网 最上面的输入框
// @match        http://pfg.officemate.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496763/%E6%8C%89%E4%B8%8Bctrl%2BF%E9%94%AE%E5%AE%9A%E4%BD%8D%E5%88%B0%E4%BC%99%E4%BC%B4%E7%BD%91%E6%9C%80%E4%B8%8A%E9%9D%A2%E7%9A%84%E8%BE%93%E5%85%A5%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/496763/%E6%8C%89%E4%B8%8Bctrl%2BF%E9%94%AE%E5%AE%9A%E4%BD%8D%E5%88%B0%E4%BC%99%E4%BC%B4%E7%BD%91%E6%9C%80%E4%B8%8A%E9%9D%A2%E7%9A%84%E8%BE%93%E5%85%A5%E6%A1%86.meta.js
// ==/UserScript==
document.addEventListener('keydown', function(event) {
  // 按下ctrl+f键
  if (event.ctrlKey && event.keyCode === 70) {
    // 定位到最上面的输入框
    var input = document.querySelector('input');
    if (input) {
      input.focus();
      event.preventDefault();
    }
  }
});