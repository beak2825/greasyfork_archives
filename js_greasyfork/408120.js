// ==UserScript==
// @name         洛谷 - 讨论区编辑器快捷键
// @namespace    http://tampermonkey.net/
// @version      2
// @description  为洛谷讨论区的编辑器添加一些快捷键
// @author       Henry-ZHR
// @match        https://www.luogu.com.cn/discuss/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @license      WTFPL; http://www.wtfpl.net/txt/copying/
// @downloadURL https://update.greasyfork.org/scripts/408120/%E6%B4%9B%E8%B0%B7%20-%20%E8%AE%A8%E8%AE%BA%E5%8C%BA%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/408120/%E6%B4%9B%E8%B0%B7%20-%20%E8%AE%A8%E8%AE%BA%E5%8C%BA%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
  "use strict";
  $.noConflict();
  var submitOnKeydown = function(e) {
    if (e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13)) {
      if (document.location.href.startsWith("https://www.luogu.com.cn/discuss/lists")) {
        // 发帖
        document.getElementById("submitpost").click();
      }
      else {
        // 回复
        document.getElementById("submit-reply").click();
      }
    }
  };
  jQuery("textarea").keydown(function(e) {
    submitOnKeydown(e);

    // 粗体 Ctrl+B
    if (e.ctrlKey && e.keyCode == 66) {
      event.preventDefault();
      jQuery("ul.mp-editor-menu a[title=\"粗体\"]")[0].click();
    }

    // 删除线 Ctrl+Shift+X
    if (e.ctrlKey && e.shiftKey && e.keyCode == 88) {
      event.preventDefault();
      jQuery("ul.mp-editor-menu a[title=\"删除线\"]")[0].click();
    }

    // 斜体 Ctrl+I
    if (e.ctrlKey && e.keyCode == 73) {
      event.preventDefault();
      jQuery("ul.mp-editor-menu a[title=\"斜体\"]")[0].click();
    }

    // 插入链接 Ctrl+K
    if (e.ctrlKey && e.keyCode == 75) {
      event.preventDefault();
      jQuery("ul.mp-editor-menu a[title=\"插入链接\"]")[0].click();
    }

    // 从 Telegram Desktop 抄的
  });
  jQuery("input[name=\"captcha\"]").keydown(submitOnKeydown);
})();