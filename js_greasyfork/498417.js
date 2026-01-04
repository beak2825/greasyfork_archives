// ==UserScript==
// @name         控制台日志记录
// @namespace    .
// @version      
// @description  通过重写控制台方法禁用控制台日志记录
// @author       *
// @run-at       document-end
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498417/%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/498417/%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 遍历控制台对象的所有方法
  for (var method in console) {
    // 检查当前属性是否是一个函数
    if (typeof console[method] === 'function') {
      // 如果是函数，将其重写为空函数，以禁用日志记录
      console[method] = function() {};
    }
  }
})();
