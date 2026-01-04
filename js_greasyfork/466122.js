// ==UserScript==
// @name        查看票价
// @namespace    pj
// @version      1.1
// @description  查看票价12306
// @author       12306查看票价
// @license GPL-3.0-or-later
// @match        *://kyfw.12306.cn/otn/leftTicket/*
// @downloadURL https://update.greasyfork.org/scripts/466122/%E6%9F%A5%E7%9C%8B%E7%A5%A8%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/466122/%E6%9F%A5%E7%9C%8B%E7%A5%A8%E4%BB%B7.meta.js
// ==/UserScript==



function clickButtons() {
  var elements = document.querySelectorAll('span.lookup b[title="查看票价"]');

  if (elements.length === 0) {
    console.log("没有找到任何 查看票价 按钮，将在5秒后重新查找");
    setTimeout(clickButtons, 5000);
    return;
  }

  for (var i = 0; i < elements.length; i++) {
    elements[i].click();
      setTimeout(function () {}, 1000);
  }
   console.log("等待三秒后进行下一次任务");
  setTimeout(clickButtons, 3000);
}

clickButtons();
