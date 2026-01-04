// ==UserScript==
// @name         南信大学习通自动评教
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  南信大学习通自动评价，默认满分
// @author       沧浪之水
// @match        https://newes.chaoxing.com/pj/newesReception/*
// @icon         https://bulletin.nuist.edu.cn/_upload/tpl/00/7a/122/template122/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483497/%E5%8D%97%E4%BF%A1%E5%A4%A7%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/483497/%E5%8D%97%E4%BF%A1%E5%A4%A7%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
//默认开启了自动提交，把不喜欢的话自动提交下面的那行代码注释掉即可

(function() {
    'use strict';

    // 获取文档中的所有 input 元素
let inputs = document.querySelectorAll("input");

// 遍历所有 input 元素，检查其 type 属性是否为 text
for (let input of inputs) {
  if (input.type === "text") {
    // 该元素的 type 属性为 text
      input.value=10
      input.addEventListener("blur", () => {
    // 调用 parseIntssBlur() 函数
    parseIntssBlur(input);
  });
  }
}
// 获取提交按钮对象
let button = document.querySelector(".botBtnBox a[onclick='save(2);']");

// 模拟点击
button.click();

// 模拟提交
document.querySelectorAll(".layui-layer-btn0")[0].click();

})();