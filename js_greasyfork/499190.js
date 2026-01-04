// ==UserScript==
// @name         学习通答案隐藏显示切换
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0.1
// @description  工具类
// @author       zhaozihao
// @match        *://*.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499190/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AD%94%E6%A1%88%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/499190/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AD%94%E6%A1%88%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(() => {
  // 创建按钮并设置其属性
  var button = document.createElement("button");
  button.id = "toggleButton";
  button.textContent = "切换模式";
  button.style.position = "fixed";
  button.style.top = 0;
  button.style.right = 0;
  button.style.zIndex = 999999;
  // 将按钮添加到页面
  document.body.appendChild(button);

  // 定义一个变量来追踪当前状态（显示或隐藏）
  var isHidden = false;
  const switchHidden = function () {
    // 获取所有类名为 'mark_answer' 的元素
    var elements = document.querySelectorAll(".mark_answer");

    // 遍历这些元素并根据当前状态显示或隐藏它们
    elements.forEach(function (element) {
      if (isHidden) {
        element.style.visibility = "visible";
      } else {
        element.style.visibility = "hidden";
      }
    });

    // 切换当前状态
    isHidden = !isHidden;
  };
  // 为按钮添加点击事件监听器
  button.addEventListener("click", switchHidden);
  document.addEventListener("keydown", (e) => {
    if (e.code == "KeyX") {
      switchHidden();
    }
  });
})();


