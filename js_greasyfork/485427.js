// ==UserScript==
// @name         javdb自动点击想看
// @namespace    http://javdb.com/
// @version      1.1
// @description  在网页加载后自动点击指定按钮
// @author       xiaoxiao
// @match        *://javdb*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485427/javdb%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%83%B3%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/485427/javdb%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%83%B3%E7%9C%8B.meta.js
// ==/UserScript==

setInterval(function() {
    if (document.body.innerHTML.includes("Please take a rest.")) {
        location.reload();
    }
}, 1000); // 每1秒检查一次

(function() {
  'use strict';

  // 检测是否出现了成功标签和想看标签
  var successTag = document.querySelector('.tag.is-success.is-light');
  var wantToWatchTag = document.querySelector('.tag.is-info.is-light');

  if (successTag || wantToWatchTag) {
    // 关闭当前页面
    window.close();
  } else {
    // 获取想看按钮元素
    var wantToWatchButton = document.querySelector('.buttons .button_to button[data-disable-with="..."]');

    // 检查按钮是否存在
    if (wantToWatchButton) {
      // 模拟点击按钮
      simulateClick(wantToWatchButton);

      // 等待一定时间后刷新网页
      setTimeout(function() {
        window.location.reload();
      }, 1000);
    } else {
      console.error('无法找到想看按钮');
    }

    // 模拟鼠标点击事件
    function simulateClick(element) {
      var event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    }
  }
})();
