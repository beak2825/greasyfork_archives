// ==UserScript==
// @name         acwing题解增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  增强AcWing白嫖党的使用体验，添加跳转bing搜索洛谷和跳转题解功能
// @author       You
// @match        https://www.acwing.com/problem/*
// @icon         https://www.acwing.com/static/web/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462334/acwing%E9%A2%98%E8%A7%A3%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/462334/acwing%E9%A2%98%E8%A7%A3%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 找到页面中唯一的table元素
const table = document.querySelector('table');

// 找到table中所有的a标签
const links = table.querySelectorAll('a');

// 设置新标签页打开所有链接
links.forEach(link => {
  link.target = '_blank';

  // 创建一个新的a标签
  const bingLink = document.createElement('a');

  // 设置href属性
  bingLink.href = `https://www.bing.com/search?q=%E6%B4%9B%E8%B0%B7${link.innerText}`;

  // 设置内容
  bingLink.innerHTML = '&nbsp;&nbsp;跳转洛谷 ';

  // 在原先的a标签后面添加bingLink，并且在它们之间添加两个空格
  link.parentNode.insertBefore(bingLink, link.nextSibling);
  link.parentNode.insertBefore(document.createTextNode('  '), bingLink);

  // 创建一个新的a标签
  const acwingLink = document.createElement('a');

  // 设置href属性
  acwingLink.href = `https://www.acwing.com/solution/search/1/?search_content=${link.innerText}`;

  // 设置内容
  acwingLink.innerHTML = '&nbsp;&nbsp;跳转题解 ';

  // 在bingLink后面添加acwingLink，并且在它们之间添加两个空格
  bingLink.parentNode.insertBefore(acwingLink, bingLink.nextSibling);
  bingLink.parentNode.insertBefore(document.createTextNode('  '), acwingLink);
});
})();