// ==UserScript==
// @name         吾爱破解，屏蔽左右箭头←→翻页快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  from https://www.52pojie.cn/thread-1531229-1-1.html
// @author       You
// @match        https://www.52pojie.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474041/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%EF%BC%8C%E5%B1%8F%E8%94%BD%E5%B7%A6%E5%8F%B3%E7%AE%AD%E5%A4%B4%E2%86%90%E2%86%92%E7%BF%BB%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/474041/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%EF%BC%8C%E5%B1%8F%E8%94%BD%E5%B7%A6%E5%8F%B3%E7%AE%AD%E5%A4%B4%E2%86%90%E2%86%92%E7%BF%BB%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==
keyPageScroll = function(e, prev, next, url, page) {
  console.log('重写keyPageScroll，关闭翻页快捷键');
}