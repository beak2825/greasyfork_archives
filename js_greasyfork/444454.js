// ==UserScript==
// @name         Better竹马
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除竹马法考答案解析页面两侧的空白，有效利用宽屏显示器，客观题界面添加选项字母作为其快捷键，方便用户快速选择。
// @author       You
// @include      https://www.zhumavip.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/444454/Better%E7%AB%B9%E9%A9%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444454/Better%E7%AB%B9%E9%A9%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(".inner, #container{width:99% !important;}");
  GM_addStyle(
    ".topicSubject, #container{width:100% !important; float: none !important;}"
  );
  GM_addStyle(".layered, #container{height:100% !important;}");
  GM_addStyle(".titlebarlist, #container{width:770px !important;}");
  GM_addStyle(".subject, #container{width:770px !important;}");
})();

(function () {
  "use strict";
  // JS监听键盘快捷键并自动点击按钮
  document.addEventListener("keydown", function (event) {
    var answers = document.getElementsByName("checkboxselectanwsers");
    if (answers.length == 0) {
      answers = document.getElementsByName("questionradio");
    }
    var markedCheckBox = document.getElementsByName("markedcheckbox")[0];
    var prev = document.getElementsByClassName("question-prev-next-btn")[0];
    var next = document.getElementsByClassName("question-prev-next-btn")[1];
    var submit = document.getElementsByClassName("mokao-do-jiaojuan-box")[0];
    switch (event.keyCode) {
      case 65:
        answers[0].click(); // A
        break;
      case 66:
        answers[1].click(); // B
        break;
      case 67:
        answers[2].click(); // C
        break;
      case 68:
        answers[3].click(); // D
        break;
      case 70:
        markedCheckBox.click(); // F
        break;
      case 83:
        submit.click(); // S
        break;
      case 37:
        prev.click(); // ←
        break;
      case 39:
        next.click(); // →
        break;
    }
  });
})();
