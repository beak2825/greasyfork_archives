// ==UserScript==
// @name         批量打开编辑按钮
// @namespace    http://your-namespace.com
// @version      1.0
// @description  在页面中创建一个按钮，用于批量点击具有"data-role"属性的<a>标签
// @match        *://searchstaff.alibaba.com/diagnosis/orderProductDetail*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466047/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BC%96%E8%BE%91%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/466047/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BC%96%E8%BE%91%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
  'use strict';

     var box = document.getElementById("diagnose-tab");
    var input = document.createElement("input");
    input.type = "button";
    input.id = "han"
    input.value = "批量点击"
    box.appendChild(input);
    document.getElementById("han").style.background="#fff";
    document.getElementById("han").style.borderColor = "#fffff";
    document.getElementById("han").style.border = "1px solid #1047f5";
    document.getElementById("han").style.color= "#1047f5";
    document.getElementById("han").style.display = "block";
    document.getElementById("han").style.width = "100px";
    document.getElementById("han").style.height = "32px";
    document.getElementById("han").style.borderRadius="18px";
    document.getElementById("han").style.marginTop="12px";
    document.getElementById("han").style.marginBottom="12px";
    document.getElementById("han").style.float="right";
    document.getElementById("han").onclick = function() {
        window.scrollTo(0,document.body.scrollHeight);}



  // 点击按钮时执行批量点击操作
  input.addEventListener('click', function() {
    // 获取所有具有"data-role"属性的<a>标签
    var elements = document.querySelectorAll('a[data-role="edit-single-product"]');

    // 遍历所有匹配的元素并模拟点击
    for (var i = 0; i < elements.length; i++) {
      elements[i].click();
    }
  });
})();
