// ==UserScript==
// @name         b站页面元素修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除b站页面元素
// @author       https://github.com/ChaunceyBai98
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/464456/b%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/464456/b%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

  function removeNodesWithClasses(params) {
    var nodesToRemove1 = document.querySelectorAll(params);
    if (nodesToRemove1.length > 0) {
      nodesToRemove1.forEach(node => node.remove());
      setTimeout(removeNodesWithClasses(params), 2000);
    }
  }
let count = 0
let t = setInterval(function () {
    count+=1;
  //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
    var nodesToRemove2 = document.querySelectorAll('.con');
    if (nodesToRemove2.length > 0 || count>5) {
      nodesToRemove2.forEach(node => node.remove());
      clearInterval(t); //清除循环定时器
      count = 0;
    }
}, 1000)

removeNodesWithClasses('.mini-header, .m-header, .mini-type');

function delayedFunction() {
  setTimeout(function() {
      removeNodesWithClasses('.change-btn');
  }, 1000);
}
delayedFunction();

    // Your code here...
})();