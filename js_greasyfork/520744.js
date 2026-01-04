// ==UserScript==
// @name - dadagui
// @namespace tytyty
// @version 1.0
// @description dadagui
// @author tuyun
// @match http://www.dadagui.la/*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/520744/-%20dadagui.user.js
// @updateURL https://update.greasyfork.org/scripts/520744/-%20dadagui.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 选择要移除的元素
    // 获取所有页面元素
const elements = document.querySelectorAll('*');

    // 移除元素
    function removeElements() {
        elements.forEach(element => {
  const zIndex = window.getComputedStyle(element).zIndex;
  if (zIndex === '100' || zIndex==='10') {
    element.remove(); // 设置 display 为 none，隐藏元素
  }
});
    }
 
     // 在页面加载完成后执行

       
         // 在页面加载完成后执行
        removeElements();
   
 


 

   

})();
 