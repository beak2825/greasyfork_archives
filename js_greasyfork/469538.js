// ==UserScript==
// @name         Github助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在GitHub页面上添加了一个名为"Go Dev"的按钮，点击该按钮会将当前URL中的"github.com"修改为"github.dev"并在当前标签页打开新URL。
// @author       微笑
// @run-at       document-idle
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @changelog 新增了对页面上的时间标签的格式化处理
// @downloadURL https://update.greasyfork.org/scripts/469538/Github%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469538/Github%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 获取页面上的目标DOM节点
  var pageheadActions = document.querySelector('.pagehead-actions');

  // 创建一个li节点
  var liNode = document.createElement('li');

  // 设置li节点的innerHTML
  liNode.innerHTML =
    '<button class="js-toggler-target rounded-left-2 btn-sm btn BtnGroup-item">Go Dev</button>';

  // 将li节点插入到第一个位置
  pageheadActions?.insertBefore(liNode, pageheadActions.firstChild);

  // 添加点击事件处理程序
  liNode.addEventListener('click', function () {
    // 修改当前URL中的github.com为github.dev
    var currentUrl = window.location.href;
    var newUrl = currentUrl.replace('github.com', 'github.dev');
    // 在当前标签页打开新URL
    window.open(newUrl, '_self');
  });

  function formatDate(dateString) {
    // 创建 Date 对象并解析输入的日期字符串
    var date = new Date(dateString);

    // 提取日期和时间组件
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，因此需要+1，并确保两位数格式
    var day = ('0' + date.getDate()).slice(-2); // 确保两位数格式
    var hours = ('0' + date.getHours()).slice(-2); // 确保两位数格式
    var minutes = ('0' + date.getMinutes()).slice(-2); // 确保两位数格式
    var seconds = ('0' + date.getSeconds()).slice(-2); // 确保两位数格式

    // 拼接日期和时间组件，返回格式化后的字符串
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  const relativeTimes = document.querySelectorAll('relative-time');
  relativeTimes.forEach((relativeTime) => {
    const title = relativeTime.getAttribute('title');
    const formattedDate = formatDate(title);
    relativeTime.setAttribute('title', formattedDate);
  });
})();
