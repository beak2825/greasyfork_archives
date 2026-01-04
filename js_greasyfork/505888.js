// ==UserScript==
// @name         洛谷安全访问中心自动跳转
// @namespace    https://www.luogu.com.cn
// @description  当触发洛谷安全访问中心时，自动跳转到相应页面
// @author       uzxn
// @version      1.1
// @match        https://www.luogu.com.cn/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505888/%E6%B4%9B%E8%B0%B7%E5%AE%89%E5%85%A8%E8%AE%BF%E9%97%AE%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/505888/%E6%B4%9B%E8%B0%B7%E5%AE%89%E5%85%A8%E8%AE%BF%E9%97%AE%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

let elem = document.getElementById('url');
if (elem != null) {
  window.location.replace(elem.innerHTML);
}

window.onload = function () {
  'use strict';
  // 目标元素
  let target = document.getElementById('app');
  // 创建一个 MutationObserver 实例
  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      let t = document.getElementById('url');
      if (t != null) window.location.replace(t.innerHTML);
    });
  });
  // 配置观察选项
  let config = {
    attributes: true, childList: true, subtree: true
  };
  // 开始观察目标元素
  observer.observe(target, config);
};