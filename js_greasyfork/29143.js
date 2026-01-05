// ==UserScript==
// @name        知乎_问题_自动点击“更多”按钮
// @namespace   zhihu
// @include     https://www.zhihu.com/question/*
// @version     1
// @grant       none
// @description 知乎_问题_每隔5秒点击“更多”按钮，显示更多答案
// @downloadURL https://update.greasyfork.org/scripts/29143/%E7%9F%A5%E4%B9%8E_%E9%97%AE%E9%A2%98_%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E6%9B%B4%E5%A4%9A%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/29143/%E7%9F%A5%E4%B9%8E_%E9%97%AE%E9%A2%98_%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E6%9B%B4%E5%A4%9A%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

function clickbutton() {
  var buttonone = document.getElementsByClassName("Button QuestionMainAction")
  var i;
    for (i = 0; i < buttonone.length; i++) {
        buttonone[i].click();
    }
}
setInterval(clickbutton, 5000);
