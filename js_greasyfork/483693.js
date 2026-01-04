// ==UserScript==
// @name         testBycxl
// @namespace    hello,cxl
// @version      0.01
// @description  用于在yu3.shop代理打开的Illution 网站下载对应的png资源
// @author       chenxinliang
// @include      *
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/483693/testBycxl.user.js
// @updateURL https://update.greasyfork.org/scripts/483693/testBycxl.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // Your code here...
    console.log("你好呀，欢迎参考我的第一个脚本!!")
//    alert("你好呀，欢迎参考我的第一个脚本!")
   // 获取包含所有元素的父容器
   const container = document.getElementsByTagName("body")

   // 添加点击事件监听器（事件委托）
   container.addEventListener("click", function(event) {
     // 使用事件对象的 target 属性获取点击的元素
     const clickedElement = event.target;

     // 打印点击的元素
     console.log("Clicked Element:", clickedElement);
   });
})();