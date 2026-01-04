// ==UserScript==
// @name         修复NGA论坛shift+方向键失效的bug
// @namespace    通过微软new bing AI实现，对话见https://sl.bing.net/jevLvKdJjNs
// @version      1.0
// @description  Fix the bug that prevents users from selecting text with Shift and arrow keys on NGA forum
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480871/%E4%BF%AE%E5%A4%8DNGA%E8%AE%BA%E5%9D%9Bshift%2B%E6%96%B9%E5%90%91%E9%94%AE%E5%A4%B1%E6%95%88%E7%9A%84bug.user.js
// @updateURL https://update.greasyfork.org/scripts/480871/%E4%BF%AE%E5%A4%8DNGA%E8%AE%BA%E5%9D%9Bshift%2B%E6%96%B9%E5%90%91%E9%94%AE%E5%A4%B1%E6%95%88%E7%9A%84bug.meta.js
// ==/UserScript==

//获取原来的postfunc.inputchar函数
var originalInputChar = postfunc.inputchar;

//重写postfunc.inputchar函数
postfunc.inputchar = function(e,o) {
  //如果用户按下的是Shift或者Ctrl或者Alt键，就不执行后面的操作
  if (e.shiftKey || e.ctrlKey || e.altKey) return;

  //如果用户按下的是方向键，也不执行后面的操作
  if (e.keyCode >= 37 && e.keyCode <= 40) return;

  //调用原来的postfunc.inputchar函数
  originalInputChar.call(this, e, o);
}