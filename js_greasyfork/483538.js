// ==UserScript==
// @name         抖音增强脚本
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  功能1：只在当前标签打开新标签
// @author       kizj
// @match        *://live.douyin.com/*
// @grant        none
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/483538/%E6%8A%96%E9%9F%B3%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/483538/%E6%8A%96%E9%9F%B3%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...

  window.addEventListener('load',function(){

    // 功能1：只在当前标签打开新标签
    // 因为页面有动态生成的元素，所以延迟1000毫秒后执行
    setTimeout(function(){
      var arr = document.getElementsByTagName('a');
      var arrLength = arr.length;
      for (var i = 0; i < arrLength; i++) {
        arr[i].setAttribute("target","_self")
      }
      console.log("脚本执行完毕！当前修改" + arrLength + "个元素");
  }, 1000);

    // 功能2：
  })
})();